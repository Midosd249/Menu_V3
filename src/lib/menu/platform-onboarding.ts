import { createHash, randomBytes } from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { requirePlatformAdmin } from "@/lib/auth/platform-admin.server";
import { getSql } from "@/lib/db";
import { newId, slugify } from "@/lib/utils";
import type { FnResult } from "./types";

const tokenSchema = z.string().trim().min(40).max(200);
const leadIdSchema = z.string().trim().min(1).max(100);

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

async function assertAdmin(userId: string): Promise<FnResult<true>> {
  try {
    await requirePlatformAdmin(userId);
    return { ok: true, data: true };
  } catch (err) {
    if (err instanceof Error && err.message === "PLATFORM_ADMIN_REQUIRED") return { ok: false, code: "forbidden", error: "هذه الصفحة مخصصة لمالك المنصة" };
    console.error("platform onboarding admin check failed", err);
    return { ok: false, code: "unavailable", error: "تعذر التحقق من صلاحيات الإدارة" };
  }
}

export type LeadOnboardingStatus = {
  leadId: string;
  status: "pending" | "used" | "revoked" | "expired" | "none";
  expiresAt: string | null;
  approvedAt: string | null;
  usedAt: string | null;
  tenantId: string | null;
  tenantSlug: string | null;
  registrationUrl: string | null;
  menuUrl: string | null;
};

function mapStatus(row: Record<string, unknown> | undefined, leadId: string): LeadOnboardingStatus {
  if (!row) return { leadId, status: "none", expiresAt: null, approvedAt: null, usedAt: null, tenantId: null, tenantSlug: null, registrationUrl: null, menuUrl: null };
  const expiresAt = row.expires_at ? new Date(String(row.expires_at)).toISOString() : null;
  const usedAt = row.used_at ? new Date(String(row.used_at)).toISOString() : null;
  const approvedAt = row.approved_at ? new Date(String(row.approved_at)).toISOString() : null;
  const status = row.used_at ? "used" : row.revoked_at ? "revoked" : expiresAt && new Date(expiresAt) <= new Date() ? "expired" : "pending";
  const slug = row.tenant_slug ? String(row.tenant_slug) : null;
  return { leadId, status, expiresAt, approvedAt, usedAt, tenantId: row.tenant_id ? String(row.tenant_id) : null, tenantSlug: slug, registrationUrl: null, menuUrl: slug ? `/m/${slug}/main?src=onboarding` : null };
}

export const getLeadOnboardingStatus = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ leadId: leadIdSchema }))
  .handler(async ({ context, data }): Promise<FnResult<LeadOnboardingStatus>> => {
    const permission = await assertAdmin(context.userId);
    if (!permission.ok) return permission;
    try {
      const sql = await getSql();
      const rows = await sql<Record<string, unknown>>`select lo.*, t.slug as tenant_slug from lead_onboarding lo left join tenants t on t.id = lo.tenant_id where lo.lead_id = ${data.leadId} order by lo.created_at desc limit 1`;
      return { ok: true, data: mapStatus(rows[0], data.leadId) };
    } catch (err) {
      console.error("getLeadOnboardingStatus failed", err);
      return { ok: false, code: "unavailable", error: "تعذر تحميل حالة التسجيل" };
    }
  });

export const approveLead = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ leadId: leadIdSchema }))
  .handler(async ({ context, data }): Promise<FnResult<LeadOnboardingStatus & { token: string; registrationUrl: string }>> => {
    const permission = await assertAdmin(context.userId);
    if (!permission.ok) return permission as FnResult<LeadOnboardingStatus & { token: string; registrationUrl: string }>;
    try {
      const sql = await getSql();
      const lead = await sql`select id from leads where id = ${data.leadId} limit 1`;
      if (!lead[0]) return { ok: false, code: "not_found", error: "العميل المحتمل غير موجود" };
      const existing = await sql`select id from lead_onboarding where lead_id = ${data.leadId} and used_at is null and revoked_at is null and expires_at > now() order by created_at desc limit 1`;
      if (existing[0]) return { ok: false, code: "conflict", error: "يوجد رابط تسجيل نشط بالفعل. ألغِ الرابط الحالي أولاً إذا أردت إنشاء رابط جديد." };
      const token = randomBytes(32).toString("base64url");
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      await sql`update lead_onboarding set revoked_at = now() where lead_id = ${data.leadId} and used_at is null and revoked_at is null`;
      await sql`insert into lead_onboarding (id, lead_id, token_hash, expires_at, approved_at, created_by) values (${newId()}, ${data.leadId}, ${hashToken(token)}, ${expiresAt}, now(), ${context.userId})`;
      await sql`update leads set status = 'qualified', updated_at = now() where id = ${data.leadId}`;
      const status = mapStatus({ expires_at: expiresAt, approved_at: new Date().toISOString() }, data.leadId);
      const registrationUrl = `/onboarding/${token}`;
      return { ok: true, data: { ...status, token, registrationUrl } };
    } catch (err) {
      console.error("approveLead failed", err);
      return { ok: false, code: "unavailable", error: "تعذر اعتماد العميل وإنشاء رابط التسجيل" };
    }
  });

