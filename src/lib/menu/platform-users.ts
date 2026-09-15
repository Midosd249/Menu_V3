import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { requirePlatformAdmin } from "@/lib/auth/platform-admin.server";
import { getSql } from "@/lib/db";
import { normalizePhoneDigits } from "./public-actions";
import type { FnResult } from "./types";

export type PlatformUser = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  phoneVerified: boolean;
  banned: boolean;
  banReason: string;
  banExpires: string | null;
  role: string;
  createdAt: string;
  tenantCount: number;
  isPlatformAdmin: boolean;
};

async function assertAdmin(userId: string): Promise<FnResult<true>> {
  try {
    await requirePlatformAdmin(userId);
    return { ok: true, data: true };
  } catch (error) {
    if (error instanceof Error && error.message === "PLATFORM_ADMIN_REQUIRED") return { ok: false, code: "forbidden", error: "هذه العملية مخصصة لمالك المنصة" };
    console.error("platform user authorization failed", error);
    return { ok: false, code: "unavailable", error: "تعذر التحقق من صلاحيات مالك المنصة" };
  }
}

function iso(value: unknown): string | null {
  if (!value) return null;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function mapUser(row: Record<string, unknown>): PlatformUser {
  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    email: String(row.email ?? ""),
    phoneNumber: String(row.phone_number ?? ""),
    phoneVerified: Boolean(row.phone_verified),
    banned: Boolean(row.banned),
    banReason: String(row.ban_reason ?? ""),
    banExpires: iso(row.ban_expires),
    role: String(row.role ?? "user"),
    createdAt: String(row.created_at),
    tenantCount: Number(row.tenant_count ?? 0),
    isPlatformAdmin: Boolean(row.is_platform_admin),
  };
}

export const getPlatformUsers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ q: z.string().trim().max(120).optional() }))
  .handler(async ({ context, data }): Promise<FnResult<PlatformUser[]>> => {
    const permission = await assertAdmin(context.userId);
    if (!permission.ok) return permission;
    try {
      const sql = await getSql();
      const q = data.q ? `%${data.q.toLowerCase()}%` : null;
      const rows = await sql<Record<string, unknown>>`
        select
          u."id", u."name", u."email", coalesce(u."phoneNumber", '') as phone_number,
          coalesce(u."phoneNumberVerified", false) as phone_verified,
          coalesce(u."banned", false) as banned, coalesce(u."banReason", '') as ban_reason,
          u."banExpires" as ban_expires, coalesce(u."role", 'user') as role,
          u."createdAt" as created_at,
          (select count(*)::int from tenant_members tm where tm.user_id = u."id") as tenant_count,
          menu_v3.is_platform_admin(u."id") as is_platform_admin
        from "user" u
        where (
          ${q}::text is null
          or lower(u."name") like ${q}
          or lower(u."email") like ${q}
          or coalesce(u."phoneNumber", '') like ${q}
        )
        order by u."createdAt" desc
        limit 500
      `;
      return { ok: true, data: rows.map(mapUser) };
    } catch (error) {
      console.error("getPlatformUsers failed", error);
      return { ok: false, code: "unavailable", error: "تعذر تحميل حسابات المنصة" };
    }
  });

export const setPlatformUserBan = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ userId: z.string().min(1).max(128), banned: z.boolean(), reason: z.string().trim().max(500).optional() }))
  .handler(async ({ context, data }): Promise<FnResult<PlatformUser>> => {
    const permission = await assertAdmin(context.userId);
    if (!permission.ok) return permission;
    if (data.userId === context.userId) return { ok: false, code: "forbidden", error: "لا يمكن لمالك المنصة تجميد حسابه الحالي" };
    try {
      const sql = await getSql();
      const adminTarget = await sql<{ is_admin: boolean }>`select menu_v3.is_platform_admin(${data.userId}) as is_admin`;
      if (adminTarget[0]?.is_admin) return { ok: false, code: "forbidden", error: "لا يمكن تجميد حساب مالك منصة آخر من هذا المسار" };
      const rows = await sql<Record<string, unknown>>`
        update "user"
        set "banned" = ${data.banned},
            "banReason" = ${data.banned ? (data.reason || "Platform Owner action") : null},
            "banExpires" = null,
            "updatedAt" = now()
        where "id" = ${data.userId}
        returning "id", "name", "email", "phoneNumber" as phone_number, "phoneNumberVerified" as phone_verified,
          "banned", "banReason" as ban_reason, "banExpires" as ban_expires, "role", "createdAt" as created_at
      `;
      if (!rows[0]) return { ok: false, code: "not_found", error: "الحساب غير موجود" };
      if (data.banned) await sql`delete from "session" where "userId" = ${data.userId}`;
      const enriched = await sql<Record<string, unknown>>`
        select u."id", u."name", u."email", coalesce(u."phoneNumber", '') as phone_number,
          coalesce(u."phoneNumberVerified", false) as phone_verified, coalesce(u."banned", false) as banned,
          coalesce(u."banReason", '') as ban_reason, u."banExpires" as ban_expires, coalesce(u."role", 'user') as role,
          u."createdAt" as created_at, (select count(*)::int from tenant_members tm where tm.user_id = u."id") as tenant_count,
          menu_v3.is_platform_admin(u."id") as is_platform_admin
        from "user" u where u."id" = ${data.userId} limit 1
      `;
      return { ok: true, data: mapUser(enriched[0]!) };
    } catch (error) {
      console.error("setPlatformUserBan failed", error);
      return { ok: false, code: "unavailable", error: "تعذر تحديث حالة الحساب" };
    }
  });

