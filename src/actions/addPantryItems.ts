"use server";
import { validateRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { pantry } from "@/db/schema";
import { revalidatePath } from "next/cache";

export default async function addPantryItems(
  items: { item: PantryRow["item"] }[],
) {
  const { user } = await validateRequest();

  if (user?.role !== "user") {
    return {
      error: "You cannot complete this action as a guest.",
    };
  }

  try {
    const formattedItems = items.map((item) => ({
      id: item.item.id,
      item: {
        name: item.item.name,
        quantity: item.item.quantity !== null ? item.item.quantity : 0,
        unit: item.item.unit || "",
      },
    }));

    await db.insert(pantry).values(
      formattedItems.map((item) => ({
        id: item.id,
        item: JSON.stringify(item.item),
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

interface PantryRow {
  item: {
    id: string;
    name: string;
    quantity: number | null;
    unit: string | null;
  };
}
