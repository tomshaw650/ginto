"use server";
import { db } from "@/lib/db";
import { pantry, meal, week } from "@/db/schema";
import { eq } from "drizzle-orm";

// ** PANTRY ** //
export const getPantryItems = async () => {
  const allPantryItems = await db.select().from(pantry);
  return allPantryItems;
};

export const deleteItem = async (id: string) => {
  await db.delete(pantry).where(eq(pantry.id, id));
};

// ** MEAL ** //
export const getMeals = async () => {
  const allMeals = await db.select().from(meal);
  return allMeals;
};

export const deleteMeal = async (id: string) => {
  await db.delete(meal).where(eq(meal.id, id));
};

// ** WEEK ** //
export const getWeek = async () => {
  const allWeek = await db.select().from(week);
  return allWeek;
};

export const addMeal = async (meal: any, day: string) => {
  await db.update(week).set({ meal: meal }).where(eq(week.day, day));
};
