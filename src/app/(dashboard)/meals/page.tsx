import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { meal } from "@/db/schema";
import { MealList, type MealRow, columns } from "@/components/meal-list";

export default async function Page() {
  const { user } = await validateRequest();

  const allMeals: MealRow[] = await db.select().from(meal);

  // if not a user or a guest
  if (!user?.role) {
    return redirect("/");
  }

  return (
    <>
      <MealList data={allMeals} columns={columns} />
    </>
  );
}
