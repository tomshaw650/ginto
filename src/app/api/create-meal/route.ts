import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { validateRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { meal as meals } from "@/db/schema";

export async function POST(request: Request) {
  const { user } = await validateRequest();
  const items = await request.json();

  if (user?.role !== "user") {
    return NextResponse.json(
      { error: "Guests cannot complete this action." },
      { status: 403 },
    );
  }

  try {
    await db.insert(meals).values(items);

    revalidatePath("/meals");

    return Response.json({ status: 200, message: "Meal created succesfully" });
  } catch (err) {
    return Response.json({
      status: 500,
      message: "500 being hit",
    });
  }
}
