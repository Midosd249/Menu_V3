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

export type CommercialPlanFeature = {
  ar: string;
  en: string;
};

// Canonical commercial display contract. Database migration mirrors these values;
// runtime entitlement enforcement remains server/database-authoritative.
// Pro products are unlimited at the server/database entitlement boundary.
export const COMMERCIAL_PLANS: readonly CommercialPlan[] = [
  { code: "free", nameAr: "مجاني", nameEn: "Free", monthlyPriceSar: 0, annualPriceSar: 0, maxBranches: 1, maxProducts: 20, maxTeamMembers: 2 },
  { code: "starter", nameAr: "نمو", nameEn: "Growth", monthlyPriceSar: 49, annualPriceSar: 490, maxBranches: 3, maxProducts: 300, maxTeamMembers: 10 },
  { code: "pro", nameAr: "احترافي", nameEn: "Pro", monthlyPriceSar: 149, annualPriceSar: 1490, maxBranches: 10, maxProducts: Number.MAX_SAFE_INTEGER, maxTeamMembers: 25, recommended: true },
];

export const COMMERCIAL_FEATURES = {
  ar: ["منيو رقمي ثنائي اللغة", "رمز QR ورابط عام", "الهوية والثيمات الخمسة", "تحليلات المنيو", "إدارة الفروع ضمن حد الباقة", "إدارة الفريق ضمن حد الباقة", "الطلب عبر واتساب"],
  en: ["Bilingual digital menu", "QR code and public link", "Branding and five themes", "Menu analytics", "Branch management within plan limit", "Team management within plan limit", "WhatsApp ordering"],
} as const;

export const COMMERCIAL_PLAN_FEATURES: Record<CommercialPlan["code"], readonly CommercialPlanFeature[]> = {
  free: [
    { ar: "الطلب عبر واتساب من المنيو", en: "WhatsApp ordering from the menu" },
    { ar: "منيو عربي وإنجليزي مع RTL/LTR", en: "Arabic & English menu with RTL/LTR" },
    { ar: "QR ورابط عام للمنيو", en: "QR code and public menu link" },
    { ar: "التصاميم الخمسة للمنيو", en: "All five menu themes" },
    { ar: "حتى 20 صنفًا وفرع واحد", en: "Up to 20 products and 1 branch" },
    { ar: "تحليلات أساسية للمنيو", en: "Basic menu analytics" },
    { ar: "مساعد الضيف الأساسي", en: "Core guest assistant" },
  ],
  starter: [
    { ar: "الطلب عبر واتساب من المنيو", en: "WhatsApp ordering from the menu" },
    { ar: "كل ما في الباقة المجانية", en: "Everything in Free" },
    { ar: "حتى 300 صنف و3 فروع و10 أعضاء", en: "Up to 300 products, 3 branches, and 10 team members" },
    { ar: "تحليلات أعمق وMenu Intelligence", en: "Deeper analytics and Menu Intelligence" },
    { ar: "Owner Intelligence ورؤى النمو", en: "Owner Intelligence and growth insights" },
    { ar: "CRM، الملاحظات، الحملات والاحتفاظ بالضيوف", en: "CRM, feedback, campaigns, and guest retention" },
    { ar: "استيراد وميزات ذكاء اصطناعي موسعة", en: "Import and expanded AI capabilities" },
  ],
  pro: [
    { ar: "الطلب عبر واتساب من المنيو", en: "WhatsApp ordering from the menu" },
    { ar: "كل ما في باقة نمو", en: "Everything in Growth" },
    { ar: "أصناف غير محدودة و10 فروع و25 عضوًا", en: "Unlimited products, 10 branches, and 25 team members" },
    { ar: "تحليلات موحدة عبر الفروع", en: "Cross-branch analytics" },
    { ar: "CRM ونمو واحتفاظ وحملات متقدمة", en: "Advanced CRM, growth, retention, and campaigns" },
    { ar: "تجارب محسوبة وميزات نمو متقدمة", en: "Controlled experiments and advanced growth features" },
    { ar: "ذكاء اصطناعي متقدم وأولوية في الدعم", en: "Advanced AI and priority support" },
  ],
} as const;

export function getCommercialPrice(plan: CommercialPlan, interval: BillingInterval): number {
  return interval === "annual" ? plan.annualPriceSar : plan.monthlyPriceSar;
}

export function getAnnualDiscountPercent(plan: CommercialPlan): number {
  if (plan.monthlyPriceSar <= 0) return 0;
  return Number((((plan.monthlyPriceSar * 12 - plan.annualPriceSar) / (plan.monthlyPriceSar * 12)) * 100).toFixed(2));
}
