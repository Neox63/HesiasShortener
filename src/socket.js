import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { verifyToken } from "./services/auth.service.js";
import { prisma } from "./db.js";

let io;

export function initSocket(httpServer) {
  io = new Server(httpServer);

  io.engine.use(cookieParser());

  io.use((socket, next) => {
    try {
      socket.data.user = verifyToken(socket.request.cookies.token);
      next();
    } catch {
      next(new Error("Connexion requise"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.data.user;

    socket.join(`user:${user.id}`);
    if (user.role === "ADMIN") socket.join("admins");

    socket.on("watch", async (code, ack) => {
      if (typeof code !== "string" || typeof ack !== "function") return;

      const link = await prisma.link.findUnique({ where: { code } });

      if (!link) return ack({ error: "lien introuvable" });
      if (link.userId !== user.id && user.role !== "ADMIN")
        return ack({ error: "Ce lien ne vous appartient pas" });

      socket.join(`link:${code}`);
      ack({ ok: true });
    });
  });

  return io;
}

export function notifyClick(link, visit) {
  if (!io) return;

  io.to(`user:${link.userId}`).to("admins").emit("click", {
    code: link.code,
    clicks: link._count.clicks,
  });

  io.to(`link:${link.code}`).emit("visit", visit);
}
