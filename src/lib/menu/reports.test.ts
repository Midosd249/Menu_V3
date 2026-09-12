import assert from "node:assert/strict";
import test from "node:test";
import { buildMenuReport, reportToText } from "./reports.ts";
import type { OwnerAnalytics, StudioSnapshot } from "./types";

const snapshot = {
  tenant: {
    id: "t1", ownerUserId: "u1", slug: "demo", nameAr: "Restaurant", nameEn: "Restaurant",
    taglineAr: "", taglineEn: "", logoUrl: "", coverUrl: "", instagramUrl: "", whatsapp: "966500000000",
    whatsappTemplate: "", primaryColor: "", accentColor: "", themeKey: "essential", currency: "SAR", city: "Riyadh",
    country: "SA", isPublished: true, isActive: true, createdAt: "", updatedAt: "",
  },
  role: "owner",
  branches: [{ id: "b1", tenantId: "t1", slug: "main", nameAr: "Main", nameEn: "Main", addressAr: "", addressEn: "", mapsUrl: "", phone: "", isActive: true }],
  categories: [{ id: "c1", tenantId: "t1", sortOrder: 1, nameAr: "Mains", nameEn: "Mains", isActive: true }],
  products: [{ id: "p1", tenantId: "t1", categoryId: "c1", sortOrder: 1, nameAr: "Dish", nameEn: "Dish", descriptionAr: "Description", descriptionEn: "Description", price: 20, currency: "SAR", imageUrl: "image.jpg", calories: null, isAvailable: true, isFeatured: false, allergens: "", tags: [], dietaryLabels: [] }],
  members: [{ userId: "u1", role: "owner" }],
  health: { score: 100, dimensions: [], checks: [], attention: [] },
} as StudioSnapshot;

const analytics: OwnerAnalytics = {
  rangeDays: 7, visits: 100, uniqueSessions: 80, productViews: 40, qrScans: 50, whatsappClicks: 12,
  langAr: 70, langEn: 30, series: [],
  topProducts: [{ id: "p1", nameAr: "Dish", nameEn: "Dish", count: 20 }],
  byCategory: [{ id: "c1", nameAr: "Mains", nameEn: "Mains", count: 25 }],
  byBranch: [],
};

test("professional report preserves verified source metrics", () => {
  const report = buildMenuReport(snapshot, analytics, "2026-09-12T10:00:00.000Z");
  assert.equal(report.analytics.visits, 100);
  assert.equal(report.analytics.uniqueSessions, 80);
  assert.equal(report.analytics.productViews, 40);
  assert.equal(report.analytics.qrScans, 50);
  assert.equal(report.analytics.whatsappClicks, 12);
  assert.equal(report.availableProducts, 1);
  assert.equal(report.totalProducts, 1);
  assert.equal(report.readiness, 100);
});

test("report text contains the complete report structure in both languages", () => {
  const report = buildMenuReport(snapshot, analytics, "2026-09-12T10:00:00.000Z");
  const ar = reportToText(report, "ar");
  const en = reportToText(report, "en");
  assert.match(ar, /ملخص تنفيذي/);
  assert.match(ar, /مؤشرات مسجلة/);
  assert.match(ar, /إشارات من البيانات/);
  assert.match(ar, /التوصيات العملية/);
  assert.match(en, /Executive summary/);
  assert.match(en, /Recorded metrics/);
  assert.match(en, /Data signals/);
  assert.match(en, /Actionable recommendations/);
});

test("report does not invent unsupported commercial outcomes", () => {
  const report = buildMenuReport(snapshot, analytics);
  const text = `${reportToText(report, "ar")} ${reportToText(report, "en")}`.toLowerCase();
  assert.doesNotMatch(text, /revenue|profitability|customer satisfaction|sales increased|statistical significance/);
  assert.doesNotMatch(text, /الإيرادات|الربحية|رضا العملاء|زادت المبيعات|دلالة إحصائية/);
});
