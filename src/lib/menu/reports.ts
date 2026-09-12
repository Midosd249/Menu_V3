import type { OwnerAnalytics, StudioSnapshot } from "@/lib/menu/types";
import { buildMenuGrowthAdvisor, type MenuGrowthAdvisor } from "@/lib/menu/growth-advisor";
import { buildMenuIntelligence, type MenuIntelligence } from "@/lib/menu/intelligence";

export type MenuReportMetric = {
  key: string;
  labelAr: string;
  labelEn: string;
  value: number;
  contextAr?: string;
  contextEn?: string;
};

export type MenuReport = {
  generatedAt: string;
  rangeDays: number;
  tenantNameAr: string;
  tenantNameEn: string;
  health: MenuIntelligence;
  advisor: MenuGrowthAdvisor;
  analytics: OwnerAnalytics;
  availableProducts: number;
  totalProducts: number;
  categories: number;
  missingImages: number;
  missingEnglish: number;
  missingDescriptions: number;
  unavailableProducts: number;
  uncategorizedProducts: number;
  readiness: number;
  metrics: MenuReportMetric[];
};

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function buildContentReadiness(snapshot: StudioSnapshot) {
  const products = snapshot.products;
  if (!products.length) return 100;

  let checks = 0;
  let passed = 0;
  for (const product of products) {
    checks += 3;
    if (product.imageUrl.trim()) passed += 1;
    if (product.descriptionAr.trim()) passed += 1;
    if (product.nameEn.trim() && product.descriptionEn.trim()) passed += 1;
  }
  return clamp(Math.round((passed / checks) * 100));
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
  const unavailableProducts = totalProducts - availableProducts;
  const uncategorizedProducts = products.filter((p) => !p.categoryId).length;
  const readiness = buildContentReadiness(snapshot);

  const metrics: MenuReportMetric[] = [
    { key: "visits", labelAr: "الزيارات", labelEn: "Visits", value: analytics.visits },
    { key: "sessions", labelAr: "الجلسات", labelEn: "Sessions", value: analytics.uniqueSessions },
    { key: "product-views", labelAr: "مشاهدات المنتجات", labelEn: "Product views", value: analytics.productViews },
    { key: "qr-scans", labelAr: "مسح QR", labelEn: "QR scans", value: analytics.qrScans },
    { key: "whatsapp", labelAr: "نقرات واتساب", labelEn: "WhatsApp clicks", value: analytics.whatsappClicks },
    { key: "available", labelAr: "الأصناف المتاحة", labelEn: "Available products", value: availableProducts, contextAr: `من أصل ${totalProducts}`, contextEn: `of ${totalProducts}` },
  ];

  return {
    generatedAt,
    rangeDays: analytics.rangeDays,
    tenantNameAr: snapshot.tenant.nameAr,
    tenantNameEn: snapshot.tenant.nameEn,
    health,
    advisor,
    analytics,
    availableProducts,
    totalProducts,
    categories: snapshot.categories.length,
    missingImages,
    missingEnglish,
    missingDescriptions,
    unavailableProducts,
    uncategorizedProducts,
    readiness,
    metrics,
  };
}

export function reportToText(report: MenuReport, lang: "ar" | "en"): string {
  const name = lang === "ar" ? report.tenantNameAr : report.tenantNameEn || report.tenantNameAr;
  const insights = report.advisor.insights.slice(0, 4);
  const recommendations = report.advisor.actions.slice(0, 6);
  const lines = lang === "ar"
    ? [
        `تقرير Menu V3 — ${name}`,
        `الفترة: آخر ${report.rangeDays} أيام`,
        "",
        "ملخص تنفيذي",
        `صحة القائمة: ${report.health.score}/100`,
        `جاهزية المحتوى: ${report.readiness}/100`,
        `الأصناف المتاحة: ${report.availableProducts}/${report.totalProducts}`,
        "",
        "مؤشرات مسجلة",
        `الزيارات: ${report.analytics.visits}`,
        `الجلسات: ${report.analytics.uniqueSessions}`,
        `مشاهدات المنتجات: ${report.analytics.productViews}`,
        `مسح QR: ${report.analytics.qrScans}`,
        `نقرات واتساب: ${report.analytics.whatsappClicks}`,
        "",
        "حالة المحتوى",
        `صور ناقصة: ${report.missingImages}`,
        `وصف عربي ناقص: ${report.missingDescriptions}`,
        `محتوى إنجليزي ناقص: ${report.missingEnglish}`,
        `أصناف غير متاحة: ${report.unavailableProducts}`,
        `أصناف بلا تصنيف: ${report.uncategorizedProducts}`,
        "",
        "إشارات من البيانات",
        ...(insights.length ? insights.map((i) => `• ${i.titleAr}: ${i.evidenceAr} ${i.interpretationAr}`) : ["• لا توجد إشارة تحليلية كافية بعد."]),
        "",
        "التوصيات العملية",
        ...(recommendations.length ? recommendations.map((a, i) => `${i + 1}. ${a.titleAr} — ${a.reasonAr}`) : ["لا توجد توصيات قابلة للتنفيذ حاليًا."]),
        "",
        "ملاحظة البيانات: هذا التقرير يعتمد فقط على البيانات المسجلة والمتاحة في الحساب. المؤشرات السلوكية ليست إثباتًا للمبيعات أو الأرباح أو رضا العملاء.",
      ]
    : [
        `Menu V3 Report — ${name}`,
        `Range: last ${report.rangeDays} days`,
        "",
        "Executive summary",
        `Menu health: ${report.health.score}/100`,
        `Content readiness: ${report.readiness}/100`,
        `Available products: ${report.availableProducts}/${report.totalProducts}`,
        "",
        "Recorded metrics",
        `Visits: ${report.analytics.visits}`,
        `Sessions: ${report.analytics.uniqueSessions}`,
        `Product views: ${report.analytics.productViews}`,
        `QR scans: ${report.analytics.qrScans}`,
        `WhatsApp clicks: ${report.analytics.whatsappClicks}`,
        "",
        "Content status",
        `Missing images: ${report.missingImages}`,
        `Missing Arabic descriptions: ${report.missingDescriptions}`,
        `Missing English content: ${report.missingEnglish}`,
        `Unavailable products: ${report.unavailableProducts}`,
        `Uncategorized products: ${report.uncategorizedProducts}`,
        "",
        "Data signals",
        ...(insights.length ? insights.map((i) => `• ${i.titleEn}: ${i.evidenceEn} ${i.interpretationEn}`) : ["• There is not enough analytical signal yet."]),
        "",
        "Actionable recommendations",
        ...(recommendations.length ? recommendations.map((a, i) => `${i + 1}. ${a.titleEn} — ${a.reasonEn}`) : ["There are no actionable recommendations right now."]),
        "",
        "Data note: this report uses only recorded account data. Behavioral signals do not prove sales, profitability, or customer satisfaction.",
      ];
  return lines.join("\n");
}
