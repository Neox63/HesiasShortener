import "dotenv/config";
import { app } from "./app.js";

app.listen(3000, () => console.log("Serveur démarré : https://localhost:3000"));
