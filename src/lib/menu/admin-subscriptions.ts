import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { requirePlatformAdmin } from "@/lib/auth/platform-admin.server";
import { getSql } from "@/lib/db";
import type { FnResult } from "./types";

export const ADMIN_SUBSCRIPTION_STATUSES = ["trialing", "active", "past_due", "cancelled"] as const;
export type AdminSubscriptionStatus = (typeof ADMIN_SUBSCRIPTION_STATUSES)[number];
export type AdminSubscription = {
  tenantId: string; ownerUserId: string; customerName: string; customerEmail: string; phone: string;
  tenantName: string; planCode: string; planNameAr: string; monthlyPriceSar: number;
  status: AdminSubscriptionStatus; trialEndsAt: string | null; currentPeriodEnd: string | null;
  accountStatus: "active" | "frozen" | "blocked"; updatedAt: string;
};

function iso(value: unknown): string | null {
  if (value == null) return null;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

async function assertAdmin(userId: string): Promise<FnResult<true>> {
  try { await requirePlatformAdmin(userId); return { ok: true, data: true }; }
  catch (error) {
    if (error instanceof Error && error.message === "PLATFORM_ADMIN_REQUIRED") return { ok: false, code: "forbidden", error: "هذه العملية مخصصة لمالك المنصة" };
    console.error("admin subscription authorization failed", error);
    return { ok: false, code: "unavailable", error: "تعذر التحقق من صلاحيات مالك المنصة" };
  }
}

function mapRow(row: Record<string, unknown>): AdminSubscription {
  return {
    tenantId: String(row.tenant_id), ownerUserId: String(row.owner_user_id), customerName: String(row.customer_name ?? ""),
    customerEmail: String(row.customer_email ?? ""), phone: String(row.phone ?? ""), tenantName: String(row.tenant_name ?? ""),
    planCode: String(row.plan_code), planNameAr: String(row.plan_name_ar), monthlyPriceSar: Number(row.monthly_price_sar),
    status: row.status as AdminSubscriptionStatus, trialEndsAt: iso(row.trial_ends_at), currentPeriodEnd: iso(row.current_period_end),
    accountStatus: row.account_status as AdminSubscription["accountStatus"], updatedAt: iso(row.updated_at) ?? new Date(0).toISOString(),
  };
}

export const getAdminSubscriptions = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<FnResult<AdminSubscription[]>> => {
    const permission = await assertAdmin(context.userId); if (!permission.ok) return permission;
    try {
      const sql = await getSql();
      const rows = await sql<Record<string, unknown>>`
        select t.id as tenant_id, t.owner_user_id, coalesce(u.name, '') as customer_name,
          coalesce(u.email, '') as customer_email, coalesce(u."phoneNumber", '') as phone,
          t.name_ar as tenant_name, sp.code as plan_code, sp.name_ar as plan_name_ar,
          sp.monthly_price_sar, ts.status, ts.trial_ends_at, ts.current_period_end,
          coalesce(t.account_status, 'active') as account_status,
          greatest(t.updated_at, ts.updated_at) as updated_at
        from menu_v3.tenant_subscriptions ts
        join menu_v3.tenants t on t.id = ts.tenant_id
        join menu_v3.subscription_plans sp on sp.id = ts.plan_id
        left join menu_v3."user" u on u.id = t.owner_user_id
        order by greatest(t.updated_at, ts.updated_at) desc limit 500
      `;
      return { ok: true, data: rows.map(mapRow) };
    } catch (error) {
      console.error("getAdminSubscriptions failed", error);
      return { ok: false, code: "unavailable", error: "تعذر تحميل اشتراكات العملاء" };
    }
  });

const actionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("set_plan"), tenantId: z.string().trim().min(1), planCode: z.enum(["free", "starter", "pro"]) }),
  z.object({ action: z.literal("extend_trial"), tenantId: z.string().trim().min(1), days: z.number().int().min(1).max(30) }),
  z.object({ action: z.literal("end_trial"), tenantId: z.string().trim().min(1) }),
  z.object({ action: z.literal("freeze_account"), tenantId: z.string().trim().min(1) }),
  z.object({ action: z.literal("unfreeze_account"), tenantId: z.string().trim().min(1) }),
  z.object({ action: z.literal("set_subscription_status"), tenantId: z.string().trim().min(1), status: z.enum(ADMIN_SUBSCRIPTION_STATUSES) }),
]);

export const updateAdminSubscription = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(actionSchema)
  .handler(async ({ context, data }): Promise<FnResult<AdminSubscription>> => {
    const permission = await assertAdmin(context.userId); if (!permission.ok) return permission;
    try {
      const sql = await getSql();
      const rows = await sql<Record<string, unknown>>`
        select * from menu_v3.admin_control_subscription(
          ${context.userId}, ${data.tenantId}, ${data.action},
          ${"planCode" in data ? data.planCode : null},
          ${"days" in data ? data.days : null},
          ${"status" in data ? data.status : null}
        )
      `;
      const row = rows[0];
      if (!row) return { ok: false, code: "unavailable", error: "تعذر تطبيق التغيير" };
      return { ok: true, data: mapRow(row) };
    } catch (error) {
      console.error("updateAdminSubscription failed", error);
      const message = error instanceof Error ? error.message : "";
      if (message.includes("ADMIN_SUBSCRIPTION_") || message === "PLATFORM_ADMIN_REQUIRED") return { ok: false, code: "invalid", error: "التغيير غير مسموح للحالة الحالية" };
      return { ok: false, code: "unavailable", error: "تعذر تطبيق التغيير على اشتراك العميل" };
    }
  });
