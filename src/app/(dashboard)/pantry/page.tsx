import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { pantry } from "@/db/schema";
import { validateRequest } from "@/lib/auth";
import PantryPage from "./pantry-page";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { user } = await validateRequest();

  const allPantryItems = await db.select().from(pantry);

  // if not a user or a guest
  if (!user?.role) {
    return redirect("/");
  }

  return <PantryPage items={allPantryItems} />;
}