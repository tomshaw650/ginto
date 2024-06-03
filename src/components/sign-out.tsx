import signout from "@/actions/signout";
import { Button } from "./ui/button";

export default async function SignoutButton() {
  return (
    <form action={signout}>
      <Button>Sign out</Button>
    </form>
  );
}
