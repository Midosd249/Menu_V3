import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { getSubscription, type SubscriptionSummary } from "./subscriptions";
import { COMMERCIAL_FEATURES, COMMERCIAL_PLANS, type CommercialPlan } from "./commercial-catalog";

export { COMMERCIAL_FEATURES, COMMERCIAL_PLANS } from "./commercial-catalog";
export type { CommercialPlan } from "./commercial-catalog";

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
    const tenantId = await resolveTenantId(sql, context.userId);
    if (!tenantId) return null;
    const subscription = await getSubscription(sql, tenantId);
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
  return rows[0]?.tenant_id ?? null;
}
