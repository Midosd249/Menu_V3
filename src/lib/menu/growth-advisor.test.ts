import assert from "node:assert/strict";
import test from "node:test";
import { buildMenuGrowthAdvisor } from "./growth-advisor.ts";
import type { OwnerAnalytics, StudioSnapshot } from "./types";

const snapshot: StudioSnapshot = {
  tenant: {
    id: "t1", ownerUserId: "u1", slug: "demo", nameAr: "مطعم", nameEn: "Restaurant",
    taglineAr: "", taglineEn: "", logoUrl: "", coverUrl: "", instagramUrl: "", whatsapp: "966500000000",
    whatsappTemplate: "", primaryColor: "", accentColor: "", themeKey: "essential", currency: "SAR", city: "Riyadh",
    country: "SA", isPublished: true, isActive: true, createdAt: "", updatedAt: "",
  },
  role: "owner",
  branches: [{ id: "b1", tenantId: "t1", slug: "main", nameAr: "الفرع الرئيسي", nameEn: "Main", addressAr: "", addressEn: "", mapsUrl: "", phone: "", isActive: true }],
  categories: [{ id: "c1", tenantId: "t1", sortOrder: 1, nameAr: "رئيسية", nameEn: "Mains", isActive: true }],
  products: [{ id: "p1", tenantId: "t1", categoryId: "c1", sortOrder: 1, nameAr: "طبق", nameEn: "Dish", descriptionAr: "وصف", descriptionEn: "Description", price: 20, currency: "SAR", imageUrl: "image.jpg", calories: null, isAvailable: true, isFeatured: false, allergens: "", tags: [], dietaryLabels: [] }],
  members: [{ userId: "u1", role: "owner" }],
  health: { score: 100, dimensions: [], checks: [], attention: [] },
};

const analytics: OwnerAnalytics = {
  rangeDays: 7, visits: 100, uniqueSessions: 80, productViews: 40, qrScans: 50, whatsappClicks: 12,
  langAr: 70, langEn: 30, series: [],
  topProducts: [{ id: "p1", nameAr: "طبق", nameEn: "Dish", count: 20 }],
  byCategory: [{ id: "c1", nameAr: "رئيسية", nameEn: "Mains", count: 25 }],
  byBranch: [],
};

test("verified analytics insights are derived from canonical OwnerAnalytics", () => {
  const result = buildMenuGrowthAdvisor(snapshot, analytics);
  assert.ok(result.insights.length > 0);
  assert.ok(result.insights.some((item) => item.key === "browse-depth"));
  assert.ok(result.insights.some((item) => item.key === "whatsapp-intent"));
  assert.ok(result.insights.every((item) => item.evidenceAr.length > 0 && item.evidenceEn.length > 0));
});

test("analytics intelligence does not fabricate business outcomes", () => {
  const result = buildMenuGrowthAdvisor(snapshot, analytics);
  const text = JSON.stringify(result).toLowerCase();
  assert.doesNotMatch(text, /revenue|profitability|sales increased|customer satisfaction|statistical significance/);
  assert.doesNotMatch(text, /الإيرادات|الربحية|رضا العملاء|دلالة إحصائية/);
});

test("zero-data analytics produces a baseline insight instead of a fake trend", () => {
  const empty = buildMenuGrowthAdvisor(snapshot, { ...analytics, visits: 0, uniqueSessions: 0, productViews: 0, qrScans: 0, whatsappClicks: 0, topProducts: [], byCategory: [] });
  assert.equal(empty.insights[0]?.key, "analytics-baseline");
  assert.match(empty.insights[0]?.recommendationAr ?? "", /شارك القائمة/);
});
