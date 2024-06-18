import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { login, guest } from "@/actions/login";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function Page() {
  const { user } = await validateRequest();

  // if user already logged in
  if (user) {
    return redirect("/list");
  }

  return (
    <>
      <div className="mb-5"></div>
      <ThemeToggle />
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
