"use client";
import { useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { useQueryClient } from "@tanstack/react-query";
import type { Meal } from "@/types/meal";
import MealItemList from "./meal-item-list";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function AddMeal({
  onItemSelect,
}: {
  onItemSelect: (item: Meal | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedItem, setSelectedItem] = useState<Meal | null>(null);

  const handleSelectItem = (item: Meal | null) => {
    setSelectedItem(item);
    onItemSelect(item);
    setOpen(false);
  };

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start">
            Add Meal
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <MealItemList setOpen={setOpen} setSelectedItem={handleSelectItem} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="justify-start">
          {selectedItem ? <></> : <>Add Meal</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <MealItemList setOpen={setOpen} setSelectedItem={handleSelectItem} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
