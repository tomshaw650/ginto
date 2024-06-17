import Link from "next/link";
import { useMediaQuery } from "usehooks-ts";
import { ThemeToggle } from "./theme-toggle";
import SignoutButton from "./sign-out";

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
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <header className="flex h-20 w-screen flex-row items-center justify-center">
        <nav className="flex items-center space-x-6">
          {!props.landing ? (
            <>
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href}>
                  {link.name}
                </Link>
              ))}
            </>
          ) : null}
          <ThemeToggle />
          {!props.landing && <SignoutButton />}
        </nav>
      </header>
    );
  }

  return (
    <header className="flex h-20 w-screen flex-row items-center justify-center">
      <nav className="flex items-center space-x-6">
        {!props.landing ? (
          <>
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href}>
                {link.name}
              </Link>
            ))}
          </>
        ) : null}
      </nav>
    </header>
  );
}
