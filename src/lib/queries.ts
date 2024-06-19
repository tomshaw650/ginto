"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { user as dbUser, pantry, ingredients, meal, week } from "@/db/schema";
import { sql, eq } from "drizzle-orm";

// ** USER ** //
export const getUser = async (id: string) => {
  const user = await db.select().from(dbUser).where(eq(dbUser.id, id));
  return user;
};

// ** PANTRY ** //
export const getPantryItems = async () => {
  const allPantryItems = await db.select().from(pantry);
  return allPantryItems;
};

export const addPantryItem = async (item: any) => {
  await db.insert(pantry).values(item);
  revalidatePath("/pantry");
};

export const deleteItem = async (id: string) => {
  await db.delete(pantry).where(eq(pantry.id, id));
  revalidatePath("/pantry");
};

export const updateItemQuantity = async (id: string, newQuantity: number) => {
  await db
    .update(pantry)
    .set({
      item: sql`jsonb_set(item, '{quantity}', ${newQuantity})`,
    })
    .where(eq(pantry.id, id));
  revalidatePath("/pantry");
};

// ** INGREDIENTS ** //
export const getIngredients = async () => {
  const allIngredients = await db.select().from(ingredients);
  return allIngredients;
};

export const deleteIngredient = async (id: string) => {
  await db.delete(ingredients).where(eq(ingredients.id, id));
  revalidatePath("/ingredients");
};

// ** MEAL ** //
export const getMeals = async () => {
  const allMeals = await db.select().from(meal);
  return allMeals;
};

export const deleteMeal = async (id: string) => {
  await db.delete(meal).where(eq(meal.id, id));
  revalidatePath("/meals");
};

// ** WEEK ** //
export const getWeek = async () => {
  const allWeek = await db.select().from(week);
  return allWeek;
};

export const addMeal = async (meal: any, day: string) => {
  await db.update(week).set({ meal: meal }).where(eq(week.day, day));
  revalidatePath("/home");
};
