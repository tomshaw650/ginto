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
    const day1 = items.day1 as string;
    const day2 = items.day2 as string;
    const meal1 = items.meal1 as any;
    const meal2 = items.meal2 as any;

    await db.update(week).set({ meal: meal2 }).where(eq(week.day, day1));
    await db.update(week).set({ meal: meal1 }).where(eq(week.day, day2));

    revalidatePath("/week");

    return NextResponse.json({ status: 200, message: "Meals swapped" });
  } catch (err) {
    console.error("Error swapping meals: ", err);
    return NextResponse.json({
      status: 500,
      message: "Error swapping meals",
    });
  }
}
