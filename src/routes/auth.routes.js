import { Router } from "express";
import { authSchema } from "../schemas/auth.schema.js";
import { register, signToken, login } from "../services/auth.service.js";
import { HttpError } from "../HttpError.js";

export const router = Router();

const cookieOptions = { httpOnly: true, sameSite: "lax", maxAge: 2 * 60 * 60 * 1000 };

router.get("/login", (req, res) => res.render("login", { error: null }));

router.get("/register", (req, res) => res.render("register", { error: null }));

router.post("/login", async (req, res) => {
  const result = authSchema.safeParse(req.body);

  if (!result.success)
    res.status(400).render("login", { error: "Email ou mot de pass incorrect" });

  try {
    const user = await login(result.data);
    res.cookie("token", signToken(user), cookieOptions).redirect("/");
  } catch (err) {
    if (err.status === 401)
      return res.status(401).render("login", { error: err.message });

    throw err;
  }
});

router.post("/register", async (req, res) => {
  const result = authSchema.safeParse(req.body);

  if (!result.success)
    return res.status(400).render("register", {
      error: "Email invalide ou mot de passe trop court (8 caractères min.)",
    });

  try {
    const user = await register(result.data);
    res.cookie("token", signToken(user), cookieOptions).redirect("/");
  } catch (err) {
    if (err.code === "P2002")
      return res.status(409).render("register", { error: "Cet email a déjà un compte" });

    throw err;
  }
});

router.post("/logout", (req, res) => res.clearCookie("token").redirect("/login"));
