import type { Branch, Category, MenuHealth, Product, Tenant } from "./types";

export function computeHealth(input: { tenant: Tenant; branches: Branch[]; categories: Category[]; products: Product[] }): MenuHealth {
  const { tenant, branches, categories, products } = input;
  const activeBranches = branches.filter((b) => b.isActive);
  const activeCats = categories.filter((c) => c.isActive);
  const available = products.filter((p) => p.isAvailable);
  const withImage = products.filter((p) => p.imageUrl.trim());
  const withEn = products.filter((p) => p.nameEn.trim());
  const checks = [
    { key: "published", ok: tenant.isPublished, labelAr: "المنيو منشور", labelEn: "Menu is published" },
    { key: "branch", ok: activeBranches.length > 0, labelAr: "فرع نشط", labelEn: "Active branch" },
    { key: "categories", ok: activeCats.length > 0, labelAr: "تصنيف نشط", labelEn: "Active category" },
    { key: "products", ok: products.length > 0, labelAr: "يوجد صنف", labelEn: "Products exist" },
    { key: "images", ok: products.length > 0 && withImage.length / products.length >= 0.5, labelAr: "صور لنصف الأصناف", labelEn: "Images on half of items" },
    { key: "english", ok: products.length > 0 && withEn.length / products.length >= 0.5, labelAr: "أسماء إنجليزية", labelEn: "English names" },
  ];
  const score = Math.round((checks.filter((c) => c.ok).length / checks.length) * 100);
  const attention: MenuHealth["attention"] = [];
  if (!tenant.isPublished) attention.push({ key: "publish", severity: "high", titleAr: "المنيو غير منشور", titleEn: "Menu is not published", href: "/studio/settings" });
  if (!available.length) attention.push({ key: "items", severity: "high", titleAr: "لا توجد أصناف متاحة", titleEn: "No available items", href: "/studio/menu" });
  if (!activeBranches.length) attention.push({ key: "branch", severity: "high", titleAr: "لا يوجد فرع نشط", titleEn: "No active branch", href: "/studio/branches" });
  return { score, dimensions: [], checks, attention };
}
