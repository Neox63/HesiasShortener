import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "../db.js";

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
