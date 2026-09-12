import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const source = fs.readFileSync(new URL("../src/lib/menu/guest-assistant.ts", import.meta.url), "utf8");
const ui = fs.readFileSync(new URL("../src/components/guest-menu-assistant.tsx", import.meta.url), "utf8");
const renderer = fs.readFileSync(new URL("../src/components/theme-renderer.tsx", import.meta.url), "utf8");

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
