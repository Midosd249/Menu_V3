import type { OwnerAnalytics, StudioSnapshot } from "@/lib/menu/types";
import { buildMenuGrowthAdvisor, type MenuGrowthAdvisor, type VerifiedAnalyticsInsight } from "@/lib/menu/growth-advisor";
import { buildMenuIntelligence, type MenuIntelligence } from "@/lib/menu/intelligence";

export type MenuReport = {
  generatedAt: string;
  rangeDays: number;
  tenantNameAr: string;
  tenantNameEn: string;
  health: MenuIntelligence;
  advisor: MenuGrowthAdvisor;
  verifiedInsights: VerifiedAnalyticsInsight[];
  analytics: OwnerAnalytics;
  availableProducts: number;
  totalProducts: number;
  categories: number;
  missingImages: number;
  missingEnglish: number;
  missingDescriptions: number;
  unavailableProducts: number;
  readiness: number;
  readinessBasis: string[];
};

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function buildContentReadiness(snapshot: StudioSnapshot) {
  const products = snapshot.products;
  if (!products.length) return { score: 0, basis: ["No products are currently configured."] };
  const completeArabic = products.filter((p) => p.nameAr.trim() && p.descriptionAr.trim()).length;
  const completeEnglish = products.filter((p) => p.nameEn.trim() && p.descriptionEn.trim()).length;
  const withImages = products.filter((p) => p.imageUrl.trim()).length;
  const score = clampScore(((completeArabic + completeEnglish + withImages) / (products.length * 3)) * 100);
  return {
    score,
    basis: [
      `${completeArabic}/${products.length} products have complete Arabic naming and description.`,
      `${completeEnglish}/${products.length} products have complete English naming and description.`,
      `${withImages}/${products.length} products have an image.`,
    ],
  };
}

export function buildMenuReport(snapshot: StudioSnapshot, analytics: OwnerAnalytics, generatedAt = new Date().toISOString()): MenuReport {
  const health = buildMenuIntelligence(snapshot, analytics);
  const advisor = buildMenuGrowthAdvisor(snapshot, analytics);
  const products = snapshot.products;
  const totalProducts = products.length;
  const availableProducts = products.filter((p) => p.isAvailable).length;
  const missingImages = products.filter((p) => !p.imageUrl.trim()).length;
  const missingEnglish = products.filter((p) => !p.nameEn.trim() || !p.descriptionEn.trim()).length;
  const missingDescriptions = products.filter((p) => !p.descriptionAr.trim()).length;
  const unavailableProducts = products.filter((p) => !p.isAvailable).length;
  const content = buildContentReadiness(snapshot);

  return {
    generatedAt,
    rangeDays: analytics.rangeDays,
    tenantNameAr: snapshot.tenant.nameAr,
    tenantNameEn: snapshot.tenant.nameEn,
    health,
    advisor,
    verifiedInsights: advisor.insights,
    analytics,
    availableProducts,
    totalProducts,
    categories: snapshot.categories.length,
    missingImages,
    missingEnglish,
    missingDescriptions,
    unavailableProducts,
    readiness: content.score,
    readinessBasis: content.basis,
  };
}

export function reportToText(report: MenuReport, lang: "ar" | "en"): string {
  const ar = lang === "ar";
  const name = ar ? report.tenantNameAr : report.tenantNameEn || report.tenantNameAr;
  const metrics = ar
    ? [`الزيارات: ${report.analytics.visits}`, `الجلسات الفريدة: ${report.analytics.uniqueSessions}`, `مشاهدات المنتجات: ${report.analytics.productViews}`, `مسح QR: ${report.analytics.qrScans}`, `نقرات واتساب: ${report.analytics.whatsappClicks}`, `الأصناف المتاحة: ${report.availableProducts}/${report.totalProducts}`, `التصنيفات: ${report.categories}`]
    : [`Visits: ${report.analytics.visits}`, `Unique sessions: ${report.analytics.uniqueSessions}`, `Product views: ${report.analytics.productViews}`, `QR scans: ${report.analytics.qrScans}`, `WhatsApp clicks: ${report.analytics.whatsappClicks}`, `Available products: ${report.availableProducts}/${report.totalProducts}`, `Categories: ${report.categories}`];
  const findings = ar
    ? [`صور ناقصة: ${report.missingImages}`, `وصف عربي ناقص: ${report.missingDescriptions}`, `محتوى إنجليزي ناقص: ${report.missingEnglish}`, `أصناف غير متاحة: ${report.unavailableProducts}`]
    : [`Missing images: ${report.missingImages}`, `Missing Arabic descriptions: ${report.missingDescriptions}`, `Missing English content: ${report.missingEnglish}`, `Unavailable products: ${report.unavailableProducts}`];
  const insights = report.verifiedInsights.slice(0, 4).map((item, i) => `${i + 1}. ${ar ? item.titleAr : item.titleEn} — ${ar ? item.interpretationAr : item.interpretationEn}`);
  const actions = report.advisor.actions.slice(0, 6).map((item, i) => `${i + 1}. ${ar ? item.titleAr : item.titleEn} — ${ar ? item.reasonAr : item.reasonEn}`);
  return [
    ar ? `تقرير Menu V3 — ${name}` : `Menu V3 Report — ${name}`,
    ar ? `الفترة: آخر ${report.rangeDays} أيام` : `Range: last ${report.rangeDays} days`,
    "",
    ar ? `صحة القائمة: ${report.health.score}/100` : `Menu health: ${report.health.score}/100`,
    ar ? `جاهزية المحتوى: ${report.readiness}/100` : `Content readiness: ${report.readiness}/100`,
    "",
    ar ? "المؤشرات المسجلة:" : "Observed metrics:",
    ...metrics,
    "",
    ar ? "فحص المحتوى:" : "Content check:",
    ...findings,
    "",
    ar ? "الإشارات المؤكدة:" : "Verified insights:",
    ...(insights.length ? insights : [ar ? "لا توجد إشارات كافية في الفترة المحددة." : "There are not enough observed signals for this period."]),
    "",
    ar ? "أهم الإجراءات المقترحة:" : "Priority actions:",
    ...(actions.length ? actions : [ar ? "لا توجد إجراءات ذات أولوية حاليًا." : "There are no priority actions right now."]),
    "",
    ar ? "ملاحظة: يعتمد التقرير على البيانات المسجلة والمتاحة في الحساب فقط، ولا يمثل وعدًا بنتيجة تجارية." : "Note: this report uses only recorded data available to the account and does not promise a business outcome.",
  ].join("\n");
}
