import * as z from "zod";

z.config(z.locales.fr());

export const createLinkSchema = z.object({
  url: z.url({ protocol: /^https?$/ }),
});
