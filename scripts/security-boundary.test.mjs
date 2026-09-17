import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { relative, resolve } from "node:path";
import test from "node:test";

const ROOT = resolve(new URL("..", import.meta.url).pathname);
const SRC = resolve(ROOT, "src");
function sourceFiles(dir) { const out = []; for (const entry of readdirSync(dir, { withFileTypes: true })) { const path = resolve(dir, entry.name); if (entry.isDirectory()) out.push(...sourceFiles(path)); else if (/\.(ts|tsx)$/.test(entry.name)) out.push(path); } return out; }
function read(path) { return readFileSync(resolve(ROOT, path), "utf8"); }

for (const path of sourceFiles(SRC).filter((file) => /\.(ts|tsx)$/.test(file))) {
  const source = readFileSync(path, "utf8");
  const blocks = source.split(/(?=export const \w+\s*=\s*createServerFn)/g).slice(1);
  for (const block of blocks) {
    const name = block.match(/^export const (\w+)/)?.[1] ?? "unknown";
    const handlerIndex = block.indexOf(".handler(");
    if (handlerIndex > 0) assert.match(block.slice(0, handlerIndex), /\.middleware\(\[authMiddleware\]\)/, `${path}:${name} is missing auth middleware`);
  }
}

test("platform administration is fail-closed and cannot be inferred from a client-supplied tenant", () => {
  const admin = read("src/lib/menu/admin.ts");
  const guard = read("src/lib/auth/platform-admin.server.ts");
  assert.match(admin, /requirePlatformAdmin\(context\.userId\)/);
  assert.match(guard, /menu_v3\.is_platform_admin\(\$\{userId\}\)/);
  assert.match(guard, /isPlatformAdminConfigured\(userId, users\[0\]\?\.email\)/);
  assert.match(guard, /throw new Error\("PLATFORM_ADMIN_REQUIRED"\)/);
  assert.doesNotMatch(admin, /platformAdmin.*tenantId|tenantId.*platformAdmin/i);
});

test("client-reachable source files do not contain server secret names or credential values", () => {
  const forbidden = [/SUPABASE_SERVICE_ROLE_KEY/i, /SERVICE_ROLE_KEY/i, /BETTER_AUTH_SECRET/i, /GROK_AUTH_CLIENT_SECRET/i, /GOOGLE_CLIENT_SECRET/i];
  const files = sourceFiles(SRC).filter((path) => !path.endsWith(".server.ts") && !path.endsWith(".server.tsx") && !path.endsWith("/auth/server.ts"));
  for (const path of files) { const source = readFileSync(path, "utf8"); for (const pattern of forbidden) assert.doesNotMatch(source, pattern, `${relative(ROOT, path)} contains a forbidden secret/credential reference`); }
});
