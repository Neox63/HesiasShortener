import { prisma } from "../db.js";
import { HttpError } from "../HttpError.js";
import { verifyToken } from "../services/auth.service.js";

export function loadUser(req, res, next) {
  req.user = null;
  const token = req.cookies.token;

  if (token) {
    try {
      req.user = verifyToken(token);
    } catch {
      res.clearCookie("token");
    }
  }

  res.locals.user = req.user;
  next();
}

export function requireAuth(req, res, next) {
  if (req.user) return next();
  if (req.originalUrl.startsWith("/api")) throw new HttpError(403, "Accès réservé");

  res.redirect("/login");
}

export async function canEdit(req, res, next) {
  const link = await prisma.link.findUniqueOrThrow({ where: { code: req.params.code } });

  if (link.userId !== req.user.id) {
    throw new HttpError(403, "Ce lien ne vous appartient pas");
  }
}
