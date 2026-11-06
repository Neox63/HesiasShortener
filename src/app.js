import express from "express";
import { router as apiRouter } from "./routes/api.routes.js";
import { errorHandler, notFound } from "./middlewares/errors.js";

export const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.use("/api/links", apiRouter);

app.use(notFound);
app.use(errorHandler);
