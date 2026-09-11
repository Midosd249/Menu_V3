import type { Product, StudioSnapshot } from "@/lib/menu/types";

export type SaudiReadinessSeverity = "high" | "medium" | "low" | "info";
export type SaudiReadinessStatus = "ready" | "needs_attention" | "not_supported";

export type SaudiReadinessIssue = {
  key: string;
  severity: SaudiReadinessSeverity;
  status: SaudiReadinessStatus;
  titleAr: string;
  titleEn: string;
  detailAr: string;
  detailEn: string;
  affectedCount: number;
  href: string;
};

export type SaudiReadiness = {
  score: number;
  supportedScore: number;
  status: SaudiReadinessStatus;
  summaryAr: string;
  summaryEn: string;
  issues: SaudiReadinessIssue[];
  counts: {
    products: number;
    caloriesReady: number;
    allergensDeclared: number;
    arabicReady: number;
    englishReady: number;
  };
};

const hasText = (value: string | null | undefined) => Boolean(value?.trim());

function productHasAllergenDeclaration(product: Product) {
  return hasText(product.allergens);
}

function productArabicReady(product: Product) {
  return hasText(product.nameAr) && hasText(product.descriptionAr);
}

function productEnglishReady(product: Product) {
  return hasText(product.nameEn) && hasText(product.descriptionEn);
}

export function buildSaudiMenuReadiness(snapshot: StudioSnapshot): SaudiReadiness {
  const products = snapshot.products;
  const caloriesReady = products.filter((product) => product.calories !== null && Number.isFinite(product.calories) && product.calories >= 0).length;
  const allergensDeclared = products.filter(productHasAllergenDeclaration).length;
  const arabicReady = products.filter(productArabicReady).length;
  const englishReady = products.filter(productEnglishReady).length;

  if (products.length === 0) {
    return {
      score: 0,
      supportedScore: 0,
      status: "needs_attention",
      summaryAr: "أضف أصنافًا إلى القائمة لبدء فحص الجاهزية السعودية.",
      summaryEn: "Add menu items to start the Saudi readiness check.",
      issues: [{
        key: "no-products",
        severity: "high",
        status: "needs_attention",
        titleAr: "القائمة لا تحتوي على أصناف",
        titleEn: "No menu items",
        detailAr: "لا يمكن تقييم جاهزية معلومات الأصناف قبل إضافة المنتجات.",
        detailEn: "Item readiness cannot be evaluated until products are added.",
        affectedCount: 0,
        href: "/studio/menu",
      }],
      counts: { products: 0, caloriesReady: 0, allergensDeclared: 0, arabicReady: 0, englishReady: 0 },
    };
  }

  const issues: SaudiReadinessIssue[] = [];
  const caloriesMissing = products.length - caloriesReady;
  const allergensMissing = products.length - allergensDeclared;
  const arabicMissing = products.length - arabicReady;
  const englishMissing = products.length - englishReady;

  if (caloriesMissing > 0) {
    issues.push({
      key: "calories-coverage",
      severity: caloriesMissing === products.length ? "high" : "medium",
      status: "needs_attention",
      titleAr: "السعرات الحرارية غير مكتملة",
      titleEn: "Calories are incomplete",
      detailAr: `${caloriesMissing} من ${products.length} صنفًا لا يحتوي على قيمة سعرات مؤكدة في بيانات القائمة.`,
      detailEn: `${caloriesMissing} of ${products.length} products do not have a confirmed calorie value in the menu data.`,
      affectedCount: caloriesMissing,
      href: "/studio/menu",
    });
  }

  if (allergensMissing > 0) {
    issues.push({
      key: "allergen-coverage",
      severity: allergensMissing === products.length ? "high" : "medium",
      status: "needs_attention",
      titleAr: "بيانات مسببات الحساسية غير مكتملة",
      titleEn: "Allergen declarations are incomplete",
      detailAr: `${allergensMissing} من ${products.length} صنفًا لا يحتوي على إفصاح مسجل لمسببات الحساسية. راجع كل صنف بدل افتراض أنه خالٍ من الحساسية.`,
      detailEn: `${allergensMissing} of ${products.length} products have no recorded allergen declaration. Review each item rather than assuming it is allergen-free.`,
      affectedCount: allergensMissing,
      href: "/studio/menu",
    });
  }

  if (arabicMissing > 0) {
    issues.push({
      key: "arabic-content",
      severity: "medium",
      status: "needs_attention",
      titleAr: "المحتوى العربي غير مكتمل",
      titleEn: "Arabic content is incomplete",
      detailAr: `${arabicMissing} من ${products.length} صنفًا يحتاج إلى اسم ووصف عربي مكتملين.`,
      detailEn: `${arabicMissing} of ${products.length} products need a complete Arabic name and description.`,
      affectedCount: arabicMissing,
      href: "/studio/menu",
    });
  }

  if (englishMissing > 0) {
    issues.push({
      key: "english-content",
      severity: "low",
      status: "needs_attention",
      titleAr: "المحتوى الإنجليزي غير مكتمل",
      titleEn: "English content is incomplete",
      detailAr: `${englishMissing} من ${products.length} صنفًا يحتاج إلى اسم ووصف إنجليزيين مكتملين.`,
      detailEn: `${englishMissing} of ${products.length} products need a complete English name and description.`,
      affectedCount: englishMissing,
      href: "/studio/menu",
    });
  }

  // These newer Saudi menu requirements are deliberately reported as capability gaps,
  // not as missing product values, because the current Product contract does not model
  // caffeine, salt-warning state, or physical-activity equivalence.
  issues.push({
    key: "nutrition-capability",
    severity: "info",
    status: "not_supported",
    titleAr: "معلومات غذائية إضافية غير ممثلة بعد",
    titleEn: "Additional nutrition fields are not modeled yet",
    detailAr: "النظام الحالي لا يخزن حقولًا مستقلة للكافيين، ووسم الوجبات عالية الملح، ووقت النشاط البدني. لذلك لا ندعي الجاهزية لهذه البنود.",
    detailEn: "The current product contract does not store independent caffeine, high-salt labeling, or physical-activity fields, so the system does not claim readiness for those items.",
    affectedCount: products.length,
    href: "/studio/menu",
  });

  const completeness = Math.round(((caloriesReady + allergensDeclared + arabicReady + englishReady) / (products.length * 4)) * 100);
  const supportedScore = Math.max(0, Math.min(100, completeness));
  const status: SaudiReadinessStatus = issues.some((issue) => issue.status === "needs_attention" && issue.severity === "high")
    ? "needs_attention"
    : issues.some((issue) => issue.status === "needs_attention")
      ? "needs_attention"
      : "ready";

  return {
    score: supportedScore,
    supportedScore,
    status,
    summaryAr: status === "ready"
      ? "البيانات الأساسية المدعومة في Menu V3 مكتملة حاليًا. توجد متطلبات إضافية تحتاج حقولًا مخصصة قبل أن نعلن الجاهزية لها."
      : "هناك بيانات أساسية تحتاج مراجعة قبل اعتبار القائمة جاهزة للمعلومات السعودية المدعومة حاليًا.",
    summaryEn: status === "ready"
      ? "The currently supported Menu V3 data checks are complete. Additional requirements need dedicated fields before readiness can be claimed."
      : "Some supported data checks need review before the menu can be considered ready for the currently supported Saudi information.",
    issues,
    counts: { products: products.length, caloriesReady, allergensDeclared, arabicReady, englishReady },
  };
}
