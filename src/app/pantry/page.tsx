import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { pantry } from "@/db/schema";
import { validateRequest } from "@/lib/auth";
import NavHeader from "@/components/nav";
import AddPantryItemsForm from "@/components/forms/add-pantry-items";
import { PantryList, columns } from "@/components/pantry-list";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { user } = await validateRequest();

  const allPantryItems = await db.select().from(pantry);

  // if not a user or a guest
  if (!user?.role) {
    return redirect("/");
  }

  return (
    <>
      <NavHeader />
      <AddPantryItemsForm />
      <Separator className="my-10" />
      {/* @ts-ignore-next-line */}
      <PantryList data={allPantryItems} columns={columns} />
    </>
  );
}
