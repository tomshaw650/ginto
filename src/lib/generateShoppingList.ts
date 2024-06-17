import { getWeek, getPantryItems } from "./queries";

export default async function generateShoppingList() {
  const weeklyMeals = await getWeek();
  const pantryItems = await getPantryItems();

  let shoppingList: any[] = [];

  const pantryMap = new Map();
  pantryItems.forEach((item) => {
    pantryMap.set(item.item?.name, {
      quantity: item.item?.quantity,
      unit: item.item?.unit,
    });
  });

  const shoppingListMap = new Map();

  for (const day of weeklyMeals) {
    const meal = day.meal;

    if (meal) {
      for (const ingredient of meal.ingredients) {
        const { name, quantity, unit } = ingredient;
        const pantryItem = pantryMap.get(name) || { quantity: 0, unit };

        if (quantity === null || quantity === undefined) {
          continue;
        }

        const requiredQuantity = Math.max(quantity - pantryItem.quantity, 0);

        if (requiredQuantity > 0) {
          const existingItem = shoppingListMap.get(name);
          if (existingItem) {
            existingItem.quantity += requiredQuantity;
          } else {
            shoppingListMap.set(name, { quantity: requiredQuantity, unit });
          }
        }
      }
    }
  }

  shoppingListMap.forEach((value, key) => {
    shoppingList.push(`${key} ${value.quantity}${value.unit}`);
  });

  return shoppingList;
}
