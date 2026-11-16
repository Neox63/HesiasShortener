import "dotenv/config";
import { prisma } from "../src/db.js";
import bcrypt from "bcrypt";

await prisma.link.deleteMany();
await prisma.user.deleteMany();

const passwordHash = await bcrypt.hash("RootRoot123", 12);

await prisma.user.create({
  data: { email: "admin@hesias.dev", passwordHash, role: "ADMIN" },
});
const mathis = await prisma.user.create({
  data: { email: "mathis@hesias.dev", passwordHash },
});

await prisma.link.create({
  data: {
    code: "hesias",
    url: "https://hesias.fr",
    userId: mathis.id,
    clicks: {
      create: [
        {},
        {
          referer: "https://discord.com",
        },
        {},
        {},
        {},
      ],
    },
  },
});

await prisma.link.create({
  data: { code: "nodejs", url: "https://nodejs.org", userId: mathis.id },
});

await prisma.link.create({
  data: {
    code: "expire",
    url: "https://example.com",
    userId: mathis.id,
    expiresAt: new Date("2026-10-01"),
  },
});

console.log("Base remplie");
