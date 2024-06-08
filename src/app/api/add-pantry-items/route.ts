import { validateRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { pantry } from "@/db/schema";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { user } = await validateRequest();
  const { items } = await request.json();

  console.log(items);

  if (user?.role !== "user") {
    return Response.json({ status: 401, message: "Unauthorized" });
  }

  try {
    for (const item of items) {
      await db.insert(pantry).values({ item });
    }

    revalidatePath("/pantry");

    return Response.json({ status: 200, message: "Items added to pantry" });
  } catch (err) {
    return Response.json({
      status: 500,
      message: "Error adding items to pantry",
    });
  }
}
