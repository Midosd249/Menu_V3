import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const admin = await readFile(new URL("../src/routes/admin.tsx", import.meta.url), "utf8");
const workspaceRoute = await readFile(new URL("../src/routes/admin/$workspace.tsx", import.meta.url), "utf8");
const routeTree = await readFile(new URL("../src/routeTree.gen.ts", import.meta.url), "utf8");
const platform = await readFile(new URL("../src/lib/menu/platform.ts", import.meta.url), "utf8");
const auth = await readFile(new URL("../src/lib/auth/platform-admin.server.ts", import.meta.url), "utf8");

test("W7.9 exposes the verified Admin route architecture", () => {
  assert.match(admin, /createFileRoute\("\/admin"\)/);
  assert.match(workspaceRoute, /createFileRoute\("\/admin\/\$workspace"\)/);
  for (const path of ["/admin", "/admin/restaurants", "/admin/orders", "/admin/clients", "/admin/branches", "/admin/leads", "/admin/projects", "/admin/service-requests", "/admin/subscriptions", "/admin/analytics", "/admin/activity", "/admin/system"]) assert.match(admin, new RegExp(path.replaceAll("/", "\\/")));
});

test("W7.9 generated route tree contains the real Admin child route", () => {
  assert.match(routeTree, /AdminRouteImport/);
  assert.match(routeTree, /AdminWorkspaceRouteImport/);
  assert.match(routeTree, /\/admin\/\$workspace/);
});

test("W7.9 preserves every existing Admin workspace mapping", () => {
  const mappings = { overview: "/admin", tenants: "/admin/restaurants", orders: "/admin/orders", clients: "/admin/clients", branches: "/admin/branches", leads: "/admin/leads", projects: "/admin/projects", requests: "/admin/service-requests", subscriptions: "/admin/subscriptions", analytics: "/admin/analytics", activity: "/admin/activity", system: "/admin/system" };
  for (const [tab, path] of Object.entries(mappings)) assert.match(admin, new RegExp(`${tab}: \\"${path.replaceAll("/", "\\/")}\\"`));
});

test("W7.9 keeps legacy tab compatibility and safe unknown fallback", () => {
  for (const tab of ["overview", "tenants", "orders", "clients", "branches", "leads", "projects", "requests", "subscriptions", "analytics", "activity", "system"]) assert.match(admin, new RegExp(`${tab}: \\"/admin`));
  assert.match(admin, /params\.delete\("tab"\)/);
  assert.match(admin, /if \(!target\)/);
  assert.match(admin, /throw redirect\(\{ to: "\/admin"/);
  assert.match(admin, /replace: true/);
});

test("W7.9 child route whitelists only real Admin workspaces", () => {
  for (const workspace of ["restaurants", "orders", "clients", "branches", "leads", "projects", "service-requests", "subscriptions", "analytics", "activity", "system"]) assert.match(workspaceRoute, new RegExp(`\\"${workspace}\\"`));
  assert.match(workspaceRoute, /if \(!ADMIN_WORKSPACE_TABS\[params\.workspace\]\)/);
  assert.match(workspaceRoute, /throw redirect\(\{ to: "\/admin"/);
  assert.doesNotMatch(workspaceRoute, /security|platform-health|configuration/);
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

test("W7.9 route navigation is URL-based rather than a second competing tab-only system", () => {
  assert.match(admin, /navigate\(\{ to: ADMIN_ROUTES\[next\] \}\)/);
  assert.match(admin, /aria-current=\{tab === item\.id \? "page"/);
  assert.doesNotMatch(admin, /تبقى كل المساحات داخل `\/admin` في W7\.8/);
});
