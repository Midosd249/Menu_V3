import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { requirePlatformAdmin } from "@/lib/auth/platform-admin.server";
import { getSql } from "@/lib/db";
import type { FnResult } from "./types";

const statusSchema = z.enum(["active", "trialing", "past_due", "cancelled", "suspended"]);

export type PlatformSubscription = {
  tenantId: string;
  tenantName: string;
  tenantSlug: string;
  ownerUserId: string;
  ownerName: string;
  ownerEmail: string;
  accountFrozen: boolean;
  planCode: string;
  planNameAr: string;
  planNameEn: string;
  monthlyPriceSar: number;
  maxBranches: number;
  maxProducts: number;
  maxTeamMembers: number;
  status: z.infer<typeof statusSchema>;
  trialEndsAt: string | null;
  currentPeriodEnd: string | null;
  branchCount: number;
  productCount: number;
  teamMemberCount: number;
};

export type PlatformSubscriptionAudit = {
  id: string;
  adminUserId: string;
  targetUserId: string | null;
  tenantId: string | null;
  action: string;
  reason: string;
  beforeState: string;
  afterState: string;
  createdAt: string;
};

async function assertAdmin(userId: string): Promise<FnResult<true>> {
  try {
    await requirePlatformAdmin(userId);
    return { ok: true, data: true };
  } catch (error) {
    if (error instanceof Error && error.message === "PLATFORM_ADMIN_REQUIRED") {
      return { ok: false, code: "forbidden", error: "هذه العملية مخصصة لمالك المنصة" };
    }
    console.error("platform subscription authorization failed", error);
    return { ok: false, code: "unavailable", error: "تعذر التحقق من صلاحيات مالك المنصة" };
  }
}

function mapSubscription(row: Record<string, unknown>): PlatformSubscription {
  return {
    tenantId: String(row.tenant_id),
    tenantName: String(row.tenant_name ?? ""),
    tenantSlug: String(row.tenant_slug ?? ""),
    ownerUserId: String(row.owner_user_id),
    ownerName: String(row.owner_name ?? ""),
    ownerEmail: String(row.owner_email ?? ""),
    accountFrozen: Boolean(row.account_frozen),
    planCode: String(row.plan_code),
    planNameAr: String(row.plan_name_ar),
    planNameEn: String(row.plan_name_en),
    monthlyPriceSar: Number(row.monthly_price_sar ?? 0),
    maxBranches: Number(row.max_branches ?? 0),
    maxProducts: Number(row.max_products ?? 0),
    maxTeamMembers: Number(row.max_team_members ?? 0),
    status: statusSchema.parse(row.status),
    trialEndsAt: row.trial_ends_at ? new Date(String(row.trial_ends_at)).toISOString() : null,
    currentPeriodEnd: row.current_period_end ? new Date(String(row.current_period_end)).toISOString() : null,
    branchCount: Number(row.branch_count ?? 0),
    productCount: Number(row.product_count ?? 0),
    teamMemberCount: Number(row.team_member_count ?? 0),
  };
}

async function loadSubscription(sql: Awaited<ReturnType<typeof getSql>>, tenantId: string) {
  const rows = await sql<Record<string, unknown>>`
    select
      t.id as tenant_id,
      coalesce(t.name_ar, t.name_en, '') as tenant_name,
      coalesce(t.slug, '') as tenant_slug,
      t.owner_user_id,
      coalesce(u.name, '') as owner_name,
      coalesce(u.email, '') as owner_email,
      coalesce(u.banned, false) as account_frozen,
      sp.code as plan_code,
      sp.name_ar as plan_name_ar,
      sp.name_en as plan_name_en,
      sp.monthly_price_sar,
      sp.max_branches,
      sp.max_products,
      sp.max_team_members,
      ts.status,
      ts.trial_ends_at,
      ts.current_period_end,
      (select count(*)::int from branches b where b.tenant_id = t.id) as branch_count,
      (select count(*)::int from products p where p.tenant_id = t.id) as product_count,
      (select count(*)::int from tenant_members tm where tm.tenant_id = t.id and tm.is_active = true) as team_member_count
    from tenants t
    join "user" u on u.id = t.owner_user_id
    left join tenant_subscriptions ts on ts.tenant_id = t.id
    left join subscription_plans sp on sp.id = ts.plan_id
    where t.id = ${tenantId}
    limit 1
  `;
  return rows[0] ? mapSubscription(rows[0]) : null;
}

