import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import test from "node:test";

const ROOT = new URL("../", import.meta.url).pathname;
const SRC = join(ROOT, "src");
const read = (path) => readFileSync(join(ROOT, path), "utf8");

function sourceFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...sourceFiles(path));
    else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) files.push(path);
  }
  return files;
}

test("public tenant mapping has a distinct type that cannot carry owner identity", () => {
  const types = read("src/lib/menu/types.ts");
  const map = read("src/lib/menu/map.ts");
  const publicMenu = read("src/lib/menu/public.ts");

  assert.match(types, /export type PublicTenant = Omit<Tenant, "ownerUserId">;/);
  assert.match(types, /export type PublicMenu = \{ tenant: PublicTenant;/);
  assert.match(map, /export function mapPublicTenant\(row: Record<string, unknown>\): PublicTenant/);
  assert.match(map, /const \{ ownerUserId: _ownerUserId, \.\.\.publicTenant \} = mapTenant\(row\);/);
  assert.match(publicMenu, /const tenant = mapPublicTenant\(row\.tenant\);/);
  assert.doesNotMatch(publicMenu, /const tenant = mapTenant\(row\.tenant\);/);
});

test("public mapping strips operational revision fields as well as owner identity", () => {
  const types = read("src/lib/menu/types.ts");
  const map = read("src/lib/menu/map.ts");
  const publicMenu = read("src/lib/menu/public.ts");

  assert.match(map, /mapPublicTenant/);
  assert.doesNotMatch(types.match(/export type PublicTenant = ([\s\S]*?);\n\nexport type PublicMenu/)?.[1] ?? "", /public_content_version/);
  assert.match(map, /ownerUserId: _ownerUserId/);
  assert.match(publicMenu, /mapPublicTenant\(row\.tenant\)/);
});

test("authenticated menu server functions use the auth middleware chokepoint", () => {
  for (const path of ["src/lib/menu/owner.ts", "src/lib/menu/admin.ts"]) {
    const source = read(path);
    const blocks = source.split(/(?=export const \w+ = createServerFn)/g).filter((block) => block.startsWith("export const "));
    assert.ok(blocks.length > 0, `${path} contains no server functions`);
    for (const block of blocks) {
      const name = block.match(/^export const (\w+)/)?.[1] ?? "unknown";
      const handlerIndex = block.indexOf(".handler(");
      assert.ok(handlerIndex > 0, `${path}:${name} has no handler`);
      assert.match(block.slice(0, handlerIndex), /\.middleware\(\[authMiddleware\]\)/, `${path}:${name} is missing auth middleware`);
    }
  }
});

test("platform administration is fail-closed and cannot be inferred from a client-supplied tenant", () => {
  const admin = read("src/lib/menu/admin.ts");
  const guard = read("src/lib/auth/platform-admin.server.ts");
  assert.match(admin, /requirePlatformAdmin\(userId\)/);
  assert.match(guard, /menu_v3\.is_platform_admin\(\$\{userId\}\)/);
  assert.match(guard, /isPlatformAdminConfigured\(userId, users\[0\]\?\.email\)/);
  assert.match(guard, /throw new Error\("PLATFORM_ADMIN_REQUIRED"\)/);
  assert.doesNotMatch(admin, /platformAdmin.*tenantId|tenantId.*platformAdmin/i);
});

test("client-reachable source files do not contain server secret names or credential values", () => {
  const forbidden = [
    /SUPABASE_SERVICE_ROLE_KEY/i,
    /SERVICE_ROLE_KEY/i,
    /BETTER_AUTH_SECRET/i,
    /GROK_AUTH_CLIENT_SECRET/i,
    /GOOGLE_CLIENT_SECRET/i,
  ];
  const files = sourceFiles(SRC).filter((path) => !path.endsWith(".server.ts") && !path.endsWith(".server.tsx"));
  for (const path of files) {
    const source = readFileSync(path, "utf8");
    for (const pattern of forbidden) {
      assert.doesNotMatch(source, pattern, `${relative(ROOT, path)} contains a forbidden secret/credential reference`);
    }
  }
});
