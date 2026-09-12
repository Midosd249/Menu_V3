import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const page = fs.readFileSync("src/routes/studio/intelligence-actions.tsx", "utf8");

test("R4 action center stays grounded in the existing advisor contract", () => {
  assert.match(page, /buildMenuGrowthAdvisor/);
  assert.match(page, /action\.evidence|action\.reason/);
  assert.match(page, /action\.metric/);
  assert.match(page, /action\.href/);
});

test("R4 action center preserves owner-controlled execution", () => {
  assert.match(page, /لا يتم تنفيذ أي تغيير تلقائيًا|Nothing is changed automatically/);
  assert.doesNotMatch(page, /supabase|\.insert\(|\.update\(|\.delete\(/i);
});

test("R4 action center keeps bilingual and mobile-first structure", () => {
  assert.match(page, /isAr/);
  assert.match(page, /md:grid-cols/);
  assert.match(page, /text-paper/);
});
