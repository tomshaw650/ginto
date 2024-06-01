import { verify } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { lucia, validateRequest } from "@/lib/auth";
import NavHeader from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default async function Page() {
  const { user } = await validateRequest();

  if (user) {
    return redirect("/home");
  }

  return (
    <>
      <NavHeader landing />
      <div className="mt-32 flex h-fit max-w-md flex-col items-center justify-center">
        <h1 className="text-rem mb-5 text-4xl">Sign in to Ginto</h1>
        <form action={login}>
          <Label htmlFor="username">Username</Label>
          <Input className="mb-4" name="username" id="username" />
          <Label htmlFor="password">Password</Label>
          <Input type="password" name="password" id="password" />
          <Button className="my-5 w-full">Sign in</Button>
        </form>
        <Separator />
        <form className="w-[11.5rem]" action={guest}>
          <Button className="my-5 w-full">Sign in as guest</Button>
        </form>
      </div>
    </>
  );
}

async function login(formData: FormData): Promise<ActionResult> {
  "use server";
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

async function guest(): Promise<ActionResult> {
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
