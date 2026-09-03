import type { Sql } from "@/lib/db";

export type PlanResource = "branches" | "products" | "team_members";

export type PlanLimits = {
  branches: number;
  products: number;
  team_members: number;
};

export type SubscriptionSummary = {
  code: string;
  nameAr: string;
  nameEn: string;
  status: "trialing" | "active" | "past_due" | "cancelled";
  maxBranches: number;
  maxProducts: number;
  maxTeamMembers: number;
  monthlyPriceSar: number;
  trialEndsAt: string | null;
  currentPeriodEnd: string | null;
};

export class PlanLimitError extends Error {
  readonly resource: PlanResource;
  readonly current: number;
  readonly max: number;

  constructor(resource: PlanResource, current: number, max: number) {
    super(`PLAN_LIMIT:${resource}:${current}:${max}`);
    this.name = "PlanLimitError";
    this.resource = resource;
    this.current = current;
    this.max = max;
  }
}

export function assertLimit(current: number, max: number, resource: PlanResource) {
  if (!Number.isFinite(current) || !Number.isFinite(max) || max < 0) {
    throw new Error("INVALID_PLAN_LIMIT");
  }
  if (current >= max) throw new PlanLimitError(resource, current, max);
}

export async function getSubscription(sql: Sql, tenantId: string): Promise<SubscriptionSummary | null> {
  const rows = await sql<{
    code: string;
    name_ar: string;
    name_en: string;
    status: SubscriptionSummary["status"];
    max_branches: number;
    max_products: number;
    max_team_members: number;
    monthly_price_sar: string | number;
    trial_ends_at: string | null;
    current_period_end: string | null;
  }>`
    select
      sp.code,
      sp.name_ar,
      sp.name_en,
      ts.status,
      sp.max_branches,
      sp.max_products,
      sp.max_team_members,
      sp.monthly_price_sar,
      ts.trial_ends_at,
      ts.current_period_end
    from menu_v3.tenant_subscriptions ts
    join menu_v3.subscription_plans sp on sp.id = ts.plan_id
    where ts.tenant_id = ${tenantId}
      and sp.is_active = true
    limit 1
  `;

  const row = rows[0];
  if (!row) return null;
  return {
    code: row.code,
    nameAr: row.name_ar,
    nameEn: row.name_en,
    status: row.status,
    maxBranches: Number(row.max_branches),
    maxProducts: Number(row.max_products),
    maxTeamMembers: Number(row.max_team_members),
    monthlyPriceSar: Number(row.monthly_price_sar),
    trialEndsAt: row.trial_ends_at,
    currentPeriodEnd: row.current_period_end,
  };
}

export async function assertWithinPlanLimit(
  sql: Sql,
  tenantId: string,
  resource: PlanResource,
) {
  const rows = await sql<{
    max_branches: number;
    max_products: number;
    max_team_members: number;
    current_branches: number;
    current_products: number;
    current_team_members: number;
  }>`
    select
      sp.max_branches,
      sp.max_products,
      sp.max_team_members,
      (select count(*)::int from menu_v3.branches b where b.tenant_id = ${tenantId} and b.is_active = true) as current_branches,
      (select count(*)::int from menu_v3.products p where p.tenant_id = ${tenantId}) as current_products,
      (select count(*)::int from menu_v3.tenant_members tm where tm.tenant_id = ${tenantId}) as current_team_members
    from menu_v3.tenant_subscriptions ts
    join menu_v3.subscription_plans sp on sp.id = ts.plan_id
    where ts.tenant_id = ${tenantId}
      and ts.status in ('trialing', 'active')
      and sp.is_active = true
    for update of ts
  `;

  const row = rows[0];
  if (!row) throw new Error("SUBSCRIPTION_REQUIRED");

  const limits: Record<PlanResource, [number, number]> = {
    branches: [Number(row.current_branches), Number(row.max_branches)],
    products: [Number(row.current_products), Number(row.max_products)],
    team_members: [Number(row.current_team_members), Number(row.max_team_members)],
  };

  const [current, max] = limits[resource];
  assertLimit(current, max, resource);
}
