import { customAlphabet } from "nanoid";
import { prisma } from "../db.js";
import { HttpError } from "../HttpError.js";

const generateCode = customAlphabet("abcdefghijklmnopqrstuvwxyz1234567890", 8);

export async function loadLinks({ sort } = {}) {
  const links = await prisma.link.findMany({
    include: { _count: { select: { clicks: true } } },
    orderBy: sort === "clicks" ? { clicks: { _count: "desc" } } : { createdAt: "desc" },
  });

  return links.map(({ _count, ...link }) => ({ ...link, clicks: _count.clicks }));
}

export const getLink = async (code) => {
  return prisma.link.findUniqueOrThrow({ where: { code } });
};

export const deleteLink = async (code) => {
  return prisma.link.delete({ where: { code } });
};

export async function createLink(url) {
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 1);

  return prisma.link.create({
    data: {
      code: generateCode(),
      url,
      expiresAt,
    },
  });
}

export async function useLink(code, referer) {
  const link = await getLink(code);

  if (link.expiresAt && link.expiresAt < new Date()) {
    throw new HttpError(410, "Lien expiré");
  }

  return prisma.link.update({
    where: { code },
    data: {
      clicks: {
        create: {
          referer,
        },
      },
    },
  });
}

export async function getStats(code) {
  const link = await getLink(code);

  const [total, byReferer, lastClicks] = await Promise.all([
    prisma.click.count({ where: { linkId: link.id } }),
    prisma.click.groupBy({
      by: ["referer"],
      where: { linkId: link.id },
      _count: true,
    }),
    prisma.click.findMany({
      where: { linkId: link.id },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    }),
  ]);

  return { link, total, byReferer, lastClicks };
}
