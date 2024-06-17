export type Item = {
  id: string;
  item: {
    name: string;
    quantity: number | null;
    unit: string | null;
  } | null;
};

export type IngredientItem = {
  id: string;
  item: {
    name: string;
    unit: string | null;
  } | null;
};
