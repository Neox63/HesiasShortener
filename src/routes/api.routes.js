import { Router } from "express";
import { createLink, deleteLink, getLink, loadLinks } from "../services/links.service.js";
import { validate } from "../middlewares/validate.js";
import { createLinkSchema } from "../schemas/link.schema.js";
import { canEdit, requireAuth } from "../middlewares/auth.js";

export const router = Router();

router.use(requireAuth);

router.get("/", async (req, res) => {
  res.json(await loadLinks({ user: req.user, sort: req.query.sort }));
});

router.get("/:code", canEdit, async (req, res) => {
  res.json(await getLink(req.params.code));
});

router.post("/", validate(createLinkSchema), async (req, res) => {
  const link = await createLink(req.body.url, req.user.id);

  res.status(201).json(link);
});

router.delete("/:code", canEdit, async (req, res) => {
  const { code } = req.params;
  await deleteLink(code);

  res.sendStatus(204);
});
