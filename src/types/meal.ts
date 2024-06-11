export type Meal = {
  id: string;
  name: string;
  ingredients: Array<{
    name: string;
    quantity: number | null;
    unit: string | null;
  }> | null;
  createdAt: Date | null;
};
