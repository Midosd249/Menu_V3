import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const PUBLIC_MENU = await readFile("src/lib/menu/public.ts", "utf8");
const SESSION = await readFile("src/lib/menu/session.server.ts", "utf8");
const PUBLIC_ROUTE = await readFile("src/routes/m.$slug.tsx", "utf8");
const BRANCH_ROUTE = await readFile("src/routes/m.$slug.$branch.tsx", "utf8");

test("public menu content is cache-safe and attribution is a separate side-effecting function", () => {
  const attributionStart = PUBLIC_MENU.indexOf("export const getPublicMenuAttribution");
  assert.ok(attributionStart > 0);
  const publicHandler = PUBLIC_MENU.slice(PUBLIC_MENU.indexOf("export const getPublicMenu"), attributionStart);
  assert.match(publicHandler, /export const getPublicMenu = createServerFn\(\{ method: "GET" \}\)/);
  assert.match(publicHandler, /Cache-Control.*public/);
  assert.doesNotMatch(publicHandler, /resolveAnonymousSession/);
  assert.doesNotMatch(publicHandler, /setAnonymousSessionCookie/);
  assert.match(PUBLIC_MENU.slice(attributionStart), /export const getPublicMenuAttribution = createServerFn\(\{ method: "POST" \}\)/);
  assert.match(PUBLIC_MENU.slice(attributionStart), /resolveAnonymousSession/);
});

test("public HTML routes are safe for shared caching because session attribution is no longer in SSR", () => {
  for (const route of [PUBLIC_ROUTE, BRANCH_ROUTE]) {
    assert.match(route, /headers: \(\) => \(\{ "Cache-Control": "public, max-age=0, s-maxage=15, stale-while-revalidate=30" \}\)/);
    assert.doesNotMatch(route, /private, no-store/);
  }
});

test("anonymous session last_seen_at updates are throttled while preserving tenant-bound identity", () => {
  assert.match(SESSION, /ANONYMOUS_SESSION_TOUCH_INTERVAL_SECONDS = 5 \* 60/);
  assert.match(SESSION, /where id = \$\{session\.id\}\s+and tenant_id = \$\{tenantId\}/);
  assert.match(SESSION, /last_seen_at < now\(\) - \(\$\{ANONYMOUS_SESSION_TOUCH_INTERVAL_SECONDS\} \* interval '1 second'\)/);
});

test("branch cache identity remains explicit and server-authoritative", () => {
  assert.match(PUBLIC_MENU, /const cacheKey = `\$\{tenantSlug\}:\$\{branchSlug \?\? "default"\}:\$\{revision\}`/);
  assert.match(PUBLIC_MENU, /where b0\.tenant_id = t\.id/);
  assert.match(PUBLIC_MENU, /b0\.slug = \$\{branchSlug \?\? null\}/);
});

test("attribution remains out of preview mode and does not weaken public-menu rendering", () => {
  assert.match(PUBLIC_ROUTE, /getPublicMenuAttribution/);
  assert.match(PUBLIC_ROUTE, /if \(previewTheme \|\| state\.status !== "ok" \|\| !state\.menu\.tenant\.whatsapp\?\.trim\(\)\)/);
  assert.match(BRANCH_ROUTE, /initialMenu=\{menuData\?\.menu\}/);
});
