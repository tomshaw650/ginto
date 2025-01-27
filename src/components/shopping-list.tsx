"use client";
import { useState } from "react";
import { useStorage, useMutation, useSelf, useStatus } from "@liveblocks/react/suspense";
import "@liveblocks/react";
import { LiveObject } from "@liveblocks/client";
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
import { useCopyToClipboard } from "usehooks-ts";

export default function ShoppingList() {
  const [draft, setDraft] = useState("");
  const list = useStorage((root) => root.items);
  const { role } = useSelf((me) => me.info);
  const connectionStatus = useStatus();
  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const hasCopiedText = Boolean(copiedText);

  const addItem = useMutation(({ storage }, text) => {
    try {
      storage.get("items").push(new LiveObject({ text }));
    } catch (err) {
      if (role === "guest") {
        toast.error("Guests cannot complete this action.", {
          duration: 3000,
        });
      }
    }
  }, []);

  const toggleDone = useMutation(({ storage }, index) => {
    try {
      const item = storage.get("items").get(index);
      item?.set("checked", !item.get("checked"));
    } catch (err) {
      if (role === "guest") {
        toast.error("Guests cannot complete this action.", {
          duration: 3000,
        });
      }
    }
  }, []);

  const deleteAll = useMutation(({ storage }) => {
    try {
      storage.get("items").clear();
    } catch (err) {
      if (role === "guest") {
        toast.error("Guests cannot complete this action.", {
          duration: 3000,
        });
      }
    }
  }, []);

  const deleteItem = useMutation(({ storage }, index) => {
    try {
      storage.get("items").delete(index);
    } catch (err) {
      if (role === "guest") {
        toast.error("Guests cannot complete this action.", {
          duration: 3000,
        });
      }
    }
  }, []);

  const generateFromWeek = useMutation(({ storage }) => {
    try {
      generateShoppingList().then((list) => {
        for (const item of list) {
          const itemString = `${item.name} ${item.quantity}${item.unit}`;
          storage
            .get("items")
            .push(new LiveObject({ text: itemString, checked: false }));
        }
      });
    } catch (err) {
      if (role === "guest") {
        toast.error("Guests cannot complete this action.", {
          duration: 3000,
        });
      }
    }
  }, []);

  const getCheckedItems = () => {
    const checkedItems = [];

    for (const item of list) {
      if (item.checked) {
        // Split item.text into name, quantity, and unit
        const match = item.text.match(/^([\w\s'’.-]+)\s+(\d*\.?\d+)\s*(\w+)$/);
        if (match) {
          const name = match[1].trim();
          const quantity = parseFloat(match[2]);
          const unit = match[3];
          checkedItems.push({ name, quantity, unit });
        } else {
          console.warn(`Failed to parse item: ${item.text}`);
        }
      }
    }

    return checkedItems;
  };

  const addCheckedItemsToPantry = () => {
    try {
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
    } catch (err) {
      if (role === "guest") {
        toast.error("Guests cannot complete this action.", {
          duration: 3000,
        });
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-xs">{connectionStatus}</div>
      <div className="flex gap-2">
        <Button
            variant="ghost"
            disabled={hasCopiedText}
            className="link"
            onClick={() => copyToClipboard(list.map(item => item.text).join("\n"))}
          >
            Copy to clipboard
          </Button>
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
      <div className="flex max-h-[510px] w-full flex-col gap-2 overflow-y-scroll px-10">
        {list.map((item, index) => (
          <div key={index}>
            <Checkbox
              id={item.text}
              className="mr-2 align-bottom"
              onClick={() => toggleDone(index)}
              checked={item.checked}
              disabled={role !== "user"}
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
