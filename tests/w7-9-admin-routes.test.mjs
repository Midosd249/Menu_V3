import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const admin = await readFile(new URL("../src/routes/admin.tsx", import.meta.url), "utf8");
const workspaceRoute = await readFile(new URL("../src/routes/admin/$workspace.tsx", import.meta.url), "utf8");
const routeTree = await readFile(new URL("../src/routeTree.gen.ts", import.meta.url), "utf8");
const platform = await readFile(new URL("../src/lib/menu/platform.ts", import.meta.url), "utf8");
const auth = await readFile(new URL("../src/lib/auth/platform-admin.server.ts", import.meta.url), "utf8");

const routeMappings = {
  overview: "/admin",
  tenants: "/admin/restaurants",
  orders: "/admin/orders",
  clients: "/admin/clients",
  branches: "/admin/branches",
  leads: "/admin/leads",
  projects: "/admin/projects",
  requests: "/admin/service-requests",
  subscriptions: "/admin/subscriptions",
  analytics: "/admin/analytics",
  activity: "/admin/activity",
  system: "/admin/system",
};

const workspaceMappings = {
  restaurants: "tenants",
  orders: "orders",
  clients: "clients",
  branches: "branches",
  leads: "leads",
  projects: "projects",
  "service-requests": "requests",
  subscriptions: "subscriptions",
  analytics: "analytics",
  activity: "activity",
  system: "system",
};

test("W7.9 exposes the verified Admin route architecture", () => {
  assert.match(admin, /createFileRoute\("\/admin"\)/);
  assert.match(workspaceRoute, /createFileRoute\("\/admin\/\$workspace"\)/);
  for (const path of Object.values(routeMappings)) assert.ok(admin.includes(`"${path}"`), `missing Admin route mapping: ${path}`);
});

test("W7.9 generated route tree contains the real Admin child route", () => {
  assert.match(routeTree, /Route as AdminRouteImport/);
  assert.match(routeTree, /Route as AdminWorkspaceRouteImport/);
  assert.match(routeTree, /\/admin\/\$workspace/);
  assert.match(routeTree, /getParentRoute: \(\) => AdminRoute/);
});

test("W7.9 preserves every existing Admin workspace mapping", () => {
  for (const [tab, path] of Object.entries(routeMappings)) {
    assert.ok(admin.includes(`${tab}: "${path}"`), `missing ${tab} → ${path}`);
  }
  assert.match(admin, /const ADMIN_WORKSPACE_TABS: Record<string, Tab>/);
  for (const [workspace, tab] of Object.entries(workspaceMappings)) {
    assert.ok(admin.includes(`${workspace}: "${tab}"`), `missing ${workspace} → ${tab}`);
  }
});

test("W7.9 keeps legacy tab compatibility and safe unknown fallback", () => {
  assert.match(admin, /const LEGACY_TAB_ROUTES: Record<string, AdminRoutePath> = \{ \.\.\.ADMIN_ROUTES \};/);
  assert.match(admin, /const legacyTab = params\.get\("tab"\)/);
  assert.match(admin, /params\.delete\("tab"\)/);
  assert.match(admin, /if \(!target\) throw redirect\(\{ to: "\/admin"/);
  assert.match(admin, /throw redirect\(\{ to: "\/admin\/\$workspace"/);
  assert.match(admin, /replace: true/);
});

test("W7.9 child route is a protected adapter over the verified workspace mapping", () => {
  assert.match(workspaceRoute, /ADMIN_WORKSPACE_TABS\[params\.workspace\]/);
  assert.match(workspaceRoute, /if \(!ADMIN_WORKSPACE_TABS\[params\.workspace\]\)/);
  assert.match(workspaceRoute, /const initialTab = ADMIN_WORKSPACE_TABS\[workspace\] as Tab/);
  assert.match(workspaceRoute, /return <PlatformAdminPage initialTab=\{initialTab\} \/>/);
  assert.match(workspaceRoute, /throw redirect\(\{ to: "\/admin", replace: true \}\)/);
  assert.doesNotMatch(workspaceRoute, /\/admin\/(security|platform-health|configuration)/);
});

test("W7.9 preserves existing Platform Admin authorization boundaries", () => {
  assert.match(platform, /assertPlatformAdmin\(context\.userId\)/);
  assert.match(platform, /requirePlatformAdmin\(userId\)/);
  assert.match(auth, /requirePlatformAdmin/);
  assert.match(admin, /useCurrentUserState/);
  assert.match(admin, /navigate\(\{ to: "\/login"/);
});

test("W7.9 does not add unsupported Admin detail routes or fabricated data", () => {
  assert.doesNotMatch(admin, /\/admin\/(restaurants|clients)\/\$id/);
  assert.doesNotMatch(workspaceRoute, /\/admin\/(security|platform-health|configuration)/);
  assert.doesNotMatch(admin, /fake|sample data|demo data/i);
  assert.doesNotMatch(admin, /health score|security events|revenue trend|predicted/i);
});

test("W7.9 route navigation is URL-based while preserving the local setTab state contract", () => {
  assert.match(admin, /function selectTab\(next: Tab\) \{ setTab\(next\);/);
  assert.match(admin, /navigate\(\{ to: ADMIN_ROUTES\[next\] \}\)/);
  assert.match(admin, /aria-current=\{tab === item\.id \? "page"/);
});
