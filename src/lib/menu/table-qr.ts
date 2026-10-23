import { createHash, randomBytes } from "node:crypto";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { newId } from "@/lib/utils";
import type { FnResult } from "./types";

export type ResolvedTableContext = {
  tableId: string;
  tableLabel: string;
  branchId: string;
  tenantId: string;
  tenantSlug: string;
  branchSlug: string;
  tokenId: string;
};

const TOKEN_BYTES = 32;

export function hashTableQrToken(plainToken: string): string {
  return createHash("sha256").update(plainToken, "utf8").digest("hex");
}

export function generateTableQrToken(): { plain: string; hash: string } {
  const plain = randomBytes(TOKEN_BYTES).toString("base64url");
  return { plain, hash: hashTableQrToken(plain) };
}

/**
 * Resolve an opaque table QR token to trusted tenant/branch/table context.
 * Server-only. Does not expose internal IDs beyond what is required for order association.
 * Returns null for invalid, revoked, expired, or inactive tables.
 */
export async function resolveTableQrToken(
  sql: Awaited<ReturnType<typeof getSql>>,
  plainToken: string,
): Promise<ResolvedTableContext | null> {
  const token = plainToken?.trim() ?? "";
  if (!token || token.length < 16 || token.length > 128) return null;
  const tokenHash = hashTableQrToken(token);

  const rows = await sql<{
    token_id: string;
    table_id: string;
    table_label: string;
    branch_id: string;
    tenant_id: string;
    tenant_slug: string;
    branch_slug: string;
    table_active: boolean;
    branch_active: boolean;
    tenant_active: boolean;
    tenant_published: boolean;
  }>`
    select
      t.id as token_id,
      rt.id as table_id,
      rt.label as table_label,
      rt.branch_id,
      rt.tenant_id,
      ten.slug as tenant_slug,
      b.slug as branch_slug,
      rt.is_active as table_active,
      b.is_active as branch_active,
      ten.is_active as tenant_active,
      ten.is_published as tenant_published
    from table_qr_tokens t
    join restaurant_tables rt on rt.id = t.table_id
    join branches b on b.id = rt.branch_id
    join tenants ten on ten.id = rt.tenant_id
    where t.token_hash = ${tokenHash}
      and t.revoked_at is null
      and (t.expires_at is null or t.expires_at > now())
    limit 1
  `;

  const row = rows[0];
  if (!row) return null;
  if (!row.table_active || !row.branch_active || !row.tenant_active || !row.tenant_published) {
    return null;
  }

  return {
    tableId: String(row.table_id),
    tableLabel: String(row.table_label),
    branchId: String(row.branch_id),
    tenantId: String(row.tenant_id),
    tenantSlug: String(row.tenant_slug),
    branchSlug: String(row.branch_slug),
    tokenId: String(row.token_id),
  };
}

/**
 * Minimal server capability to provision a table and its first QR token.
 * Intended for owner/staff use only (callers must enforce authorization).
 * Returns the plain token once; it is never stored in plain form.
 */
export async function createRestaurantTableWithToken(
  sql: Awaited<ReturnType<typeof getSql>>,
  input: {
    tenantId: string;
    branchId: string;
    label: string;
    sortOrder?: number;
    createdBy?: string;
  },
): Promise<FnResult<{ tableId: string; plainToken: string }>> {
  const label = input.label.trim();
  if (!label || label.length > 80) {
    return { ok: false, code: "invalid", error: "تسمية الطاولة غير صالحة" };
  }

  const tableId = newId();
  const { plain, hash } = generateTableQrToken();
  const tokenId = newId();

  try {
    await sql.begin(async (tx) => {
      await tx`
        insert into restaurant_tables (id, tenant_id, branch_id, label, sort_order, is_active)
        values (${tableId}, ${input.tenantId}, ${input.branchId}, ${label}, ${input.sortOrder ?? 0}, true)
      `;
      await tx`
        insert into table_qr_tokens (id, table_id, tenant_id, branch_id, token_hash, created_by)
        values (${tokenId}, ${tableId}, ${input.tenantId}, ${input.branchId}, ${hash}, ${input.createdBy ?? null})
      `;
    });
    return { ok: true, data: { tableId, plainToken: plain } };
  } catch (err) {
    console.error("createRestaurantTableWithToken failed", err);
    if (typeof err === "object" && err !== null && "code" in err && (err as { code?: string }).code === "23505") {
      return { ok: false, code: "invalid", error: "طاولة بنفس الاسم موجودة بالفعل في هذا الفرع" };
    }
    return { ok: false, code: "unavailable", error: "تعذر إنشاء الطاولة" };
  }
}

export async function rotateTableQrToken(
  sql: Awaited<ReturnType<typeof getSql>>,
  input: { tableId: string; tenantId: string; createdBy?: string },
): Promise<FnResult<{ plainToken: string }>> {
  const { plain, hash } = generateTableQrToken();
  const tokenId = newId();

  try {
    const tableRows = await sql<{ id: string; branch_id: string }>`
      select id, branch_id from restaurant_tables
      where id = ${input.tableId} and tenant_id = ${input.tenantId} and is_active = true
      limit 1
    `;
    const table = tableRows[0];
    if (!table) return { ok: false, code: "not_found", error: "الطاولة غير موجودة" };

    await sql.begin(async (tx) => {
      await tx`
        update table_qr_tokens
        set revoked_at = now()
        where table_id = ${input.tableId} and revoked_at is null
      `;
      await tx`
        insert into table_qr_tokens (id, table_id, tenant_id, branch_id, token_hash, created_by)
        values (${tokenId}, ${input.tableId}, ${input.tenantId}, ${table.branch_id}, ${hash}, ${input.createdBy ?? null})
      `;
    });
    return { ok: true, data: { plainToken: plain } };
  } catch (err) {
    console.error("rotateTableQrToken failed", err);
    return { ok: false, code: "unavailable", error: "تعذر تدوير رمز الطاولة" };
  }
}
