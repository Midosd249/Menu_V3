import type { OwnerAnalytics, Product, StudioSnapshot } from "./types";

export type IntelligenceSeverity = "high" | "medium" | "low";
export type IntelligenceIssue = {
  key: string;
  severity: IntelligenceSeverity;
  titleAr: string;
  titleEn: string;
  detailAr: string;
  detailEn: string;
  href: string;
};

export type MenuIntelligence = {
  score: number;
  contentScore: number;
  presentationScore: number;
  operationsScore: number;
  analyticsStatus: "baseline" | "active";
  headlineAr: string;
  headlineEn: string;
  briefingAr: string[];
  briefingEn: string[];
  issues: IntelligenceIssue[];
  leadingProduct: OwnerAnalytics["topProducts"][number] | null;
  leadingCategory: OwnerAnalytics["byCategory"][number] | null;
};

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function percentage(ok: number, total: number) {
  return total === 0 ? 100 : Math.round((ok / total) * 100);
}

function uniqueNames(products: Product[]) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const product of products) {
    const key = product.nameAr.trim().toLocaleLowerCase();
    if (!key) continue;
    if (seen.has(key)) duplicates.add(product.nameAr.trim());
    seen.add(key);
  }
  return [...duplicates];
}

export function buildMenuIntelligence(snapshot: StudioSnapshot, analytics: OwnerAnalytics | null): MenuIntelligence {
  const { products, categories, branches, tenant } = snapshot;
  const available = products.filter((product) => product.isAvailable);
  const issues: IntelligenceIssue[] = [];

  const contentChecks = products.flatMap((product) => [
    Boolean(product.nameAr.trim()),
    Boolean(product.nameEn.trim()),
    Boolean(product.descriptionAr.trim()),
    Boolean(product.descriptionEn.trim()),
  ]);
  const presentationChecks = products.flatMap((product) => [
    Boolean(product.imageUrl.trim()),
    Boolean(product.categoryId),
  ]);
  const contentScore = percentage(contentChecks.filter(Boolean).length, contentChecks.length);
  const presentationScore = percentage(presentationChecks.filter(Boolean).length, presentationChecks.length);
  const operationsScore = percentage(
    [tenant.isPublished, branches.some((branch) => branch.isActive), available.length > 0, categories.some((category) => category.isActive)].filter(Boolean).length,
    4,
  );

  for (const product of products) {
    const name = product.nameAr || product.nameEn || "الصنف";
    if (!product.nameEn.trim()) {
      issues.push({ key: `english-name:${product.id}`, severity: "medium", titleAr: `${name}: الاسم الإنجليزي ناقص`, titleEn: `${name}: English name is missing`, detailAr: "أضف اسمًا إنجليزيًا حتى تبقى تجربة القائمة ثنائية اللغة مكتملة.", detailEn: "Add an English name to keep the bilingual menu complete.", href: "/studio/menu" });
    }
    if (!product.descriptionAr.trim() || !product.descriptionEn.trim()) {
      issues.push({ key: `description:${product.id}`, severity: "medium", titleAr: `${name}: الوصف يحتاج استكمالًا`, titleEn: `${name}: description needs completion`, detailAr: "الوصف الناقص يقلل وضوح الصنف عند التصفح.", detailEn: "Incomplete descriptions reduce clarity while guests browse.", href: "/studio/menu" });
    }
    if (!product.imageUrl.trim()) {
      issues.push({ key: `image:${product.id}`, severity: "low", titleAr: `${name}: لا توجد صورة`, titleEn: `${name}: no image`, detailAr: "الصورة ليست إلزامية، لكنها فرصة لتحسين عرض الصنف.", detailEn: "An image is not mandatory, but it is an opportunity to improve presentation.", href: "/studio/menu" });
    }
    if (!product.categoryId) {
      issues.push({ key: `category:${product.id}`, severity: "high", titleAr: `${name}: بدون تصنيف`, titleEn: `${name}: uncategorized`, detailAr: "ضع الصنف داخل تصنيف واضح حتى لا يضيع في القائمة.", detailEn: "Place the item in a clear category so guests can find it.", href: "/studio/menu" });
    }
    if (!product.isAvailable) {
      issues.push({ key: `availability:${product.id}`, severity: "low", titleAr: `${name}: غير متاح`, titleEn: `${name}: unavailable`, detailAr: "تمت الإبقاء عليه غير متاح؛ راجع الحالة إذا كان يفترض أن يظهر للضيوف.", detailEn: "It is currently unavailable; review the status if guests should see it.", href: "/studio/menu" });
    }
  }

  for (const duplicate of uniqueNames(products)) {
    issues.push({ key: `duplicate:${duplicate}`, severity: "high", titleAr: `اسم مكرر: ${duplicate}`, titleEn: `Duplicate name: ${duplicate}`, detailAr: "راجع الأصناف المتشابهة وتأكد أنها مقصودة وليست نسخة مكررة.", detailEn: "Review similar items and confirm the duplicate is intentional.", href: "/studio/menu" });
  }

  if (!tenant.isPublished) {
    issues.unshift({ key: "publish", severity: "high", titleAr: "القائمة غير منشورة", titleEn: "Menu is not published", detailAr: "لن يتمكن الضيوف من رؤية القائمة العامة حتى يتم نشرها.", detailEn: "Guests cannot see the public menu until it is published.", href: "/studio/settings" });
  }
  if (branches.every((branch) => !branch.isActive)) {
    issues.unshift({ key: "branch", severity: "high", titleAr: "لا يوجد فرع نشط", titleEn: "No active branch", detailAr: "يجب أن يكون هناك فرع نشط لتشغيل وجهة القائمة العامة.", detailEn: "An active branch is required for a usable public-menu destination.", href: "/studio/branches" });
  }

  const score = Math.round(contentScore * 0.4 + presentationScore * 0.2 + operationsScore * 0.4);
  const analyticsStatus = analytics && analytics.uniqueSessions > 0 ? "active" : "baseline";
  const leadingProduct = analytics?.topProducts[0] ?? null;
  const leadingCategory = analytics?.byCategory[0] ?? null;
  const briefingAr: string[] = [];
  const briefingEn: string[] = [];

  if (issues.length === 0) {
    briefingAr.push("لا توجد مشكلات حرجة في فحص القائمة الحالي.");
    briefingEn.push("No critical issues were found in the current menu check.");
  } else {
    const high = issues.filter((issue) => issue.severity === "high").length;
    const medium = issues.filter((issue) => issue.severity === "medium").length;
    if (high > 0) {
      briefingAr.push(`لديك ${high} ملاحظة عالية الأولوية تحتاج مراجعة.`);
      briefingEn.push(`${high} high-priority item${high === 1 ? "" : "s"} need review.`);
    }
    if (medium > 0) {
      briefingAr.push(`هناك ${medium} ملاحظة متوسطة لتحسين المحتوى.`);
      briefingEn.push(`${medium} medium-priority content improvement${medium === 1 ? "" : "s"} are available.`);
    }
  }
  if (leadingProduct) {
    briefingAr.push(`الأكثر مشاهدة: ${leadingProduct.nameAr} (${leadingProduct.count} مشاهدة).`);
    briefingEn.push(`Most viewed: ${leadingProduct.nameEn || leadingProduct.nameAr} (${leadingProduct.count} views).`);
  } else {
    briefingAr.push("لا توجد بيانات مشاهدة كافية بعد؛ سيصبح الملخص أدق مع أول زيارات للقائمة.");
    briefingEn.push("There is not enough view data yet; the briefing will become more useful after menu visits.");
  }
  if (available.length === 0) {
    briefingAr.push("لا توجد أصناف متاحة حاليًا.");
    briefingEn.push("No items are currently available.");
  } else {
    briefingAr.push(`${available.length} صنف متاح من أصل ${products.length}.`);
    briefingEn.push(`${available.length} of ${products.length} items are currently available.`);
  }

  const headlineAr = score >= 90 ? "قائمتك في حالة ممتازة" : score >= 75 ? "القائمة جيدة وتحتاج بعض التحسينات" : "هناك فرص واضحة لتحسين القائمة";
  const headlineEn = score >= 90 ? "Your menu is in excellent shape" : score >= 75 ? "Your menu is healthy with a few opportunities" : "There are clear opportunities to improve your menu";

  return {
    score: clamp(score),
    contentScore,
    presentationScore,
    operationsScore,
    analyticsStatus,
    headlineAr,
    headlineEn,
    briefingAr,
    briefingEn,
    issues: issues.slice(0, 20),
    leadingProduct,
    leadingCategory,
  };
}
