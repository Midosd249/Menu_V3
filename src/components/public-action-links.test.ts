import assert from "node:assert/strict";
import test from "node:test";
import { buildWhatsAppUrl, getPublicActions, normalizePhoneDigits, sanitizeExternalUrl } from "./public-action-links.ts";
import type { Branch, Tenant } from "@/lib/menu/types";

const tenant: Tenant = {
  id: "t1", ownerUserId: "u1", slug: "restaurant", nameAr: "مطعم", nameEn: "Restaurant",
  taglineAr: "", taglineEn: "", logoUrl: "", coverUrl: "", instagramUrl: "https://www.instagram.com/restaurant/",
  whatsapp: "0551234567", whatsappTemplate: "Hello {restaurant} — {product}", primaryColor: "#111", accentColor: "#a2472f",
  themeKey: "editorial", currency: "SAR", city: "Riyadh", country: "SA", isPublished: true, isActive: true,
  createdAt: "", updatedAt: "",
};
const branch: Branch = {
  id: "b1", tenantId: "t1", slug: "main", nameAr: "الفرع الرئيسي", nameEn: "Main branch",
  addressAr: "الرياض", addressEn: "Riyadh", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Riyadh", phone: "0551234567", isActive: true,
};

test("Saudi phone normalization handles local and international forms", () => {
  assert.equal(normalizePhoneDigits("0551234567", "SA"), "966551234567");
  assert.equal(normalizePhoneDigits("+966 55 123 4567", "SA"), "966551234567");
  assert.equal(normalizePhoneDigits("not-a-number", "SA"), null);
});

test("external URL sanitizer allows approved map/social hosts only", () => {
  assert.ok(sanitizeExternalUrl(branch.mapsUrl, new Set(["google.com"])));
  assert.equal(sanitizeExternalUrl("javascript:alert(1)", new Set(["google.com"])), null);
  assert.equal(sanitizeExternalUrl("https://evil.example/", new Set(["google.com"])), null);
});

test("WhatsApp URL is normalized and template values are encoded", () => {
  const url = buildWhatsAppUrl(tenant, "ar");
  assert.ok(url?.startsWith("https://wa.me/966551234567?text="));
  assert.match(url ?? "", /%D9%85%D8%B7%D8%B9%D9%85/);
});

test("actions are data-driven and disappear when destinations are missing or invalid", () => {
  const actions = getPublicActions(tenant, branch, "ar");
  assert.deepEqual(actions.map((action) => action.key), ["whatsapp", "location", "phone", "instagram"]);
  const missing = getPublicActions({ ...tenant, whatsapp: "", instagramUrl: "javascript:alert(1)" }, { ...branch, mapsUrl: "", phone: "" }, "ar");
  assert.deepEqual(missing, []);
});
