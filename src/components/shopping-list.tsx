"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "./ui/separator";

const list = [
  "200g flour",
  "200g sugar",
  "100g butter",
  "100g eggs",
  "1 tsp vanilla extract",
  "1 tsp baking powder",
  "1/2 tsp salt",
  "1/2 cup milk",
  "2 cups water",
  "2 cups chocolate chips",
];

const done: string[] = ["chains", "whips"];

export default function ShoppingList() {
  return (
    <div className="flex flex-col gap-3">
      {list.map((item) => (
        <div key={item}>
          <Checkbox id={item} className="mr-2" />
          <label
            className="cursor-pointer text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor={item}
          >
            {item}
          </label>
        </div>
      ))}
      {done.length > 0 && <Separator />}
      {done.map((item) => (
        <div key={item} className="line-through">
          <Checkbox id={item} className="mr-2 opacity-50" checked />
          <label
            className="cursor-pointer text-lg font-medium leading-none opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor={item}
          >
            {item}
          </label>
        </div>
      ))}
    </div>
  );
}
