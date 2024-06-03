"use client";
import { useState, useRef, useEffect } from "react";
import { useFormState } from "react-dom";
import { nanoid } from "nanoid";
import { Plus, Minus } from "lucide-react";
import addPantryItems from "@/actions/addPantryItems";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/submit-button";
import { Button } from "../ui/button";

interface Item {
  item: {
    id: string;
    name: string;
    quantity: number | null;
    unit: string | null;
  };
}

const initialState: Item[] = [
  { item: { id: nanoid(), name: "", quantity: null, unit: null } },
];

export default function AddPantryItem() {
  const [items, setItems] = useState<Item[]>(initialState);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const formRef = useRef<HTMLFormElement>(null!);

  useEffect(() => {
    if (inputRefs.current.length > 0) {
      inputRefs.current[inputRefs.current.length - 1]?.focus();
    }
  }, [items.length]);

  const handleAddItem = () => {
    setItems([
      ...items,
      { item: { id: nanoid(), name: "", quantity: null, unit: null } },
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
      item.item.id === id
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

  // rest form if state.message is "success", ONLY RUN ONCE
  useEffect(() => {
    // refresh page
    if (state.message === "success") {
      window.location.reload();
    }
  }, [items, []]);

  return (
    <>
      <div className="mb-4 flex gap-x-4">
        <Button variant="outline" onClick={handleAddItem}>
          <Plus className="h-4 w-10" />
        </Button>
        {items.length > 1 && (
          <Button variant="outline" onClick={handleRemoveItem}>
            <Minus className="h-4 w-10" />
          </Button>
        )}
      </div>
      <form
        ref={formRef}
        action={formAction}
        className="flex flex-col items-center gap-y-4"
      >
        {items.map((i, index) => (
          <ItemInput
            key={i.item.id}
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
    <div className="flex">
      <div className="mr-4 grid w-full items-center gap-1.5">
        <Input
          placeholder="Item name"
          value={item.item.name}
          required
          ref={inputRef}
          onKeyDown={onKeyDown}
          onChange={(e) => onInputChange(item.item.id, "name", e.target.value)}
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
              item.item.id,
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
            onInputChange(item.item.id, "unit", e.target.value || null)
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
