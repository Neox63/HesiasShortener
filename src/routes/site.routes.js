import { Router } from "express";
import {
  createLink,
  deleteLink,
  getLink,
  getStats,
  loadLinks,
  useLink,
} from "../services/links.service.js";
import { createLinkSchema } from "../schemas/link.schema.js";
import { canEdit, requireAuth } from "../middlewares/auth.js";

export const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const links = await loadLinks({
    user: req.user,
    sort: req.query.sort,
  });

  res.render("index", { links, error: null });
});

router.post("/links", requireAuth, async (req, res) => {
  const result = createLinkSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).render("index", {
      links: await loadLinks({ user: req.user }),
      error: "URL invalide",
      sort: null,
      order: null,
    });
  }

  await createLink(req.body.url, req.user.id);
  res.redirect("/");
});

router.get("/links/:code/stats", requireAuth, canEdit, async (req, res) => {
  res.render("stats", await getStats(req.params.code));
});

router.post("/links/:code/delete", requireAuth, canEdit, async (req, res) => {
  await deleteLink(req.params.code);
  res.redirect("/");
});

router.get("/:code", async (req, res) => {
  const link = await useLink(req.params.code, req.get("referer"));

  res.redirect(link.url);
});
