import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { indexOrder, moveByDirection } from "../src/lib/menu/reorder.ts";

test("branch menu ordering moves categories and products without changing unrelated rows", () => {
  const items = [{ id: "a" }, { id: "b" }, { id: "c" }];
  assert.deepEqual(moveByDirection(items, "b", "up").map((item) => item.id), ["b", "a", "c"]);
  assert.deepEqual(moveByDirection(items, "b", "down").map((item) => item.id), ["a", "c", "b"]);
  assert.deepEqual(moveByDirection(items, "a", "up").map((item) => item.id), ["a", "b", "c"]);
  assert.deepEqual(indexOrder(items), [{ id: "a", sortOrder: 10 }, { id: "b", sortOrder: 20 }, { id: "c", sortOrder: 30 }]);
});

test("branch menu ordering is persisted and isolated by tenant and branch", async () => {
  const migration = await readFile("migrations/20260930010000_menu_branch_ordering.sql", "utf8");
  const owner = await readFile("src/lib/menu/owner.ts", "utf8");
  assert.match(migration, /primary key \(branch_id, category_id\)/);
  assert.match(migration, /primary key \(branch_id, product_id\)/);
  assert.match(migration, /menu order branch tenant mismatch/);
  assert.match(migration, /menu order resource tenant mismatch/);
  assert.match(owner, /branch_category_order/);
  assert.match(owner, /branch_product_order/);
  assert.match(owner, /branch_id = \$\{data\.branchId\}/);
  assert.match(owner, /tenant_id = \$\{member\.tenant_id\}/);
  assert.match(owner, /member_branch_access/);
});

test("public menu renders saved branch ordering instead of tenant creation order", async () => {
  const publicMenu = await readFile("src/lib/menu/public.ts", "utf8");
  assert.match(publicMenu, /branch_category_order/);
  assert.match(publicMenu, /branch_product_order/);
  assert.match(publicMenu, /coalesce\(bco\.sort_order, c\.sort_order\)/);
  assert.match(publicMenu, /coalesce\(bpo\.sort_order, p\.sort_order\)/);
  assert.match(publicMenu, /bco\.branch_id = b\.id/);
  assert.match(publicMenu, /bpo\.branch_id = b\.id/);
});

test("Studio exposes accessible up/down ordering controls and branch context", async () => {
  const page = await readFile("src/components/studio-menu-workspace-page.tsx", "utf8");
  const workspace = await readFile("src/components/studio-menu-workspace.tsx", "utf8");
  assert.match(page, /getMenuOrdering/);
  assert.match(page, /reorderMenu/);
  assert.match(page, /setBranchId/);
  assert.match(workspace, /ChevronUp/);
  assert.match(workspace, /ChevronDown/);
  assert.match(workspace, /aria-label=.*Move/);
});

test("Taste does not contain a hard-coded Chef's Choice badge", async () => {
  const source = await readFile("src/components/templates/taste.tsx", "utf8");
  assert.doesNotMatch(source, /Chef['’]s Choice/);
  assert.doesNotMatch(source, /اختيار الشيف/);
  assert.match(source, /product\.dietaryLabels/);
});
