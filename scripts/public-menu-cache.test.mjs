import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const publicSource = fs.readFileSync(new URL("src/lib/menu/public.ts", root), "utf8");
const migrationSource = fs.readFileSync(new URL("migrations/20260906001000_public_menu_content_revision.sql", root), "utf8");

test("public menu cache is versioned by the database content revision", () => {
  assert.match(publicSource, /select public_content_version/);
  assert.match(publicSource, /const revision = String\(revisionRows[0\]\?\.public_content_version/);
  assert.match(publicSource, /`\$\{tenantSlug\}:\$\{branchSlug \?\? "default"\}:\$\{revision\}`/);
  assert.match(publicSource, /const MENU_CACHE_TTL_MS = 15_000/);
});

test("public content revision migration is explicitly scoped to menu_v3", () => {
  assert.match(migrationSource, /alter table menu_v3\.tenants/);
  assert.match(migrationSource, /create or replace function menu_v3\.bump_tenant_public_content_version/);
  assert.match(migrationSource, /create or replace function menu_v3\.bump_parent_tenant_public_content_version/);
  assert.doesNotMatch(migrationSource, /(^|\s)(alter table|update|create trigger|drop trigger) tenants\b/m);
  assert.doesNotMatch(migrationSource, /(^|\s)(create trigger|drop trigger) (branches|branch_hours|categories|products|product_variants|modifier_groups|modifier_options|product_modifier_groups)\b/m);
});

test("public content revision covers every public menu mutation surface", () => {
  assert.match(migrationSource, /add column if not exists public_content_version bigint not null default 0/);
  for (const table of [
    "tenants",
    "branches",
    "branch_hours",
    "categories",
    "products",
    "product_variants",
    "modifier_groups",
    "modifier_options",
    "product_modifier_groups",
  ]) {
    assert.match(migrationSource, new RegExp(`${table}_public_content_version`));
  }
  assert.match(migrationSource, /update menu_v3\.tenants\s+set public_content_version = public_content_version \+ 1/);
});
