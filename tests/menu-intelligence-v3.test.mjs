import fs from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const advisor = fs.readFileSync("src/lib/menu/growth-advisor.ts", "utf8");
const intelligence = fs.readFileSync("src/lib/menu/intelligence.ts", "utf8");
const page = fs.readFileSync("src/routes/studio/intelligence.tsx", "utf8");

test("V3 growth advisor is deterministic and bounded", () => {
  assert.match(advisor, /buildMenuGrowthAdvisor/);
  assert.match(advisor, /slice\(0, 6\)/);
  assert.match(advisor, /OwnerAnalytics/);
  assert.doesNotMatch(advisor, /revenue|guaranteed|sales increased|statistical significance/i);
});

test("V3 advisor reuses existing Studio surfaces", () => {
  assert.match(advisor, /\/studio\/menu/);
  assert.match(advisor, /\/studio\/brand/);
  assert.match(advisor, /\/studio\/branches/);
});

test("V3 keeps Menu Intelligence data-bounded", () => {
  assert.match(intelligence, /OwnerAnalytics/);
  assert.doesNotMatch(intelligence, /revenue|guaranteed|sales increased|conversion rate/i);
});

test("V3 surfaces the advisor from the existing intelligence journey", () => {
  assert.match(page, /buildMenuGrowthAdvisor/);
  assert.match(page, /الأولوية التالية|Next priority/);
  assert.match(page, /\/studio\/menu/);
});
