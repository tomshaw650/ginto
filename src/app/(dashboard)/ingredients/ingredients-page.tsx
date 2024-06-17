"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSwipeable } from "react-swipeable";
import { CircleChevronRight, CircleChevronLeft } from "lucide-react";
import { getIngredients } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import AddIngredientsForm from "@/components/forms/add-ingredients";
import { IngredientsList, columns } from "@/components/ingredients-list";

export default function IngredientsPage() {
  const { data } = useQuery({
    queryKey: ["ingredients"],
    queryFn: () => {
      return getIngredients();
    },
  });
  const [showIngredientsList, setShowIngredientsList] = useState(false);

  const handleToggle = () => {
    setShowIngredientsList(!showIngredientsList);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => setShowIngredientsList(true),
    onSwipedRight: () => setShowIngredientsList(false),
  });

  const ingredientsData = data || [];

  return (
    <div
      {...handlers}
      className="flex h-screen w-screen flex-col items-center justify-start"
    >
      <h2 className="mb-2 text-2xl font-bold">Ingredients</h2>
      {showIngredientsList && (
        <Button
          onClick={handleToggle}
          variant="ghost"
          className="absolute left-0 top-1/3 hidden -translate-y-1/2 transform sm:block"
        >
          <CircleChevronLeft />
        </Button>
      )}
      {!showIngredientsList && (
        <Button
          onClick={handleToggle}
          variant="ghost"
          className="absolute right-0 top-1/3 hidden -translate-y-1/2 transform sm:block"
        >
          <CircleChevronRight />
        </Button>
      )}
      {showIngredientsList ? (
        <IngredientsList data={ingredientsData} columns={columns} />
      ) : (
        <AddIngredientsForm />
      )}
    </div>
  );
}
