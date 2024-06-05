import NavHeader from "@/components/nav";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavHeader />
      {children}
    </>
  );
}
