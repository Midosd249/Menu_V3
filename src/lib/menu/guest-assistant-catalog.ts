import { calculateOffer, getActiveOfferProductIds } from "./offers";
import type { ProductOffer } from "./types";

export type GuestCatalogProduct = {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  currency: string;
  allergens: string;
  dietaryLabels: string[];
  categoryAr: string;
  categoryEn: string;
  isAvailable: boolean;
};

function clean(value: unknown, max: number) {
  return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}

export function buildGuestAssistantCatalog(products: GuestCatalogProduct[], offers: Record<string, ProductOffer> = {}, now = new Date()) {
  const activeOfferProductIds = getActiveOfferProductIds(products.map((product) => product.id), offers, now);
  return products.map((p, index) => {
    const offer = activeOfferProductIds.has(p.id) ? offers[p.id] : undefined;
    const pricing = offer ? calculateOffer(p.price, 0, offer.offerType === "bogo" ? 2 : 1, offer) : null;
    const offerLabelAr = offer?.offerType === "bogo" && !offer.labelAr ? "اشترِ 1 واحصل على 1 مجاناً" : offer?.labelAr || "عرض";
    const offerLabelEn = offer?.offerType === "bogo" && !offer.labelEn ? "Buy 1 Get 1 Free" : offer?.labelEn || "Offer";
    return [
      `#${index + 1}`,
      `ID=${clean(p.id, 80)}`,
      `AR=${clean(p.nameAr, 120)}`,
      `EN=${clean(p.nameEn, 120)}`,
      `CAT_AR=${clean(p.categoryAr, 80)}`,
      `CAT_EN=${clean(p.categoryEn, 80)}`,
      `DESC_AR=${clean(p.descriptionAr, 240)}`,
      `DESC_EN=${clean(p.descriptionEn, 240)}`,
      `PRICE=${p.price} ${clean(p.currency, 12)}`,
      `ALLERGENS=${clean(p.allergens, 180) || "غير مذكورة"}`,
      `DIETARY=${clean(p.dietaryLabels.join(", "), 120) || "غير مذكورة"}`,
      ...(offer && pricing ? [
        "OFFER_ACTIVE=yes",
        `OFFER_TYPE=${offer.offerType}`,
        `OFFER_LABEL_AR=${clean(offerLabelAr, 160)}`,
        `OFFER_LABEL_EN=${clean(offerLabelEn, 160)}`,
        `OFFER_ORIGINAL_PRICE=${p.price} ${clean(p.currency, 12)}`,
        `OFFER_DISCOUNTED_PRICE=${pricing.discountedBaseUnitPrice} ${clean(p.currency, 12)}`,
        `OFFER_DESCRIPTION_AR=${clean(offer.offerType === "bogo" ? "اشترِ 1 واحصل على 1 مجاناً" : offerLabelAr, 180)}`,
        `OFFER_DESCRIPTION_EN=${clean(offer.offerType === "bogo" ? "Buy 1 Get 1 Free" : offerLabelEn, 180)}`,
      ] : ["OFFER_ACTIVE=no"]),
    ].join(" | ");
  }).join("\n");
}
