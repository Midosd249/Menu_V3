import assert from "node:assert/strict";
import test from "node:test";
import { buildIntelligenceDataQuality } from "./intelligence-data-quality.ts";
import type { OwnerAnalytics } from "./types";

const analytics: OwnerAnalytics = {
  rangeDays: 7,
  visits: 10,
  uniqueSessions: 8,
  productViews: 12,
  qrScans: 2,
  whatsappClicks: 1,
  langAr: 7,
  langEn: 1,
  series: [
    { day: "2026-09-09", visits: 1, views: 2 },
    { day: "2026-09-10", visits: 2, views: 3 },
    { day: "2026-09-10", visits: 1, views: 1 },
    { day: "2026-09-11", visits: 7, views: 6 },
  ],
  topProducts: [],
  byCategory: [],
  byBranch: [],
};

test("marks evidence fresh within the explicit threshold", () => {
  const result = buildIntelligenceDataQuality(analytics, new Date("2026-09-12T12:00:00Z"));
  assert.equal(result.status, "fresh");
  assert.equal(result.latestObservedDay, "2026-09-11");
  assert.equal(result.observedDays, 3);
});

test("marks evidence stale only after the explicit threshold", () => {
  const result = buildIntelligenceDataQuality(analytics, new Date("2026-09-16T12:00:00Z"));
  assert.equal(result.status, "stale");
});

test("returns insufficient instead of inventing freshness without analytics", () => {
  const result = buildIntelligenceDataQuality(null, new Date("2026-09-12T12:00:00Z"));
  assert.equal(result.status, "insufficient");
  assert.equal(result.observedDays, 0);
  assert.equal(result.latestObservedDay, null);
});

test("ignores invalid observation dates", () => {
  const result = buildIntelligenceDataQuality({ ...analytics, series: [{ day: "not-a-date", visits: 9, views: 9 }] }, new Date("2026-09-12T12:00:00Z"));
  assert.equal(result.status, "insufficient");
  assert.equal(result.observedDays, 0);
});
