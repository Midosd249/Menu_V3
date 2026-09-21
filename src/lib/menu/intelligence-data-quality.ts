import type { OwnerAnalytics } from "./types";

export type IntelligenceDataQualityStatus = "fresh" | "stale" | "insufficient";

export type IntelligenceDataQuality = {
  status: IntelligenceDataQualityStatus;
  rangeDays: number;
  observedDays: number;
  latestObservedDay: string | null;
  messageAr: string;
  messageEn: string;
};

/**
 * Describes the evidence window available to Owner Intelligence.
 *
 * This function is intentionally deterministic: callers provide `now` so the
 * same analytics payload always produces the same result in tests and review.
 * It never fabricates activity for missing days.
 */
export function buildIntelligenceDataQuality(
  analytics: OwnerAnalytics | null,
  now: Date,
  staleAfterDays = 3,
): IntelligenceDataQuality {
  if (!analytics || analytics.rangeDays <= 0) {
    return {
      status: "insufficient",
      rangeDays: Math.max(analytics?.rangeDays ?? 0, 0),
      observedDays: 0,
      latestObservedDay: null,
      messageAr: "لا توجد نافذة بيانات تحليلية كافية للحكم على حداثة الإشارات.",
      messageEn: "There is not enough analytics-window data to assess signal freshness.",
    };
  }

  const validDays = analytics.series
    .map((point) => point.day)
    .filter((day) => !Number.isNaN(Date.parse(day)))
    .sort();
  const latestObservedDay = validDays.at(-1) ?? null;

  if (!latestObservedDay) {
    return {
      status: "insufficient",
      rangeDays: analytics.rangeDays,
      observedDays: 0,
      latestObservedDay: null,
      messageAr: "لا توجد أيام تحليلية صالحة يمكن الاعتماد عليها بعد.",
      messageEn: "There are no valid observed analytics days to rely on yet.",
    };
  }

  const latest = new Date(`${latestObservedDay}T23:59:59.999Z`);
  const ageDays = Math.max(0, (now.getTime() - latest.getTime()) / 86_400_000);
  const status: IntelligenceDataQualityStatus = ageDays > staleAfterDays ? "stale" : "fresh";

  return {
    status,
    rangeDays: analytics.rangeDays,
    observedDays: new Set(validDays).size,
    latestObservedDay,
    messageAr:
      status === "fresh"
        ? `بيانات الذكاء محدثة حتى ${latestObservedDay}.`
        : `آخر يوم بيانات متاح هو ${latestObservedDay}؛ قد تحتاج الإشارات إلى بيانات أحدث قبل اتخاذ قرار جديد.`,
    messageEn:
      status === "fresh"
        ? `Intelligence data is current through ${latestObservedDay}.`
        : `The latest available data is ${latestObservedDay}; newer evidence may be needed before taking a new decision.`,
  };
}
