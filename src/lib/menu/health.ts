import type { Branch, Category, MenuHealth, Product, Tenant } from "./types";

export function computeHealth(input: {
  tenant: Tenant;
  branches: Branch[];
  categories: Category[];
  products: Product[];
}): MenuHealth {
  const { tenant, branches, categories, products } = input;
  const available = products.filter((p) => p.isAvailable);
  const withImage = products.filter((p) => p.imageUrl.trim());
  const withEn = products.filter((p) => p.nameEn.trim());
  const featured = products.filter((p) => p.isFeatured);
  const activeBranches = branches.filter((b) => b.isActive);
  const activeCats = categories.filter((c) => c.isActive);

  const checks = [
    { key: "published", ok: tenant.isPublished, labelAr: "المنيو منشور", labelEn: "Menu is published" },
    { key: "whatsapp", ok: Boolean(tenant.whatsapp.trim()), labelAr: "رقم واتساب", labelEn: "WhatsApp number" },
    { key: "branch", ok: activeBranches.length > 0, labelAr: "فرع نشط", labelEn: "Active branch" },
    { key: "categories", ok: activeCats.length >= 2, labelAr: "تصنيفان على الأقل", labelEn: "At least two categories" },
    { key: "products", ok: available.length >= 5, labelAr: "خمسة أصناف متاحة", labelEn: "Five available items" },
    { key: "images", ok: products.length > 0 && withImage.length / products.length >= 0.5, labelAr: "صور لنصف الأصناف على الأقل", labelEn: "Images on at least half of items" },
    { key: "english", ok: products.length > 0 && withEn.length / products.length >= 0.5, labelAr: "أسماء إنجليزية", labelEn: "English names" },
    { key: "featured", ok: featured.length > 0, labelAr: "صنف مميز واحد على الأقل", labelEn: "At least one featured item" },
    { key: "brand", ok: Boolean(tenant.logoUrl || tenant.coverUrl), labelAr: "شعار أو غلاف", labelEn: "Logo or cover" },
  ];

  const score = Math.round((checks.filter((c) => c.ok).length / checks.length) * 100);

  const attention: MenuHealth["attention"] = [];
  if (!tenant.isPublished) {
    attention.push({
      key: "publish",
      severity: "high",
      titleAr: "المنيو ما زال مسودة — الضيوف لن يروه",
      titleEn: "Menu is still a draft — guests cannot see it",
      href: "/studio/settings",
    });
  }
  if (available.length === 0) {
    attention.push({
      key: "items",
      severity: "high",
      titleAr: "لا توجد أصناف متاحة في القائمة",
      titleEn: "No available items on the menu",
      href: "/studio/menu",
    });
  }
  if (!tenant.whatsapp.trim()) {
    attention.push({
      key: "wa",
      severity: "medium",
      titleAr: "أضف واتساب لاستقبال الاستفسارات من الطاولة",
      titleEn: "Add WhatsApp so guests can enquire from the table",
      href: "/studio/brand",
    });
  }
  if (products.length > 0 && withImage.length === 0) {
    attention.push({
      key: "photos",
      severity: "medium",
      titleAr: "لا صور على الأصناف — المنيو يبدو فارغاً",
      titleEn: "No item photos — the menu looks empty",
      href: "/studio/menu",
    });
  }
  if (activeBranches.length === 0) {
    attention.push({
      key: "branch",
      severity: "high",
      titleAr: "أضف فرعاً حتى يعمل رمز QR",
      titleEn: "Add a branch so the QR code has a destination",
      href: "/studio/branches",
    });
  }

  return { score, checks, attention };
}
