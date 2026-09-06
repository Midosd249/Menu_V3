import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { getSubscription, type SubscriptionSummary } from "./subscriptions";

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
  {
    code: "free",
    nameAr: "مجاني",
    nameEn: "Free",
    monthlyPriceSar: 0,
    maxBranches: 1,
    maxProducts: 50,
    maxTeamMembers: 3,
  },
  {
    code: "starter",
    nameAr: "بداية",
    nameEn: "Starter",
    monthlyPriceSar: 99,
    maxBranches: 3,
    maxProducts: 300,
    maxTeamMembers: 10,
  },
  {
    code: "pro",
    nameAr: "احترافي",
    nameEn: "Pro",
    monthlyPriceSar: 199,
    maxBranches: 10,
    maxProducts: 1000,
    maxTeamMembers: 25,
    recommended: true,
  },
];

export const COMMERCIAL_FEATURES = {
  ar: ["منيو رقمي ثنائي اللغة", "رمز QR ورابط عام", "الهوية والثيمات الخمسة", "تحليلات المنيو", "إدارة الفروع ضمن حد الباقة", "إدارة الفريق ضمن حد الباقة"],
  en: ["Bilingual digital menu", "QR code and public link", "Branding and five themes", "Menu analytics", "Branches within plan limit", "Team members within plan limit"],
} as const;

export type CommercialSnapshot = SubscriptionSummary & {
  limits: {
    branches: number;
    products: number;
    teamMembers: number;
  };
};

export const getMySubscription = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<CommercialSnapshot | null> => {
    const sql = await getSql();
    const subscription = await getSubscription(sql, context.userId ? await resolveTenantId(sql, context.userId) : "");
    if (!subscription) return null;
    return {
      ...subscription,
      limits: {
        branches: subscription.maxBranches,
        products: subscription.maxProducts,
        teamMembers: subscription.maxTeamMembers,
      },
    };
  });

async function resolveTenantId(sql: Awaited<ReturnType<typeof getSql>>, userId: string) {
  const rows = await sql<{ tenant_id: string }>`
    select tenant_id
    from menu_v3.tenant_members
    where user_id = ${userId} and is_active = true
    order by created_at
    limit 1
  `;
  return rows[0]?.tenant_id ?? "";
}
