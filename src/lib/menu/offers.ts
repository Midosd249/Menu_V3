import type { ProductOffer } from "./types";

export const OFFER_TIME_ZONE = "Asia/Riyadh";
export const OFFERS_FILTER_ID = "__offers__";

export type OfferCalculation = {
  discountedBaseUnitPrice: number;
  discountAmount: number;
  lineTotal: number;
};

export function isOfferCurrentlyActive(
  offer: Pick<ProductOffer, "isActive" | "startsAt" | "endsAt">,
  now = new Date(),
): boolean {
  if (!offer.isActive) return false;
  const startsAt = offer.startsAt ? new Date(offer.startsAt).getTime() : Number.NEGATIVE_INFINITY;
  const endsAt = offer.endsAt ? new Date(offer.endsAt).getTime() : Number.POSITIVE_INFINITY;
  return now.getTime() >= startsAt && now.getTime() < endsAt;
}

export function getActiveOfferProductIds(productIds: readonly string[], offers: Record<string, ProductOffer> | undefined, now = new Date()): Set<string> {
  return new Set(productIds.filter((productId) => {
    const offer = offers?.[productId];
    return Boolean(offer && isOfferCurrentlyActive(offer, now));
  }));
}

export function calculateOffer(baseUnitPrice: number, modifierAddOnsPerUnit: number, quantity: number, offer: ProductOffer): OfferCalculation {
  const base = Math.max(0, Number(baseUnitPrice));
  const addOns = Math.max(0, Number(modifierAddOnsPerUnit));
  const qty = Math.max(1, Math.floor(quantity));
  let discountedBase = base;
  if (offer.offerType === "percentage") discountedBase = base * (1 - Math.min(100, Math.max(0, Number(offer.value ?? 0))) / 100);
  else if (offer.offerType === "fixed") discountedBase = Math.max(0, base - Math.min(base, Number(offer.value ?? 0)));
  else if (offer.offerType === "sale_price") discountedBase = Math.min(base, Math.max(0, Number(offer.value ?? 0)));
  const originalBase = base * qty;
  const regularDiscount = Math.max(0, originalBase - discountedBase * qty);
  const bogoDiscount = offer.offerType === "bogo" ? base * Math.floor(qty / 2) : 0;
  const discountAmount = regularDiscount + bogoDiscount;
  const lineTotal = Math.max(0, originalBase - discountAmount + addOns * qty);
  return { discountedBaseUnitPrice: lineTotal / qty - addOns, discountAmount, lineTotal };
}

export function riyadhLocalToIso(value: string): string {
  const normalized = value.length === 16 ? value + ":00" : value;
  return new Date(normalized + "+03:00").toISOString();
}

export function isoToRiyadhLocal(value: string | null): string {
  if (!value) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: OFFER_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(new Date(value));
  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}T${part("hour")}:${part("minute")}`;
}
