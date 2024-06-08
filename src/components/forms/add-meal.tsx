"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import SubmitButton from "../submit-button";
import AddIngredient from "../add-ingredient";

export default function AddMealForm(allPantryItems: any) {
  return (
    <div>
      <form action={() => {}} className="flex flex-col gap-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="name">Meal Name</Label>
          <Input type="text" id="name" placeholder="Meal Name" />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="name">Ingredients</Label>
          <AddIngredient allPantryItems={allPantryItems} />
          <div className="flex">
            <Input type="text" id="quantity" placeholder="Quantity" />
            <Input disabled value={"test"} className="w-[120px]" />
          </div>
        </div>
        <SubmitButton>Add Meal</SubmitButton>
      </form>
    </div>
  );
}
