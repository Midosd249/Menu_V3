import type { Product, StudioSnapshot } from "./types";
export type MenuProblemSeverity = "high" | "medium" | "low";
export type MenuProblemArea = "publishing" | "content" | "translation" | "visual" | "organization" | "commercial" | "availability";
export type MenuProblem = { key: string; area: MenuProblemArea; severity: MenuProblemSeverity; titleAr: string; titleEn: string; detailAr: string; detailEn: string; evidenceAr: string; evidenceEn: string; href: string; fixKey: string };
const add = (list: MenuProblem[], p: MenuProblem) => { if (!list.some((x) => x.key === p.key)) list.push(p); };
const nameOf = (p: Product) => p.nameAr.trim() || p.nameEn.trim() || "Item";
export function detectMenuProblems(snapshot: StudioSnapshot): MenuProblem[] {
  const { tenant, branches, categories, products, health } = snapshot;
  const problems: MenuProblem[] = [];
  for (const item of health.attention) add(problems, { ...item, area: item.key.startsWith("image") ? "visual" : item.key.startsWith("currency") ? "commercial" : item.key.startsWith("category") ? "organization" : item.key.startsWith("name-en") ? "translation" : "content", detailAr: "هذه الملاحظة مبنية على بيانات القائمة الحالية.", detailEn: "This finding is based on current menu data.", evidenceAr: "تم اكتشافها في الفحص الحالي.", evidenceEn: "Detected by the current menu check.", fixKey: item.key.split(":")[0] });
  if (products.length && health.dimensions.find((d) => d.key === "availability")?.score === 0) add(problems, { key: "availability-all", area: "availability", severity: "high", titleAr: "لا توجد أصناف متاحة", titleEn: "No products are available", detailAr: "راجع حالة التوفر.", detailEn: "Review availability.", evidenceAr: `المتاح: 0 من ${products.length}`, evidenceEn: `Available: 0 of ${products.length}`, href: "/studio/menu", fixKey: "availability" });
  const names = new Map<string, Product[]>();
  for (const p of products) { const k = p.nameAr.trim().toLocaleLowerCase(); if (k) names.set(k, [...(names.get(k) ?? []), p]); }
  for (const group of names.values()) if (group.length > 1) { const p = group[0]; const n = nameOf(p); add(problems, { key: `duplicate:${p.id}`, area: "content", severity: "medium", titleAr: `اسم مكرر: ${n}`, titleEn: `Duplicate name: ${p.nameEn.trim() || n}`, detailAr: "راجع الأسماء المتكررة.", detailEn: "Review repeated names.", evidenceAr: `${group.length} أصناف تحمل الاسم نفسه`, evidenceEn: `${group.length} products share the same name`, href: "/studio/menu", fixKey: "duplicate-names" }); }
  const ids = new Set(categories.map((c) => c.id));
  for (const p of products) {
    const n = nameOf(p);
    if (!p.descriptionAr.trim()) add(problems, { key: `description-ar:${p.id}`, area: "content", severity: "medium", titleAr: `${n}: الوصف العربي ناقص`, titleEn: `${n}: Arabic description is missing`, detailAr: "أضف وصفًا مختصرًا.", detailEn: "Add a concise description.", evidenceAr: "الوصف العربي فارغ", evidenceEn: "Arabic description is empty", href: "/studio/menu", fixKey: "descriptions" });
    if (!p.descriptionEn.trim()) add(problems, { key: `description-en:${p.id}`, area: "translation", severity: "medium", titleAr: `${n}: الوصف الإنجليزي ناقص`, titleEn: `${n}: English description is missing`, detailAr: "أكمل الوصف الإنجليزي.", detailEn: "Complete the English description.", evidenceAr: "الوصف الإنجليزي فارغ", evidenceEn: "English description is empty", href: "/studio/menu", fixKey: "descriptions" });
    if (!p.categoryId || !ids.has(p.categoryId)) add(problems, { key: `category:${p.id}`, area: "organization", severity: "high", titleAr: `${n}: بدون تصنيف صالح`, titleEn: `${n}: no valid category`, detailAr: "اربط الصنف بتصنيف صالح.", detailEn: "Assign the item to a valid category.", evidenceAr: "التصنيف غير صالح", evidenceEn: "Category is missing or invalid", href: "/studio/menu", fixKey: "categories" });
    if (p.currency.trim() !== tenant.currency.trim()) add(problems, { key: `currency:${p.id}`, area: "commercial", severity: "medium", titleAr: `${n}: العملة غير متسقة`, titleEn: `${n}: currency is inconsistent`, detailAr: "وحّد العملة مع إعداد المطعم.", detailEn: "Align the currency with the restaurant setting.", evidenceAr: `${p.currency || "غير محددة"} مقابل ${tenant.currency}`, evidenceEn: `${p.currency || "unspecified"} vs ${tenant.currency}`, href: "/studio/menu", fixKey: "currency" });
  }
  const rank: Record<MenuProblemSeverity, number> = { high: 0, medium: 1, low: 2 };
  problems.sort((a, b) => rank[a.severity] - rank[b.severity] || a.key.localeCompare(b.key));
  return problems.slice(0, 40);
}
