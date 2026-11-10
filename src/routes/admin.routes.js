import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth.js";
import { loadLinks } from "../services/links.service.js";
import { loadUsers } from "../services/users.service.js";

export const router = Router();

router.use(requireAuth, requireRole("ADMIN"));

router.get("/", async (req, res, next) => {
  return res.render("admin", {
    users: await loadUsers(),
    links: await loadLinks({ user: req.user }),
  });
});
