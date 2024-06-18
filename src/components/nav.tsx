"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Home,
  ShoppingBasket,
  Soup,
  Ham,
  Refrigerator,
} from "lucide-react";
import { useMediaQuery } from "usehooks-ts";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "./ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { name: "Home", href: "/home", icon: <Home className="h-5 w-5" /> },
  { name: "List", href: "/list", icon: <ShoppingBasket className="h-5 w-5" /> },
  { name: "Meals", href: "/meals", icon: <Soup className="h-5 w-5" /> },
  {
    name: "Pantry",
    href: "/pantry",
    icon: <Refrigerator className="h-5 w-5" />,
  },
  {
    name: "Ingredients",
    href: "/ingredients",
    icon: <Ham className="h-5 w-5" />,
  },
];

interface NavHeaderProps {
  children?: React.ReactNode;
}

export default function NavHeader(props: NavHeaderProps) {
  const pathname = usePathname();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <header className="flex h-20 w-screen flex-row items-center justify-center">
      <nav className="flex items-center space-x-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side={`${isDesktop ? "left" : "top"}`}>
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <SheetClose key={link.name} asChild>
                  <Link
                    href={link.href}
                    className={`flex gap-2 rounded-md p-5 hover:bg-slate-100 ${
                      pathname === link.href
                        ? "bg-slate-200 hover:bg-slate-200"
                        : ""
                    }`}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                </SheetClose>
              ))}
            </div>
            <Separator className="mb-8 mt-2" />
            <div className="flex gap-3">
              <ThemeToggle />
              {props.children}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
