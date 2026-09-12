import assert from "node:assert/strict";
import test from "node:test";
import { buildMenuReport, reportToText } from "./reports.ts";
import type { OwnerAnalytics, StudioSnapshot } from "./types";

const snapshot: StudioSnapshot = {
  tenant: {
    id: "t1", ownerUserId: "u1", slug: "demo", nameAr: "مطعم التجربة", nameEn: "Demo Restaurant",
    taglineAr: "", taglineEn: "", logoUrl: "", coverUrl: "", instagramUrl: "", whatsapp: "966500000000", whatsappTemplate: "",
    primaryColor: "", accentColor: "", themeKey: "essential", currency: "SAR", city: "Riyadh", country: "SA",
    isPublished: true, isActive: true, createdAt: "", updatedAt: "",
  },
  role: "owner",
  branches: [{ id: "b1", tenantId: "t1", slug: "main", nameAr: "الفرع الرئيسي", nameEn: "Main", addressAr: "", addressEn: "", mapsUrl: "", phone: "", isActive: true }],
  categories: [{ id: "c1", tenantId: "t1", sortOrder: 1, nameAr: "الرئيسية", nameEn: "Mains", isActive: true }],
  products: [{ id: "p1", tenantId: "t1", categoryId: "c1", sortOrder: 1, nameAr: "طبق", nameEn: "Dish", descriptionAr: "وصف عربي", descriptionEn: "English description", price: 30, currency: "SAR", imageUrl: "image.jpg", calories: null, isAvailable: true, isFeatured: true, allergens: "", tags: [], dietaryLabels: [] }],
  members: [{ userId: "u1", role: "owner" }],
  health: { score: 100, dimensions: [], checks: [], attention: [] },
};

const analytics: OwnerAnalytics = {
  rangeDays: 30, visits: 120, uniqueSessions: 90, productViews: 75, qrScans: 50, whatsappClicks: 8,
  langAr: 80, langEn: 40, series: [{ day: "2026-09-01", visits: 10, views: 5 }],
  topProducts: [{ id: "p1", nameAr: "طبق", nameEn: "Dish", count: 25 }],
  byCategory: [{ id: "c1", nameAr: "الرئيسية", nameEn: "Mains", count: 40 }],
  byBranch: [],
};

test("professional report is grounded in canonical analytics and menu health", () => {
  const report = buildMenuReport(snapshot, analytics, "2026-09-12T00:00:00.000Z");
  assert.equal(report.rangeDays, 30);
  assert.equal(report.health.score, 100);
  assert.equal(report.totalProducts, 1);
  assert.equal(report.availableProducts, 1);
  assert.equal(report.missingImages, 0);
  assert.equal(report.missingEnglish, 0);
  assert.equal(report.missingDescriptions, 0);
  assert.equal(report.unavailableProducts, 0);
  assert.equal(report.readiness, 100);
  assert.equal(report.generatedAt, "2026-09-12T00:00:00.000Z");
});

test("report text has stable bilingual structure and no fabricated business claims", () => {
  const report = buildMenuReport(snapshot, analytics);
  const ar = reportToText(report, "ar");
  const en = reportToText(report, "en");
  assert.match(ar, /تقرير Menu V3/);
  assert.match(ar, /الزيارات: 120/);
  assert.match(ar, /مشاهدات المنتجات: 75/);
  assert.match(en, /Menu V3 Report/);
  assert.match(en, /Visits: 120/);
  assert.match(en, /Product views: 75/);
  assert.doesNotMatch(`${ar}\n${en}`.toLowerCase(), /revenue|profitability|sales increased|customer satisfaction|statistical significance/);
  assert.doesNotMatch(`${ar}\n${en}`, /الإيرادات|الربحية|رضا العملاء|دلالة إحصائية/);
});

test("zero-product reports remain readable instead of producing invalid readiness", () => {
  const empty = { ...snapshot, products: [] };
  const report = buildMenuReport(empty, { ...analytics, topProducts: [] });
  assert.equal(report.totalProducts, 0);
  assert.equal(report.readiness, 100);
  assert.ok(reportToText(report, "ar").length > 100);
});
