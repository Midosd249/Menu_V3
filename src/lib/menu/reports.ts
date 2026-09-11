import type { OwnerAnalytics, StudioSnapshot } from "@/lib/menu/types";
import { buildMenuGrowthAdvisor, type MenuGrowthAdvisor } from "@/lib/menu/growth-advisor";
import { buildMenuIntelligence, type MenuIntelligence } from "@/lib/menu/intelligence";

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
  readiness: number;
};

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
  const readiness = totalProducts === 0 ? 100 : Math.round(((totalProducts - missingImages - missingDescriptions) / (totalProducts * 2)) * 100);

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
    readiness: Math.max(0, Math.min(100, readiness)),
  };
}

export function reportToText(report: MenuReport, lang: "ar" | "en"): string {
  const name = lang === "ar" ? report.tenantNameAr : report.tenantNameEn || report.tenantNameAr;
  const lines = lang === "ar"
    ? [
        `تقرير Menu V3 — ${name}`,
        `الفترة: آخر ${report.rangeDays} أيام`,
        "",
        `جاهزية القائمة: ${report.health.score}/100`,
        `الظهور والمحتوى: ${report.readiness}/100`,
        `الزيارات: ${report.analytics.visits}`,
        `مشاهدات المنتجات: ${report.analytics.productViews}`,
        `مسح QR: ${report.analytics.qrScans}`,
        `نقرات واتساب: ${report.analytics.whatsappClicks}`,
        `الأصناف المتاحة: ${report.availableProducts}/${report.totalProducts}`,
        `التصنيفات: ${report.categories}`,
        `صور ناقصة: ${report.missingImages}`,
        `وصف عربي ناقص: ${report.missingDescriptions}`,
        `إنجليزية ناقصة: ${report.missingEnglish}`,
        `أصناف غير متاحة: ${report.unavailableProducts}`,
        "",
        "أهم التوصيات:",
        ...report.advisor.actions.slice(0, 6).map((a, i) => `${i + 1}. ${a.titleAr} — ${a.reasonAr}`),
        "",
        "هذا التقرير يعتمد فقط على البيانات المتاحة في الحساب ولا يمثل وعدًا بالمبيعات أو التحويل.",
      ]
    : [
        `Menu V3 Report — ${name}`,
        `Range: last ${report.rangeDays} days`,
        "",
        `Menu health: ${report.health.score}/100`,
        `Content readiness: ${report.readiness}/100`,
        `Visits: ${report.analytics.visits}`,
        `Product views: ${report.analytics.productViews}`,
        `QR scans: ${report.analytics.qrScans}`,
        `WhatsApp clicks: ${report.analytics.whatsappClicks}`,
        `Available products: ${report.availableProducts}/${report.totalProducts}`,
        `Categories: ${report.categories}`,
        `Missing images: ${report.missingImages}`,
        `Missing Arabic descriptions: ${report.missingDescriptions}`,
        `Missing English content: ${report.missingEnglish}`,
        `Unavailable products: ${report.unavailableProducts}`,
        "",
        "Top recommendations:",
        ...report.advisor.actions.slice(0, 6).map((a, i) => `${i + 1}. ${a.titleEn} — ${a.reasonEn}`),
        "",
        "This report uses only available account data and does not claim sales or conversion outcomes.",
      ];
  return lines.join("\n");
}
