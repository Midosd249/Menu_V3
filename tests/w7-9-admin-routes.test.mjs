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
  assert.ok(admin.includes('createFileRoute("/admin")'));
  assert.ok(workspaceRoute.includes('createFileRoute("/admin/$workspace")'));
  for (const path of Object.values(routeMappings)) assert.ok(admin.includes(`"${path}"`), `missing Admin route mapping: ${path}`);
});

test("W7.9 generated route tree contains the real Admin child route", () => {
  assert.ok(routeTree.includes("Route as AdminRouteImport"));
  assert.ok(routeTree.includes("Route as AdminWorkspaceRouteImport"));
  assert.ok(routeTree.includes("'/admin/$workspace'"));
  assert.ok(routeTree.includes("getParentRoute: () => AdminRoute"));
});

test("W7.9 preserves every existing Admin workspace mapping", () => {
  for (const [tab, path] of Object.entries(routeMappings)) {
    assert.ok(admin.includes(`${tab}: "${path}"`), `missing ${tab} → ${path}`);
  }
  assert.ok(admin.includes("const ADMIN_WORKSPACE_TABS: Record<string, Tab>"));
  for (const [workspace, tab] of Object.entries(workspaceMappings)) {
    const key = workspace.includes("-") ? JSON.stringify(workspace) : workspace;
    assert.ok(admin.includes(`${key}: "${tab}"`), `missing ${workspace} → ${tab}`);
  }
});

test("W7.9 keeps legacy tab compatibility and safe unknown fallback", () => {
  assert.ok(admin.includes("const LEGACY_TAB_ROUTES: Record<string, AdminRoutePath> = { ...ADMIN_ROUTES };"));
  assert.ok(admin.includes('const legacyTab = params.get("tab")'));
  assert.ok(admin.includes('params.delete("tab")'));
  assert.ok(admin.includes('if (!target) throw redirect({ to: "/admin"'));
  assert.ok(admin.includes('throw redirect({ to: "/admin/$workspace"'));
  assert.ok(admin.includes("replace: true"));
});

test("W7.9 child route is a protected adapter over the verified workspace mapping", () => {
  assert.ok(workspaceRoute.includes("ADMIN_WORKSPACE_TABS[params.workspace]"));
  assert.ok(workspaceRoute.includes("if (!ADMIN_WORKSPACE_TABS[params.workspace])"));
  assert.ok(workspaceRoute.includes("const initialTab = ADMIN_WORKSPACE_TABS[workspace] as Tab"));
  assert.ok(workspaceRoute.includes("return <PlatformAdminPage initialTab={initialTab} />"));
  assert.ok(workspaceRoute.includes('throw redirect({ to: "/admin", replace: true })'));
  assert.ok(!/\/admin\/(security|platform-health|configuration)/.test(workspaceRoute));
});

test("W7.9 preserves existing Platform Admin authorization boundaries", () => {
  assert.ok(platform.includes("assertPlatformAdmin(context.userId)"));
  assert.ok(platform.includes("requirePlatformAdmin(userId)"));
  assert.ok(auth.includes("requirePlatformAdmin"));
  assert.ok(admin.includes("useCurrentUserState"));
  assert.ok(admin.includes('navigate({ to: "/login"'));
});

test("W7.9 does not add unsupported Admin detail routes or fabricated data", () => {
  assert.ok(!/\/admin\/(restaurants|clients)\/\$id/.test(admin));
  assert.ok(!/\/admin\/(security|platform-health|configuration)/.test(workspaceRoute));
  assert.ok(!/fake|sample data|demo data/i.test(admin));
  assert.ok(!/health score|security events|revenue trend|predicted/i.test(admin));
});

test("W7.9 route navigation is URL-based while preserving the local setTab state contract", () => {
  assert.ok(admin.includes("function selectTab(next: Tab) { setTab(next);"));
  assert.ok(admin.includes("navigate({ to: ADMIN_ROUTES[next] })"));
  assert.ok(admin.includes('aria-current={tab === item.id ? "page"'));
});
