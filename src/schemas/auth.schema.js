import * as z from "zod";

export const authSchema = z.object({
  email: z.email().toLowerCase(),
  password: z.string().min(8),
});
