import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "../auth/middleware.ts";
import {
  getMembership,
  requirePermissionForRole,
  type Membership,
} from "../auth/authorization.server.ts";
import type { Sql } from "../db.ts";
import type { FnResult } from "./types";

export const ORDER_VALUE_ANALYTICS_TIME_ZONE = "Asia/Riyadh" as const;
export const ORDER_VALUE_ANALYTICS_CURRENCY = "SAR" as const;
export const ORDER_VALUE_ANALYTICS_WEEK_START = 0 as const;
export const ORDER_VALUE_ANALYTICS_ELIGIBLE_STATUSES = ["confirmed", "preparing", "ready", "completed"] as const;

export type OrderValueAnalyticsPeriod =
  | { type: "today" }
  | { type: "week" }
  | { type: "month" }
  | { type: "custom"; startLocal: string; endLocal: string };

export type OrderValueAnalyticsInput = {
  period: OrderValueAnalyticsPeriod;
  tenantId?: string;
  branchId?: string;
};

export type OrderValueAnalyticsTenant = {
  id: string;
  nameAr: string;
  nameEn: string;
  branches: Array<{ id: string; nameAr: string; nameEn: string }>;
};

export type OrderValueAnalytics = {
  period: {
    type: OrderValueAnalyticsPeriod["type"];
    start: string;
    end: string;
    timeZone: typeof ORDER_VALUE_ANALYTICS_TIME_ZONE;
  };
  currency: typeof ORDER_VALUE_ANALYTICS_CURRENCY;
  orderValue: number;
  orderCount: number;
  averageOrderValue: number | null;
  dailyTrend: Array<{ day: string; orderValue: number }>;
  dataQuality: { currencyConsistent: boolean };
};

export type ResolvedOrderValuePeriod = {
  type: OrderValueAnalyticsPeriod["type"];
  start: Date;
  end: Date;
  startLocal: string;
  endLocal: string;
};

type RiyadhDateParts = { year: number; month: number; day: number };
type AggregateRow = { order_value: number | string | null; order_count: number | string | null };
type TrendRow = { day: string; order_value: number | string | null };

const CUSTOM_LOCAL_RE = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;
const DAY_MS = 24 * 60 * 60 * 1000;
const RIYADH_OFFSET_MINUTES = 180;

const inputSchema = z.object({
  period: z.discriminatedUnion("type", [
    z.object({ type: z.literal("today") }),
    z.object({ type: z.literal("week") }),
    z.object({ type: z.literal("month") }),
    z.object({ type: z.literal("custom"), startLocal: z.string(), endLocal: z.string() }),
  ]),
  tenantId: z.string().min(1).max(128).optional(),
  branchId: z.string().min(1).max(80).optional(),
}).strict();

function localParts(now: Date): RiyadhDateParts {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: ORDER_VALUE_ANALYTICS_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const values = Object.fromEntries(
    parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]),
  );
  return { year: Number(values.year), month: Number(values.month), day: Number(values.day) };
}

function localKey(parts: RiyadhDateParts): string {
  return `${parts.year.toString().padStart(4, "0")}-${parts.month.toString().padStart(2, "0")}-${parts.day.toString().padStart(2, "0")}`;
}

function dateFromLocal(parts: RiyadhDateParts, hour = 0, minute = 0): Date {
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day, hour, minute, 0, 0) - RIYADH_OFFSET_MINUTES * 60_000);
}

function addLocalDays(parts: RiyadhDateParts, days: number): RiyadhDateParts {
  const utc = new Date(Date.UTC(parts.year, parts.month - 1, parts.day) + days * DAY_MS);
  return { year: utc.getUTCFullYear(), month: utc.getUTCMonth() + 1, day: utc.getUTCDate() };
}

function addLocalMonths(parts: RiyadhDateParts, months: number): RiyadhDateParts {
  const utc = new Date(Date.UTC(parts.year, parts.month - 1 + months, 1));
  return { year: utc.getUTCFullYear(), month: utc.getUTCMonth() + 1, day: 1 };
}

function parseCustomLocal(value: string): Date | null {
  const match = CUSTOM_LOCAL_RE.exec(value);
  if (!match) return null;
  const [, year, month, day, hour, minute] = match.map(Number);
  if (month < 1 || month > 12 || day < 1 || day > 31 || hour > 23 || minute > 59) return null;
  const result = dateFromLocal({ year, month, day }, hour, minute);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: ORDER_VALUE_ANALYTICS_TIME_ZONE,
    year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(result);
  const values = Object.fromEntries(
    parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]),
  );
  const roundTrip = `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}`;
  return roundTrip === value ? result : null;
}

