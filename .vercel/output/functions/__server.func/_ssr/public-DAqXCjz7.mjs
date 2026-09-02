import { o as getSql, s as newId } from "./utils-DRrjZD06.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { cn as _enum, gn as object, pn as literal, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { a as mapProduct, i as mapHour, n as mapBranch, o as mapTenant, r as mapCategory, t as createServerRpc } from "./map-DSXpWPI5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/public-DAqXCjz7.js
var slugSchema = string().min(1).max(63).regex(/^[a-z0-9][a-z0-9-]*$/);
async function loadPublicMenu(tenantSlug, branchSlug) {
	try {
		const sql = await getSql();
		const tenants = await sql`select * from tenants where slug = ${tenantSlug} and is_active = true limit 1`;
		if (!tenants[0]) return {
			ok: false,
			code: "not_found",
			error: "المنيو غير موجود"
		};
		const tenant = mapTenant(tenants[0]);
		if (!tenant.isPublished) return {
			ok: false,
			code: "not_found",
			error: "المنيو غير موجود"
		};
		const branches = (await sql`select * from branches where tenant_id = ${tenant.id} and is_active = true order by created_at`).map((r) => mapBranch(r));
		if (branches.length === 0) return {
			ok: false,
			code: "unavailable",
			error: "لا يوجد فرع نشط لهذا المنيو"
		};
		const branch = (branchSlug ? branches.find((b) => b.slug === branchSlug) : null) ?? branches[0];
		if (branchSlug && !branches.some((b) => b.slug === branchSlug)) return {
			ok: false,
			code: "not_found",
			error: "الفرع غير موجود"
		};
		const [hourRows, catRows, prodRows] = await Promise.all([
			sql`select * from branch_hours where branch_id = ${branch.id} order by weekday`,
			sql`select * from categories where tenant_id = ${tenant.id} and is_active = true order by sort_order, created_at`,
			sql`select * from products where tenant_id = ${tenant.id} order by sort_order, created_at`
		]);
		return {
			ok: true,
			data: {
				tenant,
				branch,
				branches,
				hours: hourRows.map((r) => mapHour(r)),
				categories: catRows.map((r) => mapCategory(r)),
				products: prodRows.map((r) => mapProduct(r))
			}
		};
	} catch (err) {
		console.error("loadPublicMenu failed", err);
		return {
			ok: false,
			code: "unavailable",
			error: "تعذر تحميل المنيو حالياً"
		};
	}
}
var getPublicMenu_createServerFn_handler = createServerRpc({
	id: "852131eb30b9fbff25e1e06e05fd859cd4587a0495f25505e703ce99c64a2079",
	name: "getPublicMenu",
	filename: "src/lib/menu/public.ts"
}, (opts) => getPublicMenu.__executeServer(opts));
var getPublicMenu = createServerFn({ method: "GET" }).validator(object({
	slug: slugSchema,
	branch: string().max(63).optional()
})).handler(getPublicMenu_createServerFn_handler, async ({ data }) => loadPublicMenu(data.slug, data.branch));
var recordPublicEvent_createServerFn_handler = createServerRpc({
	id: "3343a0af62196f7c5bc046a9e6c297fa1a2ad829cda898bde955abf66a1522f7",
	name: "recordPublicEvent",
	filename: "src/lib/menu/public.ts"
}, (opts) => recordPublicEvent.__executeServer(opts));
var recordPublicEvent = createServerFn({ method: "POST" }).validator(object({
	slug: slugSchema,
	branchSlug: string().max(63).optional(),
	productId: string().max(80).optional(),
	eventType: _enum([
		"visit",
		"product_view",
		"qr_scan",
		"whatsapp"
	]),
	lang: _enum(["ar", "en"]).optional(),
	sessionId: string().min(8).max(80)
})).handler(recordPublicEvent_createServerFn_handler, async ({ data }) => {
	try {
		const sql = await getSql();
		const tenantId = (await sql`select id from tenants where slug = ${data.slug} and is_active = true and is_published = true limit 1`)[0]?.id;
		if (!tenantId) return {
			ok: false,
			code: "not_found",
			error: "المنيو غير موجود"
		};
		let branchId = null;
		if (data.branchSlug) branchId = (await sql`select id from branches where tenant_id = ${tenantId} and slug = ${data.branchSlug} and is_active = true limit 1`)[0]?.id ?? null;
		if (data.eventType === "product_view") {
			if (!data.productId) return {
				ok: false,
				code: "invalid",
				error: "صنف غير صالح"
			};
			if (!(await sql`select id from products where id = ${data.productId} and tenant_id = ${tenantId} limit 1`)[0]) return {
				ok: false,
				code: "invalid",
				error: "صنف غير صالح"
			};
		}
		if (data.eventType === "visit" || data.eventType === "qr_scan") {
			if ((await sql`
          select id from menu_events
          where tenant_id = ${tenantId}
            and session_id = ${data.sessionId}
            and event_type = ${data.eventType}
            and created_at > now() - interval '30 minutes'
          limit 1
        `)[0]) return {
				ok: true,
				data: { recorded: false }
			};
		}
		const eventType = data.eventType;
		await sql`
        insert into menu_events (id, tenant_id, branch_id, product_id, event_type, lang, session_id)
        values (
          ${newId()},
          ${tenantId},
          ${branchId},
          ${data.productId ?? null},
          ${eventType},
          ${data.lang ?? null},
          ${data.sessionId}
        )
      `;
		return {
			ok: true,
			data: { recorded: true }
		};
	} catch (err) {
		console.error("recordPublicEvent failed", err);
		return {
			ok: false,
			code: "unavailable",
			error: "تعذر تسجيل الحدث"
		};
	}
});
var submitLead_createServerFn_handler = createServerRpc({
	id: "8de37b0ab7c6f750c453e235b5dd72fede62d111d76a0f8b6615b8fa8cb018f9",
	name: "submitLead",
	filename: "src/lib/menu/public.ts"
}, (opts) => submitLead.__executeServer(opts));
var submitLead = createServerFn({ method: "POST" }).validator(object({
	businessName: string().trim().min(2).max(120),
	city: string().trim().max(80).optional(),
	contactName: string().trim().min(2).max(80),
	contactPhone: string().trim().min(8).max(30),
	contactEmail: string().trim().email().optional().or(literal("")),
	details: string().trim().max(1e3).optional()
})).handler(submitLead_createServerFn_handler, async ({ data }) => {
	try {
		const sql = await getSql();
		const id = newId();
		await sql`
        insert into leads (id, business_name, city, contact_name, contact_phone, contact_email, details)
        values (
          ${id},
          ${data.businessName},
          ${data.city ?? null},
          ${data.contactName},
          ${data.contactPhone},
          ${data.contactEmail || null},
          ${data.details ?? null}
        )
      `;
		return {
			ok: true,
			data: { id }
		};
	} catch (err) {
		console.error("submitLead failed", err);
		return {
			ok: false,
			code: "unavailable",
			error: "تعذر إرسال الطلب حالياً"
		};
	}
});
//#endregion
export { getPublicMenu_createServerFn_handler, recordPublicEvent_createServerFn_handler, submitLead_createServerFn_handler };
