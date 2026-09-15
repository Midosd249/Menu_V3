import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const route = fs.readFileSync("src/routes/studio/guests.tsx", "utf8");
const workspace = fs.readFileSync("src/components/studio-customers-workspace.tsx", "utf8");
const domain = fs.readFileSync("src/lib/menu/guest-relationships.ts", "utf8");
const shell = fs.readFileSync("src/components/studio-shell.tsx", "utf8");
const routeTree = fs.readFileSync("src/routeTree.gen.ts", "utf8");

test("Customers route remains the existing URL and generated route", () => {
  assert.match(route, /createFileRoute\("\/studio\/guests"\)/);
  assert.match(route, /StudioCustomersWorkspace/);
  assert.doesNotMatch(route, /createFileRoute\("\/studio\/guests\/[^"]+"\)/);
  assert.match(routeTree, /\/studio\/guests/);
});

test("Customers Workspace reuses the existing guest relationship source", () => {
  assert.match(workspace, /useStudio\(\)/);
  assert.match(workspace, /getGuestRelationshipOverview/);
  assert.match(workspace, /GuestRelationshipOverview/);
  assert.match(domain, /authMiddleware/);
  assert.match(domain, /getMembership/);
  assert.match(domain, /canAccessBranch/);
  assert.match(domain, /owner.*admin/);
});

test("Customers Workspace represents only real supported relationship capabilities", () => {
  for (const label of [/Loyalty/, /Campaigns/, /Feedback/, /Retention/]) assert.match(workspace, label);
  assert.doesNotMatch(workspace, /\/studio\/loyalty/);
  assert.doesNotMatch(workspace, /\/studio\/campaigns/);
  assert.doesNotMatch(workspace, /\/studio\/feedback/);
  assert.doesNotMatch(workspace, /\/studio\/retention/);
  assert.doesNotMatch(shell, /to:\s*["']\/studio\/(loyalty|campaigns|feedback|retention)["']/);
});

test("Customers Workspace is data-honest and does not fabricate CRM metrics", () => {
  for (const pattern of [/fakeCustomer/i, /sampleCustomer/i, /fakeSpend/i, /fakeOrder/i, /fakeLoyalty/i, /fakeCampaign/i, /fakeFeedback/i, /fakeRetention/i, /fakeSegment/i, /fakeCohort/i, /fakeClv/i, /fakeRecommendation/i]) {
    assert.doesNotMatch(workspace, pattern);
  }
  assert.match(workspace, /لا يعني ذلك عدم وجود عملاء|does not mean the restaurant has no customers/);
  assert.match(workspace, /لا توجد شرائح|No segments/);
  assert.match(workspace, /No segments, cohorts, customer lifetime value, or churn score/);
});

test("Customers Workspace has honest state and accessibility structure", () => {
  for (const pattern of [/LoadingState/, /EmptyState/, /ErrorState/, /PermissionDeniedState/, /aria-label/, /aria-labelledby/, /focus-visible:ring/]) {
    assert.match(workspace, pattern);
  }
  assert.match(workspace, /status === "forbidden"/);
  assert.match(workspace, /status === "loading"/);
});

test("Customers Workspace keeps unsupported detail and list flows explicitly unavailable", () => {
  assert.match(workspace, /غير معروضة كقائمة\/تفاصيل مستقلة|not exposed as a standalone list\/detail flow/);
  assert.match(workspace, /No segments, cohorts, customer lifetime value, or churn score/);
  assert.match(workspace, /outbound delivery is not automated|لا يوجد إرسال تلقائي/);
});
