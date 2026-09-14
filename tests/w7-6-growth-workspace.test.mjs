import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const route = fs.readFileSync("src/routes/studio/growth.tsx", "utf8");
const workspace = fs.readFileSync("src/components/studio-growth-workspace.tsx", "utf8");
const shell = fs.readFileSync("src/components/studio-shell.tsx", "utf8");

for (const path of ["/studio/growth", "/studio/intelligence", "/studio/intelligence-actions", "/studio/analytics", "/studio/reports"]) {
  test(`Growth Workspace keeps verified destination ${path}`, () => {
    assert.match(workspace, new RegExp(path.replaceAll("/", "\\/")));
  });
}

test("Growth route remains the existing URL and delegates to one workspace", () => {
  assert.match(route, /createFileRoute\("\/studio\/growth"\)/);
  assert.match(route, /StudioGrowthWorkspace/);
  assert.doesNotMatch(route, /createFileRoute\("\/studio\/growth\/[^"]+"\)/);
});

test("Growth Workspace reuses existing evidence and business logic", () => {
  assert.match(workspace, /useStudio\(\)/);
  assert.match(workspace, /getOwnerAnalytics/);
  assert.match(workspace, /buildMenuGrowthEngine/);
  assert.match(workspace, /buildMenuGrowthAdvisor/);
  assert.match(workspace, /buildMenuIntelligence/);
  assert.match(workspace, /buildIntelligenceDataQuality/);
  assert.match(workspace, /Observe|راقب/);
  assert.match(workspace, /Understand|افهم/);
  assert.match(workspace, /Act|نفّذ/);
  assert.match(workspace, /Measure|قِس/);
});

test("Growth Workspace is evidence-honest", () => {
  for (const pattern of [/fakeRevenue/i, /fakeConversion/i, /fakeImpact/i, /sampleProduction/i, /inventedTrend/i]) {
    assert.doesNotMatch(workspace, pattern);
  }
  assert.match(workspace, /not orders or sales|وليست طلبات أو مبيعات/);
  assert.match(workspace, /do not infer revenue|لا تستنتج الإيرادات/);
  assert.match(workspace, /outcome not decided yet|النتيجة غير محسومة بعد/);
  assert.match(workspace, /design-ready only|جاهزة للتصميم فقط/);
});

test("Growth Workspace exposes reports only contextually and does not invent an experiments route", () => {
  assert.match(workspace, /\/studio\/reports/);
  assert.doesNotMatch(workspace, /\/studio\/experiments/);
  assert.doesNotMatch(shell, /to:\s*["']\/studio\/reports["']/);
});

test("Growth Workspace has honest state and accessibility structure", () => {
  assert.match(workspace, /LoadingState/);
  assert.match(workspace, /ErrorState/);
  assert.match(workspace, /EmptyState/);
  assert.match(workspace, /aria-label/);
  assert.match(workspace, /aria-labelledby/);
  assert.match(workspace, /aria-current/);
  assert.match(workspace, /focus-visible:ring/);
});
