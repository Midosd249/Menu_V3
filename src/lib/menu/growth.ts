import type { OwnerAnalytics } from "./types";

export type GrowthRate = { numerator: number; denominator: number; percent: number };

export type GrowthMetrics = {
  engagementRate: GrowthRate;
  productInterestRate: GrowthRate;
  whatsappRate: GrowthRate;
  qrToVisitRate: GrowthRate;
  averageViewsPerSession: number;
  leadingProduct: OwnerAnalytics["topProducts"][number] | null;
  leadingCategory: OwnerAnalytics["byCategory"][number] | null;
  primaryOpportunity: "discovery" | "conversion" | "content" | "distribution" | "baseline";
};

function rate(numerator: number, denominator: number): GrowthRate {
  const safeNumerator = Math.max(0, numerator);
  const safeDenominator = Math.max(0, denominator);
  return {
    numerator: safeNumerator,
    denominator: safeDenominator,
    percent: safeDenominator > 0 ? Math.min(100, (safeNumerator / safeDenominator) * 100) : 0,
  };
}

/**
 * Derives decision metrics only from server-reported OwnerAnalytics.
 * It never invents a denominator when the source data is missing.
 */
export function buildGrowthMetrics(analytics: OwnerAnalytics): GrowthMetrics {
  const engagedSessions = analytics.productViews > 0
    ? Math.min(analytics.uniqueSessions, analytics.productViews)
    : 0;
  const primaryOpportunity = analytics.uniqueSessions === 0
    ? "baseline"
    : analytics.productViews === 0
      ? "discovery"
      : analytics.whatsappClicks === 0
        ? "conversion"
        : analytics.topProducts.length === 0
          ? "content"
          : "distribution";

  return {
    engagementRate: rate(engagedSessions, analytics.uniqueSessions),
    productInterestRate: rate(analytics.productViews, analytics.visits),
    whatsappRate: rate(analytics.whatsappClicks, analytics.uniqueSessions),
    qrToVisitRate: rate(analytics.visits, analytics.qrScans),
    averageViewsPerSession: analytics.uniqueSessions > 0
      ? Number((analytics.productViews / analytics.uniqueSessions).toFixed(1))
      : 0,
    leadingProduct: analytics.topProducts[0] ?? null,
    leadingCategory: analytics.byCategory[0] ?? null,
    primaryOpportunity,
  };
}

export const GROWTH_EVENT_CONTRACT = [
  { event: "visit", purpose: "menu entry", uniqueKey: "tenant + session + 30m window" },
  { event: "qr_scan", purpose: "QR acquisition", uniqueKey: "tenant + session + 30m window" },
  { event: "product_view", purpose: "product interest", uniqueKey: "event" },
  { event: "whatsapp", purpose: "high-intent contact", uniqueKey: "event" },
] as const;
