"use client";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { X } from "lucide-react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import type { Meal } from "@/types/meal";
import { getWeek } from "@/lib/queries";
import AddMeal from "@/components/add-meal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Day {
  id: string;
  day: string;
  meal: {
    id: string;
    name: string;
    ingredients: {
      name: string;
      quantity: number | null;
      unit: string | null;
    }[];
  } | null;
}

const daysOrdered = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

interface DraggableMealProps {
  meal: {
    id: string;
    name: string;
    ingredients: {
      name: string;
      quantity: number | null;
      unit: string | null;
    }[];
  };
  dayId: string;
}

const DraggableMeal: React.FC<DraggableMealProps> = ({ meal, dayId }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: dayId,
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex items-center justify-between gap-x-2 ${isDragging ? "opacity-50" : ""}`}
    >
      <span>{meal.name}</span>
    </div>
  );
};

interface DroppableDayProps {
  day: Day;
  children: React.ReactNode;
  isOver: boolean;
  handleDeleteMeal: (dayId: string) => void;
}

const DroppableDay: React.FC<DroppableDayProps> = ({
  day,
  children,
  isOver,
  handleDeleteMeal,
}) => {
  const { setNodeRef } = useDroppable({
    id: day.id,
  });

  return (
    <Card
      className={`w-[300px] rounded-lg ${isOver ? "bg-blue-100" : ""}`}
      ref={setNodeRef}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between capitalize">
          {day.day}
          <Button
            variant="ghost"
            onClick={() => handleDeleteMeal(day.id)}
            className={`${day.meal ? "" : "-z-50 cursor-default opacity-0"}`}
          >
            <X className="h-5 w-5" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default function WeekDisplay() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["week"],
    queryFn: () => getWeek(),
  });
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);
  const [draggingId, setDraggingId] = useState<UniqueIdentifier | null>(null);

  const addMeal = useMutation({
    mutationFn: async (values: { meal: Meal; day: Day }) => {
      const response = await fetch("/api/add-meal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ meal: values.meal, day: values.day.day }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error adding meal: ${errorText}`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["week"] });
    },
    onError: (error: Error) => {
      toast.error(`${error.message}`, {
        duration: 3000,
      });
    },
  });

  const deleteMeal = useMutation({
    mutationFn: async (values: { day: Day }) => {
      const response = await fetch("/api/clear-day", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ day: values.day.day }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error deleting meal: ${errorText}`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["week"] });
    },
    onError: (error: Error) => {
      toast.error(`${error.message}`, {
        duration: 3000,
      });
    },
  });

  const swapMeals = useMutation({
    mutationFn: async (values: {
      day1: string;
      day2: string;
      meal1: any;
      meal2: any;
    }) => {
      const response = await fetch("/api/swap-meals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          day1: values.day1,
          day2: values.day2,
          meal1: values.meal1,
          meal2: values.meal2,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error swapping meals: ${errorText}`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["week"] });
    },
    onError: (error: Error) => {
      toast.error(`${error.message}`, {
        duration: 3000,
      });
    },
  });

  const weekData: Day[] = data || [];

  // Sort in the order of days (mon - sun)
  const sortedWeekData = weekData.sort((a, b) => {
    return daysOrdered.indexOf(a.day) - daysOrdered.indexOf(b.day);
  });

  const handleMealSelect = (meal: Meal, day: Day) => {
    addMeal.mutate({ meal, day });
  };

  const handleDeleteMeal = (dayId: string) => {
    const day = sortedWeekData.find((d) => d.id === dayId);
    if (day) {
      deleteMeal.mutate({ day });
    } else {
      console.error("Day not found for id: ", dayId);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setDraggingId(event.active.id);
  };

  const handleDragOver = (event: DragOverEvent) => {
    setOverId(event.over?.id || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setOverId(null);
    setDraggingId(null);

    if (active.id !== over?.id) {
      const activeDay = sortedWeekData.find((day) => day.id === active.id);
      const overDay = sortedWeekData.find((day) => day.id === over?.id);

      if (activeDay && overDay) {
        swapMeals.mutate({
          day1: activeDay.day,
          day2: overDay.day,
          meal1: activeDay.meal,
          meal2: overDay.meal,
        });
      }
    }
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="my-4 flex max-h-10 flex-col gap-x-4 gap-y-1">
        {sortedWeekData.map((day) => (
          <DroppableDay
            key={day.id}
            day={day}
            isOver={day.id === overId}
            handleDeleteMeal={handleDeleteMeal}
          >
            {day?.meal ? (
              <DraggableMeal meal={day.meal} dayId={day.id} />
            ) : (
              <AddMeal onItemSelect={(meal) => handleMealSelect(meal!, day)} />
            )}
          </DroppableDay>
        ))}
      </div>
    </DndContext>
  );
}
