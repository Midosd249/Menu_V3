import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const adminRoute = await readFile(new URL("../src/routes/admin.tsx", import.meta.url), "utf8");

test("Admin route keeps the heavy platform implementation out of the route reference file", async () => {
  const platformAdmin = await readFile(
    new URL("../src/components/admin/platform-admin-page.tsx", import.meta.url),
    "utf8",
  );

  assert.ok(adminRoute.includes('createFileRoute("/admin")'));
  assert.ok(adminRoute.includes('import { PlatformAdminPage } from "@/components/admin/platform-admin-page";'));
  assert.ok(!adminRoute.includes("export function PlatformAdminPage"));
  assert.ok(!adminRoute.includes("function PlatformAdminPage"));
  assert.ok(platformAdmin.includes("export function PlatformAdminPage"));
  assert.ok(platformAdmin.includes("function Overview("));
  assert.ok(platformAdmin.includes("function Orders("));
  assert.ok(platformAdmin.includes("function Row("));
  assert.ok(platformAdmin.includes("function isOpenOrder("));
});

test("Admin route does not export route component implementation", () => {
  assert.doesNotMatch(adminRoute, /export\s+(?:async\s+)?function\s+(?:PlatformAdminPage|AdminRouteShell)/);
});
