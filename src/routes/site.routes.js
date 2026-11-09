import { Router } from "express";
import {
  createLink,
  deleteLink,
  getLink,
  loadLinks,
  useLink,
} from "../services/links.service.js";
import { createLinkSchema } from "../schemas/link.schema.js";

export const router = Router();

router.get("/", async (req, res) => {
  let links;
  const { sort } = req.query;
  const order = req.query.order === "asc" ? "asc" : "desc";

  if (sort === "clicks") {
    links = await loadLinks(order);
  } else {
    links = await loadLinks();
  }

  res.render("index", { links, error: null, sort, order });
});

router.post("/links", async (req, res) => {
  const result = createLinkSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).render("index", {
      links: await loadLinks(),
      error: "URL invalide",
      sort: null,
      order: null,
    });
  }

  await createLink(req.body.url);
  res.redirect("/");
});

router.post("/links/:code/delete", async (req, res) => {
  await deleteLink(req.params.code);
  res.redirect("/");
});

router.get("/:code", async (req, res) => {
  const link = await useLink(req.params.code, req.get("referer"));

  res.redirect(link.url);
});
