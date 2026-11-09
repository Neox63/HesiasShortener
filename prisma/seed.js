import "dotenv/config";
import { prisma } from "../src/db.js";

await prisma.link.deleteMany();

await prisma.link.create({
  data: {
    code: "hesias",
    url: "https://hesias.fr",
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
  data: {
    code: "nodejs",
    url: "https://nodejs.org",
  },
});

await prisma.link.create({
  data: { code: "expire", url: "https://example.com", expiresAt: new Date("2026-10-01") },
});

console.log("Base remplie");
