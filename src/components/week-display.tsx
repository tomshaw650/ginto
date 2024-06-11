"use client";
import { useQuery } from "@tanstack/react-query";
import { getWeek } from "@/lib/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WeekDisplay() {
  const { data } = useQuery({
    queryKey: ["week"],
    queryFn: () => {
      return getWeek();
    },
  });

  const weekData = data || [];

  return (
    <div className="my-4 flex max-h-10 flex-col gap-x-4 gap-y-1">
      {weekData.map((day) => (
        <Card className="w-[300px] rounded-lg" key={day.id}>
          <CardHeader>
            <CardTitle className="capitalize">{day.day}</CardTitle>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      ))}
    </div>
  );
}
