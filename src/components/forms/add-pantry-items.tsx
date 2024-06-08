"use client";
import { useState, useRef, useEffect } from "react";
import { useFormState } from "react-dom";
import { nanoid } from "nanoid";
import { Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import addPantryItems from "@/actions/addPantryItems";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SubmitButton from "@/components/submit-button";

export const dynamic = "force-dynamic";

interface Item {
  id: string;
  item: {
    name: string;
    quantity: number | null;
    unit: string | null;
  };
}

const createNewItem = (): Item => ({
  id: nanoid(),
  item: { name: "", quantity: null, unit: null },
});

const initialState: Item[] = [createNewItem()];

export default function AddPantryItemsForm() {
  const [items, setItems] = useState<Item[]>(initialState);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current.length > 0 && items.length > 1) {
      inputRefs.current[inputRefs.current.length - 1]?.focus();
    }
  }, [items.length]);

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: nanoid(), item: { name: "", quantity: null, unit: null } },
    ]);
  };

  const handleRemoveItem = () => {
    if (items.length > 1) {
      setItems(items.slice(0, -1));
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddItem();
    }
  };

  const handleInputChange = (
    id: string,
    field: "name" | "quantity" | "unit",
    value: string | number | null,
  ) => {
    const updatedItems = items.map((item) =>
      item.id === id
        ? {
            ...item,
            item: {
              ...item.item,
              [field]: value,
            },
          }
        : item,
    );
    setItems(updatedItems);
  };

  const updatePantryWithItems = addPantryItems.bind(null, items);

  const [state, formAction] = useFormState(updatePantryWithItems, {
    message: "",
  });

  useEffect(() => {
    if (state.message === "success") {
      window.location.reload();
    }
  }, [state.message, items]);

  return (
    <>
      <div className="mb-4 flex max-h-10 gap-x-4">
        <Button variant="outline" onClick={handleAddItem}>
          <Plus className="h-4 w-10" />
        </Button>
        {items.length > 1 && (
          <Button variant="outline" onClick={handleRemoveItem}>
            <Minus className="h-4 w-10" />
          </Button>
        )}
      </div>
      <form action={formAction} className="flex flex-col items-center gap-y-4">
        {items.map((i, index) => (
          <ItemInput
            key={i.id}
            item={i}
            onInputChange={handleInputChange}
            inputRef={(el) => (inputRefs.current[index] = el)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          />
        ))}
        <SubmitButton className="uppercase" pendingcontent="Adding...">
          Add to pantry
        </SubmitButton>
      </form>
    </>
  );
}

const ItemInput = ({
  item,
  onInputChange,
  inputRef,
  onKeyDown,
}: ItemInputProps) => {
  return (
    <div className="flex px-2">
      <div className="mr-3 grid w-full items-center gap-1.5">
        <Input
          placeholder="Item name"
          value={item.item.name}
          required
          ref={inputRef}
          onKeyDown={onKeyDown}
          onChange={(e) => onInputChange(item.id, "name", e.target.value)}
        />
      </div>
      <div className="mr-2 grid w-full max-w-24 items-center gap-1.5">
        <Input
          placeholder="Quantity"
          type="number"
          value={item.item.quantity ?? ""}
          onKeyDown={onKeyDown}
          onChange={(e) =>
            onInputChange(
              item.id,
              "quantity",
              e.target.value ? parseInt(e.target.value, 10) : null,
            )
          }
        />
      </div>
      <div className="mr-2 grid w-full max-w-24 items-center gap-1.5">
        <Input
          placeholder="Unit"
          value={item.item.unit ?? ""}
          onKeyDown={onKeyDown}
          onChange={(e) =>
            onInputChange(item.id, "unit", e.target.value || null)
          }
        />
      </div>
    </div>
  );
};

interface ItemInputProps {
  item: Item;
  onInputChange: (
    id: string,
    field: "name" | "quantity" | "unit",
    value: string | number | null,
  ) => void;
  inputRef: (el: HTMLInputElement | null) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}
