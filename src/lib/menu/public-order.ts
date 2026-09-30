import type { Category, Product } from "./types";

export function orderPublicMenuContent(categories: readonly Category[], products: readonly Product[]) {
  const orderedCategories = [...categories].sort((a, b) => a.sortOrder - b.sortOrder || a.id.localeCompare(b.id));
  const rank = new Map(orderedCategories.map((category, index) => [category.id, index]));
  const orderedProducts = [...products].sort((a, b) => {
    const categoryDelta = (rank.get(a.categoryId ?? "") ?? Number.MAX_SAFE_INTEGER) - (rank.get(b.categoryId ?? "") ?? Number.MAX_SAFE_INTEGER);
    return categoryDelta || a.sortOrder - b.sortOrder || a.id.localeCompare(b.id);
  });
  return { categories: orderedCategories, products: orderedProducts };
}
