import "dotenv/config";

import { prisma } from "../src/db.js";

const DAY = 24 * 60 * 60 * 1000;
const REFERERS = [
  null,
  "https://www.google.com/",
  "https://www.linkedin.com/",
  null,
  "https://discord.com/",
  "https://hesias.fr/",
];

// [code, url, age in days, number of clicks]
const LINKS = [
  ["hesias", "https://hesias.fr", 50, 42],
  ["nodejs", "https://nodejs.org", 45, 12],
  ["gh", "https://github.com", 40, 25],
  ["gh-prisma", "https://github.com/prisma/prisma", 35, 8],
  ["express", "https://expressjs.com", 30, 15],
  ["mdn", "https://developer.mozilla.org", 25, 30],
  ["gta6", "https://www.rockstargames.com/VI", 20, 60],
  ["zod", "https://zod.dev", 15, 3],
  ["cv", "https://example.com/cv.pdf", 10, 18],
  ["oublie", "https://example.com/oublie", 5, 0],
];

await prisma.link.deleteMany();

for (const [i, [code, url, age, count]] of LINKS.entries()) {
  const createdAt = new Date(Date.now() - age * DAY);
  const link = await prisma.link.create({ data: { code, url, createdAt } });

  const clicks = Array.from({ length: count }, (_, j) => ({
    linkId: link.id,
    createdAt: new Date(createdAt.getTime() + ((j + 0.5) / count) * age * DAY),
    referer: REFERERS[(j * 7 + i) % REFERERS.length],
  }));
  await prisma.click.createMany({ data: clicks });
}

console.log("Playground prêt : 10 liens, 213 clics");
