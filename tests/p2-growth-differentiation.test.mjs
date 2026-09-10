import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const analytics = fs.readFileSync("src/routes/studio/analytics.tsx", "utf8");

test("P2 analytics surface keeps the canonical owner analytics source", () => {
  assert.match(analytics, /getOwnerAnalytics/);
  assert.match(analytics, /buildGrowthMetrics/);
  assert.match(analytics, /getMyStudio/);
});

test("P2 local visibility uses only verified tenant and branch fields", () => {
  assert.match(analytics, /tenant\.city/);
  assert.match(analytics, /branch\?\.addressAr/);
  assert.match(analytics, /branch\?\.phone/);
  assert.match(analytics, /branch\?\.mapsUrl/);
  assert.match(analytics, /tenant\.instagramUrl/);
  assert.match(analytics, /tenant\.whatsapp/);
  assert.match(analytics, /does not claim Google ranking|لا تدّعي ترتيب Google/);
});

test("P2 local visibility remains visible when analytics has no events", () => {
  assert.match(analytics, /!hasData \? \(\s*<\>\s*<p className=.*noDataYet/);
  assert.match(analytics, /<VisibilityReadiness studio=\{studio\} analytics=\{analytics\} lang=\{lang\} \/>/);
});

test("P2 experimentation surface is hypothesis-led and does not claim measured significance", () => {
  assert.match(analytics, /Experimentation/);
  assert.match(analytics, /Hypothesis/);
  assert.match(analytics, /Decision rule/);
  assert.match(analytics, /does not invent results or statistical significance/);
});

test("P2 does not introduce a second analytics event source", () => {
  assert.doesNotMatch(analytics, /insert into menu_events/);
  assert.doesNotMatch(analytics, /record_public_menu_event/);
});
