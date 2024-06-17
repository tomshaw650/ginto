"use client";
import { IngredientItem } from "@/types/item";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useQuery } from "@tanstack/react-query";
import { getIngredients } from "@/lib/queries";

export default function IngredientsList({
  setOpen,
  setSelectedItem,
}: {
  setOpen: (open: boolean) => void;
  setSelectedItem: (item: IngredientItem | null) => void;
}) {
  const { data } = useQuery({
    queryKey: ["ingredients"],
    queryFn: () => {
      return getIngredients();
    },
  });

  const items = data || [];

  return (
    <Command>
      <CommandInput placeholder="Filter ingredients..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {items.map((item: any) => (
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
              {item.item?.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
