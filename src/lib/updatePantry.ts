import { getPantryItems, deleteItem, updateItemQuantity } from "./queries";

export default async function updatePantry(meal: any) {
  const pantry = await getPantryItems();
  const mealIngredients = meal.ingredients.map((ingredient: any) => ({
    name: ingredient.name,
    quantity: ingredient.quantity,
    unit: ingredient.unit,
  }));

  for (const item of pantry) {
    const pantryItem = item;
    const existingIngredient = mealIngredients.find(
      (ingredient: any) => ingredient.name === pantryItem?.item?.name,
    );

    if (existingIngredient) {
      const pantryQuantity = pantryItem.item?.quantity || 0;
      const ingredientQuantity = existingIngredient.quantity || 0;

      const newQuantity = pantryQuantity - ingredientQuantity;

      if (newQuantity <= 0) {
        await deleteItem(pantryItem.id);
      } else {
        await updateItemQuantity(pantryItem.id, newQuantity);
      }
    }
  }
}
