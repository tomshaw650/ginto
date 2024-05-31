import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import NavHeader from "@/components/nav";

export default async function Page() {
  const { user } = await validateRequest();

  // if not a user or a guest
  if (!user?.role) {
    return redirect("/");
  }

  return (
    <>
      <NavHeader />
      <h1>Pantry</h1>
    </>
  );
}
