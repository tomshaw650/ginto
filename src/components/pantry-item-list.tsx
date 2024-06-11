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
import { useQuery } from "@tanstack/react-query";
import { getPantryItems } from "@/lib/queries";

export default function PantryItemList({
  setOpen,
  setSelectedItem,
}: {
  setOpen: (open: boolean) => void;
  setSelectedItem: (item: Item | null) => void;
}) {
  const { data } = useQuery({
    queryKey: ["pantryItems"],
    queryFn: () => {
      return getPantryItems();
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
