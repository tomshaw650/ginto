import { redirect } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getPantryItems } from "@/lib/queries";
import { validateRequest } from "@/lib/auth";
import PantryPage from "./pantry-page";

export default async function Page() {
  const queryClient = new QueryClient();
  const { user } = await validateRequest();

  await queryClient.prefetchQuery({
    queryKey: ["pantryItems"],
    queryFn: getPantryItems,
  });

  // if not a user or a guest
  if (!user?.role) {
    return redirect("/");
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PantryPage />
    </HydrationBoundary>
  );
}
