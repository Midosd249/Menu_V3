import type { Product } from "./types";

export const MAX_FEATURED_PRESENTATION_ITEMS = 6;

export function getFeaturedProducts(products: readonly Product[]): Product[] {
  return products.filter((product) => product.isFeatured).slice(0, MAX_FEATURED_PRESENTATION_ITEMS);
}
