import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { validateRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { ingredients } from "@/db/schema";

export async function POST(request: Request) {
  const { user } = await validateRequest();
  const { items } = await request.json();

  if (user?.role !== "user") {
    return NextResponse.json(
      { error: "Guests cannot complete this action." },
      { status: 403 },
    );
  }

  try {
    for (const item of items) {
      await db.insert(ingredients).values({ item });
    }

    revalidatePath("/ingredients");

    return Response.json({
      status: 200,
      message: "Items added to ingredients",
    });
  } catch (err) {
    return Response.json({
      status: 500,
      message: "Error adding items to ingredients",
    });
  }
}
