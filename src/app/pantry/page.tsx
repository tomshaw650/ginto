import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { pantry } from "@/db/schema";
import NavHeader from "@/components/nav";
import AddPantryItem from "@/components/forms/add-pantry-item";

export default async function Page() {
  const { user } = await validateRequest();

  // GET ALL PANTRY ITEMS
  // const allPantryItems = await db.select().from(pantry);

  // ADD SINGLE ITEM TO PANTRY
  // const addItem = async () => {
  //   await db
  //     .insert(pantry)
  //     .values({ item: { name: "avocado", quantity: 10, unit: "" } });

  //   alert("Item added to pantry");
  // };

  // ADD MULTIPLE ITEMS TO PANTRY
  // const addItems = async () => {
  //   await db
  //     .insert(pantry)
  //     .values([
  //       { item: { name: "Apple", quantity: 10 } },
  //       { item: { name: "Banana", quantity: 20 } },
  //       { item: { name: "Orange", quantity: 15 } },
  //     ]);
  // };

  // if not a user or a guest
  if (!user?.role) {
    return redirect("/");
  }

  // const allPantryItems = await db.select().from(pantry);
  // console.log(allPantryItems);

  return (
    <>
      <NavHeader />
      <AddPantryItem />
    </>
  );
}
