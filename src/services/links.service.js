import { customAlphabet } from "nanoid";
import { writeFile } from "node:fs/promises";
import { HttpError } from "../HttpError.js";
import { prisma } from "../db.js";

const FILE = new URL("../data/links.json", import.meta.url);

const generateCode = customAlphabet("abcdefghijklmnopqrstuvwxyz1234567890", 8);

export async function loadLinks() {
  const links = await prisma.link.findMany({
    include: {
      _count: {
        select: {
          clicks: true,
        },
      },
    },
  });

  return links.map(({ _count, ...link }) => ({ ...link, clicks: _count.clicks }));
}

export const getLink = async (code) => {
  return prisma.link.findUniqueOrThrow({ where: { code } });
};

export const saveLinks = async (links) => {
  await writeFile(FILE, JSON.stringify(links, null, 2));
};

export const deleteLink = async (code) => {
  const links = await loadLinks();

  const link = links.find((l) => l.code === code);

  if (!link) throw new HttpError(404, "Lien introuvable");

  await saveLinks(links.filter((l) => l.code !== code));

  return link;
};

export async function createLink(url) {
  const links = await loadLinks();

  const link = {
    code: generateCode(),
    url,
    clicks: 0,
  };

  links.push(link);

  await saveLinks(links);

  return link;
}

export async function useLink(code) {
  const links = await loadLinks();

  const link = links.find((l) => l.code === code);

  if (!link) throw new HttpError(404, "Lien introuvable");

  link.clicks++;

  await saveLinks(links);

  return link;
}
