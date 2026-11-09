import { customAlphabet } from "nanoid";
import { prisma } from "../db.js";

const generateCode = customAlphabet("abcdefghijklmnopqrstuvwxyz1234567890", 8);

export async function loadLinks(order) {
  let orderBy;

  if (order) {
    orderBy = {
      clicks: {
        _count: order,
      },
    };
  }

  const links = await prisma.link.findMany({
    include: {
      _count: {
        select: {
          clicks: true,
        },
      },
    },
    orderBy,
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
  return prisma.link.create({
    data: {
      code: generateCode(),
      url,
    },
  });
}

export async function useLink(code, referer) {
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
