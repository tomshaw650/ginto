import {
  getPantryItems,
  addPantryItem,
  getIngredients,
  updateItemQuantity,
} from "@/lib/queries";

export default async function addListToPantry(listItems: any) {
  try {
    const pantryItems = await getPantryItems();
    const ingredients = await getIngredients();

    console.log(listItems);

    for (const item of listItems) {
      console.log("item", item);
      const ingredient = ingredients.find(
        (ing) =>
          ing.item?.name.trim().toLowerCase() ===
          item.name.trim().toLowerCase(),
      );

      if (ingredient) {
        const existingPantryItem = pantryItems.find(
          (pantry) =>
            pantry.item?.name.trim().toLowerCase() ===
            item.name.trim().toLowerCase(),
        );

        if (existingPantryItem) {
          const newQuantity = existingPantryItem.item?.quantity + item.quantity;
          await updateItemQuantity(existingPantryItem.id, newQuantity);
        } else {
          // item not in pantry, so we add it
          await addPantryItem({
            item: {
              name: item.name,
              quantity: item.quantity,
              unit: item.unit,
            },
          });
        }
      }
    }

    return true;
  } catch (error) {
    console.error("Error adding items to pantry:", error);
    throw error;
  }
}
