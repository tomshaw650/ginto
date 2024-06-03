"use server";
import { redirect } from "next/navigation";
import { lucia } from "@/lib/auth";
import { db } from "@/lib/db";
import { verify } from "@node-rs/argon2";
import { cookies } from "next/headers";

export async function login(formData: FormData): Promise<ActionResult> {
  const username = formData.get("username");

  if (
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    return {
      error: "Invalid username",
    };
  }
  const password = formData.get("password");
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return {
      error: "Invalid password",
    };
  }

  const existingUser = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.username, username),
  });

  if (!existingUser) {
    return {
      error: "Incorrect username or password",
    };
  }

  const validPassword = await verify(existingUser.passwordHash, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  if (!validPassword) {
    return {
      error: "Incorrect username or password",
    };
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect("/home");
}

export async function guest(): Promise<ActionResult> {
  "use server";
  const username = "guest";

  const existingUser = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.username, username),
  });

  if (!existingUser) {
    return {
      error: "guest account not currently working",
    };
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect("/home");
}

interface ActionResult {
  error: string;
}
