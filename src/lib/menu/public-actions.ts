import type { Branch, Lang, PublicTenant } from "./types";

export type PublicActionKey = "whatsapp" | "location" | "phone" | "website" | "instagram" | "snapchat" | "facebook" | "tiktok";
export type PublicAction = { key: PublicActionKey; href: string; label: string; external?: boolean };

const MAP_HOSTS = new Set(["apple.com", "goo.gl", "google.com", "maps.app.goo.gl", "maps.google.com", "waze.com"]);
const SOCIAL_HOSTS = new Set(["instagram.com", "snapchat.com", "facebook.com", "fb.com", "tiktok.com"]);

function isAllowedHost(hostname: string, allowed: Set<string>): boolean {
  const host = hostname.toLowerCase();
  return [...allowed].some((allowedHost) => host === allowedHost || host.endsWith("." + allowedHost));
}
export function sanitizeExternalUrl(value: string, allowedHosts: Set<string>): string | null {
  const raw = value.trim();
  if (!raw) return null;
  try { const url = new URL(raw); if (url.protocol !== "https:" || url.username || url.password) return null; return isAllowedHost(url.hostname, allowedHosts) ? url.toString() : null; } catch { return null; }
}
export function sanitizeWebsiteUrl(value: string): string | null {
  const raw = value.trim();
  if (!raw) return null;
  try { const url = new URL(raw); if ((url.protocol !== "https:" && url.protocol !== "http:") || url.username || url.password) return null; return url.toString(); } catch { return null; }
}
export function normalizePhoneDigits(value: string, country = "SA"): string | null {
  const raw = value.trim(); if (!raw) return null;
  let digits = raw.replace(/\D/g, ""); if (digits.startsWith("00")) digits = digits.slice(2);
  if (country.toUpperCase() === "SA") { if (digits.startsWith("0") && digits.length === 10) digits = "966" + digits.slice(1); else if (digits.length === 9 && digits.startsWith("5")) digits = "966" + digits; }
  if (digits.length < 8 || digits.length > 15) return null; return digits;
}
export function buildWhatsAppUrl(tenant: PublicTenant, lang: Lang): string | null {
  const digits = normalizePhoneDigits(tenant.whatsapp, tenant.country); if (!digits) return null;
  const restaurant = lang === "ar" ? tenant.nameAr || tenant.nameEn : tenant.nameEn || tenant.nameAr;
  const fallback = lang === "ar" ? "السلام عليكم، أريد الاستفسار عن {restaurant}." : "Hello, I would like to ask about {restaurant}.";
  const message = (tenant.whatsappTemplate || fallback).replaceAll("{restaurant}", restaurant).replaceAll("{product}", lang === "ar" ? "المنيو" : "the menu").trim();
  return "https://wa.me/" + digits + "?text=" + encodeURIComponent(message);
}
export function getPublicActions(tenant: PublicTenant, branch: Branch, lang: Lang): PublicAction[] {
  const label = (ar: string, en: string) => lang === "ar" ? ar : en;
  const actions: Array<PublicAction | null> = [
    (() => { const href = buildWhatsAppUrl(tenant, lang); return href ? { key: "whatsapp", href, label: label("واتساب","WhatsApp"), external: true } : null; })(),
    (() => { const href = sanitizeWebsiteUrl(tenant.websiteUrl ?? ""); return href ? { key: "website", href, label: label("الموقع","Website"), external: true } : null; })(),
    (() => { const href = sanitizeExternalUrl(branch.mapsUrl, MAP_HOSTS); return href ? { key: "location", href, label: label("الموقع","Location"), external: true } : null; })(),
    (() => { const phone = normalizePhoneDigits(branch.phone, tenant.country); return phone ? { key: "phone", href: "tel:+" + phone, label: label("اتصال","Call") } : null; })(),
    ...([["instagram", tenant.instagramUrl],["snapchat", tenant.snapchatUrl ?? ""],["facebook", tenant.facebookUrl ?? ""],["tiktok", tenant.tiktokUrl ?? ""]].map(([key,value]) => { const href = sanitizeExternalUrl(value as string, SOCIAL_HOSTS); return href ? { key: key as PublicActionKey, href, label: key === "instagram" ? "Instagram" : key === "snapchat" ? "Snapchat" : key === "facebook" ? "Facebook" : "TikTok", external: true } : null; })),
  ];
  return actions.filter((action): action is PublicAction => action !== null);
}
