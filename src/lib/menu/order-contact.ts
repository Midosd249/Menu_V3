import type { AdminOrder } from "./orders";
import { normalizePhoneDigits } from "./public-actions.ts";
import type { Lang } from "./types";

export type OrderContact = { digits: string; tel: string; whatsapp: string };

export function buildOrderContact(value: string, country = "SA"): OrderContact | null {
  const raw = value.trim();
  if (!raw) return null;
  const digits = normalizePhoneDigits(raw, country);
  if (!digits) return null;
  const compact = raw.replace(/\D/g, "");
  const hasExplicitCountry = raw.startsWith("+") || raw.startsWith("00");
  const saLocal = country.toUpperCase() === "SA" && /^0?5\d{8}$/.test(compact);
  if (!hasExplicitCountry && !saLocal) return null;
  return { digits, tel: `tel:+${digits}`, whatsapp: `https://wa.me/${digits}` };
}

export function buildOrderWhatsAppMessage(order: AdminOrder, lang: Lang): string {
  const restaurant = order.restaurantName || (lang === "ar" ? "المطعم" : "the restaurant");
  const customer = order.customerName || (lang === "ar" ? "عميل" : "Customer");
  const status = {
    new: { ar: "جديد", en: "New" },
    confirmed: { ar: "مؤكد", en: "Confirmed" },
    preparing: { ar: "قيد التحضير", en: "Preparing" },
    ready: { ar: "جاهز", en: "Ready" },
    completed: { ar: "مكتمل", en: "Completed" },
    cancelled: { ar: "ملغى", en: "Cancelled" },
  }[order.status][lang];
  return lang === "ar"
    ? `مرحباً ${customer}، معك ${restaurant} بخصوص طلبك #${order.orderNumber}. حالة الطلب الحالية: ${status}.`
    : `Hello ${customer}, this is ${restaurant} regarding order #${order.orderNumber}. Current status: ${status}.`;
}

export function buildOrderWhatsAppUrl(order: AdminOrder, lang: Lang): string | null {
  const phone = buildOrderContact(order.customerPhone);
  if (!phone) return null;
  return `${phone.whatsapp}?text=${encodeURIComponent(buildOrderWhatsAppMessage(order, lang))}`;
}
