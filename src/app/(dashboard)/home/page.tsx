import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";

export default async function Page() {
  const { user } = await validateRequest();

  // if not a user or a guest
  if (!user?.role) {
    return redirect("/");
  }

  return (
    <>
      <h1>Hi, {user.username}!</h1>
    </>
  );
}
