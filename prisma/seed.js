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

console.log("Base remplie");
