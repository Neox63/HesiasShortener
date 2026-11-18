import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { verifyToken } from "./services/auth.service.js";

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
  });

  return io;
}

export function notifyClick(link) {
  if (!io) return;

  io.to(`user:${link.userId}`).to("admins").emit("click", {
    code: link.code,
    clicks: link._count.clicks,
  });
}
