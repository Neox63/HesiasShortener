import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "../db.js";
import { HttpError } from "../HttpError.js";

export function signToken(user) {
  const { id, email, role } = user;
  return jwt.sign({ id, email, role }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET, {
    algorithms: ["HS256"],
  });
}

export async function register({ email, password }) {
  const passwordHash = await bcrypt.hash(password, 12);

  return await prisma.user.create({ data: { email, passwordHash } });
}

export async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new HttpError(401, "Email ou mot de passe incorrect");
  }

  return user;
}