export function resolveOrderValuePeriod(period: OrderValueAnalyticsPeriod, now = new Date()): ResolvedOrderValuePeriod | null {
  if (Number.isNaN(now.getTime())) return null;
  if (period.type === "custom") {
    const start = parseCustomLocal(period.startLocal);
    const end = parseCustomLocal(period.endLocal);
    if (!start || !end || start >= end) return null;
    return { type: "custom", start, end, startLocal: period.startLocal, endLocal: period.endLocal };
  }

  const today = localParts(now);
  if (period.type === "today") {
    const next = addLocalDays(today, 1);
    return { type: "today", start: dateFromLocal(today), end: dateFromLocal(next), startLocal: localKey(today), endLocal: localKey(next) };
  }
  if (period.type === "month") {
    const next = addLocalMonths(today, 1);
    const start = { ...today, day: 1 };
    return { type: "month", start: dateFromLocal(start), end: dateFromLocal(next), startLocal: localKey(start), endLocal: localKey(next) };
  }

  const dayOfWeek = new Date(Date.UTC(today.year, today.month - 1, today.day)).getUTCDay();
  const daysSinceWeekStart = (dayOfWeek - ORDER_VALUE_ANALYTICS_WEEK_START + 7) % 7;
  const weekStart = addLocalDays(today, -daysSinceWeekStart);
  const weekEnd = addLocalDays(weekStart, 7);
  return { type: "week", start: dateFromLocal(weekStart), end: dateFromLocal(weekEnd), startLocal: localKey(weekStart), endLocal: localKey(weekEnd) };
}

function numeric(value: number | string | null | undefined): number {
  return Number(value ?? 0);
}

function errorResult(code: "invalid" | "forbidden" | "unavailable" | "data_quality", error: string): FnResult<never> {
  return { ok: false, code, error };
}

async function resolveAuthorizedBranches(sql: Sql, membership: Membership): Promise<string[] | null> {
  if (membership.role === "owner") return null;
  if (membership.role === "admin" && membership.branchScope === null) return null;

  const rows = await sql<{ id: string }>`
    select b.id
    from branches b
    where b.tenant_id = ${membership.tenantId}
      and b.is_active = true
      and (
        b.id = any(${membership.branchScope ?? []}::text[])
        or exists (
          select 1 from member_branch_access mba
          where mba.tenant_id = b.tenant_id
            and mba.user_id = ${membership.userId}
            and mba.branch_id = b.id
        )
      )
    order by b.id
  `;
  return rows.map((row) => String(row.id));
}

async function assertRequestedBranch(
  sql: Sql,
  membership: Membership,
  branchId: string,
  authorizedBranchIds: string[] | null,
): Promise<boolean> {
  const rows = await sql<{ id: string }>`
    select b.id
    from branches b
    where b.id = ${branchId}
      and b.tenant_id = ${membership.tenantId}
      and b.is_active = true
    limit 1
  `;
  if (!rows[0]) return false;
  return authorizedBranchIds === null || authorizedBranchIds.includes(branchId);
}

export async function queryOrderValueAnalytics(
  sql: Sql,
  membership: Membership,
  period: ResolvedOrderValuePeriod,
  branchId: string | undefined,
  authorizedBranchIds: string[] | null,
): Promise<FnResult<OrderValueAnalytics>> {
  const effectiveBranchIds = branchId ? [branchId] : authorizedBranchIds;
  const branchPredicate = effectiveBranchIds === null ? "" : "and o.branch_id = any($4::text[])";
  const params = effectiveBranchIds === null
    ? [membership.tenantId, period.start.toISOString(), period.end.toISOString()]
    : [membership.tenantId, period.start.toISOString(), period.end.toISOString(), effectiveBranchIds];

  const currencyRows = await sql.query<{ count: number | string }>(
    `select count(*)::int as count from orders o
     where o.tenant_id = $1
       ${branchPredicate}
       and o.created_at >= $2::timestamptz
       and o.created_at < $3::timestamptz
       and o.status in ('confirmed','preparing','ready','completed')
       and o.currency <> 'SAR'`,
    params,
  );
  if (numeric(currencyRows[0]?.count) > 0) return errorResult("data_quality", "Order value analytics contains eligible non-SAR historical orders.");

  const aggregate = await sql.query<AggregateRow>(
    `select coalesce(sum(o.total), 0)::numeric as order_value,
            count(*)::int as order_count
     from orders o
     where o.tenant_id = $1
       ${branchPredicate}
       and o.created_at >= $2::timestamptz
       and o.created_at < $3::timestamptz
       and o.status in ('confirmed','preparing','ready','completed')
       and o.currency = 'SAR'`,
    params,
  );
  const trend = await sql.query<TrendRow>(
    `select to_char(o.created_at at time zone 'Asia/Riyadh', 'YYYY-MM-DD') as day,
            coalesce(sum(o.total), 0)::numeric as order_value
     from orders o
     where o.tenant_id = $1
       ${branchPredicate}
       and o.created_at >= $2::timestamptz
       and o.created_at < $3::timestamptz
       and o.status in ('confirmed','preparing','ready','completed')
       and o.currency = 'SAR'
     group by day
     order by day`,
    params,
  );
  const orderValue = numeric(aggregate[0]?.order_value);
  const orderCount = numeric(aggregate[0]?.order_count);
  return {
    ok: true,
    data: {
      period: { type: period.type, start: period.start.toISOString(), end: period.end.toISOString(), timeZone: ORDER_VALUE_ANALYTICS_TIME_ZONE },
      currency: ORDER_VALUE_ANALYTICS_CURRENCY,
      orderValue,
      orderCount,
      averageOrderValue: orderCount === 0 ? null : orderValue / orderCount,
      dailyTrend: trend.map((row) => ({ day: String(row.day), orderValue: numeric(row.order_value) })),
      dataQuality: { currencyConsistent: true },
    },
  };
}

