import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const source = fs.readFileSync(new URL("../src/lib/menu/guest-assistant.ts", import.meta.url), "utf8");
const ui = fs.readFileSync(new URL("../src/components/guest-menu-assistant.tsx", import.meta.url), "utf8");
const renderer = fs.readFileSync(new URL("../src/components/theme-renderer.tsx", import.meta.url), "utf8");
const fallback = fs.readFileSync(new URL("../src/lib/menu/guest-assistant-fallback.ts", import.meta.url), "utf8");

for (const expected of [
  "export const askGuestMenuAssistant",
  "t.is_published = true",
  "p.is_available = true",
  "where b0.tenant_id = t.id",
  "tenantId",
  "guest:${data.sessionId}",
  "guest.menu_assistant",
  "Never invent ingredients, allergens, dietary properties, availability, prices",
  "Do not claim that an allergen is absent",
  "read-only",
  "productIds",
  "fallbackGuestAnswer",
  "السعر في القائمة",
  "I cannot generate the full AI answer right now",
]) {
  test(`guest assistant enforces ${expected}`, () => {
    assert.ok(source.includes(expected), `Missing expected contract: ${expected}`);
  });
}

test("guest assistant filters model product references to the published available catalog", () => {
  assert.ok(source.includes("const allowedIds = new Set(products.map((p) => p.id))"));
  assert.ok(source.includes("result.data.productIds.filter((id) => allowedIds.has(id))"));
});

test("customer UI is Arabic-first, mobile-safe, and does not expose provider details", () => {
  assert.ok(ui.includes("اسأل عن القائمة"));
  assert.ok(ui.includes("max-h-[82dvh]"));
  assert.ok(ui.includes("items-end justify-center"));
  assert.ok(ui.includes("Answers grounded in available menu items"));
  assert.ok(!ui.includes("Mercury"));
  assert.ok(!ui.includes("OpenRouter"));
  assert.ok(!ui.includes("API_KEY"));
});

test("assistant dialog has keyboard, focus, and scroll-lock safeguards", () => {
  assert.ok(ui.includes("aria-haspopup=\"dialog\""));
  assert.ok(ui.includes("aria-expanded={open}"));
  assert.ok(ui.includes("role=\"dialog\" aria-modal=\"true\""));
  assert.ok(ui.includes("aria-labelledby=\"guest-menu-assistant-title\""));
  assert.ok(ui.includes('event.key === "Escape"'));
  assert.ok(ui.includes('event.key !== "Tab"'));
  assert.ok(ui.includes('document.body.style.overflow = "hidden"'));
  assert.ok(ui.includes("previousActive ?? triggerRef.current"));
});

test("assistant is added once through the canonical theme renderer and not to previews", () => {
  assert.ok(renderer.includes("<GuestMenuAssistant menu={menu} />"));
  assert.ok(renderer.includes("{!preview && <GuestMenuAssistant menu={menu} />}") );
});


test("guest assistant never surfaces a provider failure when grounded fallback data can answer", () => {
  assert.match(source, /if \(!result\.ok\)/);
  assert.match(source, /const fallback = fallbackGuestAnswer/);
  assert.match(source, /return \{ ok: true, data: fallback \}/);
});


test("shared guest fallback is pure, grounded, and usable by server and client", () => {
  for (const expected of [
    "export function fallbackGuestAnswer",
    "isRecommendation",
    "isAvailability",
    "isPrice",
    "isAllergen",
    "productIds",
    "isFeatured",
    "isAvailable",
    "I cannot confirm that any allergen is absent",
  ]) {
    assert.ok(fallback.includes(expected), `Missing shared fallback contract: ${expected}`);
  }
  assert.ok(!fallback.includes("getSql"));
  assert.ok(!fallback.includes("process.env"));
});

test("client assistant never surfaces AI failure when public menu data can answer", () => {
  assert.match(ui, /fallbackGuestAnswer\(trimmed, menu\.products\)/);
  assert.match(ui, /if \(!result\.ok\)/);
  assert.match(ui, /setAnswer\(\{ ar: fallback\.answerAr, en: fallback\.answerEn, productIds: fallback\.productIds \}\)/);
  assert.ok(!ui.includes("setError(result.error)"));
  assert.match(ui, /catch \{/);
});


const core = fs.readFileSync(new URL("../src/lib/menu/ai-core.ts", import.meta.url), "utf8");
const sessionServer = fs.readFileSync(new URL("../src/lib/menu/session.server.ts", import.meta.url), "utf8");
const dailyMigration = fs.readFileSync(new URL("../migrations/20260926010000_ai_guest_assistant_daily_limits.sql", import.meta.url), "utf8");

test("guest assistant rate-limit identity is server-issued and cannot be reset by rotating client sessionId", () => {
  assert.ok(source.includes("resolveAnonymousSession(sql, tenantId)"));
  assert.ok(source.includes("userId: `guest-session:${anonymousSession.id}`"));
  assert.ok(source.includes("rateLimitIp: getRequestHeader(\"x-forwarded-for\")?.split(\",\")[0]?.trim() ?? undefined"));
  assert.ok(!source.includes("data.sessionId"));
  assert.ok(!ui.includes("getGuestSessionId"));
  assert.ok(!ui.includes("sessionId:"));
  assert.match(sessionServer, /setCookie\(ANONYMOUS_SESSION_COOKIE/);
  assert.match(sessionServer, /httpOnly: true/);
  assert.match(sessionServer, /secure: true/);
  assert.match(sessionServer, /sameSite: "lax"/);
  assert.match(sessionServer, /tenant_id = \$\{tenantId\}/);
});

test("guest assistant daily tenant circuit breaker is configurable, atomic, and runs before providers", () => {
  assert.match(core, /AI_GUEST_ASSISTANT_REQUESTS_PER_TENANT_PER_DAY/);
  assert.match(core, /AI_DEFAULT_GUEST_ASSISTANT_DAILY_LIMIT = 500/);
  assert.match(core, /AI_DEFAULT_GUEST_ASSISTANT_IP_RATE_LIMIT_PER_MINUTE = 60/);
  assert.match(core, /createHash\("sha256"\)/);
  assert.ok(core.includes("guest-ip:${normalizedIpKey}"));
  assert.match(core, /operation !== "guest\.menu_assistant"/);
  assert.match(core, /ai_guest_assistant_daily_limits/);
  assert.match(core, /where ai_guest_assistant_daily_limits\.request_count < \$\{dailyLimit\}/);
  assert.match(core, /return Number\(dailyRows\[0\]\?\.request_count \?\? dailyLimit \+ 1\) <= dailyLimit/);
  assert.match(core, /consumeRateLimit\(args\.sql, args\.tenantId, args\.userId, args\.operation\)/);
  assert.ok(core.indexOf("consumeRateLimit(args.sql") < core.indexOf("callStructuredProvider"));
  assert.match(dailyMigration, /primary key \(tenant_id, window_start\)/);
  assert.match(dailyMigration, /alter table menu_v3\.ai_guest_assistant_daily_limits enable row level security/);
  assert.match(dailyMigration, /revoke all on table menu_v3\.ai_guest_assistant_daily_limits from public, anon, authenticated/);
});

test("daily cap denial stays inside the existing grounded guest fallback path", () => {
  assert.match(source, /if \(!result\.ok\)/);
  assert.match(source, /const fallback = fallbackGuestAnswer\(data\.question, products\)/);
  assert.match(source, /return \{ ok: true, data: fallback \}/);
});
