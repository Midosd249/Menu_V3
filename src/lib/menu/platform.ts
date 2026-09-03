import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import type { FnResult } from "./types";

export type PlatformTenant = {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  city: string;
  country: string;
  ownerUserId: string;
  isPublished: boolean;
  isActive: boolean;
  branchCount: number;
  productCount: number;
  orderCount: number;
  planCode: string;
  subscriptionStatus: string;
  createdAt: string;
};

export type PlatformDashboard = {
  tenants: PlatformTenant[];
  tenantCount: number;
  activeTenantCount: number;
  publishedTenantCount: number;
  branchCount: number;
  productCount: number;
  orderCount: number;
  openOrderCount: number;
  leadCount: number;
  newLeadCount: number;
  menuEventCount: number;
  activeSubscriptionCount: number;
  trialSubscriptionCount: number;
};

function csvEnv(key: string): string[] {
  return (process.env[key] ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

async function requirePlatformAdmin(userId: string) {
  const allowedIds = csvEnv("PLATFORM_ADMIN_USER_IDS");
  if (allowedIds.includes(userId.toLowerCase())) return;
  const sql = await getSql();
  const users = await sql<{ email: string }>`select "email" as email from "user" where "id" = ${userId} limit 1`;
  const email = String(users[0]?.email ?? "").trim().toLowerCase();
  if (!email || !csvEnv("PLATFORM_ADMIN_EMAILS").includes(email)) throw new Error("PLATFORM_ADMIN_REQUIRED");
}

async function platformAccess(userId: string): Promise<FnResult<true>> {
  try {
    await requirePlatformAdmin(userId);
    return { ok: true, data: true };
  } catch (error) {
    if (error instanceof Error && error.message === "PLATFORM_ADMIN_REQUIRED") {
      return { ok: false, code: "forbidden", error: "هذه الصفحة مخصصة لمالك المنصة" };
    }
    console.error("platform access check failed", error);
    return { ok: false, code: "unavailable", error: "تعذر التحقق من صلاحيات مالك المنصة" };
  }
}

export const getPlatformDashboard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<FnResult<PlatformDashboard>> => {
    const access = await platformAccess(context.userId);
    if (!access.ok) return access;
    try {
      const sql = await getSql();
      const rows = await sql<Record<string, unknown>>`
        select
          (select count(*)::int from tenants) as tenant_count,
          (select count(*)::int from tenants where is_active) as active_tenant_count,
          (select count(*)::int from tenants where is_published) as published_tenant_count,
          (select count(*)::int from branches) as branch_count,
          (select count(*)::int from products) as product_count,
          (select count(*)::int from orders) as order_count,
          (select count(*)::int from orders where status in ('new','confirmed','preparing','ready')) as open_order_count,
          (select count(*)::int from leads) as lead_count,
          (select count(*)::int from leads where status = 'new') as new_lead_count,
          (select count(*)::int from menu_events) as menu_event_count,
          (select count(*)::int from tenant_subscriptions where status = 'active') as active_subscription_count,
          (select count(*)::int from tenant_subscriptions where status = 'trialing') as trial_subscription_count
      `;
      const tenants = await sql<Record<string, unknown>>`
        select
          t.id, t.slug, t.name_ar, t.name_en, coalesce(t.city, '') as city, t.country,
          t.owner_user_id, t.is_published, t.is_active, t.created_at,
          (select count(*)::int from branches b where b.tenant_id = t.id) as branch_count,
          (select count(*)::int from products p where p.tenant_id = t.id) as product_count,
          (select count(*)::int from orders o where o.tenant_id = t.id) as order_count,
          coalesce(ts.status, 'unassigned') as subscription_status,
          coalesce(sp.code, 'unassigned') as plan_code
        from tenants t
        left join tenant_subscriptions ts on ts.tenant_id = t.id
        left join subscription_plans sp on sp.id = ts.plan_id
        order by t.created_at desc
        limit 200
      `;
      const row = rows[0] ?? {};
      return {
        ok: true,
        data: {
          tenantCount: Number(row.tenant_count ?? 0),
          activeTenantCount: Number(row.active_tenant_count ?? 0),
          publishedTenantCount: Number(row.published_tenant_count ?? 0),
          branchCount: Number(row.branch_count ?? 0),
          productCount: Number(row.product_count ?? 0),
          orderCount: Number(row.order_count ?? 0),
          openOrderCount: Number(row.open_order_count ?? 0),
          leadCount: Number(row.lead_count ?? 0),
          newLeadCount: Number(row.new_lead_count ?? 0),
          menuEventCount: Number(row.menu_event_count ?? 0),
          activeSubscriptionCount: Number(row.active_subscription_count ?? 0),
          trialSubscriptionCount: Number(row.trial_subscription_count ?? 0),
          tenants: tenants.map((tenant) => ({
            id: String(tenant.id), slug: String(tenant.slug), nameAr: String(tenant.name_ar ?? ""), nameEn: String(tenant.name_en ?? ""),
            city: String(tenant.city ?? ""), country: String(tenant.country ?? ""), ownerUserId: String(tenant.owner_user_id),
            isPublished: Boolean(tenant.is_published), isActive: Boolean(tenant.is_active), branchCount: Number(tenant.branch_count ?? 0),
            productCount: Number(tenant.product_count ?? 0), orderCount: Number(tenant.order_count ?? 0), planCode: String(tenant.plan_code),
            subscriptionStatus: String(tenant.subscription_status), createdAt: new Date(String(tenant.created_at)).toISOString(),
          })),
        },
      };
    } catch (error) {
      console.error("getPlatformDashboard failed", error);
      return { ok: false, code: "unavailable", error: "تعذر تحميل مركز مالك المنصة" };
    }
  });

export const updatePlatformTenantStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ tenantId: z.string().min(1).max(200), isActive: z.boolean() }))
  .handler(async ({ context, data }): Promise<FnResult<{ tenantId: string; isActive: boolean }>> => {
    const access = await platformAccess(context.userId);
    if (!access.ok) return access;
    try {
      const sql = await getSql();
      const rows = await sql<{ id: string; is_active: boolean }>`
        update tenants set is_active = ${data.isActive}, updated_at = now()
        where id = ${data.tenantId}
        returning id, is_active
      `;
      if (!rows[0]) return { ok: false, code: "not_found", error: "المطعم غير موجود" };
      return { ok: true, data: { tenantId: String(rows[0].id), isActive: Boolean(rows[0].is_active) } };
    } catch (error) {
      console.error("updatePlatformTenantStatus failed", error);
      return { ok: false, code: "unavailable", error: "تعذر تحديث حالة المطعم" };
    }
  });
