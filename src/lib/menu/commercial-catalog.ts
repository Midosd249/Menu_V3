export type CommercialPlan = {
  code: "free" | "starter" | "pro";
  nameAr: string;
  nameEn: string;
  monthlyPriceSar: number;
  maxBranches: number;
  maxProducts: number;
  maxTeamMembers: number;
  recommended?: boolean;
};

// Canonical commercial display contract. Values mirror the active subscription_plans
// migration; pricing is intentionally not duplicated elsewhere in application logic.
export const COMMERCIAL_PLANS: readonly CommercialPlan[] = [
  { code: "free", nameAr: "مجاني", nameEn: "Free", monthlyPriceSar: 0, maxBranches: 1, maxProducts: 50, maxTeamMembers: 3 },
  { code: "starter", nameAr: "بداية", nameEn: "Starter", monthlyPriceSar: 99, maxBranches: 3, maxProducts: 300, maxTeamMembers: 10 },
  { code: "pro", nameAr: "احترافي", nameEn: "Pro", monthlyPriceSar: 199, maxBranches: 10, maxProducts: 1000, maxTeamMembers: 25, recommended: true },
];

export const COMMERCIAL_FEATURES = {
  ar: ["منيو رقمي ثنائي اللغة", "رمز QR ورابط عام", "الهوية والثيمات الخمسة", "تحليلات المنيو", "إدارة الفروع ضمن حد الباقة", "إدارة الفريق ضمن حد الباقة"],
  en: ["Bilingual digital menu", "QR code and public link", "Branding and five themes", "Menu analytics", "Branches within plan limit", "Team members within plan limit"],
} as const;
