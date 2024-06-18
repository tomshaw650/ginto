import signout from "@/actions/signout";
import { LogOut } from "lucide-react";
import { Button } from "./ui/button";

export default async function SignoutButton() {
  return (
    <form action={signout}>
      <Button>
        <LogOut className="h-5 w-5" />
        <span className="ml-2">Sign out</span>
      </Button>
    </form>
  );
}
