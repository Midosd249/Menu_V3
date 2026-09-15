import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const admin = await readFile(new URL("../src/routes/admin.tsx", import.meta.url), "utf8");
const platform = await readFile(new URL("../src/lib/menu/platform.ts", import.meta.url), "utf8");
const auth = await readFile(new URL("../src/lib/auth/platform-admin.server.ts", import.meta.url), "utf8");

test("W7.8 Admin keeps the existing route and all current tab capabilities", () => {
  assert.match(admin, /createFileRoute\("\/admin"\)/);
  for (const id of ["overview", "tenants", "orders", "clients", "branches", "leads", "projects", "requests", "subscriptions", "analytics", "activity", "system"]) {
    assert.match(admin, new RegExp(`\\"${id}\\"`));
  }
});

test("W7.8 Admin navigation is grouped around real capabilities only", () => {
  for (const label of ["نظرة عامة", "العملاء", "التجارة والتشغيل", "المبيعات", "الذكاء التشغيلي", "النظام"]) assert.match(admin, new RegExp(label));
  assert.match(admin, /aria-current=\{tab === item\.id \? "page"/);
  assert.match(admin, /W7\.9 يحوّل هذه المساحات إلى روابط URL حقيقية/);
  for (const unsupported of ["Security مستقلة", "Platform Health مستقلة", "Configuration مستقلة"]) assert.match(admin, new RegExp(unsupported));
});

test("W7.8 preserves existing Admin operations and authorization boundaries", () => {
  for (const operation of ["getPlatformDashboard", "getPlatformOrders", "updatePlatformOrderStatus", "archivePlatformOrder", "updatePlatformTenantStatus", "getAdminDashboard", "updateLead", "approveLead"]) assert.match(admin, new RegExp(operation));
  assert.match(platform, /assertPlatformAdmin\(context\.userId\)/);
  assert.match(platform, /requirePlatformAdmin\(userId\)/);
  assert.match(auth, /requirePlatformAdmin/);
});

test("W7.8 contains no fabricated Admin destinations or platform claims", () => {
  assert.doesNotMatch(admin, /href="\/admin\/(security|health|configuration)"/);
  assert.doesNotMatch(admin, /fake|sample data|demo data/i);
  assert.doesNotMatch(admin, /health score|security events|revenue trend|predicted/i);
});

test("W7.8 reuses internal design-system presentation primitives", () => {
  for (const primitive of ["PageHeader", "SectionHeader", "MetricRow", "LoadingState", "ErrorState"]) assert.match(admin, new RegExp(primitive));
});
