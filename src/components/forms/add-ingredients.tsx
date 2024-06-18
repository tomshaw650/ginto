"use client";
import { useState } from "react";
import { Plus, Minus, Camera, CameraOff } from "lucide-react";
import { z } from "zod";
import { useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import getFoodData from "@/lib/getFoodData";
import { ingredientsSchema } from "@/schemas/ingredient";
import BarcodeScanner from "../barcode-scanner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function AddIngredientsForm() {
  const queryClient = useQueryClient();
  const { register, control, handleSubmit, reset, setFocus, setValue } =
    useForm<z.infer<typeof ingredientsSchema>>({
      resolver: zodResolver(ingredientsSchema),
      defaultValues: {
        items: [
          {
            name: "",
            unit: null,
          },
        ],
      },
    });
  const [isScanning, setIsScanning] = useState(false);

  const { fields, append, remove } = useFieldArray({
    name: "items",
    control,
  });

  const nameWatched = useWatch({ control, name: "items.0.name" });

  const addIngredients = useMutation({
    mutationFn: async (values: z.infer<typeof ingredientsSchema>) => {
      const response = await fetch("/api/add-ingredients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Error adding items to ingredients");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Items added to ingredients", {
        duration: 3000,
      });
      reset();
    },
    onError: (error) => {
      toast.error(`Error adding items to ingredients: ${error.message}`, {
        duration: 3000,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["ingredients"],
      });
    },
  });

  const onSubmit = (values: z.infer<typeof ingredientsSchema>) => {
    addIngredients.mutate(values);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      append({ name: "", unit: null });
      setFocus(`items.${index}.name`);
    }
  };

  return (
    <>
      <div className="my-4 flex max-h-10 gap-x-4">
        <Button
          variant="outline"
          onClick={() => append({ name: "", unit: null })}
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
                {...register(`items.${index}.unit`)}
                placeholder="Unit"
                type="text"
                onKeyDown={(e) => handleKeyDown(e, index * 3 + 2)}
                autoComplete="off"
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button className="bg-purple-400 hover:bg-purple-500">
                  <Camera />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <BarcodeScanner
                  onCapture={async (data: any) => {
                    try {
                      const foodData = await getFoodData(data.rawValue);
                      if (foodData) {
                        setValue(`items.${index}.name`, foodData.name);
                        setValue(`items.${index}.unit`, foodData.unit);
                      }
                    } catch (error) {
                      console.error("Error setting food data:", error);
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        ))}
        <div className="px-2"></div>
        <Button className="uppercase" type="submit">
          Add to ingredients list
        </Button>
        <div className="mt-2"></div>
      </form>
    </>
  );
}
