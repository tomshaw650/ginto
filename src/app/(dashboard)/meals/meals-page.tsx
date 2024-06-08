"use client";
import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { CircleChevronRight, CircleChevronLeft } from "lucide-react";
import { Item } from "@/types/item";
import { Button } from "@/components/ui/button";
import AddMealForm from "@/components/forms/add-meal";
import { MealList, columns } from "@/components/meal-list";

export default function MealsPage({
  allMeals,
  allPantryItems,
}: {
  allMeals: any[];
  allPantryItems: any;
}) {
  const [showMealList, setShowMealList] = useState(false);

  const handleToggle = () => {
    setShowMealList(!showMealList);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => setShowMealList(true),
    onSwipedRight: () => setShowMealList(false),
  });

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
        <MealList data={allMeals} columns={columns} />
      ) : (
        <AddMealForm allPantryItems={allPantryItems} />
      )}
    </div>
  );
}
