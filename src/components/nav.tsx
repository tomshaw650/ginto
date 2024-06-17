import Link from "next/link";
import { Menu } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import SignoutButton from "./sign-out";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { name: "Home", href: "/home" },
  { name: "List", href: "/list" },
  { name: "Meals", href: "/meals" },
  { name: "Pantry", href: "/pantry" },
  { name: "Ingredients", href: "/ingredients" },
];

interface NavHeaderProps {
  landing?: boolean;
}

export default function NavHeader(props: NavHeaderProps) {
  return (
    <header className="flex h-20 w-screen flex-row items-center justify-center">
      <nav className="flex items-center space-x-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <ThemeToggle />
            {!props.landing ? (
              <div className="my-10 flex flex-col gap-3">
                {navLinks.map((link) => (
                  <SheetClose key={link.name} asChild>
                    <Link href={link.href}>{link.name}</Link>
                  </SheetClose>
                ))}
              </div>
            ) : null}
            {!props.landing && <SignoutButton />}
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
