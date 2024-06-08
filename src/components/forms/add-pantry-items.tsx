"use client";
import { Plus, Minus } from "lucide-react";
import { z } from "zod";
import { useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { pantryItemSchema } from "@/schemas/pantry-item";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddPantryItemsForm() {
  const { register, control, handleSubmit, reset } = useForm<
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

  function onSubmit(values: z.infer<typeof pantryItemSchema>) {
    fetch("/api/add-pantry-items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((res) => {
        toast.success("Items added to pantry", {
          duration: 3000,
        });
        reset();
      })
      .catch((err) => {
        toast.error("Error adding items to pantry, " + err, {
          duration: 3000,
        });
      });
  }

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
          <>
            <Button variant="outline" onClick={() => remove(fields.length - 1)}>
              <Minus className="h-4 w-10" />
            </Button>
            <Button variant="outline" onClick={() => reset()}>
              Clear
            </Button>
          </>
        )}
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
              />
            </div>
            <div className="mr-2 grid w-full max-w-24 items-center gap-1.5">
              <Input
                {...register(`items.${index}.quantity`)}
                placeholder="Quantity"
                type="number"
              />
            </div>
            <div className="mr-2 grid w-full max-w-24 items-center gap-1.5">
              <Input
                {...register(`items.${index}.unit`)}
                placeholder="Unit"
                type="text"
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
