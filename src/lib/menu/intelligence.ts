import type { OwnerAnalytics, StudioSnapshot } from "./types";

export type IntelligenceSeverity = "high" | "medium" | "low";
export type IntelligenceIssue = { key: string; severity: IntelligenceSeverity; titleAr: string; titleEn: string; detailAr: string; detailEn: string; href: string };
export type MenuIntelligence = { score: number; contentScore: number; presentationScore: number; operationsScore: number; analyticsStatus: "baseline" | "active"; headlineAr: string; headlineEn: string; briefingAr: string[]; briefingEn: string[]; issues: IntelligenceIssue[]; leadingProduct: OwnerAnalytics["topProducts"][number] | null; leadingCategory: OwnerAnalytics["byCategory"][number] | null };

export function buildMenuIntelligence(snapshot: StudioSnapshot, analytics: OwnerAnalytics | null): MenuIntelligence {
  const { products, health } = snapshot;
  const scoreOf = (key: "content" | "translation" | "visual" | "organization" | "publishing" | "availability") => health.dimensions.find((d) => d.key === key)?.score ?? 0;
  const contentScore = Math.round((scoreOf("content") + scoreOf("translation")) / 2);
  const presentationScore = scoreOf("visual");
  const operationsScore = Math.round((scoreOf("publishing") + scoreOf("organization") + scoreOf("availability")) / 3);
  const issues: IntelligenceIssue[] = health.attention.map((item) => ({
    key: item.key,
    severity: item.severity,
    titleAr: item.titleAr,
    titleEn: item.titleEn,
    detailAr: "راجع هذه الملاحظة من مصدر بيانات القائمة الحالي.",
    detailEn: "Review this finding from the current menu data.",
    href: item.href,
  }));
  const analyticsStatus = analytics && analytics.uniqueSessions > 0 ? "active" : "baseline";
  const leadingProduct = analytics?.topProducts[0] ?? null;
  const leadingCategory = analytics?.byCategory[0] ?? null;
  const briefingAr: string[] = [];
  const briefingEn: string[] = [];
  const high = issues.filter((i) => i.severity === "high").length;
  const medium = issues.filter((i) => i.severity === "medium").length;
  if (!issues.length) {
    briefingAr.push("لا توجد ملاحظات تحتاج إجراءً في الفحص الحالي.");
    briefingEn.push("No actionable findings were detected in the current check.");
  } else {
    if (high) { briefingAr.push(`لديك ${high} ملاحظة عالية الأولوية تحتاج مراجعة.`); briefingEn.push(`${high} high-priority finding${high === 1 ? "" : "s"} need review.`); }
    if (medium) { briefingAr.push(`هناك ${medium} ملاحظة متوسطة للتحسين.`); briefingEn.push(`${medium} medium-priority improvement${medium === 1 ? "" : "s"} available.`); }
  }
  if (leadingProduct) {
    briefingAr.push(`الأكثر مشاهدة: ${leadingProduct.nameAr} (${leadingProduct.count} مشاهدة).`);
    briefingEn.push(`Most viewed: ${leadingProduct.nameEn || leadingProduct.nameAr} (${leadingProduct.count} views).`);
  } else {
    briefingAr.push("لا توجد بيانات مشاهدة كافية بعد؛ سيصبح هذا القسم أدق مع زيارات القائمة.");
    briefingEn.push("There is not enough view data yet; this section becomes more useful after menu visits.");
  }
  const available = products.filter((p) => p.isAvailable).length;
  briefingAr.push(products.length ? `${available} صنف متاح من أصل ${products.length}.` : "لا توجد أصناف حاليًا.");
  briefingEn.push(products.length ? `${available} of ${products.length} items are currently available.` : "There are no products yet.");
  const score = health.score;
  return {
    score,
    contentScore,
    presentationScore,
    operationsScore,
    analyticsStatus,
    headlineAr: score >= 90 ? "قائمتك في حالة ممتازة" : score >= 75 ? "القائمة جيدة وتحتاج بعض التحسينات" : "هناك فرص واضحة لتحسين القائمة",
    headlineEn: score >= 90 ? "Your menu is in excellent shape" : score >= 75 ? "Your menu is healthy with a few opportunities" : "There are clear opportunities to improve your menu",
    briefingAr,
    briefingEn,
    issues: issues.slice(0, 20),
    leadingProduct,
    leadingCategory,
  };
}
