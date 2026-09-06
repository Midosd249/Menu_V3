import assert from "node:assert/strict";
import test from "node:test";
import { buildGrowthMetrics, GROWTH_EVENT_CONTRACT } from "./growth.ts";
import type { OwnerAnalytics } from "./types";

const base: OwnerAnalytics = {
  rangeDays: 7,
  visits: 100,
  uniqueSessions: 80,
  productViews: 40,
  qrScans: 50,
  whatsappClicks: 12,
  langAr: 70,
  langEn: 30,
  series: [],
  topProducts: [{ id: "p1", nameAr: "طبق", nameEn: "Dish", count: 20 }],
  byCategory: [{ id: "c1", nameAr: "رئيسية", nameEn: "Mains", count: 25 }],
  byBranch: [],
};

test("growth metrics use server-reported denominators", () => {
  const metrics = buildGrowthMetrics(base);
  assert.equal(metrics.productInterestRate.percent, 40);
  assert.equal(metrics.engagementRate.percent, 50);
  assert.equal(metrics.whatsappRate.percent, 15);
  assert.equal(metrics.qrToVisitRate.percent, 100);
  assert.equal(metrics.averageViewsPerSession, 0.5);
  assert.equal(metrics.primaryOpportunity, "distribution");
});

test("growth metrics fail safely when there is no baseline", () => {
  const metrics = buildGrowthMetrics({ ...base, visits: 0, uniqueSessions: 0, productViews: 0, qrScans: 0, whatsappClicks: 0, topProducts: [], byCategory: [] });
  assert.equal(metrics.productInterestRate.percent, 0);
  assert.equal(metrics.engagementRate.percent, 0);
  assert.equal(metrics.whatsappRate.percent, 0);
  assert.equal(metrics.qrToVisitRate.percent, 0);
  assert.equal(metrics.averageViewsPerSession, 0);
  assert.equal(metrics.primaryOpportunity, "baseline");
});

test("growth event contract contains only the implemented public events", () => {
  assert.deepEqual(GROWTH_EVENT_CONTRACT.map((event) => event.event), ["visit", "qr_scan", "product_view", "whatsapp"]);
});
