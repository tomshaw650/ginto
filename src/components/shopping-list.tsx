"use client";
import { useState } from "react";
import { useStorage, useMutation } from "@liveblocks/react/suspense";
import "@liveblocks/react";
import { LiveObject } from "@liveblocks/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "./ui/input";

export default function ShoppingList() {
  const [draft, setDraft] = useState("");
  const list = useStorage((root) => root.items);

  const addItem = useMutation(({ storage }, text) => {
    storage.get("items").push(new LiveObject({ text }));
  }, []);

  const toggleDone = useMutation(({ storage }, index) => {
    const item = storage.get("items").get(index);
    item?.set("checked", !item.get("checked"));
  }, []);

  return (
    <div className="flex flex-col gap-3">
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
      {list.map((item, index) => (
        <div key={index}>
          <Checkbox
            id={item.text}
            className="mr-2"
            onClick={() => toggleDone(index)}
            checked={item.checked}
          />
          <label
            className={`cursor-pointer text-lg font-medium leading-none ${
              item.checked && "line-through opacity-30"
            }`}
            htmlFor={item.text}
          >
            {item.text}
          </label>
        </div>
      ))}
    </div>
  );
}