async function writeAudit(
  sql: Awaited<ReturnType<typeof getSql>>,
  input: {
    adminUserId: string;
    targetUserId?: string | null;
    tenantId?: string | null;
    action: string;
    reason?: string;
    beforeState: unknown;
    afterState: unknown;
  },
) {
  await sql`
    insert into platform_admin_subscription_audit
      (admin_user_id, target_user_id, tenant_id, action, reason, before_state, after_state)
    values
      (${input.adminUserId}, ${input.targetUserId ?? null}, ${input.tenantId ?? null}, ${input.action},
       ${input.reason ?? null}, ${JSON.stringify(input.beforeState)}::jsonb, ${JSON.stringify(input.afterState)}::jsonb)
  `;
}

export const getPlatformSubscriptions = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ q: z.string().trim().max(120).optional() }))
  .handler(async ({ context, data }): Promise<FnResult<PlatformSubscription[]>> => {
    const permission = await assertAdmin(context.userId);
    if (!permission.ok) return permission;
    try {
      const sql = await getSql();
      const q = data.q ? `%${data.q.toLowerCase()}%` : null;
      const rows = await sql<Record<string, unknown>>`
        select
          t.id as tenant_id,
          coalesce(t.name_ar, t.name_en, '') as tenant_name,
          coalesce(t.slug, '') as tenant_slug,
          t.owner_user_id,
          coalesce(u.name, '') as owner_name,
          coalesce(u.email, '') as owner_email,
          coalesce(u.banned, false) as account_frozen,
          coalesce(sp.code, 'free') as plan_code,
          coalesce(sp.name_ar, 'مجاني') as plan_name_ar,
          coalesce(sp.name_en, 'Free') as plan_name_en,
          coalesce(sp.monthly_price_sar, 0) as monthly_price_sar,
          coalesce(sp.max_branches, 1) as max_branches,
          coalesce(sp.max_products, 50) as max_products,
          coalesce(sp.max_team_members, 3) as max_team_members,
          coalesce(ts.status, 'active') as status,
          ts.trial_ends_at,
          ts.current_period_end,
          (select count(*)::int from branches b where b.tenant_id = t.id) as branch_count,
          (select count(*)::int from products p where p.tenant_id = t.id) as product_count,
          (select count(*)::int from tenant_members tm where tm.tenant_id = t.id and tm.is_active = true) as team_member_count
        from tenants t
        join "user" u on u.id = t.owner_user_id
        left join tenant_subscriptions ts on ts.tenant_id = t.id
        left join subscription_plans sp on sp.id = ts.plan_id
        where (
          ${q}::text is null
          or lower(coalesce(t.name_ar, '')) like ${q}
          or lower(coalesce(t.name_en, '')) like ${q}
          or lower(coalesce(t.slug, '')) like ${q}
          or lower(coalesce(u.name, '')) like ${q}
          or lower(coalesce(u.email, '')) like ${q}
        )
        order by t.created_at desc nulls last
        limit 500
      `;
      return { ok: true, data: rows.map(mapSubscription) };
    } catch (error) {
      console.error("getPlatformSubscriptions failed", error);
      return { ok: false, code: "unavailable", error: "تعذر تحميل الاشتراكات" };
    }
  });

