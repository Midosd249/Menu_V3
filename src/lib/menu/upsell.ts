import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { newId } from "@/lib/utils";
import type { FnResult } from "./types";

type PairRow = {
  source_product_id: string;
  recommended_product_id: string;
  count: number;
};

type ProductRow = {
  id: string;
  name_ar: string;
  name_en: string;
  price: number;
  currency: string;
  image_url: string;
  is_available: boolean;
};

type MemberRow = { tenant_id: string; role: string };

async function membership(sql: Awaited<ReturnType<typeof getSql>>, userId: string): Promise<MemberRow | null> {
  const rows = await sql<MemberRow>`
    select tenant_id, role
    from tenant_members
    where user_id = ${userId} and is_active = true
    order by created_at
    limit 1
  `;
  return rows[0] ?? null;
}

function canManage(role: string): boolean {
  return role === "owner" || role === "admin";
}

function normalizePair(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a];
}

export type UpsellCandidate = {
  key: string;
  sourceProductId: string;
  recommendedProductId: string;
  sourceNameAr: string;
  sourceNameEn: string;
  recommendedNameAr: string;
  recommendedNameEn: string;
  coViewSessions: number;
  coCartOrders: number;
  coOrderOrders: number;
  evidenceScore: number;
  evidenceLevel: "strong" | "developing" | "insufficient";
  approved: boolean;
};

export type ApprovedUpsell = UpsellCandidate & {
  id: string;
};

function buildCandidates(
  products: ProductRow[],
  coView: PairRow[],
  coCart: PairRow[],
  coOrder: PairRow[],
  approvedKeys: Set<string>,
): UpsellCandidate[] {
  const productMap = new Map(products.map((product) => [String(product.id), product]));
  const aggregate = new Map<string, { a: string; b: string; view: number; cart: number; order: number }>();
  const add = (rows: PairRow[], kind: "view" | "cart" | "order") => {
    for (const row of rows) {
      const [a, b] = normalizePair(String(row.source_product_id), String(row.recommended_product_id));
      if (!productMap.has(a) || !productMap.has(b)) continue;
      const key = `${a}:${b}`;
      const current = aggregate.get(key) ?? { a, b, view: 0, cart: 0, order: 0 };
      current[kind] = Number(row.count ?? 0);
      aggregate.set(key, current);
    }
  };
  add(coView, "view");
  add(coCart, "cart");
  add(coOrder, "order");

  return [...aggregate.values()]
    .map((pair) => {
      const evidenceScore = Math.min(100, pair.view * 1.5 + pair.cart * 4 + pair.order * 6);
      const strongest = Math.max(pair.view, pair.cart, pair.order);
      const evidenceLevel: UpsellCandidate["evidenceLevel"] = strongest >= 10 && evidenceScore >= 45
        ? "strong"
        : strongest >= 5 && evidenceScore >= 20
          ? "developing"
          : "insufficient";
      const a = productMap.get(pair.a)!;
      const b = productMap.get(pair.b)!;
      return {
        key: `${pair.a}:${pair.b}`,
        sourceProductId: pair.a,
        recommendedProductId: pair.b,
        sourceNameAr: String(a.name_ar),
        sourceNameEn: String(a.name_en || a.name_ar),
        recommendedNameAr: String(b.name_ar),
        recommendedNameEn: String(b.name_en || b.name_ar),
        coViewSessions: pair.view,
        coCartOrders: pair.cart,
        coOrderOrders: pair.order,
        evidenceScore: Math.round(evidenceScore),
        evidenceLevel,
        approved: approvedKeys.has(`${pair.a}:${pair.b}`),
      };
    })
    .filter((candidate) => candidate.evidenceLevel !== "insufficient")
    .sort((a, b) => b.evidenceScore - a.evidenceScore)
    .slice(0, 12);
}

