"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSwipeable } from "react-swipeable";
import { CircleChevronRight, CircleChevronLeft } from "lucide-react";
import { getMeals } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import AddMealForm from "@/components/forms/add-meal";
import { MealList, columns } from "@/components/meal-list";

export default function MealPage() {
  const { data } = useQuery({
    queryKey: ["meals"],
    queryFn: () => {
      return getMeals();
    },
  });
  const [showMealList, setShowMealList] = useState(false);

  const handleToggle = () => {
    setShowMealList(!showMealList);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => setShowMealList(true),
    onSwipedRight: () => setShowMealList(false),
  });

  const mealData = data || [];

  return (
    <div
      {...handlers}
      className="flex h-screen w-screen flex-col items-center justify-start"
    >
      {showMealList && (
        <Button
          onClick={handleToggle}
          variant="ghost"
          className="absolute left-0 top-1/3 hidden -translate-y-1/2 transform sm:block"
        >
          <CircleChevronLeft />
        </Button>
      )}
      {!showMealList && (
        <Button
          onClick={handleToggle}
          variant="ghost"
          className="absolute right-0 top-1/3 hidden -translate-y-1/2 transform sm:block"
        >
          <CircleChevronRight />
        </Button>
      )}
      {showMealList ? (
        <MealList data={mealData} columns={columns} />
      ) : (
        <AddMealForm />
      )}
    </div>
  );
}
