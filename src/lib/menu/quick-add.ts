import type { Product, ProductOptions } from "@/lib/menu/types";

export type QuickAddDecision = "eligible" | "requires-options" | "unavailable" | "invalid-price";

/**
 * Direct add is intentionally conservative: any configured variant or active
 * modifier group stays on the existing product-details/options flow.
 */
export function getQuickAddDecision(product: Product, options?: ProductOptions): QuickAddDecision {
  if (!product.isAvailable) return "unavailable";
  if (!Number.isFinite(product.price) || product.price < 0) return "invalid-price";
  if ((options?.variants ?? []).some((variant) => variant.isAvailable) || (options?.groups ?? []).some((group) => group.isActive)) {
    return "requires-options";
  }
  return "eligible";
}

export function quickAddKey(productId: string): string {
  return `simple:${productId}`;
}
