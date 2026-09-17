export type BillingInterval = "monthly" | "annual";

export type CommercialPlan = {
  code: "free" | "starter" | "pro";
  nameAr: string;
  nameEn: string;
  monthlyPriceSar: number;
  annualPriceSar: number;
  maxBranches: number;
  maxProducts: number;
  maxTeamMembers: number;
  recommended?: boolean;
};

// Canonical commercial display contract. Database migration mirrors these values;
// runtime entitlement enforcement remains server/database-authoritative.
// Pro's product limit is represented by a display-safe sentinel because the database
// entitlement boundary explicitly bypasses the product limit for the Pro plan.
export const COMMERCIAL_PLANS: readonly CommercialPlan[] = [
  { code: "free", nameAr: "مجاني", nameEn: "Free", monthlyPriceSar: 0, annualPriceSar: 0, maxBranches: 1, maxProducts: 50, maxTeamMembers: 3 },
  { code: "starter", nameAr: "نمو", nameEn: "Growth", monthlyPriceSar: 49, annualPriceSar: 490, maxBranches: 3, maxProducts: 300, maxTeamMembers: 10 },
  { code: "pro", nameAr: "احترافي", nameEn: "Pro", monthlyPriceSar: 149, annualPriceSar: 1490, maxBranches: 10, maxProducts: Number.MAX_SAFE_INTEGER, maxTeamMembers: 25, recommended: true },
];

export const COMMERCIAL_FEATURES = {
  ar: ["منيو رقمي ثنائي اللغة", "رمز QR ورابط عام", "الهوية والثيمات الخمسة", "تحليلات المنيو", "إدارة الفروع ضمن حد الباقة", "إدارة الفريق ضمن حد الباقة"],
  en: ["Bilingual digital menu", "QR code and public link", "Branding and five themes", "Menu analytics", "Branch management within plan limit", "Team management within plan limit"],
} as const;

export function getCommercialPrice(plan: CommercialPlan, interval: BillingInterval): number {
  return interval === "annual" ? plan.annualPriceSar : plan.monthlyPriceSar;
}

export function getAnnualDiscountPercent(plan: CommercialPlan): number {
  if (plan.monthlyPriceSar <= 0) return 0;
  return Number((((plan.monthlyPriceSar * 12 - plan.annualPriceSar) / (plan.monthlyPriceSar * 12)) * 100).toFixed(2));
}
