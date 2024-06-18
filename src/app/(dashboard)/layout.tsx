import NavHeader from "@/components/nav";
import SignoutButton from "@/components/sign-out";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavHeader>
        <SignoutButton />
      </NavHeader>
      {children}
    </>
  );
}
