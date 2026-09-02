import { l as slugify, o as getSql, s as newId } from "./utils-DRrjZD06.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-Bs72scqa.mjs";
import { bn as union, cn as _enum, dn as boolean, gn as object, hn as number, pn as literal, un as array, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { a as mapProduct, i as mapHour, n as mapBranch, o as mapTenant, r as mapCategory, t as createServerRpc } from "./map-DSXpWPI5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/owner-rZwZj9Wk.js
function computeHealth(input) {
	const { tenant, branches, categories, products } = input;
	const available = products.filter((p) => p.isAvailable);
	const withImage = products.filter((p) => p.imageUrl.trim());
	const withEn = products.filter((p) => p.nameEn.trim());
	const featured = products.filter((p) => p.isFeatured);
	const activeBranches = branches.filter((b) => b.isActive);
	const activeCats = categories.filter((c) => c.isActive);
	const checks = [
		{
			key: "published",
			ok: tenant.isPublished,
			labelAr: "المنيو منشور",
			labelEn: "Menu is published"
		},
		{
			key: "whatsapp",
			ok: Boolean(tenant.whatsapp.trim()),
			labelAr: "رقم واتساب",
			labelEn: "WhatsApp number"
		},
		{
			key: "branch",
			ok: activeBranches.length > 0,
			labelAr: "فرع نشط",
			labelEn: "Active branch"
		},
		{
			key: "categories",
			ok: activeCats.length >= 2,
			labelAr: "تصنيفان على الأقل",
			labelEn: "At least two categories"
		},
		{
			key: "products",
			ok: available.length >= 5,
			labelAr: "خمسة أصناف متاحة",
			labelEn: "Five available items"
		},
		{
			key: "images",
			ok: products.length > 0 && withImage.length / products.length >= .5,
			labelAr: "صور لنصف الأصناف على الأقل",
			labelEn: "Images on at least half of items"
		},
		{
			key: "english",
			ok: products.length > 0 && withEn.length / products.length >= .5,
			labelAr: "أسماء إنجليزية",
			labelEn: "English names"
		},
		{
			key: "featured",
			ok: featured.length > 0,
			labelAr: "صنف مميز واحد على الأقل",
			labelEn: "At least one featured item"
		},
		{
			key: "brand",
			ok: Boolean(tenant.logoUrl || tenant.coverUrl),
			labelAr: "شعار أو غلاف",
			labelEn: "Logo or cover"
		}
	];
	const score = Math.round(checks.filter((c) => c.ok).length / checks.length * 100);
	const attention = [];
	if (!tenant.isPublished) attention.push({
		key: "publish",
		severity: "high",
		titleAr: "المنيو ما زال مسودة — الضيوف لن يروه",
		titleEn: "Menu is still a draft — guests cannot see it",
		href: "/studio/settings"
	});
	if (available.length === 0) attention.push({
		key: "items",
		severity: "high",
		titleAr: "لا توجد أصناف متاحة في القائمة",
		titleEn: "No available items on the menu",
		href: "/studio/menu"
	});
	if (!tenant.whatsapp.trim()) attention.push({
		key: "wa",
		severity: "medium",
		titleAr: "أضف واتساب لاستقبال الاستفسارات من الطاولة",
		titleEn: "Add WhatsApp so guests can enquire from the table",
		href: "/studio/brand"
	});
	if (products.length > 0 && withImage.length === 0) attention.push({
		key: "photos",
		severity: "medium",
		titleAr: "لا صور على الأصناف — المنيو يبدو فارغاً",
		titleEn: "No item photos — the menu looks empty",
		href: "/studio/menu"
	});
	if (activeBranches.length === 0) attention.push({
		key: "branch",
		severity: "high",
		titleAr: "أضف فرعاً حتى يعمل رمز QR",
		titleEn: "Add a branch so the QR code has a destination",
		href: "/studio/branches"
	});
	return {
		score,
		checks,
		attention
	};
}
var slugSchema = string().min(1).max(63).regex(/^[a-z0-9][a-z0-9-]*$/);
async function membershipOf(sql, userId, tenantId) {
	if (tenantId) return (await sql`
      select tenant_id, user_id, role from tenant_members
      where user_id = ${userId} and tenant_id = ${tenantId}
      limit 1
    `)[0] ?? null;
	return (await sql`
    select tenant_id, user_id, role from tenant_members
    where user_id = ${userId}
    order by created_at
    limit 1
  `)[0] ?? null;
}
function canWriteMenu(role) {
	return role === "owner" || role === "admin" || role === "editor";
}
function canWriteSettings(role) {
	return role === "owner" || role === "admin";
}
async function loadSnapshot(sql, tenantId, role) {
	const [tenantRows, branchRows, catRows, prodRows, memberRows] = await Promise.all([
		sql`select * from tenants where id = ${tenantId} limit 1`,
		sql`select * from branches where tenant_id = ${tenantId} order by created_at`,
		sql`select * from categories where tenant_id = ${tenantId} order by sort_order, created_at`,
		sql`select * from products where tenant_id = ${tenantId} order by sort_order, created_at`,
		sql`select user_id, role from tenant_members where tenant_id = ${tenantId}`
	]);
	const tenant = mapTenant(tenantRows[0]);
	const branches = branchRows.map((r) => mapBranch(r));
	const categories = catRows.map((r) => mapCategory(r));
	const products = prodRows.map((r) => mapProduct(r));
	return {
		tenant,
		role,
		branches,
		categories,
		products,
		members: memberRows.map((r) => ({
			userId: String(r.user_id),
			role: r.role
		})),
		health: computeHealth({
			tenant,
			branches,
			categories,
			products
		})
	};
}
var getMyStudio_createServerFn_handler = createServerRpc({
	id: "332f1ff261b33dcae60b51848be7e49ce31c972d915fadbb8816e709861164a0",
	name: "getMyStudio",
	filename: "src/lib/menu/owner.ts"
}, (opts) => getMyStudio.__executeServer(opts));
var getMyStudio = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMyStudio_createServerFn_handler, async ({ context }) => {
	try {
		const sql = await getSql();
		const member = await membershipOf(sql, context.userId);
		if (!member) return {
			ok: true,
			data: { tenant: null }
		};
		return {
			ok: true,
			data: await loadSnapshot(sql, member.tenant_id, member.role)
		};
	} catch (err) {
		console.error("getMyStudio failed", err);
		return {
			ok: false,
			code: "unavailable",
			error: "تعذر تحميل الاستوديو"
		};
	}
});
var createRestaurant_createServerFn_handler = createServerRpc({
	id: "0f18bfb5ab772d161a924af0f085416fd02cc5123829b92f26b9b833fc5d2c21",
	name: "createRestaurant",
	filename: "src/lib/menu/owner.ts"
}, (opts) => createRestaurant.__executeServer(opts));
var createRestaurant = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	nameAr: string().trim().min(2).max(80),
	nameEn: string().trim().max(80).optional(),
	slug: string().trim().max(63).optional(),
	city: string().trim().max(80).optional(),
	branchNameAr: string().trim().min(2).max(80),
	branchNameEn: string().trim().max(80).optional(),
	addressAr: string().trim().max(200).optional(),
	whatsapp: string().trim().max(30).optional()
})).handler(createRestaurant_createServerFn_handler, async ({ context, data }) => {
	try {
		const sql = await getSql();
		const existing = await membershipOf(sql, context.userId);
		if (existing) return {
			ok: true,
			data: await loadSnapshot(sql, existing.tenant_id, existing.role)
		};
		let slug = slugify(data.slug || data.nameEn || data.nameAr);
		if ((await sql`select id from tenants where slug = ${slug} limit 1`)[0]) slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
		if (!slugSchema.safeParse(slug).success) slug = `r-${Date.now().toString(36)}`;
		const tenantId = newId();
		const branchId = newId();
		await sql`
        insert into tenants (
          id, owner_user_id, slug, name_ar, name_en, city, whatsapp, is_published, is_active
        ) values (
          ${tenantId}, ${context.userId}, ${slug}, ${data.nameAr}, ${data.nameEn ?? ""},
          ${data.city ?? ""}, ${data.whatsapp ?? ""}, false, true
        )
      `;
		await sql`
        insert into tenant_members (tenant_id, user_id, role)
        values (${tenantId}, ${context.userId}, 'owner')
      `;
		await sql`
        insert into branches (id, tenant_id, slug, name_ar, name_en, address_ar, is_active)
        values (
          ${branchId}, ${tenantId}, ${slugify(data.branchNameEn || data.branchNameAr) || "main"}, ${data.branchNameAr},
          ${data.branchNameEn ?? ""}, ${data.addressAr ?? ""}, true
        )
      `;
		for (const day of [
			0,
			1,
			2,
			3,
			4,
			5,
			6
		]) await sql`
          insert into branch_hours (branch_id, weekday, opens_at, closes_at, is_closed)
          values (
            ${branchId},
            ${day},
            ${day === 5 ? "13:00" : "07:00"},
            ${"00:00"},
            ${false}
          )
        `;
		return {
			ok: true,
			data: await loadSnapshot(sql, tenantId, "owner")
		};
	} catch (err) {
		console.error("createRestaurant failed", err);
		return {
			ok: false,
			code: "unavailable",
			error: "تعذر إنشاء المطعم"
		};
	}
});
var updateTenant_createServerFn_handler = createServerRpc({
	id: "62212f44155f0d5d93ea9aa2ed99d65bdb708ebc1862ec2a0bc86a0c7718e712",
	name: "updateTenant",
	filename: "src/lib/menu/owner.ts"
}, (opts) => updateTenant.__executeServer(opts));
var updateTenant = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	nameAr: string().trim().min(2).max(80).optional(),
	nameEn: string().trim().max(80).optional(),
	taglineAr: string().trim().max(160).optional(),
	taglineEn: string().trim().max(160).optional(),
	logoUrl: string().trim().max(500).optional(),
	coverUrl: string().trim().max(500).optional(),
	instagramUrl: string().trim().max(200).optional(),
	whatsapp: string().trim().max(30).optional(),
	whatsappTemplate: string().trim().max(240).optional(),
	primaryColor: string().trim().max(20).optional(),
	accentColor: string().trim().max(20).optional(),
	city: string().trim().max(80).optional(),
	isPublished: boolean().optional()
})).handler(updateTenant_createServerFn_handler, async ({ context, data }) => {
	try {
		const sql = await getSql();
		const member = await membershipOf(sql, context.userId);
		if (!member) return {
			ok: false,
			code: "not_found",
			error: "لا يوجد مطعم"
		};
		if (!canWriteSettings(member.role)) return {
			ok: false,
			code: "forbidden",
			error: "ليست لديك صلاحية"
		};
		await sql`
        update tenants set
          name_ar = coalesce(${data.nameAr ?? null}, name_ar),
          name_en = coalesce(${data.nameEn ?? null}, name_en),
          tagline_ar = coalesce(${data.taglineAr ?? null}, tagline_ar),
          tagline_en = coalesce(${data.taglineEn ?? null}, tagline_en),
          logo_url = coalesce(${data.logoUrl ?? null}, logo_url),
          cover_url = coalesce(${data.coverUrl ?? null}, cover_url),
          instagram_url = coalesce(${data.instagramUrl ?? null}, instagram_url),
          whatsapp = coalesce(${data.whatsapp ?? null}, whatsapp),
          whatsapp_template = coalesce(${data.whatsappTemplate ?? null}, whatsapp_template),
          primary_color = coalesce(${data.primaryColor ?? null}, primary_color),
          accent_color = coalesce(${data.accentColor ?? null}, accent_color),
          city = coalesce(${data.city ?? null}, city),
          is_published = coalesce(${data.isPublished ?? null}, is_published),
          updated_at = now()
        where id = ${member.tenant_id}
      `;
		return {
			ok: true,
			data: await loadSnapshot(sql, member.tenant_id, member.role)
		};
	} catch (err) {
		console.error("updateTenant failed", err);
		return {
			ok: false,
			code: "unavailable",
			error: "تعذر حفظ الهوية"
		};
	}
});
var saveCategory_createServerFn_handler = createServerRpc({
	id: "fbf5a3a7a732d2b1121d966a184433a435e0372e80f0ee58a867e1b4879e5a8f",
	name: "saveCategory",
	filename: "src/lib/menu/owner.ts"
}, (opts) => saveCategory.__executeServer(opts));
var saveCategory = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: string().optional(),
	nameAr: string().trim().min(1).max(80),
	nameEn: string().trim().max(80).optional(),
	sortOrder: number().int().optional(),
	isActive: boolean().optional()
})).handler(saveCategory_createServerFn_handler, async ({ context, data }) => {
	try {
		const sql = await getSql();
		const member = await membershipOf(sql, context.userId);
		if (!member) return {
			ok: false,
			code: "not_found",
			error: "لا يوجد مطعم"
		};
		if (!canWriteMenu(member.role)) return {
			ok: false,
			code: "forbidden",
			error: "ليست لديك صلاحية"
		};
		if (data.id) await sql`
          update categories set
            name_ar = ${data.nameAr},
            name_en = ${data.nameEn ?? ""},
            sort_order = coalesce(${data.sortOrder ?? null}, sort_order),
            is_active = coalesce(${data.isActive ?? null}, is_active)
          where id = ${data.id} and tenant_id = ${member.tenant_id}
        `;
		else {
			const max = await sql`select coalesce(max(sort_order), 0) as m from categories where tenant_id = ${member.tenant_id}`;
			await sql`
          insert into categories (id, tenant_id, sort_order, name_ar, name_en, is_active)
          values (
            ${newId()}, ${member.tenant_id}, ${data.sortOrder ?? (max[0]?.m ?? 0) + 10},
            ${data.nameAr}, ${data.nameEn ?? ""}, ${data.isActive ?? true}
          )
        `;
		}
		return {
			ok: true,
			data: await loadSnapshot(sql, member.tenant_id, member.role)
		};
	} catch (err) {
		console.error("saveCategory failed", err);
		return {
			ok: false,
			code: "unavailable",
			error: "تعذر حفظ التصنيف"
		};
	}
});
var deleteCategory_createServerFn_handler = createServerRpc({
	id: "d859f2946c4ba7e7cf97bdb219cad797a1aa7468b05a4588e6605a8597fdbacc",
	name: "deleteCategory",
	filename: "src/lib/menu/owner.ts"
}, (opts) => deleteCategory.__executeServer(opts));
var deleteCategory = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: string().min(1) })).handler(deleteCategory_createServerFn_handler, async ({ context, data }) => {
	try {
		const sql = await getSql();
		const member = await membershipOf(sql, context.userId);
		if (!member) return {
			ok: false,
			code: "not_found",
			error: "لا يوجد مطعم"
		};
		if (!canWriteMenu(member.role)) return {
			ok: false,
			code: "forbidden",
			error: "ليست لديك صلاحية"
		};
		await sql`update products set category_id = null where category_id = ${data.id} and tenant_id = ${member.tenant_id}`;
		await sql`delete from categories where id = ${data.id} and tenant_id = ${member.tenant_id}`;
		return {
			ok: true,
			data: await loadSnapshot(sql, member.tenant_id, member.role)
		};
	} catch (err) {
		console.error("deleteCategory failed", err);
		return {
			ok: false,
			code: "unavailable",
			error: "تعذر حذف التصنيف"
		};
	}
});
var saveProduct_createServerFn_handler = createServerRpc({
	id: "227b814459c26bd27f8becb5a5fb054e8f22cd5faf39f3a6cbc295ed8aa5830f",
	name: "saveProduct",
	filename: "src/lib/menu/owner.ts"
}, (opts) => saveProduct.__executeServer(opts));
var saveProduct = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: string().optional(),
	categoryId: string().nullable().optional(),
	nameAr: string().trim().min(1).max(120),
	nameEn: string().trim().max(120).optional(),
	descriptionAr: string().trim().max(600).optional(),
	descriptionEn: string().trim().max(600).optional(),
	price: number().min(0).max(1e5),
	imageUrl: string().trim().max(500).optional(),
	calories: number().int().min(0).max(1e4).nullable().optional(),
	isAvailable: boolean().optional(),
	isFeatured: boolean().optional(),
	allergens: string().trim().max(200).optional(),
	sortOrder: number().int().optional()
})).handler(saveProduct_createServerFn_handler, async ({ context, data }) => {
	try {
		const sql = await getSql();
		const member = await membershipOf(sql, context.userId);
		if (!member) return {
			ok: false,
			code: "not_found",
			error: "لا يوجد مطعم"
		};
		if (!canWriteMenu(member.role)) return {
			ok: false,
			code: "forbidden",
			error: "ليست لديك صلاحية"
		};
		if (data.categoryId) {
			if (!(await sql`select id from categories where id = ${data.categoryId} and tenant_id = ${member.tenant_id} limit 1`)[0]) return {
				ok: false,
				code: "invalid",
				error: "تصنيف غير صالح"
			};
		}
		if (data.id) await sql`
          update products set
            category_id = ${data.categoryId ?? null},
            name_ar = ${data.nameAr},
            name_en = ${data.nameEn ?? ""},
            description_ar = ${data.descriptionAr ?? ""},
            description_en = ${data.descriptionEn ?? ""},
            price = ${data.price},
            image_url = ${data.imageUrl ?? ""},
            calories = ${data.calories ?? null},
            is_available = coalesce(${data.isAvailable ?? null}, is_available),
            is_featured = coalesce(${data.isFeatured ?? null}, is_featured),
            allergens = ${data.allergens ?? ""},
            sort_order = coalesce(${data.sortOrder ?? null}, sort_order),
            updated_at = now()
          where id = ${data.id} and tenant_id = ${member.tenant_id}
        `;
		else {
			const max = await sql`select coalesce(max(sort_order), 0) as m from products where tenant_id = ${member.tenant_id}`;
			await sql`
          insert into products (
            id, tenant_id, category_id, sort_order, name_ar, name_en, description_ar, description_en,
            price, image_url, calories, is_available, is_featured, allergens
          ) values (
            ${newId()}, ${member.tenant_id}, ${data.categoryId ?? null},
            ${data.sortOrder ?? (max[0]?.m ?? 0) + 10},
            ${data.nameAr}, ${data.nameEn ?? ""}, ${data.descriptionAr ?? ""}, ${data.descriptionEn ?? ""},
            ${data.price}, ${data.imageUrl ?? ""}, ${data.calories ?? null},
            ${data.isAvailable ?? true}, ${data.isFeatured ?? false}, ${data.allergens ?? ""}
          )
        `;
		}
		return {
			ok: true,
			data: await loadSnapshot(sql, member.tenant_id, member.role)
		};
	} catch (err) {
		console.error("saveProduct failed", err);
		return {
			ok: false,
			code: "unavailable",
			error: "تعذر حفظ الصنف"
		};
	}
});
var toggleProduct_createServerFn_handler = createServerRpc({
	id: "386e888f9bd1f68267060464991c39dd8742964de5bf224659e339c34d235762",
	name: "toggleProduct",
	filename: "src/lib/menu/owner.ts"
}, (opts) => toggleProduct.__executeServer(opts));
var toggleProduct = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: string().min(1),
	field: _enum(["isAvailable", "isFeatured"]),
	value: boolean()
})).handler(toggleProduct_createServerFn_handler, async ({ context, data }) => {
	try {
		const sql = await getSql();
		const member = await membershipOf(sql, context.userId);
		if (!member) return {
			ok: false,
			code: "not_found",
			error: "لا يوجد مطعم"
		};
		if (!canWriteMenu(member.role)) return {
			ok: false,
			code: "forbidden",
			error: "ليست لديك صلاحية"
		};
		if (data.field === "isAvailable") await sql`update products set is_available = ${data.value}, updated_at = now() where id = ${data.id} and tenant_id = ${member.tenant_id}`;
		else await sql`update products set is_featured = ${data.value}, updated_at = now() where id = ${data.id} and tenant_id = ${member.tenant_id}`;
		return {
			ok: true,
			data: await loadSnapshot(sql, member.tenant_id, member.role)
		};
	} catch (err) {
		console.error("toggleProduct failed", err);
		return {
			ok: false,
			code: "unavailable",
			error: "تعذر تحديث الصنف"
		};
	}
});
var deleteProduct_createServerFn_handler = createServerRpc({
	id: "0e731316b2165076364239625f3e57ce8a6f97fee980bd9ee451a67ed7552328",
	name: "deleteProduct",
	filename: "src/lib/menu/owner.ts"
}, (opts) => deleteProduct.__executeServer(opts));
var deleteProduct = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: string().min(1) })).handler(deleteProduct_createServerFn_handler, async ({ context, data }) => {
	try {
		const sql = await getSql();
		const member = await membershipOf(sql, context.userId);
		if (!member) return {
			ok: false,
			code: "not_found",
			error: "لا يوجد مطعم"
		};
		if (!canWriteMenu(member.role)) return {
			ok: false,
			code: "forbidden",
			error: "ليست لديك صلاحية"
		};
		await sql`delete from products where id = ${data.id} and tenant_id = ${member.tenant_id}`;
		return {
			ok: true,
			data: await loadSnapshot(sql, member.tenant_id, member.role)
		};
	} catch (err) {
		console.error("deleteProduct failed", err);
		return {
			ok: false,
			code: "unavailable",
			error: "تعذر حذف الصنف"
		};
	}
});
var saveBranch_createServerFn_handler = createServerRpc({
	id: "0766acc254cbfca99819708343de0ce7343f169eb2a27a691d3a17cfffedb5b2",
	name: "saveBranch",
	filename: "src/lib/menu/owner.ts"
}, (opts) => saveBranch.__executeServer(opts));
var saveBranch = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: string().optional(),
	nameAr: string().trim().min(1).max(80),
	nameEn: string().trim().max(80).optional(),
	slug: string().trim().max(63).optional(),
	addressAr: string().trim().max(200).optional(),
	addressEn: string().trim().max(200).optional(),
	mapsUrl: string().trim().max(400).optional(),
	phone: string().trim().max(30).optional(),
	isActive: boolean().optional(),
	hours: array(object({
		weekday: number().int().min(0).max(6),
		opensAt: string().nullable(),
		closesAt: string().nullable(),
		isClosed: boolean()
	})).optional()
})).handler(saveBranch_createServerFn_handler, async ({ context, data }) => {
	try {
		const sql = await getSql();
		const member = await membershipOf(sql, context.userId);
		if (!member) return {
			ok: false,
			code: "not_found",
			error: "لا يوجد مطعم"
		};
		if (!canWriteSettings(member.role)) return {
			ok: false,
			code: "forbidden",
			error: "ليست لديك صلاحية"
		};
		const slug = slugify(data.slug || data.nameEn || data.nameAr) || "branch";
		let branchId = data.id;
		if (branchId) await sql`
          update branches set
            name_ar = ${data.nameAr},
            name_en = ${data.nameEn ?? ""},
            slug = ${slug},
            address_ar = ${data.addressAr ?? ""},
            address_en = ${data.addressEn ?? ""},
            maps_url = ${data.mapsUrl ?? ""},
            phone = ${data.phone ?? ""},
            is_active = coalesce(${data.isActive ?? null}, is_active),
            updated_at = now()
          where id = ${branchId} and tenant_id = ${member.tenant_id}
        `;
		else {
			branchId = newId();
			await sql`
          insert into branches (id, tenant_id, slug, name_ar, name_en, address_ar, address_en, maps_url, phone, is_active)
          values (
            ${branchId}, ${member.tenant_id}, ${slug}, ${data.nameAr}, ${data.nameEn ?? ""},
            ${data.addressAr ?? ""}, ${data.addressEn ?? ""}, ${data.mapsUrl ?? ""}, ${data.phone ?? ""},
            ${data.isActive ?? true}
          )
        `;
		}
		if (data.hours) {
			await sql`delete from branch_hours where branch_id = ${branchId}`;
			for (const hour of data.hours) await sql`
            insert into branch_hours (branch_id, weekday, opens_at, closes_at, is_closed)
            values (${branchId}, ${hour.weekday}, ${hour.opensAt}, ${hour.closesAt}, ${hour.isClosed})
          `;
		}
		return {
			ok: true,
			data: await loadSnapshot(sql, member.tenant_id, member.role)
		};
	} catch (err) {
		console.error("saveBranch failed", err);
		return {
			ok: false,
			code: "unavailable",
			error: "تعذر حفظ الفرع"
		};
	}
});
var deleteBranch_createServerFn_handler = createServerRpc({
	id: "7710444e6bc635eee74147ea6ac9bfa19fa4bbb2b47db4e9311cbb26cec8af5d",
	name: "deleteBranch",
	filename: "src/lib/menu/owner.ts"
}, (opts) => deleteBranch.__executeServer(opts));
var deleteBranch = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: string().min(1) })).handler(deleteBranch_createServerFn_handler, async ({ context, data }) => {
	try {
		const sql = await getSql();
		const member = await membershipOf(sql, context.userId);
		if (!member) return {
			ok: false,
			code: "not_found",
			error: "لا يوجد مطعم"
		};
		if (!canWriteSettings(member.role)) return {
			ok: false,
			code: "forbidden",
			error: "ليست لديك صلاحية"
		};
		if (((await sql`select count(*)::int as c from branches where tenant_id = ${member.tenant_id}`)[0]?.c ?? 0) <= 1) return {
			ok: false,
			code: "invalid",
			error: "يجب الإبقاء على فرع واحد على الأقل"
		};
		await sql`delete from branches where id = ${data.id} and tenant_id = ${member.tenant_id}`;
		return {
			ok: true,
			data: await loadSnapshot(sql, member.tenant_id, member.role)
		};
	} catch (err) {
		console.error("deleteBranch failed", err);
		return {
			ok: false,
			code: "unavailable",
			error: "تعذر حذف الفرع"
		};
	}
});
var getBranchHours_createServerFn_handler = createServerRpc({
	id: "9da79b8772a27af2ae42391815f3c925bace40cbe3eb426fcc6f26624fcd02a3",
	name: "getBranchHours",
	filename: "src/lib/menu/owner.ts"
}, (opts) => getBranchHours.__executeServer(opts));
var getBranchHours = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({ branchId: string().min(1) })).handler(getBranchHours_createServerFn_handler, async ({ context, data }) => {
	try {
		const sql = await getSql();
		const member = await membershipOf(sql, context.userId);
		if (!member) return {
			ok: false,
			code: "not_found",
			error: "لا يوجد مطعم"
		};
		if (!(await sql`select id from branches where id = ${data.branchId} and tenant_id = ${member.tenant_id} limit 1`)[0]) return {
			ok: false,
			code: "not_found",
			error: "الفرع غير موجود"
		};
		return {
			ok: true,
			data: { hours: (await sql`select * from branch_hours where branch_id = ${data.branchId} order by weekday`).map((r) => mapHour(r)) }
		};
	} catch (err) {
		console.error("getBranchHours failed", err);
		return {
			ok: false,
			code: "unavailable",
			error: "تعذر تحميل ساعات العمل"
		};
	}
});
var importProducts_createServerFn_handler = createServerRpc({
	id: "6fe017d7b5059d29a4b217a2903a77a8184a01c14c8b11dc27611ce8e6b733ec",
	name: "importProducts",
	filename: "src/lib/menu/owner.ts"
}, (opts) => importProducts.__executeServer(opts));
var importProducts = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ rows: array(object({
	nameAr: string().trim().min(1).max(120),
	nameEn: string().trim().max(120),
	categoryAr: string().trim().min(1).max(80),
	categoryEn: string().trim().max(80),
	descriptionAr: string().trim().max(600),
	descriptionEn: string().trim().max(600),
	price: number().min(0).max(1e5),
	imageUrl: string().trim().max(500),
	calories: number().int().min(0).max(1e4).nullable(),
	isFeatured: boolean(),
	isAvailable: boolean()
})).min(1).max(400) })).handler(importProducts_createServerFn_handler, async ({ context, data }) => {
	try {
		const sql = await getSql();
		const member = await membershipOf(sql, context.userId);
		if (!member) return {
			ok: false,
			code: "not_found",
			error: "لا يوجد مطعم"
		};
		if (!canWriteMenu(member.role)) return {
			ok: false,
			code: "forbidden",
			error: "ليست لديك صلاحية"
		};
		const cats = (await sql`select * from categories where tenant_id = ${member.tenant_id}`).map((r) => mapCategory(r));
		const byName = new Map(cats.map((c) => [c.nameAr.trim(), c]));
		let imported = 0;
		let sort = (await sql`select coalesce(max(sort_order), 0) as m from products where tenant_id = ${member.tenant_id}`)[0]?.m ?? 0;
		for (const row of data.rows) {
			let cat = byName.get(row.categoryAr.trim());
			if (!cat) {
				const id = newId();
				const maxC = await sql`select coalesce(max(sort_order), 0) as m from categories where tenant_id = ${member.tenant_id}`;
				await sql`
            insert into categories (id, tenant_id, sort_order, name_ar, name_en, is_active)
            values (${id}, ${member.tenant_id}, ${(maxC[0]?.m ?? 0) + 10}, ${row.categoryAr}, ${row.categoryEn}, true)
          `;
				cat = {
					id,
					tenantId: member.tenant_id,
					sortOrder: 0,
					nameAr: row.categoryAr,
					nameEn: row.categoryEn,
					isActive: true
				};
				byName.set(row.categoryAr.trim(), cat);
			}
			sort += 10;
			await sql`
          insert into products (
            id, tenant_id, category_id, sort_order, name_ar, name_en, description_ar, description_en,
            price, image_url, calories, is_available, is_featured
          ) values (
            ${newId()}, ${member.tenant_id}, ${cat.id}, ${sort},
            ${row.nameAr}, ${row.nameEn}, ${row.descriptionAr}, ${row.descriptionEn},
            ${row.price}, ${row.imageUrl}, ${row.calories}, ${row.isAvailable}, ${row.isFeatured}
          )
        `;
			imported += 1;
		}
		const snapshot = await loadSnapshot(sql, member.tenant_id, member.role);
		return {
			ok: true,
			data: {
				imported,
				snapshot
			}
		};
	} catch (err) {
		console.error("importProducts failed", err);
		return {
			ok: false,
			code: "unavailable",
			error: "تعذر استيراد الأصناف"
		};
	}
});
var getOwnerAnalytics_createServerFn_handler = createServerRpc({
	id: "e583d78af6f72b9c5cfe6f95277f75facc8eed6857a2dbf6a1032c8f928b188d",
	name: "getOwnerAnalytics",
	filename: "src/lib/menu/owner.ts"
}, (opts) => getOwnerAnalytics.__executeServer(opts));
var getOwnerAnalytics = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({ days: union([literal(7), literal(30)]).optional() })).handler(getOwnerAnalytics_createServerFn_handler, async ({ context, data }) => {
	try {
		const sql = await getSql();
		const member = await membershipOf(sql, context.userId);
		if (!member) return {
			ok: false,
			code: "not_found",
			error: "لا يوجد مطعم"
		};
		const days = data.days === 30 ? 30 : 7;
		const since = (/* @__PURE__ */ new Date(Date.now() - days * 24 * 60 * 60 * 1e3)).toISOString();
		const totals = await sql`
        select
          count(*) filter (where event_type = 'visit')::int as visits,
          count(*) filter (where event_type = 'product_view')::int as views,
          count(*) filter (where event_type = 'qr_scan')::int as qr,
          count(*) filter (where event_type = 'whatsapp')::int as wa,
          count(distinct session_id)::int as sessions,
          count(*) filter (where lang = 'ar')::int as lang_ar,
          count(*) filter (where lang = 'en')::int as lang_en
        from menu_events
        where tenant_id = ${member.tenant_id} and created_at >= ${since}
      `;
		const seriesRows = await sql`
        select
          to_char(date_trunc('day', created_at), 'YYYY-MM-DD') as day,
          count(*) filter (where event_type = 'visit')::int as visits,
          count(*) filter (where event_type = 'product_view')::int as views
        from menu_events
        where tenant_id = ${member.tenant_id} and created_at >= ${since}
        group by 1
        order by 1
      `;
		const topProducts = await sql`
        select p.id, p.name_ar, p.name_en, count(*)::int as count
        from menu_events e
        join products p on p.id = e.product_id
        where e.tenant_id = ${member.tenant_id}
          and e.event_type = 'product_view'
          and e.created_at >= ${since}
        group by p.id, p.name_ar, p.name_en
        order by count desc
        limit 8
      `;
		const byCategory = await sql`
        select c.id, c.name_ar, c.name_en, count(*)::int as count
        from menu_events e
        join products p on p.id = e.product_id
        join categories c on c.id = p.category_id
        where e.tenant_id = ${member.tenant_id}
          and e.event_type = 'product_view'
          and e.created_at >= ${since}
        group by c.id, c.name_ar, c.name_en
        order by count desc
      `;
		const byBranch = await sql`
        select b.id, b.name_ar, b.name_en, count(*)::int as count
        from menu_events e
        join branches b on b.id = e.branch_id
        where e.tenant_id = ${member.tenant_id}
          and e.event_type in ('visit', 'qr_scan')
          and e.created_at >= ${since}
        group by b.id, b.name_ar, b.name_en
        order by count desc
      `;
		const t = totals[0];
		return {
			ok: true,
			data: {
				rangeDays: days,
				visits: t?.visits ?? 0,
				uniqueSessions: t?.sessions ?? 0,
				productViews: t?.views ?? 0,
				qrScans: t?.qr ?? 0,
				whatsappClicks: t?.wa ?? 0,
				langAr: t?.lang_ar ?? 0,
				langEn: t?.lang_en ?? 0,
				series: seriesRows.map((r) => ({
					day: r.day,
					visits: r.visits,
					views: r.views
				})),
				topProducts: topProducts.map((r) => ({
					id: r.id,
					nameAr: r.name_ar,
					nameEn: r.name_en,
					count: r.count
				})),
				byCategory: byCategory.map((r) => ({
					id: r.id,
					nameAr: r.name_ar,
					nameEn: r.name_en,
					count: r.count
				})),
				byBranch: byBranch.map((r) => ({
					id: r.id,
					nameAr: r.name_ar,
					nameEn: r.name_en,
					count: r.count
				}))
			}
		};
	} catch (err) {
		console.error("getOwnerAnalytics failed", err);
		return {
			ok: false,
			code: "unavailable",
			error: "تعذر تحميل التحليلات"
		};
	}
});
var seedStarterItems_createServerFn_handler = createServerRpc({
	id: "8b12e124d987fe7da7596030cfadeebfa4298f1bd4408979ff7d50fa4141eadf",
	name: "seedStarterItems",
	filename: "src/lib/menu/owner.ts"
}, (opts) => seedStarterItems.__executeServer(opts));
var seedStarterItems = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ items: array(object({
	categoryAr: string(),
	categoryEn: string(),
	nameAr: string(),
	nameEn: string(),
	price: number().min(0)
})).max(20) })).handler(seedStarterItems_createServerFn_handler, async ({ context, data }) => {
	try {
		const sql = await getSql();
		const member = await membershipOf(sql, context.userId);
		if (!member) return {
			ok: false,
			code: "not_found",
			error: "لا يوجد مطعم"
		};
		const rows = data.items.map((item) => ({
			nameAr: item.nameAr,
			nameEn: item.nameEn,
			categoryAr: item.categoryAr,
			categoryEn: item.categoryEn,
			descriptionAr: "",
			descriptionEn: "",
			price: item.price,
			imageUrl: "",
			calories: null,
			isFeatured: false,
			isAvailable: true,
			issues: []
		}));
		if (rows.length === 0) return {
			ok: true,
			data: await loadSnapshot(sql, member.tenant_id, member.role)
		};
		const catRows = await sql`select * from categories where tenant_id = ${member.tenant_id}`;
		const byName = new Map(catRows.map((r) => {
			const c = mapCategory(r);
			return [c.nameAr.trim(), c];
		}));
		let sort = (await sql`select coalesce(max(sort_order), 0) as m from products where tenant_id = ${member.tenant_id}`)[0]?.m ?? 0;
		for (const row of rows) {
			let cat = byName.get(row.categoryAr.trim());
			if (!cat) {
				const id = newId();
				const maxC = await sql`select coalesce(max(sort_order), 0) as m from categories where tenant_id = ${member.tenant_id}`;
				await sql`
            insert into categories (id, tenant_id, sort_order, name_ar, name_en, is_active)
            values (${id}, ${member.tenant_id}, ${(maxC[0]?.m ?? 0) + 10}, ${row.categoryAr}, ${row.categoryEn}, true)
          `;
				cat = {
					id,
					tenantId: member.tenant_id,
					sortOrder: 0,
					nameAr: row.categoryAr,
					nameEn: row.categoryEn,
					isActive: true
				};
				byName.set(row.categoryAr.trim(), cat);
			}
			sort += 10;
			await sql`
          insert into products (id, tenant_id, category_id, sort_order, name_ar, name_en, price, is_available, is_featured)
          values (${newId()}, ${member.tenant_id}, ${cat.id}, ${sort}, ${row.nameAr}, ${row.nameEn}, ${row.price}, true, false)
        `;
		}
		return {
			ok: true,
			data: await loadSnapshot(sql, member.tenant_id, member.role)
		};
	} catch (err) {
		console.error("seedStarterItems failed", err);
		return {
			ok: false,
			code: "unavailable",
			error: "تعذر إضافة الأصناف"
		};
	}
});
var getOwnerPreviewMenu_createServerFn_handler = createServerRpc({
	id: "92b12c4e2ab30eff02b5ecb4711a06e4e5c2fe5e20dd6f1cec70af37b9b8955f",
	name: "getOwnerPreviewMenu",
	filename: "src/lib/menu/owner.ts"
}, (opts) => getOwnerPreviewMenu.__executeServer(opts));
var getOwnerPreviewMenu = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({ branchSlug: string().max(63).optional() })).handler(getOwnerPreviewMenu_createServerFn_handler, async ({ context, data }) => {
	try {
		const sql = await getSql();
		const member = await membershipOf(sql, context.userId);
		if (!member) return {
			ok: false,
			code: "not_found",
			error: "لا يوجد مطعم"
		};
		const tenants = await sql`select * from tenants where id = ${member.tenant_id} limit 1`;
		if (!tenants[0]) return {
			ok: false,
			code: "not_found",
			error: "لا يوجد مطعم"
		};
		const tenant = mapTenant(tenants[0]);
		const branches = (await sql`select * from branches where tenant_id = ${tenant.id} order by created_at`).map((r) => mapBranch(r));
		const branch = (data.branchSlug ? branches.find((b) => b.slug === data.branchSlug) : null) ?? branches[0];
		if (!branch) return {
			ok: false,
			code: "unavailable",
			error: "لا يوجد فرع"
		};
		const [hourRows, catRows, prodRows] = await Promise.all([
			sql`select * from branch_hours where branch_id = ${branch.id} order by weekday`,
			sql`select * from categories where tenant_id = ${tenant.id} order by sort_order`,
			sql`select * from products where tenant_id = ${tenant.id} order by sort_order`
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
		console.error("getOwnerPreviewMenu failed", err);
		return {
			ok: false,
			code: "unavailable",
			error: "تعذر تحميل المعاينة"
		};
	}
});
//#endregion
export { createRestaurant_createServerFn_handler, deleteBranch_createServerFn_handler, deleteCategory_createServerFn_handler, deleteProduct_createServerFn_handler, getBranchHours_createServerFn_handler, getMyStudio_createServerFn_handler, getOwnerAnalytics_createServerFn_handler, getOwnerPreviewMenu_createServerFn_handler, importProducts_createServerFn_handler, saveBranch_createServerFn_handler, saveCategory_createServerFn_handler, saveProduct_createServerFn_handler, seedStarterItems_createServerFn_handler, toggleProduct_createServerFn_handler, updateTenant_createServerFn_handler };
