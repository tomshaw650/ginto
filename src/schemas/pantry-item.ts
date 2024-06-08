import { z } from "zod";

export const pantryItemSchema = z.object({
  items: z.array(
    z.object({
      name: z.string(),
      quantity: z.coerce.number().nullable(),
      unit: z.string().nullable(),
    }),
  ),
});
