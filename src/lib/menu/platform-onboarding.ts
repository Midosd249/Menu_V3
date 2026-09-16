import { createHash, randomBytes } from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { requirePlatformAdmin } from "@/lib/auth/platform-admin.server";
import { getSql } from "@/lib/db";
import { newId, slugify } from "@/lib/utils";
import { normalizePhoneDigits } from "./public-actions";
import type { FnResult } from "./types";

const tokenSchema = z.string().trim().min(40).max(200);
const leadIdSchema = z.string().trim().min(1).max(100);
function hashToken(token: string) { return createHash("sha256").update(token).digest("hex"); }

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

export type CustomerAccessStatus = "none" | "pending" | "action_required" | "approved" | "converted" | "rejected";

export const getMyCustomerAccessStatus = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<FnResult<{ status: CustomerAccessStatus }>> => {
    try {
      const sql = await getSql();
      const activation = await sql<{ activation_status: string }>`select activation_status from leads where account_user_id = ${context.userId} limit 1`;
      const activationStatus = activation[0]?.activation_status;
      if (activationStatus === "pending") return { ok: true, data: { status: "pending" } };
      if (activationStatus === "action_required") return { ok: true, data: { status: "action_required" } };
      if (activationStatus === "approved") return { ok: true, data: { status: "approved" } };
      if (activationStatus === "activated") return { ok: true, data: { status: "converted" } };
      if (activationStatus === "rejected") return { ok: true, data: { status: "rejected" } };

      const users = await sql<{ email: string }>`select "email" from "user" where "id" = ${context.userId} limit 1`;
      const email = users[0]?.email?.trim().toLowerCase();
      if (!email) return { ok: true, data: { status: "none" } };
      const leads = await sql<{ id: string; status: string }>`select id, status from leads where lower(trim(contact_email)) = ${email} order by updated_at desc, created_at desc limit 1`;
      const lead = leads[0];
      if (!lead) return { ok: true, data: { status: "none" } };
      if (lead.status === "converted") return { ok: true, data: { status: "converted" } };
      if (lead.status === "lost") return { ok: true, data: { status: "rejected" } };
      const activeApproval = await sql`select id from lead_onboarding where lead_id = ${lead.id} and approved_at is not null and used_at is null and revoked_at is null and expires_at > now() order by created_at desc limit 1`;
      if (activeApproval[0]) return { ok: true, data: { status: "approved" } };
      return { ok: true, data: { status: "pending" } };
    } catch (err) {
      console.error("getMyCustomerAccessStatus failed", err);
      return { ok: false, code: "unavailable", error: "تعذر التحقق من حالة طلبك" };
    }
  });

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
      const lead = await sql`select id from leads where id = ${data.leadId} limit 1 for update`;
      if (!lead[0]) return { ok: false, code: "not_found", error: "العميل المحتمل غير موجود" };
      const existing = await sql`select id from lead_onboarding where lead_id = ${data.leadId} and used_at is null and revoked_at is null and expires_at > now() order by created_at desc limit 1`;
      if (existing[0]) return { ok: false, code: "conflict", error: "يوجد رابط تسجيل نشط بالفعل. ألغِ الرابط الحالي أولاً إذا أردت إنشاء رابط جديد." };
      const token = randomBytes(32).toString("base64url");
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      await sql`update lead_onboarding set revoked_at = now() where lead_id = ${data.leadId} and used_at is null and revoked_at is null`;
      await sql`insert into lead_onboarding (id, lead_id, token_hash, expires_at, approved_at, created_by) values (${newId()}, ${data.leadId}, ${hashToken(token)}, ${expiresAt}, now(), ${context.userId})`;
      await sql`update leads set status = 'qualified', updated_at = now() where id = ${data.leadId}`;
      const status = mapStatus({ expires_at: expiresAt, approved_at: new Date().toISOString() }, data.leadId);
      return { ok: true, data: { ...status, token, registrationUrl: `/onboarding/${token}` } };
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
      const rows = await sql<Record<string, unknown>>`select lo.id, lo.lead_id, lo.expires_at, lo.used_at, lo.revoked_at, l.business_name, l.city, l.contact_phone, l.contact_email from lead_onboarding lo join leads l on l.id = lo.lead_id where lo.token_hash = ${hashToken(data.token)} limit 1`;
      const onboarding = rows[0];
      if (!onboarding) return { ok: false, code: "not_found", error: "رابط التسجيل غير صالح" };
      if (onboarding.used_at) return { ok: false, code: "invalid", error: "رابط التسجيل استُخدم بالفعل" };
      if (onboarding.revoked_at || new Date(String(onboarding.expires_at)) <= new Date()) return { ok: false, code: "invalid", error: "رابط التسجيل منتهي أو ملغى" };
      const users = await sql<{ email: string }>`select "email" from "user" where "id" = ${context.userId} limit 1`;
      const accountEmail = users[0]?.email?.trim().toLowerCase();
      const leadEmail = String(onboarding.contact_email ?? "").trim().toLowerCase();
      if (!accountEmail || !leadEmail || accountEmail !== leadEmail) return { ok: false, code: "forbidden", error: "استخدم الحساب المرتبط بالبريد الإلكتروني في طلب الخدمة" };
      const phone = normalizePhoneDigits(String(onboarding.contact_phone ?? ""), "SA");
      if (phone) {
        const phoneOwner = await sql`select "id" from "user" where "phoneNumber" = ${`+${phone}`} and "id" <> ${context.userId} limit 1`;
        if (phoneOwner[0]) return { ok: false, code: "conflict", error: "رقم الجوال مرتبط بحساب آخر. راجع مالك المنصة." };
        await sql`update "user" set "phoneNumber" = ${`+${phone}`}, "phoneNumberVerified" = true, "updatedAt" = now() where "id" = ${context.userId}`;
      }
      const existingMember = await sql`select tenant_id from tenant_members where user_id = ${context.userId} and is_active = true limit 1`;
      if (existingMember[0]) {
        const existingTenant = await sql<{ slug: string }>`select slug from tenants where id = ${String(existingMember[0].tenant_id)} limit 1`;
        if (existingTenant[0]) return { ok: true, data: { tenantId: String(existingMember[0].tenant_id), slug: existingTenant[0].slug, menuUrl: `/m/${existingTenant[0].slug}/main?src=onboarding` } };
      }
      const slugBase = slugify(String(onboarding.business_name)) || `restaurant-${Date.now().toString(36)}`;
      const slug = `${slugBase}-${String(onboarding.id).slice(-6).toLowerCase()}`.slice(0, 63);
      const tenantId = newId();
      const branchId = newId();
      const result = await sql<{ tenant_id: string; slug: string }>`select * from menu_v3.activate_legacy_customer_workspace(${String(onboarding.id)}, ${context.userId}, ${tenantId}, ${branchId}, ${slug})`;
      const activated = result[0];
      if (!activated) return { ok: false, code: "unavailable", error: "تعذر إكمال إنشاء مساحة المطعم" };
      return { ok: true, data: { tenantId: activated.tenant_id, slug: activated.slug, menuUrl: `/m/${activated.slug}/main?src=onboarding` } };
    } catch (err) {
      console.error("activateLeadOnboarding failed", err);
      return { ok: false, code: "unavailable", error: "تعذر إكمال إنشاء مساحة المطعم" };
    }
  });
