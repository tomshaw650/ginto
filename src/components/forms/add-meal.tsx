"use client";
import { Plus, Minus } from "lucide-react";
import { z } from "zod";
import { useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Item } from "@/types/item";
import { mealSchema } from "@/schemas/mealSchema";
import AddIngredient from "@/components/add-ingredient";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddMealForm() {
  const queryClient = useQueryClient();
  const { register, control, handleSubmit, reset, setValue } = useForm<
    z.infer<typeof mealSchema>
  >({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      name: "",
      ingredients: [
        {
          name: "",
          quantity: null,
          unit: null,
        },
      ],
    },
  });

  const nameWatched = useWatch({ control, name: "name" });

  const { fields, append, remove } = useFieldArray({
    name: "ingredients",
    control,
  });

  const addMeal = useMutation({
    mutationFn: async (values: z.infer<typeof mealSchema>) => {
      const response = await fetch("/api/add-meal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Error creating meal");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("New meal created", {
        duration: 3000,
      });
      reset();
    },
    onError: (error) => {
      toast.error(`Error adding meal: ${error.message}`, {
        duration: 3000,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["meals"],
      });
    },
  });

  const onSubmit = (values: z.infer<typeof mealSchema>) => {
    addMeal.mutate(values);
  };

  const handleIngredientSelect =
    (index: number) => (ingredient: Item | null) => {
      setValue(`ingredients.${index}.name`, ingredient!.item!.name);
      setValue(`ingredients.${index}.unit`, ingredient!.item!.unit);
    };

  return (
    <>
      <div className="my-4 flex max-h-10 gap-x-4">
        <Button
          variant="outline"
          onClick={() => append({ name: "", quantity: null, unit: null })}
        >
          <Plus className="h-4 w-10" />
        </Button>
        {fields.length > 1 && (
          <Button variant="outline" onClick={() => remove(fields.length - 1)}>
            <Minus className="h-4 w-10" />
          </Button>
        )}
        {(fields.length > 1 || nameWatched?.length > 0) && (
          <Button variant="outline" onClick={() => reset()}>
            Clear
          </Button>
        )}
      </div>
      <form
        onSubmit={handleSubmit((data) => onSubmit(data))}
        className="flex flex-col items-center space-y-2"
      >
        <div className="mb-3 grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="name">Meal name</Label>
          <Input
            {...register("name")}
            placeholder="Meal name"
            required
            type="text"
            autoComplete="off"
          />
        </div>
        {fields.map((field, index) => (
          <div key={field.id} className="flex">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="name">Ingredients</Label>
              <AddIngredient onItemSelect={handleIngredientSelect(index)} />
              <Input
                type="hidden"
                aria-hidden="true"
                {...register(`ingredients.${index}.name`)}
              />
              <div className="mb-3 flex">
                <Input
                  {...register(`ingredients.${index}.quantity`)}
                  type="number"
                  step="0.1"
                  id="quantity"
                  placeholder="Quantity"
                />
                <Input
                  {...register(`ingredients.${index}.unit`)}
                  disabled
                  className="w-[120px]"
                />
              </div>
            </div>
          </div>
        ))}
        <Button className="uppercase" type="submit">
          Create meal
        </Button>
        <div className="mt-5"></div>
      </form>
    </>
  );
}
