import { createHash, randomUUID } from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { authorizeMutation } from "@/lib/auth/authorization.server";
import { getSql } from "@/lib/db";
import type { FnResult, Role } from "./types";

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

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function hashToken(token: string) {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

function publicInvitation(row: {
  id: string;
  email: string;
  role: Role;
  expires_at: string;
  created_at: string;
}): Invitation {
  return {
    id: String(row.id),
    email: normalizeEmail(row.email),
    role: row.role,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
  };
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
      const rows = await sql<{
        id: string;
        email: string;
        role: Role;
        expires_at: string;
        created_at: string;
      }>`
        select id, email, role, expires_at, created_at
        from team_invitations
        where tenant_id = ${tenantId}
          and accepted_at is null
          and revoked_at is null
          and expires_at > now()
        order by created_at desc
      `;
      return { ok: true, data: { invitations: rows.map(publicInvitation) } };
    } catch (err) {
      if (err instanceof Error && err.message === "TEAM_OWNER_REQUIRED") {
        return { ok: false, code: "forbidden", error: "إدارة الدعوات متاحة لمالك النشاط فقط" };
      }
      console.error("listTeamInvitations failed", err);
      return { ok: false, code: "unavailable", error: "تعذر تحميل الدعوات" };
    }
  });

export const createTeamInvitation = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      email: emailSchema,
      role: roleSchema,
    }),
  )
  .handler(async ({ context, data }): Promise<FnResult<{ invitation: Invitation; token: string }>> => {
    try {
      const sql = await getSql();
      const tenantId = await ownerTenant(context.userId);
      const email = normalizeEmail(data.email);

      const existingMember = await sql<{ user_id: string }>`
        select tm.user_id
        from tenant_members tm
        join "user" u on u.id = tm.user_id
        where tm.tenant_id = ${tenantId} and lower(u.email) = ${email}
        limit 1
      `;
      if (existingMember[0]) {
        return { ok: false, code: "invalid", error: "هذا البريد عضو بالفعل في النشاط" };
      }

      const existing = await sql<{ id: string }>`
        select id from team_invitations
        where tenant_id = ${tenantId}
          and lower(email) = ${email}
          and accepted_at is null
          and revoked_at is null
          and expires_at > now()
        limit 1
      `;
      if (existing[0]) {
        return { ok: false, code: "invalid", error: "توجد دعوة نشطة لهذا البريد بالفعل" };
      }

      const token = `${randomUUID()}${randomUUID().replaceAll("-", "")}`;
      const tokenHash = hashToken(token);
      const id = randomUUID();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      const rows = await sql<{
        id: string;
        email: string;
        role: Role;
        expires_at: string;
        created_at: string;
      }>`
        insert into team_invitations
          (id, tenant_id, email, role, token_hash, expires_at, created_by)
        values
          (${id}, ${tenantId}, ${email}, ${data.role}, ${tokenHash}, ${expiresAt}, ${context.userId})
        returning id, email, role, expires_at, created_at
      `;
      const row = rows[0];
      if (!row) return { ok: false, code: "unavailable", error: "تعذر إنشاء الدعوة" };
      return { ok: true, data: { invitation: publicInvitation(row), token } };
    } catch (err) {
      if (err instanceof Error && err.message === "TEAM_OWNER_REQUIRED") {
        return { ok: false, code: "forbidden", error: "إنشاء الدعوات متاح لمالك النشاط فقط" };
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
        update team_invitations
        set revoked_at = now()
        where id = ${data.invitationId}
          and tenant_id = ${tenantId}
          and accepted_at is null
          and revoked_at is null
        returning id
      `;
      if (!rows[0]) return { ok: false, code: "not_found", error: "الدعوة غير موجودة" };
      return { ok: true, data: null };
    } catch (err) {
      if (err instanceof Error && err.message === "TEAM_OWNER_REQUIRED") {
        return { ok: false, code: "forbidden", error: "إلغاء الدعوات متاح لمالك النشاط فقط" };
      }
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
      const userRows = await sql<{ email: string }>`
        select email from "user" where id = ${context.userId} limit 1
      `;
      const user = userRows[0];
      if (!user?.email) return { ok: false, code: "forbidden", error: "تعذر التحقق من بريد الحساب" };
      const email = normalizeEmail(user.email);
      const invitations = await sql<{
        id: string;
        tenant_id: string;
        email: string;
        role: Role;
      }>`
        select id, tenant_id, email, role
        from team_invitations
        where token_hash = ${tokenHash}
          and accepted_at is null
          and revoked_at is null
          and expires_at > now()
        limit 1
      `;
      const invitation = invitations[0];
      if (!invitation || normalizeEmail(invitation.email) !== email) {
        return { ok: false, code: "forbidden", error: "الدعوة غير صالحة أو لا تخص هذا الحساب" };
      }

      const existing = await sql<{ role: Role }>`
        select role from tenant_members
        where tenant_id = ${invitation.tenant_id} and user_id = ${context.userId}
        limit 1
      `;
      if (existing[0]) {
        await sql`
          update team_invitations set accepted_at = now()
          where id = ${invitation.id}
        `;
        return { ok: true, data: { tenantId: invitation.tenant_id, role: existing[0].role } };
      }

      await sql`
        insert into tenant_members (tenant_id, user_id, role)
        values (${invitation.tenant_id}, ${context.userId}, ${invitation.role})
      `;
      await sql`
        update team_invitations set accepted_at = now()
        where id = ${invitation.id}
      `;
      return { ok: true, data: { tenantId: invitation.tenant_id, role: invitation.role } };
    } catch (err) {
      console.error("acceptTeamInvitation failed", err);
      return { ok: false, code: "unavailable", error: "تعذر قبول الدعوة حالياً" };
    }
  });
