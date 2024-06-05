"use server";
import { db } from "@/lib/db";
import { pantry, meal } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const deleteItem = async (id: string) => {
  await db.delete(pantry).where(eq(pantry.id, id));
  revalidatePath("/pantry");
};

export const deleteMeal = async (id: string) => {
  await db.delete(meal).where(eq(meal.id, id));
  revalidatePath("/meal");
};
