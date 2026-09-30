import assert from "node:assert/strict";
import test from "node:test";
import { buildGuestAssistantCatalog } from "../src/lib/menu/guest-assistant-catalog.ts";
import type { ProductOffer } from "../src/lib/menu/types.ts";

const products = [
  { id: "p-active", nameAr: "برجر العرض", nameEn: "Offer Burger", descriptionAr: "", descriptionEn: "", price: 100, currency: "SAR", allergens: "", dietaryLabels: [], categoryAr: "برجر", categoryEn: "Burgers", isAvailable: true },
  { id: "p-expired", nameAr: "برجر منتهي", nameEn: "Expired Burger", descriptionAr: "", descriptionEn: "", price: 80, currency: "SAR", allergens: "", dietaryLabels: [], categoryAr: "برجر", categoryEn: "Burgers", isAvailable: true },
  { id: "p-inactive", nameAr: "برجر غير نشط", nameEn: "Inactive Burger", descriptionAr: "", descriptionEn: "", price: 70, currency: "SAR", allergens: "", dietaryLabels: [], categoryAr: "برجر", categoryEn: "Burgers", isAvailable: true },
];

test("guest assistant catalog includes active offers and excludes expired/inactive offers", () => {
  const now = new Date("2026-09-30T05:00:00+03:00");
  const offers: Record<string, ProductOffer> = {
    "p-active": { id: "oa", tenantId: "t", productId: "p-active", offerType: "percentage", value: 20, labelAr: "خصم 20٪", labelEn: "20% off", startsAt: null, endsAt: null, isActive: true },
    "p-expired": { id: "oe", tenantId: "t", productId: "p-expired", offerType: "sale_price", value: 40, labelAr: "منتهي", labelEn: "Expired", startsAt: null, endsAt: "2026-09-30T00:00:00Z", isActive: true },
    "p-inactive": { id: "oi", tenantId: "t", productId: "p-inactive", offerType: "fixed", value: 10, labelAr: "غير نشط", labelEn: "Inactive", startsAt: null, endsAt: null, isActive: false },
  };
  const catalog = buildGuestAssistantCatalog(products, offers, now);
  assert.match(catalog, /ID=p-active[\s\S]*OFFER_ACTIVE=yes[\s\S]*OFFER_DISCOUNTED_PRICE=80 SAR[\s\S]*OFFER_LABEL_AR=خصم 20٪/);
  assert.match(catalog, /ID=p-expired[\s\S]*OFFER_ACTIVE=no/);
  assert.match(catalog, /ID=p-inactive[\s\S]*OFFER_ACTIVE=no/);
  assert.doesNotMatch(catalog, /OFFER_LABEL_EN=Expired|OFFER_LABEL_EN=Inactive/);
});

test("guest assistant offers chip uses the shared active-offer logic and provider routing remains unchanged", async () => {
  const source = await import("node:fs/promises").then(({ readFile }) => readFile("src/components/guest-menu-assistant.tsx", "utf8"));
  const assistant = await import("node:fs/promises").then(({ readFile }) => readFile("src/lib/menu/guest-assistant.ts", "utf8"));
  assert.match(source, /getActiveOfferProductIds/);
  assert.match(source, /ما هي العروض المتوفرة؟/);
  assert.match(source, /What offers are available\?/);
  assert.match(source, /hasActiveOffers/);
  assert.match(assistant, /operation: "guest\.menu_assistant"/);
  assert.doesNotMatch(assistant, /provider registry|provider list|AI_PROVIDER/);
});
