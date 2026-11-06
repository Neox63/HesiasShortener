import { Router } from "express";
import { renderPage } from "../page.js";
import { createLink, deleteLink, getLink, loadLinks, useLink } from "../links.js";
import { validate } from "../middlewares/validate.js";
import { createLinkSchema } from "../schemas/link.schema.js";
import { error } from "node:console";

export const router = Router();

router.get("/", async (req, res) => {
  res.render("index", { links: await loadLinks(), error: null });
});

router.post("/links", async (req, res) => {
  const result = createLinkSchema.safeParse(req.body);

  if (!result.success) {
    return res
      .status(400)
      .render("index", { links: await loadLinks(), error: "URL invalide" });
  }

  await createLink(req.body.url);
  res.redirect("/");
});

router.post("/links/:code/delete", async (req, res) => {
  await deleteLink(req.params.code);
  res.redirect("/");
});

router.get("/:code", async (req, res) => {
  res.redirect((await useLink(req.params.code)).url);
});
