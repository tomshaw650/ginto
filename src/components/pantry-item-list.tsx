"use client";
import { Item } from "@/types/item";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export default function PantryItemList({
  items,
  setOpen,
  setSelectedItem,
}: {
  items: any;
  setOpen: (open: boolean) => void;
  setSelectedItem: (item: Item | null) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter ingredients..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {items.allPantryItems.allPantryItems.map((item: any) => (
            <CommandItem
              key={item.id}
              value={item.id}
              onSelect={(value) => {
                setSelectedItem(
                  items.allPantryItems.allPantryItems.find(
                    (item: any) => item.id === value,
                  ) || null,
                );
                setOpen(false);
              }}
            >
              {item.item?.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
