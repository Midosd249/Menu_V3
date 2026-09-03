import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import type { FnResult } from "./types";

export type PlatformTenant = {
  id: string;
  ownerUserId: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  city: string;
  country: string;
  isPublished: boolean;
  isActive: boolean;
  createdAt: string;
  branchCount: number;
  productCount: number;
  orderCount: number;
  planCode: string;
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
  return (process.env[key] ?? "").split(",").map((value) => value.trim().toLowerCase()).filter(Boolean);
}

async function requirePlatformAdmin(userId: string) {
  const allowedIds = csvEnv("PLATFORM_ADMIN_USER_IDS");
  if (allowedIds.includes(userId.toLowerCase())) return;
  const sql = await getSql();
  const users = await sql<{ email: string }>`select "email" as email from "user" where "id" = ${userId} limit 1`;
  const email = String(users[0]?.email ?? "").trim().toLowerCase();
  if (!email || !csvEnv("PLATFORM_ADMIN_EMAILS").includes(email)) throw new Error("PLATFORM_ADMIN_REQUIRED");
}

async function assertPlatformAdmin(userId: string): Promise<FnResult<true>> {
  try {
    await requirePlatformAdmin(userId);
    return { ok: true, data: true };
  } catch (error) {
    if (error instanceof Error && error.message === "PLATFORM_ADMIN_REQUIRED") {
      return { ok: false, code: "forbidden", error: "هذه الصفحة مخصصة لمالك المنصة" };
    }
    console.error("platform admin authorization failed", error);
    return { ok: false, code: "unavailable", error: "تعذر التحقق من صلاحيات مالك المنصة" };
  }
}

function iso(value: unknown): string {
  const date = new Date(String(value ?? ""));
  return Number.isNaN(date.getTime()) ? new Date(0).toISOString() : date.toISOString();
}

export const getPlatformDashboard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<FnResult<PlatformDashboard>> => {
    const permission = await assertPlatformAdmin(context.userId);
    if (!permission.ok) return permission;
    try {
      const sql = await getSql();
      const tenants = await sql<Record<string, unknown>>`
        select
          t.id, t.owner_user_id, t.slug, t.name_ar, t.name_en, t.city, t.country,
          t.is_published, t.is_active, t.created_at,
          (select count(*)::int from branches b where b.tenant_id = t.id) as branch_count,
          (select count(*)::int from products p where p.tenant_id = t.id) as product_count,
          (select count(*)::int from orders o where o.tenant_id = t.id) as order_count,
          coalesce((select sp.code from tenant_subscriptions ts join subscription_plans sp on sp.id = ts.plan_id where ts.tenant_id = t.id limit 1), 'free') as plan_code
        from tenants t
        order by t.created_at desc
        limit 500
      `;
      const counts = await sql<Record<string, number>>`
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
      const c = counts[0] ?? {};
      return {
        ok: true,
        data: {
          tenants: tenants.map((t) => ({
            id: String(t.id), ownerUserId: String(t.owner_user_id), slug: String(t.slug),
            nameAr: String(t.name_ar ?? ""), nameEn: String(t.name_en ?? ""), city: String(t.city ?? ""),
            country: String(t.country ?? ""), isPublished: Boolean(t.is_published), isActive: Boolean(t.is_active),
            createdAt: iso(t.created_at), branchCount: Number(t.branch_count ?? 0), productCount: Number(t.product_count ?? 0),
            orderCount: Number(t.order_count ?? 0), planCode: String(t.plan_code ?? "free"),
          })),
          tenantCount: Number(c.tenant_count ?? 0), activeTenantCount: Number(c.active_tenant_count ?? 0),
          publishedTenantCount: Number(c.published_tenant_count ?? 0), branchCount: Number(c.branch_count ?? 0),
          productCount: Number(c.product_count ?? 0), orderCount: Number(c.order_count ?? 0), openOrderCount: Number(c.open_order_count ?? 0),
          leadCount: Number(c.lead_count ?? 0), newLeadCount: Number(c.new_lead_count ?? 0), menuEventCount: Number(c.menu_event_count ?? 0),
          activeSubscriptionCount: Number(c.active_subscription_count ?? 0), trialSubscriptionCount: Number(c.trial_subscription_count ?? 0),
        },
      };
    } catch (error) {
      console.error("getPlatformDashboard failed", error);
      return { ok: false, code: "unavailable", error: "تعذر تحميل بيانات منصة Menu V3" };
    }
  });

export const updatePlatformTenantStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ tenantId: z.string().min(1).max(128), isActive: z.boolean() }))
  .handler(async ({ context, data }): Promise<FnResult<{ id: string; isActive: boolean }>> => {
    const permission = await assertPlatformAdmin(context.userId);
    if (!permission.ok) return permission;
    try {
      const sql = await getSql();
      const rows = await sql<{ id: string; is_active: boolean }>`
        update tenants set is_active = ${data.isActive}, updated_at = now()
        where id = ${data.tenantId}
        returning id, is_active
      `;
      if (!rows[0]) return { ok: false, code: "not_found", error: "المطعم غير موجود" };
      return { ok: true, data: { id: String(rows[0].id), isActive: Boolean(rows[0].is_active) } };
    } catch (error) {
      console.error("updatePlatformTenantStatus failed", error);
      return { ok: false, code: "unavailable", error: "تعذر تحديث حالة المطعم" };
    }
  });
