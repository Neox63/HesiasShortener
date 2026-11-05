import { readFile, writeFile } from "node:fs/promises";

const FILE = new URL("./data/links.json", import.meta.url);

export async function loadLinks() {
  const content = await readFile(FILE, "utf-8");

  return JSON.parse(content);
}

export const saveLinks = async (links) => {
  await writeFile(FILE, JSON.stringify(links, null, 2));
};

export async function createLink(url) {
  const links = await loadLinks();

  const code = Math.floor(Math.random() * 1000) + 1;

  const link = {
    code,
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

  if (link) {
    link.clicks++;

    await saveLinks(links);
  }

  return link;
}
