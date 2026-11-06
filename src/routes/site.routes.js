import { Router } from "express";
import { renderPage } from "../page.js";
import { createLink, getLink, loadLinks, useLink } from "../links.js";
import { validate } from "../middlewares/validate.js";
import { createLinkSchema } from "../schemas/link.schema.js";

export const router = Router();

router.get("/", async (req, res) => {
  res.send(renderPage(await loadLinks()));
});

router.post("/links", validate(createLinkSchema), async (req, res) => {
  await createLink(req.body.url);
  res.redirect("/");
});

router.get("/:code", async (req, res) => {
  res.redirect((await useLink(req.params.code)).url);
});
