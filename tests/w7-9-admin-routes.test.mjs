import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const admin = await readFile(new URL("../src/routes/admin.tsx", import.meta.url), "utf8");
const adminRoutes = await readFile(new URL("../src/lib/admin/routes.ts", import.meta.url), "utf8");
const platformAdmin = await readFile(new URL("../src/components/admin/platform-admin-page.tsx", import.meta.url), "utf8");
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
  for (const path of Object.values(routeMappings)) assert.ok(adminRoutes.includes(`"${path}"`), `missing Admin route mapping: ${path}`);
  assert.ok(!adminRoutes.includes("/admin/service-requests"));
  assert.ok(!adminRoutes.includes("/admin/leads"));
});

test("generated route tree still contains the dynamic Admin workspace adapter", () => {
  assert.ok(routeTree.includes("Route as AdminRouteImport"));
  assert.ok(routeTree.includes("Route as AdminWorkspaceRouteImport"));
  assert.ok(routeTree.includes("'/admin/$workspace'"));
  assert.ok(routeTree.includes("getParentRoute: () => AdminRoute"));
});

test("active Admin workspace mappings are explicit", () => {
  for (const [tab, path] of Object.entries(routeMappings)) assert.ok(adminRoutes.includes(`${tab}: "${path}"`), `missing ${tab} → ${path}`);
  assert.ok(adminRoutes.includes("const ADMIN_WORKSPACE_TABS: Record<string, Tab>"));
  for (const [workspace, tab] of Object.entries(workspaceMappings)) assert.ok(adminRoutes.includes(`${workspace}: "${tab}"`), `missing ${workspace} → ${tab}`);
  assert.ok(!adminRoutes.includes('"service-requests": "requests"'));
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
  assert.ok(workspaceRoute.includes("const ADMIN_WORKSPACE_TABS: Record<string, Tab>"));
  assert.ok(workspaceRoute.includes("const { workspace } = Route.useParams()"));
  assert.ok(workspaceRoute.includes("if (!initialTab)"));
  assert.ok(workspaceRoute.includes('Navigate to="/admin" replace'));
  assert.ok(workspaceRoute.includes("return <PlatformAdminPage key={workspace} initialTab={initialTab} />"));
});

test("Platform Admin authorization remains server-side", () => {
  assert.ok(platform.includes("assertPlatformAdmin(context.userId)"));
  assert.ok(platform.includes("requirePlatformAdmin(userId)"));
  assert.ok(auth.includes("requirePlatformAdmin"));
  assert.ok(platformAdmin.includes("useCurrentUserState"));
  assert.ok(platformAdmin.includes('navigate({ to: "/login"'));
});

test("Admin does not fabricate retired request data", () => {
  assert.ok(!/serviceRequests|PlatformServiceRequest|customer_requests|service_requests/i.test(platformAdmin));
  assert.ok(!/fake|sample data|demo data/i.test(platformAdmin));
  assert.ok(!/health score|security events|revenue trend|predicted/i.test(platformAdmin));
});

test("Admin navigation remains URL-based through the dynamic workspace adapter", () => {
  assert.ok(platformAdmin.includes("function selectTab(next: Tab) {"));
  assert.ok(platformAdmin.includes('navigate({ to: "/admin/$workspace", params: { workspace }'));
  assert.ok(platformAdmin.includes('void navigate({ to: "/admin" })'));
  assert.ok(platformAdmin.includes('void navigate({ to: "/admin/$workspace", params: { workspace } })'));
  assert.ok(!platformAdmin.includes("window.location.assign"));
  assert.ok(platformAdmin.includes('aria-current={tab === item.id ? "page"'));
});

test("Platform Admin exposes server-authorized new-customer notifications without reviving legacy request flows", () => {
  assert.ok(platform.includes("getPlatformCustomerNotifications"));
  assert.ok(platform.includes("assertPlatformAdmin(context.userId)"));
  assert.ok(platform.includes("from tenants t"));
  assert.ok(platform.includes("newCustomers"));
  assert.ok(platformAdmin.includes("customer-notifications-read-at"));
  assert.ok(platformAdmin.includes("setInterval(() => void pollCustomerNotifications(), 10000)"));
  assert.ok(platformAdmin.includes("Notification.requestPermission"));
  assert.ok(platformAdmin.includes('to="/admin/users"'));
  assert.ok(!platformAdmin.includes("service-requests"));
  assert.ok(!platformAdmin.includes("customer_requests"));
});

test("Orders remains an operational platform surface independent of customer signup", () => {
  assert.ok(adminRoutes.includes('orders: "/admin/orders"'));
  assert.ok(platformAdmin.includes("getPlatformOrders"));
  assert.ok(platformAdmin.includes("updatePlatformOrderStatus"));
  assert.ok(platformAdmin.includes("archivePlatformOrder"));
  assert.ok(platformAdmin.includes("فتح الطلبات"));
});
