import "dotenv/config";
import { app } from "./app.js";
import { createServer } from "node:http";
import { initSocket } from "./socket.js";

const httpServer = createServer(app);
initSocket(httpServer);

httpServer.listen(3000, () => console.log("Serveur démarré : http://localhost:3000"));
