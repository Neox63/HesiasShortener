import { Router } from "express";
import { createLink, deleteLink, getLink, isValidUrl, loadLinks } from "../links.js";

export const router = Router();

router.get("/", async (_, res) => {
  res.json(await loadLinks());
});

router.get("/:code", async (req, res) => {
  res.json(await getLink(req.params.code));
});

router.post("/", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    res.status(400).json("Error : missing URL parameter");
  }

  if (!isValidUrl(url)) {
    res.status(400).json("Error: invalid URL");
  }

  const link = await createLink(link);

  res.status(201).json(link);
});

router.delete("/:code", async (req, res) => {
  const { code } = req.params;
  await deleteLink(code);

  res.sendStatus(204);
});
