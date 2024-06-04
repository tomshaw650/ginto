"use server";
import { validateRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { pantry } from "@/db/schema";
import { revalidatePath } from "next/cache";

interface Item {
  name: string;
  quantity: number | null;
  unit: string | null;
}

interface PantryItem {
  id: string;
  item: Item;
}

export default async function addPantryItems(items: PantryItem[]) {
  const { user } = await validateRequest();

  if (user?.role !== "user") {
    return {
      error: "You cannot complete this action as a guest.",
    };
  }

  try {
    await db.insert(pantry).values(
      items.map((item) => ({
        id: item.id,
        item: item.item, // No need for JSON stringification
      })),
    );

    revalidatePath("/pantry");

    return {
      message: "success",
    };
  } catch (err) {
    return {
      message: "error",
    };
  }
}
