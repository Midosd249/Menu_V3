import type { OwnerAnalytics } from "./types";

export type GrowthRatio = { numerator: number; denominator: number; per100: number };

export type GrowthMetrics = {
  productInterest: GrowthRatio;
  whatsappIntent: GrowthRatio;
  qrVisitRatio: GrowthRatio;
  averageViewsPerSession: number;
  leadingProduct: OwnerAnalytics["topProducts"][number] | null;
  leadingCategory: OwnerAnalytics["byCategory"][number] | null;
  primaryOpportunity: "discovery" | "conversion" | "content" | "distribution" | "baseline";
};

function ratio(numerator: number, denominator: number): GrowthRatio {
  const safeNumerator = Math.max(0, numerator);
  const safeDenominator = Math.max(0, denominator);
  return {
    numerator: safeNumerator,
    denominator: safeDenominator,
    per100: safeDenominator > 0 ? (safeNumerator / safeDenominator) * 100 : 0,
  };
}

/**
 * Derives directional operating ratios only from server-reported OwnerAnalytics.
 * These are not unique-user conversion rates because the current event stream
 * does not expose a unique-user count for every event type.
 */
export function buildGrowthMetrics(analytics: OwnerAnalytics): GrowthMetrics {
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
    productInterest: ratio(analytics.productViews, analytics.visits),
    whatsappIntent: ratio(analytics.whatsappClicks, analytics.uniqueSessions),
    qrVisitRatio: ratio(analytics.visits, analytics.qrScans),
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
