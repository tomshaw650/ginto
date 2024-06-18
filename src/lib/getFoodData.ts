export default async function getFoodData(barcode: string) {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v3/product/${barcode}.json`,
    );

    if (!response.ok) {
      throw new Error("Error fetching food data");
    }

    const data = await response.json();

    console.log(data);

    return {
      name: data.product.product_name_en,
      unit:
        data.product.product_quantity_unit ||
        data.product.serving_quantity_unit,
    };
  } catch (error) {
    console.error("Error fetching food data:", error);
    throw error;
  }
}
