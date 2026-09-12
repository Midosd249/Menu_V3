import assert from "node:assert/strict";
import test from "node:test";
import { buildWhatsAppShareUrl } from "./ai-whatsapp.ts";

test("buildWhatsAppShareUrl encodes Arabic, whitespace, and newlines safely", () => {
  const message = "تقرير القائمة\nMenu health: 92/100\nابدأ بالأصناف الناقصة";
  const url = buildWhatsAppShareUrl(message);
  assert.equal(url, `https://wa.me/?text=${encodeURIComponent(message)}`);
  assert.ok(url.includes("%D8"));
  assert.ok(!url.includes("\n"));
});

test("buildWhatsAppShareUrl does not select or invent a recipient", () => {
  const url = buildWhatsAppShareUrl("Hello from Menu V3");
  assert.equal(url, "https://wa.me/?text=Hello%20from%20Menu%20V3");
  assert.ok(!url.match(/wa\.me\/\d/));
});
