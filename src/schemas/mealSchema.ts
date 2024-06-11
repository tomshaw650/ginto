import { z } from "zod";

export const mealSchema = z.object({
  name: z.string(),
  ingredients: z.array(
    z.object({
      name: z.string(),
      quantity: z.coerce.number().nullable(),
      unit: z.string().nullable(),
    }),
  ),
});
