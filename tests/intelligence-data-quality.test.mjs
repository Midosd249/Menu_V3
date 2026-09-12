import assert from "node:assert/strict";
import test from "node:test";

const DAY = 86_400_000;

function buildQuality(analytics, now, staleAfterDays = 3) {
  if (!analytics || analytics.rangeDays <= 0) return { status: "insufficient", observedDays: 0, latestObservedDay: null };
  const validDays = analytics.series.map((point) => point.day).filter((day) => !Number.isNaN(Date.parse(day))).sort();
  const latestObservedDay = validDays.at(-1) ?? null;
  if (!latestObservedDay) return { status: "insufficient", observedDays: 0, latestObservedDay: null };
  const latest = new Date(`${latestObservedDay}T23:59:59.999Z`);
  const ageDays = Math.max(0, (now.getTime() - latest.getTime()) / DAY);
  return { status: ageDays > staleAfterDays ? "stale" : "fresh", observedDays: new Set(validDays).size, latestObservedDay };
}

const analytics = {
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

test("freshness is fresh when latest evidence is within threshold", () => {
  const result = buildQuality(analytics, new Date("2026-09-12T12:00:00Z"));
  assert.equal(result.status, "fresh");
  assert.equal(result.latestObservedDay, "2026-09-11");
  assert.equal(result.observedDays, 3);
});

test("freshness becomes stale only after the explicit threshold", () => {
  const result = buildQuality(analytics, new Date("2026-09-16T12:00:00Z"));
  assert.equal(result.status, "stale");
});

test("missing analytics does not become an invented freshness score", () => {
  const result = buildQuality(null, new Date("2026-09-12T12:00:00Z"));
  assert.deepEqual(result, { status: "insufficient", observedDays: 0, latestObservedDay: null });
});

test("invalid days are ignored instead of becoming observed evidence", () => {
  const result = buildQuality({ ...analytics, series: [{ day: "not-a-date", visits: 9, views: 9 }] }, new Date("2026-09-12T12:00:00Z"));
  assert.deepEqual(result, { status: "insufficient", observedDays: 0, latestObservedDay: null });
});
