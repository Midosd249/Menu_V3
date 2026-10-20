import { createHash, randomUUID } from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { authorizeMutation } from "@/lib/auth/authorization.server";
import { getSql } from "@/lib/db";
import { roleToAccessRole, type AccessRole, type FnResult, type Role } from "./types";

const roleSchema = z.enum(["admin", "editor"]);
const emailSchema = z.string().trim().toLowerCase().email().max(254);
const tokenSchema = z.string().trim().min(40).max(200);

type Invitation = {
  id: string;
  email: string;
  role: Role;
  expiresAt: string;
  createdAt: string;
};

function normalizeEmail(value: string) { return value.trim().toLowerCase(); }
function hashToken(token: string) { return createHash("sha256").update(token, "utf8").digest("hex"); }

function publicInvitation(row: { id: string; email: string; role: Role; expires_at: string; created_at: string }): Invitation {
  return { id: String(row.id), email: normalizeEmail(row.email), role: row.role, expiresAt: row.expires_at, createdAt: row.created_at };
}

async function ownerTenant(userId: string) {
  const member = await authorizeMutation(userId, "team.write");
  if (member.role !== "owner") throw new Error("TEAM_OWNER_REQUIRED");
  return member.tenantId;
}

export const listTeamInvitations = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<FnResult<{ invitations: Invitation[] }>> => {
    try {
      const sql = await getSql();
      const tenantId = await ownerTenant(context.userId);
      const rows = await sql<{ id: string; email: string; role: Role; expires_at: string; created_at: string }>`
        select id, email, role, expires_at, created_at from team_invitations
        where tenant_id = ${tenantId} and accepted_at is null and revoked_at is null and expires_at > now()
        order by created_at desc
      `;
      return { ok: true, data: { invitations: rows.map(publicInvitation) } };
    } catch (err) {
      if (err instanceof Error && err.message === "TEAM_OWNER_REQUIRED") return { ok: false, code: "forbidden", error: "إدارة الدعوات متاحة لمالك النشاط فقط" };
      console.error("listTeamInvitations failed", err);
      return { ok: false, code: "unavailable", error: "تعذر تحميل الدعوات" };
    }
  });

export const createTeamInvitation = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ email: emailSchema, role: roleSchema }))
  .handler(async ({ context, data }): Promise<FnResult<{ invitation: Invitation; token: string }>> => {
    try {
      const sql = await getSql();
      const tenantId = await ownerTenant(context.userId);
      const email = normalizeEmail(data.email);
      const accessRole: AccessRole = roleToAccessRole(data.role);
      const token = `${randomUUID()}${randomUUID().replaceAll("-", "")}`;
      const tokenHash = hashToken(token);
      const id = randomUUID();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      const result = await sql.transaction(async (tx) => {
        const existingMember = await tx.query<{ user_id: string }>(
          'select tm.user_id from tenant_members tm join "user" u on u.id = tm.user_id where tm.tenant_id = $1 and lower(u.email) = $2 limit 1',
          [tenantId, email],
        );
        if (existingMember[0]) return { error: "member" as const };
        // The existing partial unique index includes expired unrevoked rows.
        // Revoke expired invitations in this transaction before re-issuing.
        await tx.query(
          'update team_invitations set revoked_at = now() where tenant_id = $1 and lower(email) = $2 and accepted_at is null and revoked_at is null and expires_at <= now()',
          [tenantId, email],
        );
        const existing = await tx.query<{ id: string }>(
          'select id from team_invitations where tenant_id = $1 and lower(email) = $2 and accepted_at is null and revoked_at is null limit 1',
          [tenantId, email],
        );
        if (existing[0]) return { error: "pending" as const };
        const rows = await tx.query<{ id: string; email: string; role: Role; expires_at: string; created_at: string }>(
          'insert into team_invitations (id, tenant_id, email, role, token_hash, expires_at, created_by) values ($1, $2, $3, $4, $5, $6, $7) returning id, email, role, expires_at, created_at',
          [id, tenantId, email, data.role, tokenHash, expiresAt, context.userId],
        );
        return { row: rows[0] };
      });
      if ("error" in result) {
        if (result.error === "member") return { ok: false, code: "invalid", error: "هذا البريد عضو بالفعل في النشاط" };
        return { ok: false, code: "invalid", error: "توجد دعوة نشطة لهذا البريد بالفعل" };
      }
      if (!result.row) return { ok: false, code: "unavailable", error: "تعذر إنشاء الدعوة" };
      // The invitation schema keeps the legacy role; acceptance writes canonical access_role.
      void accessRole;
      return { ok: true, data: { invitation: publicInvitation(result.row), token } };
    } catch (err) {
      if (err instanceof Error && err.message === "TEAM_OWNER_REQUIRED") return { ok: false, code: "forbidden", error: "إنشاء الدعوات متاح لمالك النشاط فقط" };
      if (typeof err === "object" && err !== null && "code" in err && (err as { code?: string }).code === "23505") {
        return { ok: false, code: "invalid", error: "توجد دعوة نشطة لهذا البريد بالفعل" };
      }
      console.error("createTeamInvitation failed", err);
      return { ok: false, code: "unavailable", error: "تعذر إنشاء الدعوة" };
    }
  });