export const changePlatformSubscriptionPlan = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ tenantId: z.string().min(1).max(128), planCode: z.string().trim().min(1).max(64), reason: z.string().trim().max(500).optional() }))
  .handler(async ({ context, data }): Promise<FnResult<PlatformSubscription>> => {
    const permission = await assertAdmin(context.userId);
    if (!permission.ok) return permission;
    try {
      const sql = await getSql();
      const before = await loadSubscription(sql, data.tenantId);
      if (!before) return { ok: false, code: "not_found", error: "مساحة العمل غير موجودة" };
      const planRows = await sql<Record<string, unknown>>`
        select id, code, max_branches, max_products, max_team_members
        from subscription_plans
        where code = ${data.planCode} and is_active = true
        limit 1
      `;
      const plan = planRows[0];
      if (!plan) return { ok: false, code: "invalid", error: "الخطة غير متاحة" };
      if (before.branchCount > Number(plan.max_branches) || before.productCount > Number(plan.max_products) || before.teamMemberCount > Number(plan.max_team_members)) {
        return { ok: false, code: "conflict", error: "لا يمكن خفض الخطة لأن الاستخدام الحالي يتجاوز حدودها" };
      }
      const isFree = String(plan.code) === "free";
      const nextStatus = isFree ? "active" : (before.status === "trialing" ? "trialing" : "active");
      const nextTrial = isFree ? null : before.trialEndsAt;
      await sql`
        update tenant_subscriptions
        set plan_id = ${String(plan.id)}, status = ${nextStatus}, trial_ends_at = ${nextTrial}, updated_at = now()
        where tenant_id = ${data.tenantId}
      `;
      const after = await loadSubscription(sql, data.tenantId);
      if (!after) return { ok: false, code: "unavailable", error: "تعذر قراءة الحالة الجديدة" };
      await writeAudit(sql, { adminUserId: context.userId, targetUserId: after.ownerUserId, tenantId: data.tenantId, action: "plan_changed", reason: data.reason, beforeState: before, afterState: after });
      return { ok: true, data: after };
    } catch (error) {
      console.error("changePlatformSubscriptionPlan failed", error);
      return { ok: false, code: "unavailable", error: "تعذر تغيير الخطة" };
    }
  });

export const managePlatformTrial = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ tenantId: z.string().min(1).max(128), action: z.enum(["extend", "end"]), trialEndsAt: z.string().datetime().optional(), reason: z.string().trim().max(500).optional() }))
  .handler(async ({ context, data }): Promise<FnResult<PlatformSubscription>> => {
    const permission = await assertAdmin(context.userId);
    if (!permission.ok) return permission;
    try {
      const sql = await getSql();
      const before = await loadSubscription(sql, data.tenantId);
      if (!before) return { ok: false, code: "not_found", error: "مساحة العمل غير موجودة" };
      if (before.planCode === "free") return { ok: false, code: "conflict", error: "الخطة المجانية لا تحتوي على تجربة" };
      if (data.action === "extend") {
        if (!data.trialEndsAt) return { ok: false, code: "invalid", error: "تاريخ نهاية التجربة مطلوب" };
        const end = new Date(data.trialEndsAt);
        if (Number.isNaN(end.getTime()) || end.getTime() <= Date.now()) return { ok: false, code: "invalid", error: "تاريخ نهاية التجربة يجب أن يكون في المستقبل" };
        await sql`update tenant_subscriptions set status = 'trialing', trial_ends_at = ${end.toISOString()}, updated_at = now() where tenant_id = ${data.tenantId}`;
      } else {
        await sql`update tenant_subscriptions set status = 'past_due', trial_ends_at = now(), updated_at = now() where tenant_id = ${data.tenantId}`;
      }
      const after = await loadSubscription(sql, data.tenantId);
      if (!after) return { ok: false, code: "unavailable", error: "تعذر قراءة الحالة الجديدة" };
      await writeAudit(sql, { adminUserId: context.userId, targetUserId: after.ownerUserId, tenantId: data.tenantId, action: data.action === "extend" ? "trial_extended" : "trial_ended", reason: data.reason, beforeState: before, afterState: after });
      return { ok: true, data: after };
    } catch (error) {
      console.error("managePlatformTrial failed", error);
      return { ok: false, code: "unavailable", error: "تعذر تحديث التجربة" };
    }
  });