export const verifyPlatformUserPhone = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ userId: z.string().min(1).max(128), phoneNumber: z.string().trim().min(7).max(30) }))
  .handler(async ({ context, data }): Promise<FnResult<PlatformUser>> => {
    const permission = await assertAdmin(context.userId);
    if (!permission.ok) return permission;
    try {
      const sql = await getSql();
      const phone = normalizePhoneDigits(data.phoneNumber, "SA");
      if (!phone) return { ok: false, code: "invalid", error: "رقم الجوال غير صالح" };
      const normalized = `+${phone}`;
      const duplicate = await sql`select "id" from "user" where "phoneNumber" = ${normalized} and "id" <> ${data.userId} limit 1`;
      if (duplicate[0]) return { ok: false, code: "conflict", error: "رقم الجوال مرتبط بحساب آخر" };
      const rows = await sql`update "user" set "phoneNumber" = ${normalized}, "phoneNumberVerified" = true, "updatedAt" = now() where "id" = ${data.userId} returning "id"`;
      if (!rows[0]) return { ok: false, code: "not_found", error: "الحساب غير موجود" };
      const enriched = await sql<Record<string, unknown>>`
        select u."id", u."name", u."email", coalesce(u."phoneNumber", '') as phone_number,
          coalesce(u."phoneNumberVerified", false) as phone_verified, coalesce(u."banned", false) as banned,
          coalesce(u."banReason", '') as ban_reason, u."banExpires" as ban_expires, coalesce(u."role", 'user') as role,
          u."createdAt" as created_at, (select count(*)::int from tenant_members tm where tm.user_id = u."id") as tenant_count,
          menu_v3.is_platform_admin(u."id") as is_platform_admin
        from "user" u where u."id" = ${data.userId} limit 1
      `;
      return { ok: true, data: mapUser(enriched[0]!) };
    } catch (error) {
      console.error("verifyPlatformUserPhone failed", error);
      return { ok: false, code: "unavailable", error: "تعذر اعتماد رقم الجوال" };
    }
  });

export const deletePlatformUser = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ userId: z.string().min(1).max(128) }))
  .handler(async ({ context, data }): Promise<FnResult<{ id: string }>> => {
    const permission = await assertAdmin(context.userId);
    if (!permission.ok) return permission;
    if (data.userId === context.userId) return { ok: false, code: "forbidden", error: "لا يمكن حذف حساب مالك المنصة الحالي" };
    try {
      const sql = await getSql();
      const target = await sql<{ is_admin: boolean }>`select menu_v3.is_platform_admin(${data.userId}) as is_admin`;
      if (target[0]?.is_admin) return { ok: false, code: "forbidden", error: "لا يمكن حذف حساب مالك منصة آخر من هذا المسار" };
      const tenantRefs = await sql<{ count: number }>`select count(*)::int as count from tenant_members where user_id = ${data.userId}`;
      const ownerRefs = await sql<{ count: number }>`select count(*)::int as count from tenants where owner_user_id = ${data.userId}`;
      if (Number(tenantRefs[0]?.count ?? 0) > 0 || Number(ownerRefs[0]?.count ?? 0) > 0) {
        return { ok: false, code: "conflict", error: "لا يمكن حذف حساب مرتبط بمطعم. جمّد الحساب أو افصل ملكية المطعم أولاً." };
      }
      await sql`delete from "verification" where "identifier" = ${data.userId}`;
      await sql`delete from "user" where "id" = ${data.userId}`;
      return { ok: true, data: { id: data.userId } };
    } catch (error) {
      console.error("deletePlatformUser failed", error);
      return { ok: false, code: "unavailable", error: "تعذر حذف الحساب" };
    }
  });
