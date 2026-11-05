import http from "node:http";
import { loadLinks, useLink } from "./links.js";

const server = http.createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/api/links") {
    const links = await loadLinks();

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(links));
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