export const getUpsellInsights = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ branchId: z.string().min(1).max(80) }))
  .handler(async ({ context, data }): Promise<FnResult<UpsellCandidate[]>> => {
    try {
      const sql = await getSql();
      const member = await membership(sql, context.userId);
      if (!member) return { ok: false, code: "not_found", error: "لا يوجد مطعم" };
      if (!canManage(member.role)) return { ok: false, code: "forbidden", error: "ليست لديك صلاحية" };

      const branch = await sql`select id from branches where id = ${data.branchId} and tenant_id = ${member.tenant_id} and is_active = true limit 1`;
      if (!branch[0]) return { ok: false, code: "not_found", error: "الفرع غير متاح" };

      const [products, coView, coCart, coOrder, approved] = await Promise.all([
        sql<ProductRow>`
          select id, name_ar, name_en, price, currency, coalesce(image_url, '') as image_url, is_available
          from products where tenant_id = ${member.tenant_id} and is_available = true
        `,
        sql<PairRow>`
          select least(a.product_id, b.product_id) as source_product_id,
                 greatest(a.product_id, b.product_id) as recommended_product_id,
                 count(distinct a.session_id)::int as count
          from menu_events a
          join menu_events b on b.tenant_id = a.tenant_id
            and b.branch_id = a.branch_id
            and b.session_id = a.session_id
            and b.event_type = 'product_view'
            and b.product_id is not null
            and a.product_id is not null
            and b.product_id <> a.product_id
          where a.tenant_id = ${member.tenant_id}
            and a.branch_id = ${data.branchId}
            and a.event_type = 'product_view'
            and a.product_id is not null
            and a.session_id is not null
            and a.created_at > now() - interval '30 days'
          group by least(a.product_id, b.product_id), greatest(a.product_id, b.product_id)
        `,
        sql<PairRow>`
          select least(a.product_id, b.product_id) as source_product_id,
                 greatest(a.product_id, b.product_id) as recommended_product_id,
                 count(distinct a.order_id)::int as count
          from order_items a
          join orders oa on oa.id = a.order_id
          join order_items b on b.order_id = a.order_id and b.product_id is not null and a.product_id is not null and b.product_id <> a.product_id
          where oa.tenant_id = ${member.tenant_id}
            and oa.branch_id = ${data.branchId}
            and oa.status <> 'cancelled'
            and oa.created_at > now() - interval '30 days'
            and a.product_id is not null
          group by least(a.product_id, b.product_id), greatest(a.product_id, b.product_id)
        `,
        sql<PairRow>`
          select least(a.product_id, b.product_id) as source_product_id,
                 greatest(a.product_id, b.product_id) as recommended_product_id,
                 count(distinct a.order_id)::int as count
          from order_items a
          join orders oa on oa.id = a.order_id
          join order_items b on b.order_id = a.order_id and b.product_id is not null and a.product_id is not null and b.product_id <> a.product_id
          where oa.tenant_id = ${member.tenant_id}
            and oa.branch_id = ${data.branchId}
            and oa.status = 'completed'
            and oa.created_at > now() - interval '30 days'
            and a.product_id is not null
          group by least(a.product_id, b.product_id), greatest(a.product_id, b.product_id)
        `,
        sql<{ source_product_id: string; recommended_product_id: string }>`
          select source_product_id, recommended_product_id
          from menu_upsell_recommendations
          where tenant_id = ${member.tenant_id} and branch_id = ${data.branchId} and status = 'approved'
        `,
      ]);

      const approvedKeys = new Set(approved.map((row) => `${row.source_product_id}:${row.recommended_product_id}`));
      return { ok: true, data: buildCandidates(products, coView, coCart, coOrder, approvedKeys) };
    } catch (error) {
      console.error("getUpsellInsights failed", error);
      return { ok: false, code: "unavailable", error: "تعذر تحليل فرص الاقتراحات" };
    }
  });

