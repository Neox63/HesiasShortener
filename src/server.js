import http from "node:http";
import { createLink, isValidUrl, loadLinks, useLink } from "./links.js";
import { renderPage } from "./page.js";
import { URLSearchParams } from "node:url";

const readBody = async (req) => {
  let body = "";
  for await (const chunk of req) body += chunk;
  return body;
};

const server = http.createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/") {
    const links = await loadLinks();
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(renderPage(links));
  }

  if (req.method === "GET" && req.url === "/api/links") {
    const links = await loadLinks();

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(links));
  }

  if (req.method === "POST" && req.url === "/links") {
    const form = new URLSearchParams(await readBody(req));
    const url = form.get("url");

    if (!isValidUrl(url)) {
      res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("Adresse invalide");
    }

    await createLink(url);

    res.writeHead(302, {
      Location: "/",
    });

    return res.end();
  }

  const link = await useLink(req.url.slice(1));
  if (req.method === "GET" && link) {
    res.writeHead(302, {
      Location: link.url,
    });

    return res.end();
  }

  res.writeHead(404);
  res.end("Lien introuvable");
});

server.listen(3003, "0.0.0.0", () => console.log("Serveur démarré !"));
