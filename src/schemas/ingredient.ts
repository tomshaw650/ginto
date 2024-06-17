import { z } from "zod";

export const ingredientsSchema = z.object({
  items: z.array(
    z.object({
      name: z.string(),
      unit: z.string().nullable(),
    }),
  ),
});
