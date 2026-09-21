import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const admin = await readFile(new URL("../src/routes/admin.tsx", import.meta.url), "utf8");
const platform = await readFile(new URL("../src/lib/menu/platform.ts", import.meta.url), "utf8");
const auth = await readFile(new URL("../src/lib/auth/platform-admin.server.ts", import.meta.url), "utf8");

test("Admin keeps the active route and capability set", () => {
  assert.match(admin, /createFileRoute\("\/admin"\)/);
  for (const id of ["overview", "tenants", "orders", "clients", "branches", "projects", "subscriptions", "analytics", "activity", "system"]) assert.match(admin, new RegExp(`\\"${id}\\"`));
  for (const retired of ["leads", "requests", "service-requests"]) assert.doesNotMatch(admin, new RegExp(`\\"${retired}\\"`));
});

test("Admin navigation is grouped around active capabilities", () => {
  for (const label of ["نظرة عامة", "العملاء", "التجارة والتشغيل", "الذكاء التشغيلي", "النظام"]) assert.match(admin, new RegExp(label));
  assert.doesNotMatch(admin, /المبيعات/);
  assert.match(admin, /aria-current=\{tab === item\.id \? "page"/);
});

test("Admin preserves server-side authorization and current operations", () => {
  for (const operation of ["getPlatformDashboard", "getPlatformOrders", "updatePlatformOrderStatus", "archivePlatformOrder", "updatePlatformTenantStatus"]) assert.match(admin, new RegExp(operation));
  for (const retired of ["getAdminDashboard", "updateLead", "approveLead"]) assert.doesNotMatch(admin, new RegExp(retired));
  assert.match(platform, /assertPlatformAdmin\(context\.userId\)/);
  assert.match(platform, /requirePlatformAdmin\(userId\)/);
  assert.match(auth, /requirePlatformAdmin/);
});

test("Admin contains no fabricated destinations or platform claims", () => {
  assert.doesNotMatch(admin, /href="\/admin\/(security|health|configuration)"/);
  assert.doesNotMatch(admin, /fake|sample data|demo data/i);
  assert.doesNotMatch(admin, /health score|security events|revenue trend|predicted/i);
});

test("Admin reuses internal design-system presentation primitives", () => {
  for (const primitive of ["PageHeader", "SectionHeader", "MetricRow", "LoadingState", "ErrorState"]) assert.match(admin, new RegExp(primitive));
});