export const setPlatformSubscriptionStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ tenantId: z.string().min(1).max(128), status: statusSchema, reason: z.string().trim().max(500).optional() }))
  .handler(async ({ context, data }): Promise<FnResult<PlatformSubscription>> => {
    const permission = await assertAdmin(context.userId);
    if (!permission.ok) return permission;
    try {
      const sql = await getSql();
      const before = await loadSubscription(sql, data.tenantId);
      if (!before) return { ok: false, code: "not_found", error: "مساحة العمل غير موجودة" };
      if (data.status === "trialing") {
        if (before.planCode === "free" || !before.trialEndsAt || new Date(before.trialEndsAt).getTime() <= Date.now()) {
          return { ok: false, code: "invalid", error: "لا يمكن تفعيل حالة التجربة لهذه الخطة أو بهذا التاريخ" };
        }
      }
      await sql`update tenant_subscriptions set status = ${data.status}, updated_at = now() where tenant_id = ${data.tenantId}`;
      const after = await loadSubscription(sql, data.tenantId);
      if (!after) return { ok: false, code: "unavailable", error: "تعذر قراءة الحالة الجديدة" };
      await writeAudit(sql, { adminUserId: context.userId, targetUserId: after.ownerUserId, tenantId: data.tenantId, action: "subscription_status_changed", reason: data.reason, beforeState: before, afterState: after });
      return { ok: true, data: after };
    } catch (error) {
      console.error("setPlatformSubscriptionStatus failed", error);
      return { ok: false, code: "unavailable", error: "تعذر تحديث حالة الاشتراك" };
    }
  });

export const setPlatformAccountFrozen = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ userId: z.string().min(1).max(128), frozen: z.boolean(), reason: z.string().trim().max(500).optional() }))
  .handler(async ({ context, data }): Promise<FnResult<{ userId: string; frozen: boolean }>> => {
    const permission = await assertAdmin(context.userId);
    if (!permission.ok) return permission;
    if (data.userId === context.userId) return { ok: false, code: "forbidden", error: "لا يمكن لمالك المنصة تجميد حسابه الحالي" };
    try {
      const sql = await getSql();
      const target = await sql<{ is_admin: boolean; banned: boolean }>`select menu_v3.is_platform_admin(${data.userId}) as is_admin, coalesce("banned", false) as banned from "user" where id = ${data.userId} limit 1`;
      if (!target[0]) return { ok: false, code: "not_found", error: "الحساب غير موجود" };
      if (target[0].is_admin) return { ok: false, code: "forbidden", error: "لا يمكن تجميد حساب مالك منصة آخر" };
      await sql`update "user" set "banned" = ${data.frozen}, "banReason" = ${data.frozen ? (data.reason || "Platform Owner action") : null}, "banExpires" = null, "updatedAt" = now() where id = ${data.userId}`;
      if (data.frozen) await sql`delete from "session" where "userId" = ${data.userId}`;
      const after = await sql<{ banned: boolean }>`select coalesce("banned", false) as banned from "user" where id = ${data.userId}`;
      await writeAudit(sql, { adminUserId: context.userId, targetUserId: data.userId, action: data.frozen ? "account_frozen" : "account_unfrozen", reason: data.reason, beforeState: { frozen: target[0].banned }, afterState: { frozen: Boolean(after[0]?.banned) } });
      return { ok: true, data: { userId: data.userId, frozen: Boolean(after[0]?.banned) } };
    } catch (error) {
      console.error("setPlatformAccountFrozen failed", error);
      return { ok: false, code: "unavailable", error: "تعذر تحديث حالة الحساب" };
    }
  });

export const getPlatformSubscriptionAudit = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ tenantId: z.string().min(1).max(128) }))
  .handler(async ({ context, data }): Promise<FnResult<PlatformSubscriptionAudit[]>> => {
    const permission = await assertAdmin(context.userId);
    if (!permission.ok) return permission;
    try {
      const sql = await getSql();
      const rows = await sql<Record<string, unknown>>`
        select id, admin_user_id, target_user_id, tenant_id, action, coalesce(reason, '') as reason,
          before_state, after_state, created_at
        from platform_admin_subscription_audit
        where tenant_id = ${data.tenantId}
        order by created_at desc
        limit 100
      `;
      return { ok: true, data: rows.map((row) => ({
        id: String(row.id),
        adminUserId: String(row.admin_user_id),
        targetUserId: row.target_user_id ? String(row.target_user_id) : null,
        tenantId: row.tenant_id ? String(row.tenant_id) : null,
        action: String(row.action),
        reason: String(row.reason ?? ""),
        beforeState: JSON.stringify(row.before_state ?? {}),
        afterState: JSON.stringify(row.after_state ?? {}),
        createdAt: new Date(String(row.created_at)).toISOString(),
      })) };
    } catch (error) {
      console.error("getPlatformSubscriptionAudit failed", error);
      return { ok: false, code: "unavailable", error: "تعذر تحميل سجل التدقيق" };
    }
  });
