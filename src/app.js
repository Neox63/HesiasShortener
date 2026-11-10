import express from "express";
import { router as apiRouter } from "./routes/api.routes.js";
import { router as authRouter } from "./routes/auth.routes.js";
import { router as siteRouter } from "./routes/site.routes.js";
import { errorHandler, notFound } from "./middlewares/errors.js";
import morgan from "morgan";
import path from "node:path";
import cookieParser from "cookie-parser";
import { loadUser } from "./middlewares/auth.js";

export const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(import.meta.dirname, "..", "views"));

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.use(morgan("dev"));
app.use(express.static(path.join(import.meta.dirname, "..", "public")));

app.use(loadUser);

app.use("/api/links", apiRouter);
app.use("/", authRouter);
app.use("/", siteRouter);

app.use(notFound);
app.use(errorHandler);
