"use client";
import { useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import type { Item } from "@/types/item";
import PantryItemList from "./pantry-item-list";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function AddIngredient({
  onItemSelect,
}: {
  onItemSelect: (item: Item | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const handleSelectItem = (item: Item | null) => {
    setSelectedItem(item);
    onItemSelect(item);
    setOpen(false);
  };

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start">
            {selectedItem ? (
              <>{selectedItem.item?.name}</>
            ) : (
              <>Add Ingredient</>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <PantryItemList
            setOpen={setOpen}
            setSelectedItem={handleSelectItem}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="justify-start">
          {selectedItem ? <>{selectedItem.item?.name}</> : <>Add Ingredient</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <PantryItemList
            setOpen={setOpen}
            setSelectedItem={handleSelectItem}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
