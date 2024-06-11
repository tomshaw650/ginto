import { validateRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { meal as meals } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  const { user } = await validateRequest();
  const items = await request.json();

  if (user?.role !== "user") {
    return Response.json({ status: 401, message: "Unauthorized" });
  }

  try {
    await db.insert(meals).values(items);

    revalidatePath("/meals");

    return Response.json({ status: 200, message: "Meal created succesfully" });
  } catch (err) {
    return Response.json({
      status: 500,
      message: "Error creating meal",
    });
  }
}
