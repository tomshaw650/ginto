import { redirect } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getMeals } from "@/lib/queries";
import { validateRequest } from "@/lib/auth";
import WeekDisplay from "@/components/week-display";

export default async function Page() {
  const queryClient = new QueryClient();
  const { user } = await validateRequest();

  await queryClient.prefetchQuery({
    queryKey: ["meals"],
    queryFn: getMeals,
  });

  // if not a user or a guest
  if (!user?.role) {
    return redirect("/");
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WeekDisplay />
    </HydrationBoundary>
  );
}
