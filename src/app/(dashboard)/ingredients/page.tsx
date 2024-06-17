import { redirect } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getIngredients } from "@/lib/queries";
import { validateRequest } from "@/lib/auth";
import IngredientsPage from "./ingredients-page";

export default async function Page() {
  const queryClient = new QueryClient();
  const { user } = await validateRequest();

  await queryClient.prefetchQuery({
    queryKey: ["ingredients"],
    queryFn: getIngredients,
  });

  // if not a user or a guest
  if (!user?.role) {
    return redirect("/");
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <IngredientsPage />
    </HydrationBoundary>
  );
}
