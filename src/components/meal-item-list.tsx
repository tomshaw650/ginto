"use client";
import type { Meal } from "@/types/meal";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useQuery } from "@tanstack/react-query";
import { getMeals } from "@/lib/queries";

export default function MealItemList({
  setOpen,
  setSelectedItem,
}: {
  setOpen: (open: boolean) => void;
  setSelectedItem: (item: Meal | null) => void;
}) {
  const { data } = useQuery({
    queryKey: ["meals"],
    queryFn: () => {
      return getMeals();
    },
  });

  const items = data || [];

  return (
    <Command>
      <CommandInput placeholder="Filter meals..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {items.map((item: Meal) => (
            <CommandItem
              key={item.id}
              value={item.id}
              onSelect={(value) => {
                setSelectedItem(
                  items.find((item: any) => item.id === value) || null,
                );
                setOpen(false);
              }}
            >
              {item?.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