export const getOwnerOrderValueAnalyticsTenants = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<FnResult<OrderValueAnalyticsTenant[]>> => {
    try {
      const { getSql } = await import("../db.ts");
      const sql = await getSql();
      const tenantRows = await sql<{ id: string; name_ar: string; name_en: string }>`
        select t.id, t.name_ar, t.name_en
        from tenants t
        join tenant_members tm on tm.tenant_id = t.id
        where tm.user_id = ${context.userId}
          and tm.is_active = true
          and t.is_active = true
        order by t.created_at, t.id
      `;

      const tenants: OrderValueAnalyticsTenant[] = [];
      for (const tenant of tenantRows) {
        const membership = await getMembership(sql, context.userId, String(tenant.id));
        if (!membership) continue;
        try {
          requirePermissionForRole(membership.role, "analytics.read");
        } catch {
          continue;
        }
        const authorizedBranchIds = await resolveAuthorizedBranches(sql, membership);
        const branchRows = authorizedBranchIds === null
          ? await sql<{ id: string; name_ar: string; name_en: string }>`
              select id, name_ar, name_en from branches
              where tenant_id = ${tenant.id} and is_active = true
              order by created_at, id
            `
          : await sql<{ id: string; name_ar: string; name_en: string }>`
              select id, name_ar, name_en from branches
              where tenant_id = ${tenant.id} and is_active = true and id = any(${authorizedBranchIds}::text[])
              order by created_at, id
            `;
        tenants.push({
          id: String(tenant.id),
          nameAr: String(tenant.name_ar ?? ""),
          nameEn: String(tenant.name_en ?? ""),
          branches: branchRows.map((branch) => ({
            id: String(branch.id),
            nameAr: String(branch.name_ar ?? ""),
            nameEn: String(branch.name_en ?? ""),
          })),
        });
      }
      return { ok: true, data: tenants };
    } catch (error) {
      console.error("getOwnerOrderValueAnalyticsTenants failed", error);
      return errorResult("unavailable", "Unable to load analytics tenants.");
    }
  });

export const getOwnerOrderValueAnalytics = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(inputSchema)
  .handler(async ({ context, data }): Promise<FnResult<OrderValueAnalytics>> => {
    try {
      const { getSql } = await import("../db.ts");
      const sql = await getSql();
      const membership = await getMembership(sql, context.userId, data.tenantId);
      if (!membership) return errorResult("forbidden", "No active tenant membership.");
      try {
        requirePermissionForRole(membership.role, "analytics.read");
      } catch {
        return errorResult("forbidden", "Forbidden: analytics.read");
      }
      const period = resolveOrderValuePeriod(data.period);
      if (!period) return errorResult("invalid", "Invalid analytics period.");
      const authorizedBranchIds = await resolveAuthorizedBranches(sql, membership);
      if (data.branchId && !(await assertRequestedBranch(sql, membership, data.branchId, authorizedBranchIds))) {
        return errorResult("forbidden", "Forbidden: branch access.");
      }
      return await queryOrderValueAnalytics(sql, membership, period, data.branchId, authorizedBranchIds);
    } catch (error) {
      console.error("getOwnerOrderValueAnalytics failed", error);
      return errorResult("unavailable", "Unable to load order value analytics.");
    }
  });
