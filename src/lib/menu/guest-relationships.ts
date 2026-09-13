import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { canAccessBranch, getMembership } from "@/lib/auth/authorization.server";
import { getSql } from "@/lib/db";
import type { FnResult } from "./types";

export type GuestRelationshipOverview = {
  profiles: number;
  repeatGuests: number;
  activeGuests30d: number;
  lapsedGuests60d: number;
  averageOrderValue: number;
  feedbackCount: number;
  averageRating: number | null;
  loyaltyMembers: number;
  loyaltyPoints: number;
  campaignDrafts: number;
  evidence: "verified" | "insufficient";
};

const branchSchema = z.object({ branchId: z.string().min(1).max(80).optional() });

async function authorize(sql: Awaited<ReturnType<typeof getSql>>, userId: string, branchId?: string) {
  const membership = await getMembership(sql, userId);
  if (!membership || !["owner", "admin"].includes(membership.role)) return null;
  if (branchId && !(await canAccessBranch(sql, membership, branchId))) return null;
  return membership;
}

export const getGuestRelationshipOverview = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(branchSchema)
  .handler(async ({ context, data }): Promise<FnResult<GuestRelationshipOverview>> => {
    try {
      const sql = await getSql();
      const membership = await authorize(sql, context.userId, data.branchId);
      if (!membership) return { ok: false, code: "forbidden", error: "ليست لديك صلاحية عرض علاقات الضيوف" };
      const branchId = data.branchId ?? null;
      const [profiles, feedback, loyalty, campaigns] = await Promise.all([
        sql<{ profiles: number; repeat: number; active: number; lapsed: number; aov: number }>`
          select count(*)::int profiles,
            count(*) filter (where order_count > 1)::int repeat,
            count(*) filter (where last_order_at >= now() - interval '30 days')::int active,
            count(*) filter (where last_order_at < now() - interval '60 days')::int lapsed,
            coalesce(sum(total_spend) / nullif(sum(order_count), 0), 0)::numeric aov
          from guest_profiles
          where tenant_id = ${membership.tenantId}
            and (${branchId}::text is null or branch_id = ${branchId})`,
        sql<{ count: number; rating: number | null }>`select count(*)::int count, avg(rating)::numeric rating from guest_feedback where tenant_id = ${membership.tenantId} and (${branchId}::text is null or branch_id = ${branchId})`,
        sql<{ members: number; points: number }>`select count(*)::int members, coalesce(sum(points_balance),0)::int points from guest_loyalty_accounts where tenant_id = ${membership.tenantId} and (${branchId}::text is null or branch_id = ${branchId})`,
        sql<{ drafts: number }>`select count(*)::int drafts from guest_campaigns where tenant_id = ${membership.tenantId} and (${branchId}::text is null or branch_id = ${branchId}) and status = 'draft'`,
      ]);
      const row = profiles[0];
      const count = Number(row?.profiles ?? 0);
      return { ok: true, data: {
        profiles: count,
        repeatGuests: Number(row?.repeat ?? 0),
        activeGuests30d: Number(row?.active ?? 0),
        lapsedGuests60d: Number(row?.lapsed ?? 0),
        averageOrderValue: Number(row?.aov ?? 0),
        feedbackCount: Number(feedback[0]?.count ?? 0),
        averageRating: feedback[0]?.rating == null ? null : Number(feedback[0].rating),
        loyaltyMembers: Number(loyalty[0]?.members ?? 0),
        loyaltyPoints: Number(loyalty[0]?.points ?? 0),
        campaignDrafts: Number(campaigns[0]?.drafts ?? 0),
        evidence: count >= 20 ? "verified" : "insufficient",
      }};
    } catch (error) {
      console.error("getGuestRelationshipOverview failed", error);
      return { ok: false, code: "unavailable", error: "تعذر تحميل علاقات الضيوف" };
    }
  });
