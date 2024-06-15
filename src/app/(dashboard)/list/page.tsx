import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { Room } from "./room";
import ShoppingList from "@/components/shopping-list";

export default async function Page() {
  const { user } = await validateRequest();

  // if not a user or a guest
  if (!user?.role) {
    return redirect("/");
  }

  return (
    <Room>
      <ShoppingList />
    </Room>
  );
}
