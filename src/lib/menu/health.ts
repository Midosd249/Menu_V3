import type { Branch, Category, HealthDimension, MenuHealth, Product, Tenant } from "./types";

const pct = (ok: number, total: number) => total === 0 ? 100 : Math.round((ok / total) * 100);
const dim = (key: HealthDimension["key"], score: number, applicable: boolean, labelAr: string, labelEn: string): HealthDimension => ({ key, score: Math.max(0, Math.min(100, score)), applicable, labelAr, labelEn });

export function computeHealth(input: { tenant: Tenant; branches: Branch[]; categories: Category[]; products: Product[] }): MenuHealth {
  const { tenant, branches, categories, products } = input;
  const activeBranches = branches.filter((b) => b.isActive);
  const activeCategories = categories.filter((c) => c.isActive);
  const available = products.filter((p) => p.isAvailable);
  const categoryIds = new Set(categories.map((c) => c.id));
  const checks: MenuHealth["checks"] = [];
  const attention: MenuHealth["attention"] = [];
  const publishing = pct([tenant.isActive, tenant.isPublished, activeBranches.length > 0].filter(Boolean).length, 3);
  const contentValues = products.flatMap((p) => [!!p.nameAr.trim(), !!p.descriptionAr.trim()]);
  const translationValues = products.flatMap((p) => [!!p.nameEn.trim(), !!p.descriptionEn.trim()]);
  const content = pct(contentValues.filter(Boolean).length, contentValues.length);
  const translation = pct(translationValues.filter(Boolean).length, translationValues.length);
  const visual = products.length ? pct(products.filter((p) => !!p.imageUrl.trim()).length, products.length) : 0;
  const organization = products.length ? pct(products.filter((p) => p.categoryId !== null && categoryIds.has(p.categoryId)).length, products.length) : 0;
  const commercial = products.length ? pct(products.filter((p) => Number.isFinite(p.price) && p.price >= 0 && p.currency.trim() === tenant.currency.trim()).length, products.length) : 0;
  const availability = products.length ? pct(available.length, products.length) : 0;
  const dimensions: HealthDimension[] = [
    dim("publishing", publishing, true, "النشر والتشغيل", "Publishing & operation"),
    dim("content", content, products.length > 0, "المحتوى", "Content"),
    dim("translation", translation, products.length > 0, "الترجمة", "Translation"),
    dim("visual", visual, products.length > 0, "العرض البصري", "Visual presentation"),
    dim("organization", organization, products.length > 0, "تنظيم الأصناف", "Organization"),
    dim("commercial", commercial, products.length > 0, "البيانات التجارية", "Commercial data"),
    dim("availability", availability, products.length > 0, "التوفر", "Availability"),
  ];
  checks.push(
    { key: "published", ok: tenant.isPublished, labelAr: "المنيو منشور", labelEn: "Menu is published" },
    { key: "active-tenant", ok: tenant.isActive, labelAr: "المطعم نشط", labelEn: "Restaurant is active" },
    { key: "branch", ok: activeBranches.length > 0, labelAr: "يوجد فرع نشط", labelEn: "Active branch exists" },
    { key: "categories", ok: activeCategories.length > 0, labelAr: "يوجد تصنيف نشط", labelEn: "Active category exists" },
    { key: "products", ok: products.length > 0, labelAr: "يوجد صنف", labelEn: "Products exist" },
    { key: "names-ar", ok: products.length > 0 && products.every((p) => !!p.nameAr.trim()), labelAr: "كل الأصناف لها أسماء عربية", labelEn: "All products have Arabic names" },
    { key: "names-en", ok: products.length > 0 && products.every((p) => !!p.nameEn.trim()), labelAr: "كل الأصناف لها أسماء إنجليزية", labelEn: "All products have English names" },
    { key: "categories-assigned", ok: products.length > 0 && products.every((p) => p.categoryId !== null && categoryIds.has(p.categoryId)), labelAr: "كل الأصناف مصنفة", labelEn: "All products are categorized" },
    { key: "currency", ok: products.length > 0 && products.every((p) => p.currency.trim() === tenant.currency.trim()), labelAr: "العملة متسقة", labelEn: "Currency is consistent" },
  );
  if (!tenant.isPublished) attention.push({ key: "publish", severity: "high", titleAr: "المنيو غير منشور", titleEn: "Menu is not published", href: "/studio/settings" });
  if (!tenant.isActive) attention.push({ key: "tenant-active", severity: "high", titleAr: "المطعم غير نشط", titleEn: "Restaurant is inactive", href: "/studio/settings" });
  if (!activeBranches.length) attention.push({ key: "branch", severity: "high", titleAr: "لا يوجد فرع نشط", titleEn: "No active branch", href: "/studio/branches" });
  if (!activeCategories.length) attention.push({ key: "categories", severity: "high", titleAr: "لا يوجد تصنيف نشط", titleEn: "No active category", href: "/studio/menu" });
  if (!products.length) attention.push({ key: "products", severity: "high", titleAr: "لا توجد أصناف بعد", titleEn: "No products yet", href: "/studio/menu" });
  for (const p of products) {
    const name = p.nameAr.trim() || p.nameEn.trim() || "الصنف";
    if (!p.nameAr.trim()) attention.push({ key: `name-ar:${p.id}`, severity: "high", titleAr: `${name}: الاسم العربي ناقص`, titleEn: `${name}: Arabic name is missing`, href: "/studio/menu" });
    if (!p.nameEn.trim()) attention.push({ key: `name-en:${p.id}`, severity: "medium", titleAr: `${name}: الاسم الإنجليزي ناقص`, titleEn: `${name}: English name is missing`, href: "/studio/menu" });
    if (!p.imageUrl.trim()) attention.push({ key: `image:${p.id}`, severity: "low", titleAr: `${name}: لا توجد صورة`, titleEn: `${name}: no image`, href: "/studio/menu" });
    if (!p.categoryId || !categoryIds.has(p.categoryId)) attention.push({ key: `category:${p.id}`, severity: "high", titleAr: `${name}: بدون تصنيف صالح`, titleEn: `${name}: no valid category`, href: "/studio/menu" });
    if (p.currency.trim() !== tenant.currency.trim()) attention.push({ key: `currency:${p.id}`, severity: "medium", titleAr: `${name}: العملة لا تطابق إعداد المطعم`, titleEn: `${name}: currency differs from restaurant settings`, href: "/studio/menu" });
  }
  const applicable = dimensions.filter((d) => d.applicable);
  const score = applicable.length ? Math.round(applicable.reduce((sum, d) => sum + d.score, 0) / applicable.length) : publishing;
  return { score, dimensions, checks, attention: attention.slice(0, 40) };
}