export const revokeLeadOnboarding = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ leadId: leadIdSchema }))
  .handler(async ({ context, data }): Promise<FnResult<LeadOnboardingStatus>> => {
    const permission = await assertAdmin(context.userId);
    if (!permission.ok) return permission;
    try {
      const sql = await getSql();
      await sql`update lead_onboarding set revoked_at = now() where lead_id = ${data.leadId} and used_at is null and revoked_at is null`;
      const rows = await sql<Record<string, unknown>>`select lo.*, t.slug as tenant_slug from lead_onboarding lo left join tenants t on t.id = lo.tenant_id where lo.lead_id = ${data.leadId} order by lo.created_at desc limit 1`;
      return { ok: true, data: mapStatus(rows[0], data.leadId) };
    } catch (err) {
      console.error("revokeLeadOnboarding failed", err);
      return { ok: false, code: "unavailable", error: "تعذر إلغاء رابط التسجيل" };
    }
  });

export const activateLeadOnboarding = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ token: tokenSchema }))
  .handler(async ({ context, data }): Promise<FnResult<{ tenantId: string; slug: string; menuUrl: string }>> => {
    try {
      const sql = await getSql();
      const rows = await sql<Record<string, unknown>>`select lo.id, lo.lead_id, lo.expires_at, lo.used_at, lo.revoked_at, l.business_name, l.city, l.contact_phone from lead_onboarding lo join leads l on l.id = lo.lead_id where lo.token_hash = ${hashToken(data.token)} limit 1`;
      const onboarding = rows[0];
      if (!onboarding) return { ok: false, code: "not_found", error: "رابط التسجيل غير صالح" };
      if (onboarding.used_at) return { ok: false, code: "invalid", error: "رابط التسجيل استُخدم بالفعل" };
      if (onboarding.revoked_at || new Date(String(onboarding.expires_at)) <= new Date()) return { ok: false, code: "invalid", error: "رابط التسجيل منتهي أو ملغى" };
      const existingMember = await sql`select tenant_id from tenant_members where user_id = ${context.userId} and is_active = true limit 1`;
      if (existingMember[0]) return { ok: false, code: "conflict", error: "هذا الحساب مرتبط بمطعم بالفعل" };
      const slugBase = slugify(String(onboarding.business_name)) || `restaurant-${Date.now().toString(36)}`;
      let slug = slugBase;
      const clash = await sql`select id from tenants where slug = ${slug} limit 1`;
      if (clash[0]) slug = `${slugBase}-${Math.random().toString(36).slice(2, 6)}`;
      const tenantId = newId();
      const branchId = newId();
      await sql`insert into tenants (id, owner_user_id, slug, name_ar, name_en, city, whatsapp, is_published, is_active) values (${tenantId}, ${context.userId}, ${slug}, ${String(onboarding.business_name)}, '', ${String(onboarding.city ?? "")}, ${String(onboarding.contact_phone ?? "")}, false, true)`;
      await sql`insert into tenant_members (tenant_id, user_id, role) values (${tenantId}, ${context.userId}, 'owner')`;
      await sql`insert into branches (id, tenant_id, slug, name_ar, name_en, address_ar, is_active) values (${branchId}, ${tenantId}, 'main', 'الفرع الرئيسي', '', '', true)`;
      for (const day of [0, 1, 2, 3, 4, 5, 6]) await sql`insert into branch_hours (branch_id, weekday, opens_at, closes_at, is_closed) values (${branchId}, ${day}, ${day === 5 ? "13:00" : "07:00"}, '00:00', false)`;
      await sql`update lead_onboarding set used_at = now(), tenant_id = ${tenantId} where id = ${String(onboarding.id)} and used_at is null and revoked_at is null`;
      await sql`update leads set status = 'converted', updated_at = now() where id = ${String(onboarding.lead_id)}`;
      return { ok: true, data: { tenantId, slug, menuUrl: `/m/${slug}/main?src=onboarding` } };
    } catch (err) {
      console.error("activateLeadOnboarding failed", err);
      return { ok: false, code: "unavailable", error: "تعذر إكمال إنشاء مساحة المطعم" };
    }
  });
