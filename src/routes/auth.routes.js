import { Router } from "express";
import { authSchema } from "../schemas/auth.schema.js";
import { register, signToken } from "../services/auth.service.js";

export const router = Router();

const cookieOptions = { httpOnly: true, sameSite: "lax", maxAge: 2 * 60 * 60 * 1000 };

router.get("/register", async (req, res) => {
  return res.render("register", { error: null });
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