export const approveUpsell = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ branchId: z.string().min(1).max(80), sourceProductId: z.string().min(1).max(80), recommendedProductId: z.string().min(1).max(80) }))
  .handler(async ({ context, data }): Promise<FnResult<{ approved: boolean }>> => {
    try {
      const sql = await getSql();
      const member = await membership(sql, context.userId);
      if (!member) return { ok: false, code: "not_found", error: "لا يوجد مطعم" };
      if (!canManage(member.role)) return { ok: false, code: "forbidden", error: "ليست لديك صلاحية" };
      if (data.sourceProductId === data.recommendedProductId) return { ok: false, code: "invalid", error: "لا يمكن اقتراح الصنف لنفسه" };
      const branch = await sql`select id from branches where id = ${data.branchId} and tenant_id = ${member.tenant_id} and is_active = true limit 1`;
      if (!branch[0]) return { ok: false, code: "not_found", error: "الفرع غير متاح" };
      const products = await sql`select id from products where tenant_id = ${member.tenant_id} and id = any(${[data.sourceProductId, data.recommendedProductId]}) and is_available = true`;
      if (products.length !== 2) return { ok: false, code: "invalid", error: "أحد الأصناف غير متاح" };

      const existing = await sql`select id from menu_upsell_recommendations where tenant_id = ${member.tenant_id} and branch_id = ${data.branchId} and source_product_id = ${data.sourceProductId} and recommended_product_id = ${data.recommendedProductId} limit 1`;
      if (existing[0]) {
        await sql`
          update menu_upsell_recommendations
          set status = 'approved', approved_by = ${context.userId}, approved_at = now(), updated_at = now()
          where id = ${existing[0].id}
        `;
      } else {
        await sql`
          insert into menu_upsell_recommendations (id, tenant_id, branch_id, source_product_id, recommended_product_id, status, approved_by, approved_at)
          values (${newId()}, ${member.tenant_id}, ${data.branchId}, ${data.sourceProductId}, ${data.recommendedProductId}, 'approved', ${context.userId}, now())
        `;
      }
      return { ok: true, data: { approved: true } };
    } catch (error) {
      console.error("approveUpsell failed", error);
      return { ok: false, code: "unavailable", error: "تعذر اعتماد الاقتراح" };
    }
  });

export const dismissUpsell = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ branchId: z.string().min(1).max(80), sourceProductId: z.string().min(1).max(80), recommendedProductId: z.string().min(1).max(80) }))
  .handler(async ({ context, data }): Promise<FnResult<{ dismissed: boolean }>> => {
    try {
      const sql = await getSql();
      const member = await membership(sql, context.userId);
      if (!member) return { ok: false, code: "not_found", error: "لا يوجد مطعم" };
      if (!canManage(member.role)) return { ok: false, code: "forbidden", error: "ليست لديك صلاحية" };
      await sql`
        update menu_upsell_recommendations
        set status = 'dismissed', updated_at = now()
        where tenant_id = ${member.tenant_id}
          and branch_id = ${data.branchId}
          and source_product_id = ${data.sourceProductId}
          and recommended_product_id = ${data.recommendedProductId}
      `;
      return { ok: true, data: { dismissed: true } };
    } catch (error) {
      console.error("dismissUpsell failed", error);
      return { ok: false, code: "unavailable", error: "تعذر إخفاء الاقتراح" };
    }
  });

export const getPublicUpsells = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string().min(1).max(63), branchSlug: z.string().max(63).optional() }))
  .handler(async ({ data }): Promise<FnResult<ApprovedUpsell[]>> => {
    try {
      const sql = await getSql();
      const rows = await sql<{
        id: string;
        source_product_id: string;
        recommended_product_id: string;
        co_view_sessions: number;
        co_cart_orders: number;
        co_order_orders: number;
        evidence_score: number;
        source_name_ar: string;
        source_name_en: string;
        recommended_name_ar: string;
        recommended_name_en: string;
      }>`
        select r.id, r.source_product_id, r.recommended_product_id,
               r.co_view_sessions, r.co_cart_orders, r.co_order_orders, r.evidence_score,
               a.name_ar as source_name_ar, a.name_en as source_name_en,
               b.name_ar as recommended_name_ar, b.name_en as recommended_name_en
        from menu_upsell_recommendations r
        join tenants t on t.id = r.tenant_id
        join branches br on br.id = r.branch_id
        join products a on a.id = r.source_product_id
        join products b on b.id = r.recommended_product_id
        where t.slug = ${data.slug}
          and t.is_active = true and t.is_published = true
          and br.is_active = true
          and (${data.branchSlug ?? null}::text is null or br.slug = ${data.branchSlug ?? null})
          and r.status = 'approved'
          and a.is_available = true and b.is_available = true
        order by r.evidence_score desc, r.updated_at desc
        limit 3
      `;
      return {
        ok: true,
        data: rows.map((row) => ({
          key: `${row.source_product_id}:${row.recommended_product_id}`,
          id: String(row.id),
          sourceProductId: String(row.source_product_id),
          recommendedProductId: String(row.recommended_product_id),
          sourceNameAr: String(row.source_name_ar),
          sourceNameEn: String(row.source_name_en || row.source_name_ar),
          recommendedNameAr: String(row.recommended_name_ar),
          recommendedNameEn: String(row.recommended_name_en || row.recommended_name_ar),
          coViewSessions: Number(row.co_view_sessions),
          coCartOrders: Number(row.co_cart_orders),
          coOrderOrders: Number(row.co_order_orders),
          evidenceScore: Number(row.evidence_score),
          evidenceLevel: "strong",
          approved: true,
        })),
      };
    } catch (error) {
      console.error("getPublicUpsells failed", error);
      return { ok: false, code: "unavailable", error: "تعذر تحميل الاقتراحات" };
    }
  });