export const revokeTeamInvitation = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ invitationId: z.string().min(1) }))
  .handler(async ({ context, data }): Promise<FnResult<null>> => {
    try {
      const sql = await getSql();
      const tenantId = await ownerTenant(context.userId);
      const rows = await sql<{ id: string }>`
        update team_invitations set revoked_at = now()
        where id = ${data.invitationId} and tenant_id = ${tenantId} and accepted_at is null and revoked_at is null
        returning id
      `;
      if (!rows[0]) return { ok: false, code: "not_found", error: "الدعوة غير موجودة" };
      return { ok: true, data: null };
    } catch (err) {
      if (err instanceof Error && err.message === "TEAM_OWNER_REQUIRED") return { ok: false, code: "forbidden", error: "إلغاء الدعوات متاح لمالك النشاط فقط" };
      console.error("revokeTeamInvitation failed", err);
      return { ok: false, code: "unavailable", error: "تعذر إلغاء الدعوة" };
    }
  });

export const acceptTeamInvitation = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ token: tokenSchema }))
  .handler(async ({ context, data }): Promise<FnResult<{ tenantId: string; role: Role }>> => {
    try {
      const sql = await getSql();
      const tokenHash = hashToken(data.token);
      const userRows = await sql.query<{ email: string; email_verified: boolean }>(
        'select email, "emailVerified" as email_verified from "user" where id = $1 limit 1',
        [context.userId],
      );
      const user = userRows[0];
      if (!user?.email || user.email_verified !== true) return { ok: false, code: "forbidden", error: "تحقق من بريد حسابك قبل قبول الدعوة" };
      const email = normalizeEmail(user.email);
      const accepted = await sql.transaction(async (tx) => {
        // Lock the invitation row so concurrent requests cannot both consume it.
        const invitations = await tx.query<{ id: string; tenant_id: string; email: string; role: Role }>(
          'select id, tenant_id, email, role from team_invitations where token_hash = $1 and accepted_at is null and revoked_at is null and expires_at > now() limit 1 for update',
          [tokenHash],
        );
        const invitation = invitations[0];
        if (!invitation || normalizeEmail(invitation.email) !== email) return { error: "invalid" as const };
        const existing = await tx.query<{ role: Role }>(
          'select role from tenant_members where tenant_id = $1 and user_id = $2 limit 1',
          [invitation.tenant_id, context.userId],
        );
        if (existing[0]) {
          if (existing[0].role !== invitation.role) return { error: "member" as const };
          const consumed = await tx.query<{ id: string }>(
            'update team_invitations set accepted_at = now() where id = $1 and accepted_at is null and revoked_at is null returning id',
            [invitation.id],
          );
          if (!consumed[0]) return { error: "invalid" as const };
          return { tenantId: invitation.tenant_id, role: existing[0].role };
        }
        const accessRole = roleToAccessRole(invitation.role);
        await tx.query(
          'insert into tenant_members (tenant_id, user_id, role, access_role, is_active) values ($1, $2, $3, $4, true)',
          [invitation.tenant_id, context.userId, invitation.role, accessRole],
        );
        const consumed = await tx.query<{ id: string }>(
          'update team_invitations set accepted_at = now() where id = $1 and accepted_at is null and revoked_at is null returning id',
          [invitation.id],
        );
        if (!consumed[0]) throw new Error("INVITATION_CONSUME_RACE");
        return { tenantId: invitation.tenant_id, role: invitation.role };
      });
      if ("error" in accepted) return { ok: false, code: "forbidden", error: accepted.error === "member" ? "هذا الحساب عضو بالفعل بدور مختلف. تواصل مع مالك النشاط." : "الدعوة غير صالحة أو منتهية أو لا تخص هذا الحساب" };
      return { ok: true, data: accepted };
    } catch (err) {
      console.error("acceptTeamInvitation failed", err);
      return { ok: false, code: "unavailable", error: "تعذر قبول الدعوة حالياً" };
    }
  });

export type TeamInvitationPreview = {
  email: string;
  role: "admin" | "editor";
  expiresAt: string;
  tenantNameAr: string;
  tenantNameEn: string;
  status: "pending" | "expired" | "revoked" | "accepted";
};

/** Token possession reveals only the invitation summary; this read never consumes it. */
export const getTeamInvitationPreview = createServerFn({ method: "POST" })
  .validator(z.object({ token: tokenSchema }))
  .handler(async ({ data }): Promise<FnResult<{ invitation: TeamInvitationPreview }>> => {
    try {
      const sql = await getSql();
      const tokenHash = hashToken(data.token);
      const rows = await sql.query<{ email: string; role: "admin" | "editor"; expires_at: string; accepted_at: string | null; revoked_at: string | null; tenant_name_ar: string; tenant_name_en: string }>(
        'select i.email, i.role, i.expires_at, i.accepted_at, i.revoked_at, t.name_ar as tenant_name_ar, t.name_en as tenant_name_en from team_invitations i join tenants t on t.id = i.tenant_id where i.token_hash = $1 limit 1',
        [tokenHash],
      );
      const row = rows[0];
      if (!row) return { ok: false, code: "not_found", error: "رابط الدعوة غير صالح" };
      const status: TeamInvitationPreview["status"] = row.accepted_at ? "accepted" : row.revoked_at ? "revoked" : new Date(row.expires_at).getTime() <= Date.now() ? "expired" : "pending";
      return { ok: true, data: { invitation: { email: normalizeEmail(row.email), role: row.role, expiresAt: row.expires_at, tenantNameAr: row.tenant_name_ar, tenantNameEn: row.tenant_name_en, status } } };
    } catch (err) {
      console.error("getTeamInvitationPreview failed", err);
      return { ok: false, code: "unavailable", error: "تعذر تحميل تفاصيل الدعوة" };
    }
  });
