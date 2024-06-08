import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { meal, pantry } from "@/db/schema";
import type { MealRow } from "@/components/meal-list";
import MealsPage from "./meals-page";

export default async function Page() {
  const { user } = await validateRequest();

  const allPantryItems = await db.select().from(pantry);
  const allMeals: MealRow[] = await db.select().from(meal);

  // if not a user or a guest
  if (!user?.role) {
    return redirect("/");
  }

  return <MealsPage allPantryItems={allPantryItems} allMeals={allMeals} />;
}
