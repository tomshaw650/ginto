import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { validateRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { week } from "@/db/schema";

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
    await db.update(week).set({ meal: null }).where(eq(week.day, items.day));

    revalidatePath("/week");

    return Response.json({ status: 200, message: "Day cleared" });
  } catch (err) {
    return Response.json({
      status: 500,
      message: "Error clearing day",
    });
  }
}