export const recordUpsellEvent = createServerFn({ method: "POST" })
  .validator(z.object({ slug: z.string().min(1).max(63), branchSlug: z.string().max(63).optional(), productId: z.string().min(1).max(80), eventType: z.enum(["upsell_impression", "upsell_click"]), sessionId: z.string().min(8).max(80) }))
  .handler(async ({ data }): Promise<FnResult<{ recorded: boolean }>> => {
    try {
      const sql = await getSql();
      const tenantRows = await sql<{ id: string }>`select id from tenants where slug = ${data.slug} and is_active = true and is_published = true limit 1`;
      const tenantId = tenantRows[0]?.id;
      if (!tenantId) return { ok: false, code: "not_found", error: "المنيو غير موجود" };
      const branchRows = await sql<{ id: string }>`select id from branches where tenant_id = ${tenantId} and is_active = true and (${data.branchSlug ?? null}::text is null or slug = ${data.branchSlug ?? null}) order by created_at limit 1`;
      const branchId = branchRows[0]?.id;
      if (!branchId) return { ok: false, code: "not_found", error: "الفرع غير متاح" };
      const approved = await sql`
        select id from menu_upsell_recommendations
        where tenant_id = ${tenantId} and branch_id = ${branchId} and status = 'approved'
          and (source_product_id = ${data.productId} or recommended_product_id = ${data.productId})
        limit 1
      `;
      if (!approved[0]) return { ok: false, code: "invalid", error: "اقتراح غير معتمد" };
      await sql`
        insert into menu_events (id, tenant_id, branch_id, product_id, event_type, session_id)
        values (${newId()}, ${tenantId}, ${branchId}, ${data.productId}, ${data.eventType}, ${data.sessionId})
      `;
      return { ok: true, data: { recorded: true } };
    } catch (error) {
      console.error("recordUpsellEvent failed", error);
      return { ok: false, code: "unavailable", error: "تعذر تسجيل التفاعل" };
    }
  });

export const getUpsellMeasurement = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ branchId: z.string().min(1).max(80), sourceProductId: z.string().min(1).max(80), recommendedProductId: z.string().min(1).max(80) }))
  .handler(async ({ context, data }): Promise<FnResult<{ impressions: number; clicks: number; pairOrders: number }>> => {
    try {
      const sql = await getSql();
      const member = await membership(sql, context.userId);
      if (!member) return { ok: false, code: "not_found", error: "لا يوجد مطعم" };
      if (!canManage(member.role)) return { ok: false, code: "forbidden", error: "ليست لديك صلاحية" };
      const [events, pairOrders] = await Promise.all([
        sql<{ impressions: number; clicks: number }>`
          select
            count(*) filter (where event_type = 'upsell_impression')::int as impressions,
            count(*) filter (where event_type = 'upsell_click')::int as clicks
          from menu_events
          where tenant_id = ${member.tenant_id} and branch_id = ${data.branchId}
            and product_id = any(${[data.sourceProductId, data.recommendedProductId]})
            and event_type in ('upsell_impression', 'upsell_click')
            and created_at > now() - interval '30 days'
        `,
        sql<{ count: number }>`
          select count(distinct o.id)::int as count
          from orders o
          join order_items a on a.order_id = o.id and a.product_id = ${data.sourceProductId}
          join order_items b on b.order_id = o.id and b.product_id = ${data.recommendedProductId}
          where o.tenant_id = ${member.tenant_id} and o.branch_id = ${data.branchId}
            and o.status <> 'cancelled' and o.created_at > now() - interval '30 days'
        `,
      ]);
      return { ok: true, data: { impressions: Number(events[0]?.impressions ?? 0), clicks: Number(events[0]?.clicks ?? 0), pairOrders: Number(pairOrders[0]?.count ?? 0) } };
    } catch (error) {
      console.error("getUpsellMeasurement failed", error);
      return { ok: false, code: "unavailable", error: "تعذر قياس أداء الاقتراح" };
    }
  });
