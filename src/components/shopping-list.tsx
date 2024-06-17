"use client";
import { useState } from "react";
import { useStorage, useMutation } from "@liveblocks/react/suspense";
import "@liveblocks/react";
import { LiveObject } from "@liveblocks/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import generateShoppingList from "@/lib/generateShoppingList";
import addListToPantry from "@/lib/addListToPantry";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ShoppingList() {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState("");
  const list = useStorage((root) => root.items);

  const addItem = useMutation(({ storage }, text) => {
    storage.get("items").push(new LiveObject({ text }));
  }, []);

  const toggleDone = useMutation(({ storage }, index) => {
    const item = storage.get("items").get(index);
    item?.set("checked", !item.get("checked"));
  }, []);

  const deleteAll = useMutation(({ storage }) => {
    storage.get("items").clear();
  }, []);

  const deleteItem = useMutation(({ storage }, index) => {
    storage.get("items").delete(index);
  }, []);

  const generateFromWeek = useMutation(({ storage }) => {
    generateShoppingList().then((list) => {
      for (const item of list) {
        const itemString = `${item.name} ${item.quantity}${item.unit}`;
        storage
          .get("items")
          .push(new LiveObject({ text: itemString, checked: false }));
      }
    });
  }, []);

  const getCheckedItems = () => {
    const checkedItems = [];

    for (const item of list) {
      if (item.checked) {
        // Split item.text into name, quantity, and unit
        const match = item.text.match(/^([\w\s]+)\s+(\d*\.?\d+)\s*(\w+)$/);
        if (match) {
          const name = match[1].trim(); // Extract name and trim whitespace
          const quantity = parseFloat(match[2]); // Extract quantity as float
          const unit = match[3]; // Extract unit
          checkedItems.push({ name, quantity, unit });
        } else {
          console.warn(`Failed to parse item: ${item.text}`);
        }
      }
    }

    return checkedItems;
  };

  const addCheckedItemsToPantry = () => {
    const checkedItems = getCheckedItems();

    addListToPantry(checkedItems).then((response) => {
      if (response === true && checkedItems.length > 0) {
        toast.success("Pantry updated", {
          duration: 3000,
        });
      } else if (response === true && checkedItems.length <= 0) {
        toast.error("No items selected", {
          duration: 3000,
        });
      } else {
        toast.error("Error updating pantry", {
          duration: 3000,
        });
      }
    });
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => generateFromWeek()}>
          Generate from week
        </Button>
        <Button onClick={() => addCheckedItemsToPantry()}>Update pantry</Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Clear list</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will clear the entire shopping list.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteAll()}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Input
        type="text"
        autoFocus={true}
        className="w-[300px] border-none"
        placeholder="Add an item to the list..."
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
        }}
        onKeyDown={(e) => {
          if (draft && e.key === "Enter") {
            addItem(draft);
            setDraft("");
          }
        }}
      />
      <div className="flex w-full flex-col gap-2 overflow-y-auto">
        {list.map((item, index) => (
          <div key={index}>
            <Checkbox
              id={item.text}
              className="mr-2 align-bottom"
              onClick={() => toggleDone(index)}
              checked={item.checked}
            />
            <label
              className={`cursor-pointer align-bottom text-lg font-medium leading-none ${
                item.checked && "line-through opacity-30"
              }`}
              htmlFor={item.text}
            >
              {item.text}
            </label>
            <Button
              variant="ghost"
              onClick={() => deleteItem(index)}
              className="float-right"
            >
              X
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
