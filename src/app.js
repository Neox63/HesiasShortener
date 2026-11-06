import express from "express";
import { router as apiRouter } from "./routes/api.routes.js";

export const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.use("/api/links", apiRouter);
