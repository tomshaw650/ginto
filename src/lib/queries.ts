"use server";
import { db } from "@/lib/db";
import { pantry, meal } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// ** PANTRY ** //
export const getPantryItems = async () => {
  const allPantryItems = await db.select().from(pantry);
  return allPantryItems;
};

export const deleteItem = async (id: string) => {
  await db.delete(pantry).where(eq(pantry.id, id));
  revalidatePath("/pantry");
};

// ** MEAL ** //
export const getMeals = async () => {
  const allMeals = await db.select().from(meal);
  return allMeals;
};

export const deleteMeal = async (id: string) => {
  await db.delete(meal).where(eq(meal.id, id));
  revalidatePath("/meal");
};
