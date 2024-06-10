"use client";
import { Plus, Minus } from "lucide-react";
import { z } from "zod";
import { useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pantryItemSchema } from "@/schemas/pantry-item";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddPantryItemsForm() {
  const queryClient = useQueryClient();
  const { register, control, handleSubmit, reset, setFocus } = useForm<
    z.infer<typeof pantryItemSchema>
  >({
    resolver: zodResolver(pantryItemSchema),
    defaultValues: {
      items: [
        {
          name: "",
          quantity: null,
          unit: null,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "items",
    control,
  });

  const nameWatched = useWatch({ control, name: "items.0.name" });

  const addPantryItems = useMutation({
    mutationFn: async (values: z.infer<typeof pantryItemSchema>) => {
      const response = await fetch("/api/add-pantry-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Error adding items to pantry");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Items added to pantry", {
        duration: 3000,
      });
      reset();
    },
    onError: (error) => {
      toast.error(`Error adding items to pantry: ${error.message}`, {
        duration: 3000,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["pantryItems"],
      });
    },
  });

  const onSubmit = (values: z.infer<typeof pantryItemSchema>) => {
    addPantryItems.mutate(values);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      append({ name: "", quantity: null, unit: null });
      setFocus(`items.${index}.name`);
    }
  };

  return (
    <>
      <div className="mb-4 flex max-h-10 gap-x-4">
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
        {fields.length > 1 ||
          (nameWatched?.length > 0 && (
            <Button variant="outline" onClick={() => reset()}>
              Clear
            </Button>
          ))}
      </div>
      <form
        onSubmit={handleSubmit((data) => onSubmit(data))}
        className="flex flex-col items-center space-y-2"
      >
        {fields.map((field, index) => (
          <div key={field.id} className="flex px-2">
            <div className="mr-3 grid w-full items-center gap-1.5">
              <Input
                {...register(`items.${index}.name`)}
                placeholder="Item name"
                required
                type="text"
                onKeyDown={(e) => handleKeyDown(e, index * 3)}
                autoComplete="off"
              />
            </div>
            <div className="mr-2 grid w-full max-w-24 items-center gap-1.5">
              <Input
                {...register(`items.${index}.quantity`)}
                placeholder="Quantity"
                type="number"
                onKeyDown={(e) => handleKeyDown(e, index * 3 + 1)}
                autoComplete="off"
              />
            </div>
            <div className="mr-2 grid w-full max-w-24 items-center gap-1.5">
              <Input
                {...register(`items.${index}.unit`)}
                placeholder="Unit"
                type="text"
                onKeyDown={(e) => handleKeyDown(e, index * 3 + 2)}
                autoComplete="off"
              />
            </div>
          </div>
        ))}
        <Button className="uppercase" type="submit">
          Add to pantry
        </Button>
      </form>
    </>
  );
}
