"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSwipeable } from "react-swipeable";
import { CircleChevronRight, CircleChevronLeft } from "lucide-react";
import { getPantryItems } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import AddPantryItemsForm from "@/components/forms/add-pantry-items";
import { PantryList, columns } from "@/components/pantry-list";

export default function PantryPage() {
  const { data } = useQuery({
    queryKey: ["pantryItems"],
    queryFn: () => {
      return getPantryItems();
    },
  });
  const [showPantryList, setShowPantryList] = useState(false);

  const handleToggle = () => {
    setShowPantryList(!showPantryList);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => setShowPantryList(true),
    onSwipedRight: () => setShowPantryList(false),
  });

  const pantryData = data || [];

  return (
    <div
      {...handlers}
      className="flex h-screen w-screen flex-col items-center justify-start"
    >
      {showPantryList && (
        <Button
          onClick={handleToggle}
          variant="ghost"
          className="absolute left-0 top-1/3 hidden -translate-y-1/2 transform sm:block"
        >
          <CircleChevronLeft />
        </Button>
      )}
      {!showPantryList && (
        <Button
          onClick={handleToggle}
          variant="ghost"
          className="absolute right-0 top-1/3 hidden -translate-y-1/2 transform sm:block"
        >
          <CircleChevronRight />
        </Button>
      )}
      {showPantryList ? (
        <PantryList data={pantryData} columns={columns} />
      ) : (
        <AddPantryItemsForm />
      )}
    </div>
  );
}
