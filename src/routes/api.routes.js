import { Router } from "express";
import { createLink, deleteLink, getLink, loadLinks } from "../services/links.service.js";
import { validate } from "../middlewares/validate.js";
import { createLinkSchema } from "../schemas/link.schema.js";
import { canEdit, requireAuth } from "../middlewares/auth.js";

export const router = Router();

router.use(requireAuth);

router.get("/", async (_, res) => {
  res.json(await loadLinks());
});

router.get("/:code", canEdit, async (req, res) => {
  res.json(await getLink(req.params.code));
});

router.post("/", validate(createLinkSchema), async (req, res) => {
  const { url } = req.body;

  if (!url) {
    res.status(400).json("Error : missing URL parameter");
  }

  const link = await createLink(url);

  res.status(201).json(link);
});

router.delete("/:code", canEdit, async (req, res) => {
  const { code } = req.params;
  await deleteLink(code);

  res.sendStatus(204);
});
