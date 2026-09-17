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
  projects: "/admin/projects",
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
  projects: "projects",
  subscriptions: "subscriptions",
  analytics: "analytics",
  activity: "activity",
  system: "system",
};

test("Admin exposes only the active platform workspaces", () => {
  assert.ok(admin.includes('createFileRoute("/admin")'));
  assert.ok(workspaceRoute.includes('createFileRoute("/admin/$workspace")'));
  for (const path of Object.values(routeMappings)) assert.ok(admin.includes(`"${path}"`), `missing Admin route mapping: ${path}`);
  assert.ok(!admin.includes("/admin/service-requests"));
  assert.ok(!admin.includes("/admin/leads"));
});

test("generated route tree still contains the dynamic Admin workspace adapter", () => {
  assert.ok(routeTree.includes("Route as AdminRouteImport"));
  assert.ok(routeTree.includes("Route as AdminWorkspaceRouteImport"));
  assert.ok(routeTree.includes("'/admin/$workspace'"));
  assert.ok(routeTree.includes("getParentRoute: () => AdminRoute"));
});

test("active Admin workspace mappings are explicit", () => {
  for (const [tab, path] of Object.entries(routeMappings)) assert.ok(admin.includes(`${tab}: "${path}"`), `missing ${tab} → ${path}`);
  assert.ok(admin.includes("const ADMIN_WORKSPACE_TABS: Record<string, Tab>"));
  for (const [workspace, tab] of Object.entries(workspaceMappings)) assert.ok(admin.includes(`${workspace}: "${tab}"`), `missing ${workspace} → ${tab}`);
  assert.ok(!admin.includes('"service-requests": "requests"'));
});

test("legacy tab compatibility safely redirects retired workspaces", () => {
  assert.ok(admin.includes("const LEGACY_TAB_ROUTES: Record<string, AdminRoutePath> = { ...ADMIN_ROUTES };"));
  assert.ok(admin.includes('const legacyTab = params.get("tab")'));
  assert.ok(admin.includes('params.delete("tab")'));
  assert.ok(admin.includes('if (!target) throw redirect({ to: "/admin"'));
  assert.ok(admin.includes('throw redirect({ to: "/admin/$workspace"'));
  assert.ok(admin.includes("replace: true"));
});

test("child route remains a protected adapter over the verified workspace mapping", () => {
  assert.ok(workspaceRoute.includes("ADMIN_WORKSPACE_TABS[params.workspace]"));
  assert.ok(workspaceRoute.includes("if (!ADMIN_WORKSPACE_TABS[params.workspace]"));
  assert.ok(workspaceRoute.includes("const initialTab = ADMIN_WORKSPACE_TABS[workspace] as Tab"));
  assert.ok(workspaceRoute.includes("return <PlatformAdminPage initialTab={initialTab} />"));
  assert.ok(workspaceRoute.includes('throw redirect({ to: "/admin", replace: true })'));
});

test("Platform Admin authorization remains server-side", () => {
  assert.ok(platform.includes("assertPlatformAdmin(context.userId)"));
  assert.ok(platform.includes("requirePlatformAdmin(userId)"));
  assert.ok(auth.includes("requirePlatformAdmin"));
  assert.ok(admin.includes("useCurrentUserState"));
  assert.ok(admin.includes('navigate({ to: "/login"'));
});

test("Admin does not fabricate retired request data", () => {
  assert.ok(!/serviceRequests|PlatformServiceRequest|customer_requests|service_requests/i.test(admin));
  assert.ok(!/fake|sample data|demo data/i.test(admin));
  assert.ok(!/health score|security events|revenue trend|predicted/i.test(admin));
});

test("Admin navigation remains URL-based", () => {
  assert.ok(admin.includes("function selectTab(next: Tab) { setTab(next);"));
  assert.ok(admin.includes("navigate({ to: ADMIN_ROUTES[next] })"));
  assert.ok(admin.includes('aria-current={tab === item.id ? "page"'));
});
