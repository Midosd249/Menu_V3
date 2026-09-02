import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function newId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `id_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function num(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

export function bool(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (value === "t" || value === "true" || value === 1 || value === "1") return true;
  return false;
}

export function slugify(input: string): string {
  const arabicToLatin: Record<string, string> = {
    ا: "a", أ: "a", إ: "i", آ: "a", ء: "", ب: "b", ت: "t", ث: "th", ج: "j",
    ح: "h", خ: "kh", د: "d", ذ: "th", ر: "r", ز: "z", س: "s", ش: "sh",
    ص: "s", ض: "d", ط: "t", ظ: "z", ع: "a", غ: "gh", ف: "f", ق: "q",
    ك: "k", ل: "l", م: "m", ن: "n", ه: "h", و: "w", ي: "y", ى: "a",
    ة: "a", ئ: "y", ؤ: "w",
  };
  const mapped = input
    .trim()
    .toLowerCase()
    .split("")
    .map((ch) => arabicToLatin[ch] ?? ch)
    .join("");
  return mapped
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "menu";
}

export function formatSar(amount: number, lang: "ar" | "en" = "ar"): string {
  const n = Number.isFinite(amount) ? amount : 0;
  const formatted = n.toLocaleString(lang === "ar" ? "ar-SA" : "en-SA", {
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return lang === "ar" ? `${formatted} ر.س` : `SAR ${formatted}`;
}

export function weekdayLabel(day: number, lang: "ar" | "en"): string {
  const ar = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  const en = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return (lang === "ar" ? ar : en)[day] ?? "";
}
