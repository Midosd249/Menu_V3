import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql, type Sql } from "@/lib/db";
import { newId, slugify } from "@/lib/utils";
import { computeHealth } from "./health";
import { mapBranch, mapCategory, mapHour, mapProduct, mapTenant } from "./map";
import type {
  FnResult,
  ImportRow,
  OwnerAnalytics,
  Role,
  StudioSnapshot,
} from "./types";

const slugSchema = z
  .string()
  .min(1)
  .max(63)
  .regex(/^[a-z0-9][a-z0-9-]*$/);

type MemberRow = { tenant_id: string; user_id: string; role: Role };

async function membershipOf(
  sql: Sql,
  userId: string,
  tenantId?: string,
): Promise<MemberRow | null> {
  if (tenantId) {
    const rows = await sql<MemberRow>`
      select tenant_id, user_id, role from tenant_members
      where user_id = ${userId} and tenant_id = ${tenantId}
      limit 1
    `;
    return rows[0] ?? null;
  }
  const rows = await sql<MemberRow>`
    select tenant_id, user_id, role from tenant_members
    where user_id = ${userId}
    order by created_at
    limit 1
  `;
  return rows[0] ?? null;
}

function canWriteMenu(role: Role) {
  return role === "owner" || role === "admin" || role === "editor";
}
function canWriteSettings(role: Role) {
  return role === "owner" || role === "admin";
}

async function loadSnapshot(sql: Sql, tenantId: string, role: Role): Promise<StudioSnapshot> {
  const [tenantRows, branchRows, catRows, prodRows, memberRows] = await Promise.all([
    sql`select * from tenants where id = ${tenantId} limit 1`,
    sql`select * from branches where tenant_id = ${tenantId} order by created_at`,
    sql`select * from categories where tenant_id = ${tenantId} order by sort_order, created_at`,
    sql`select * from products where tenant_id = ${tenantId} order by sort_order, created_at`,
    sql`select user_id, role from tenant_members where tenant_id = ${tenantId}`,
  ]);
  const tenant = mapTenant(tenantRows[0] as Record<string, unknown>);
  const branches = branchRows.map((r) => mapBranch(r as Record<string, unknown>));
  const categories = catRows.map((r) => mapCategory(r as Record<string, unknown>));
  const products = prodRows.map((r) => mapProduct(r as Record<string, unknown>));
  return {
    tenant,
    role,
    branches,
    categories,
    products,
    members: memberRows.map((r) => ({
      userId: String(r.user_id),
      role: r.role as Role,
    })),
    health: computeHealth({ tenant, branches, categories, products }),
  };
}

export const getMyStudio = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<FnResult<StudioSnapshot | { tenant: null }>> => {
    try {
      const sql = await getSql();
      const member = await membershipOf(sql, context.userId);
      if (!member) return { ok: true, data: { tenant: null } };
      const snapshot = await loadSnapshot(sql, member.tenant_id, member.role);
      return { ok: true, data: snapshot };
    } catch (err) {
      console.error("getMyStudio failed", err);
      return { ok: false, code: "unavailable", error: "تعذر تحميل الاستوديو" };
    }
  });

export const createRestaurant = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      nameAr: z.string().trim().min(2).max(80),
      nameEn: z.string().trim().max(80).optional(),
      slug: z.string().trim().max(63).optional(),
      city: z.string().trim().max(80).optional(),
      branchNameAr: z.string().trim().min(2).max(80),
      branchNameEn: z.string().trim().max(80).optional(),
      addressAr: z.string().trim().max(200).optional(),
      whatsapp: z.string().trim().max(30).optional(),
    }),
  )
  .handler(async ({ context, data }): Promise<FnResult<StudioSnapshot>> => {
    try {
      const sql = await getSql();
      const existing = await membershipOf(sql, context.userId);
      if (existing) {
        const snapshot = await loadSnapshot(sql, existing.tenant_id, existing.role);
        return { ok: true, data: snapshot };
      }
      let slug = slugify(data.slug || data.nameEn || data.nameAr);
      const clash = await sql`select id from tenants where slug = ${slug} limit 1`;
      if (clash[0]) slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
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
      const branchSlug = slugify(data.branchNameEn || data.branchNameAr) || "main";
      await sql`
        insert into branches (id, tenant_id, slug, name_ar, name_en, address_ar, is_active)
        values (
          ${branchId}, ${tenantId}, ${branchSlug}, ${data.branchNameAr},
          ${data.branchNameEn ?? ""}, ${data.addressAr ?? ""}, true
        )
      `;
      const hours = [0, 1, 2, 3, 4, 5, 6];
      for (const day of hours) {
        const closed = day === 5;
        await sql`
          insert into branch_hours (branch_id, weekday, opens_at, closes_at, is_closed)
          values (
            ${branchId},
            ${day},
            ${closed ? "13:00" : "07:00"},
            ${"00:00"},
            ${false}
          )
        `;
      }
      const snapshot = await loadSnapshot(sql, tenantId, "owner");
      return { ok: true, data: snapshot };
    } catch (err) {
      console.error("createRestaurant failed", err);
      return { ok: false, code: "unavailable", error: "تعذر إنشاء المطعم" };
    }
  });

export const updateTenant = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      nameAr: z.string().trim().min(2).max(80).optional(),
      nameEn: z.string().trim().max(80).optional(),
      taglineAr: z.string().trim().max(160).optional(),
      taglineEn: z.string().trim().max(160).optional(),
      logoUrl: z.string().trim().max(500).optional(),
      coverUrl: z.string().trim().max(500).optional(),
      instagramUrl: z.string().trim().max(200).optional(),
      whatsapp: z.string().trim().max(30).optional(),
      whatsappTemplate: z.string().trim().max(240).optional(),
      primaryColor: z.string().trim().max(20).optional(),
      accentColor: z.string().trim().max(20).optional(),
      city: z.string().trim().max(80).optional(),
      isPublished: z.boolean().optional(),
    }),
  )
  .handler(async ({ context, data }): Promise<FnResult<StudioSnapshot>> => {
    try {
      const sql = await getSql();
      const member = await membershipOf(sql, context.userId);
      if (!member) return { ok: false, code: "not_found", error: "لا يوجد مطعم" };
      if (!canWriteSettings(member.role)) return { ok: false, code: "forbidden", error: "ليست لديك صلاحية" };
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
      return { ok: true, data: await loadSnapshot(sql, member.tenant_id, member.role) };
    } catch (err) {
      console.error("updateTenant failed", err);
      return { ok: false, code: "unavailable", error: "تعذر حفظ الهوية" };
    }
  });

export const saveCategory = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      id: z.string().optional(),
      nameAr: z.string().trim().min(1).max(80),
      nameEn: z.string().trim().max(80).optional(),
      sortOrder: z.number().int().optional(),
      isActive: z.boolean().optional(),
    }),
  )
  .handler(async ({ context, data }): Promise<FnResult<StudioSnapshot>> => {
    try {
      const sql = await getSql();
      const member = await membershipOf(sql, context.userId);
      if (!member) return { ok: false, code: "not_found", error: "لا يوجد مطعم" };
      if (!canWriteMenu(member.role)) return { ok: false, code: "forbidden", error: "ليست لديك صلاحية" };
      if (data.id) {
        await sql`
          update categories set
            name_ar = ${data.nameAr},
            name_en = ${data.nameEn ?? ""},
            sort_order = coalesce(${data.sortOrder ?? null}, sort_order),
            is_active = coalesce(${data.isActive ?? null}, is_active)
          where id = ${data.id} and tenant_id = ${member.tenant_id}
        `;
      } else {
        const max = await sql<{ m: number }>`select coalesce(max(sort_order), 0) as m from categories where tenant_id = ${member.tenant_id}`;
        await sql`
          insert into categories (id, tenant_id, sort_order, name_ar, name_en, is_active)
          values (
            ${newId()}, ${member.tenant_id}, ${data.sortOrder ?? (max[0]?.m ?? 0) + 10},
            ${data.nameAr}, ${data.nameEn ?? ""}, ${data.isActive ?? true}
          )
        `;
      }
      return { ok: true, data: await loadSnapshot(sql, member.tenant_id, member.role) };
    } catch (err) {
      console.error("saveCategory failed", err);
      return { ok: false, code: "unavailable", error: "تعذر حفظ التصنيف" };
    }
  });

export const deleteCategory = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ context, data }): Promise<FnResult<StudioSnapshot>> => {
    try {
      const sql = await getSql();
      const member = await membershipOf(sql, context.userId);
      if (!member) return { ok: false, code: "not_found", error: "لا يوجد مطعم" };
      if (!canWriteMenu(member.role)) return { ok: false, code: "forbidden", error: "ليست لديك صلاحية" };
      await sql`update products set category_id = null where category_id = ${data.id} and tenant_id = ${member.tenant_id}`;
      await sql`delete from categories where id = ${data.id} and tenant_id = ${member.tenant_id}`;
      return { ok: true, data: await loadSnapshot(sql, member.tenant_id, member.role) };
    } catch (err) {
      console.error("deleteCategory failed", err);
      return { ok: false, code: "unavailable", error: "تعذر حذف التصنيف" };
    }
  });

export const saveProduct = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      id: z.string().optional(),
      categoryId: z.string().nullable().optional(),
      nameAr: z.string().trim().min(1).max(120),
      nameEn: z.string().trim().max(120).optional(),
      descriptionAr: z.string().trim().max(600).optional(),
      descriptionEn: z.string().trim().max(600).optional(),
      price: z.number().min(0).max(100000),
      imageUrl: z.string().trim().max(500).optional(),
      calories: z.number().int().min(0).max(10000).nullable().optional(),
      isAvailable: z.boolean().optional(),
      isFeatured: z.boolean().optional(),
      allergens: z.string().trim().max(200).optional(),
      sortOrder: z.number().int().optional(),
    }),
  )
  .handler(async ({ context, data }): Promise<FnResult<StudioSnapshot>> => {
    try {
      const sql = await getSql();
      const member = await membershipOf(sql, context.userId);
      if (!member) return { ok: false, code: "not_found", error: "لا يوجد مطعم" };
      if (!canWriteMenu(member.role)) return { ok: false, code: "forbidden", error: "ليست لديك صلاحية" };
      if (data.categoryId) {
        const cat = await sql`select id from categories where id = ${data.categoryId} and tenant_id = ${member.tenant_id} limit 1`;
        if (!cat[0]) return { ok: false, code: "invalid", error: "تصنيف غير صالح" };
      }
      if (data.id) {
        await sql`
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
      } else {
        const max = await sql<{ m: number }>`select coalesce(max(sort_order), 0) as m from products where tenant_id = ${member.tenant_id}`;
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
      return { ok: true, data: await loadSnapshot(sql, member.tenant_id, member.role) };
    } catch (err) {
      console.error("saveProduct failed", err);
      return { ok: false, code: "unavailable", error: "تعذر حفظ الصنف" };
    }
  });

export const toggleProduct = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      id: z.string().min(1),
      field: z.enum(["isAvailable", "isFeatured"]),
      value: z.boolean(),
    }),
  )
  .handler(async ({ context, data }): Promise<FnResult<StudioSnapshot>> => {
    try {
      const sql = await getSql();
      const member = await membershipOf(sql, context.userId);
      if (!member) return { ok: false, code: "not_found", error: "لا يوجد مطعم" };
      if (!canWriteMenu(member.role)) return { ok: false, code: "forbidden", error: "ليست لديك صلاحية" };
      if (data.field === "isAvailable") {
        await sql`update products set is_available = ${data.value}, updated_at = now() where id = ${data.id} and tenant_id = ${member.tenant_id}`;
      } else {
        await sql`update products set is_featured = ${data.value}, updated_at = now() where id = ${data.id} and tenant_id = ${member.tenant_id}`;
      }
      return { ok: true, data: await loadSnapshot(sql, member.tenant_id, member.role) };
    } catch (err) {
      console.error("toggleProduct failed", err);
      return { ok: false, code: "unavailable", error: "تعذر تحديث الصنف" };
    }
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ context, data }): Promise<FnResult<StudioSnapshot>> => {
    try {
      const sql = await getSql();
      const member = await membershipOf(sql, context.userId);
      if (!member) return { ok: false, code: "not_found", error: "لا يوجد مطعم" };
      if (!canWriteMenu(member.role)) return { ok: false, code: "forbidden", error: "ليست لديك صلاحية" };
      await sql`delete from products where id = ${data.id} and tenant_id = ${member.tenant_id}`;
      return { ok: true, data: await loadSnapshot(sql, member.tenant_id, member.role) };
    } catch (err) {
      console.error("deleteProduct failed", err);
      return { ok: false, code: "unavailable", error: "تعذر حذف الصنف" };
    }
  });

export const saveBranch = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      id: z.string().optional(),
      nameAr: z.string().trim().min(1).max(80),
      nameEn: z.string().trim().max(80).optional(),
      slug: z.string().trim().max(63).optional(),
      addressAr: z.string().trim().max(200).optional(),
      addressEn: z.string().trim().max(200).optional(),
      mapsUrl: z.string().trim().max(400).optional(),
      phone: z.string().trim().max(30).optional(),
      isActive: z.boolean().optional(),
      hours: z
        .array(
          z.object({
            weekday: z.number().int().min(0).max(6),
            opensAt: z.string().nullable(),
            closesAt: z.string().nullable(),
            isClosed: z.boolean(),
          }),
        )
        .optional(),
    }),
  )
  .handler(async ({ context, data }): Promise<FnResult<StudioSnapshot>> => {
    try {
      const sql = await getSql();
      const member = await membershipOf(sql, context.userId);
      if (!member) return { ok: false, code: "not_found", error: "لا يوجد مطعم" };
      if (!canWriteSettings(member.role)) return { ok: false, code: "forbidden", error: "ليست لديك صلاحية" };
      const slug = slugify(data.slug || data.nameEn || data.nameAr) || "branch";
      let branchId = data.id;
      if (branchId) {
        await sql`
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
      } else {
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
        for (const hour of data.hours) {
          await sql`
            insert into branch_hours (branch_id, weekday, opens_at, closes_at, is_closed)
            values (${branchId}, ${hour.weekday}, ${hour.opensAt}, ${hour.closesAt}, ${hour.isClosed})
          `;
        }
      }
      return { ok: true, data: await loadSnapshot(sql, member.tenant_id, member.role) };
    } catch (err) {
      console.error("saveBranch failed", err);
      return { ok: false, code: "unavailable", error: "تعذر حفظ الفرع" };
    }
  });

export const deleteBranch = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ context, data }): Promise<FnResult<StudioSnapshot>> => {
    try {
      const sql = await getSql();
      const member = await membershipOf(sql, context.userId);
      if (!member) return { ok: false, code: "not_found", error: "لا يوجد مطعم" };
      if (!canWriteSettings(member.role)) return { ok: false, code: "forbidden", error: "ليست لديك صلاحية" };
      const count = await sql<{ c: number }>`select count(*)::int as c from branches where tenant_id = ${member.tenant_id}`;
      if ((count[0]?.c ?? 0) <= 1) {
        return { ok: false, code: "invalid", error: "يجب الإبقاء على فرع واحد على الأقل" };
      }
      await sql`delete from branches where id = ${data.id} and tenant_id = ${member.tenant_id}`;
      return { ok: true, data: await loadSnapshot(sql, member.tenant_id, member.role) };
    } catch (err) {
      console.error("deleteBranch failed", err);
      return { ok: false, code: "unavailable", error: "تعذر حذف الفرع" };
    }
  });

export const getBranchHours = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ branchId: z.string().min(1) }))
  .handler(async ({ context, data }): Promise<FnResult<{ hours: ReturnType<typeof mapHour>[] }>> => {
    try {
      const sql = await getSql();
      const member = await membershipOf(sql, context.userId);
      if (!member) return { ok: false, code: "not_found", error: "لا يوجد مطعم" };
      const owned = await sql`select id from branches where id = ${data.branchId} and tenant_id = ${member.tenant_id} limit 1`;
      if (!owned[0]) return { ok: false, code: "not_found", error: "الفرع غير موجود" };
      const rows = await sql`select * from branch_hours where branch_id = ${data.branchId} order by weekday`;
      return { ok: true, data: { hours: rows.map((r) => mapHour(r as Record<string, unknown>)) } };
    } catch (err) {
      console.error("getBranchHours failed", err);
      return { ok: false, code: "unavailable", error: "تعذر تحميل ساعات العمل" };
    }
  });

export const importProducts = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      rows: z.array(
        z.object({
          nameAr: z.string().trim().min(1).max(120),
          nameEn: z.string().trim().max(120),
          categoryAr: z.string().trim().min(1).max(80),
          categoryEn: z.string().trim().max(80),
          descriptionAr: z.string().trim().max(600),
          descriptionEn: z.string().trim().max(600),
          price: z.number().min(0).max(100000),
          imageUrl: z.string().trim().max(500),
          calories: z.number().int().min(0).max(10000).nullable(),
          isFeatured: z.boolean(),
          isAvailable: z.boolean(),
        }),
      ).min(1).max(400),
    }),
  )
  .handler(async ({ context, data }): Promise<FnResult<{ imported: number; snapshot: StudioSnapshot }>> => {
    try {
      const sql = await getSql();
      const member = await membershipOf(sql, context.userId);
      if (!member) return { ok: false, code: "not_found", error: "لا يوجد مطعم" };
      if (!canWriteMenu(member.role)) return { ok: false, code: "forbidden", error: "ليست لديك صلاحية" };

      const catRows = await sql`select * from categories where tenant_id = ${member.tenant_id}`;
      const cats = catRows.map((r) => mapCategory(r as Record<string, unknown>));
      const byName = new Map(cats.map((c) => [c.nameAr.trim(), c]));
      let imported = 0;
      let sort = (await sql<{ m: number }>`select coalesce(max(sort_order), 0) as m from products where tenant_id = ${member.tenant_id}`)[0]?.m ?? 0;

      for (const row of data.rows) {
        let cat = byName.get(row.categoryAr.trim());
        if (!cat) {
          const id = newId();
          const maxC = await sql<{ m: number }>`select coalesce(max(sort_order), 0) as m from categories where tenant_id = ${member.tenant_id}`;
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
            isActive: true,
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
      return { ok: true, data: { imported, snapshot } };
    } catch (err) {
      console.error("importProducts failed", err);
      return { ok: false, code: "unavailable", error: "تعذر استيراد الأصناف" };
    }
  });

export const getOwnerAnalytics = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ days: z.union([z.literal(7), z.literal(30)]).optional() }))
  .handler(async ({ context, data }): Promise<FnResult<OwnerAnalytics>> => {
    try {
      const sql = await getSql();
      const member = await membershipOf(sql, context.userId);
      if (!member) return { ok: false, code: "not_found", error: "لا يوجد مطعم" };
      const days = data.days === 30 ? 30 : 7;
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

      const totals = await sql<{
        visits: number;
        views: number;
        qr: number;
        wa: number;
        sessions: number;
        lang_ar: number;
        lang_en: number;
      }>`
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

      const seriesRows = await sql<{ day: string; visits: number; views: number }>`
        select
          to_char(date_trunc('day', created_at), 'YYYY-MM-DD') as day,
          count(*) filter (where event_type = 'visit')::int as visits,
          count(*) filter (where event_type = 'product_view')::int as views
        from menu_events
        where tenant_id = ${member.tenant_id} and created_at >= ${since}
        group by 1
        order by 1
      `;

      const topProducts = await sql<{ id: string; name_ar: string; name_en: string; count: number }>`
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

      const byCategory = await sql<{ id: string; name_ar: string; name_en: string; count: number }>`
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

      const byBranch = await sql<{ id: string; name_ar: string; name_en: string; count: number }>`
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
          series: seriesRows.map((r) => ({ day: r.day, visits: r.visits, views: r.views })),
          topProducts: topProducts.map((r) => ({
            id: r.id,
            nameAr: r.name_ar,
            nameEn: r.name_en,
            count: r.count,
          })),
          byCategory: byCategory.map((r) => ({
            id: r.id,
            nameAr: r.name_ar,
            nameEn: r.name_en,
            count: r.count,
          })),
          byBranch: byBranch.map((r) => ({
            id: r.id,
            nameAr: r.name_ar,
            nameEn: r.name_en,
            count: r.count,
          })),
        },
      };
    } catch (err) {
      console.error("getOwnerAnalytics failed", err);
      return { ok: false, code: "unavailable", error: "تعذر تحميل التحليلات" };
    }
  });

export const seedStarterItems = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      items: z.array(
        z.object({
          categoryAr: z.string(),
          categoryEn: z.string(),
          nameAr: z.string(),
          nameEn: z.string(),
          price: z.number().min(0),
        }),
      ).max(20),
    }),
  )
  .handler(async ({ context, data }): Promise<FnResult<StudioSnapshot>> => {
    try {
      const sql = await getSql();
      const member = await membershipOf(sql, context.userId);
      if (!member) return { ok: false, code: "not_found", error: "لا يوجد مطعم" };
      const rows: ImportRow[] = data.items.map((item) => ({
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
        issues: [],
      }));
      if (rows.length === 0) {
        return { ok: true, data: await loadSnapshot(sql, member.tenant_id, member.role) };
      }
      const catRows = await sql`select * from categories where tenant_id = ${member.tenant_id}`;
      const byName = new Map(
        catRows.map((r) => {
          const c = mapCategory(r as Record<string, unknown>);
          return [c.nameAr.trim(), c] as const;
        }),
      );
      let sort =
        (await sql<{ m: number }>`select coalesce(max(sort_order), 0) as m from products where tenant_id = ${member.tenant_id}`)[0]
          ?.m ?? 0;
      for (const row of rows) {
        let cat = byName.get(row.categoryAr.trim());
        if (!cat) {
          const id = newId();
          const maxC = await sql<{ m: number }>`select coalesce(max(sort_order), 0) as m from categories where tenant_id = ${member.tenant_id}`;
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
            isActive: true,
          };
          byName.set(row.categoryAr.trim(), cat);
        }
        sort += 10;
        await sql`
          insert into products (id, tenant_id, category_id, sort_order, name_ar, name_en, price, is_available, is_featured)
          values (${newId()}, ${member.tenant_id}, ${cat.id}, ${sort}, ${row.nameAr}, ${row.nameEn}, ${row.price}, true, false)
        `;
      }
      return { ok: true, data: await loadSnapshot(sql, member.tenant_id, member.role) };
    } catch (err) {
      console.error("seedStarterItems failed", err);
      return { ok: false, code: "unavailable", error: "تعذر إضافة الأصناف" };
    }
  });

export const getOwnerPreviewMenu = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ branchSlug: z.string().max(63).optional() }))
  .handler(async ({ context, data }) => {
    try {
      const sql = await getSql();
      const member = await membershipOf(sql, context.userId);
      if (!member) return { ok: false as const, code: "not_found" as const, error: "لا يوجد مطعم" };
      const tenants = await sql`select * from tenants where id = ${member.tenant_id} limit 1`;
      if (!tenants[0]) return { ok: false as const, code: "not_found" as const, error: "لا يوجد مطعم" };
      const tenant = mapTenant(tenants[0] as Record<string, unknown>);
      const branchRows = await sql`select * from branches where tenant_id = ${tenant.id} order by created_at`;
      const branches = branchRows.map((r) => mapBranch(r as Record<string, unknown>));
      const branch =
        (data.branchSlug ? branches.find((b) => b.slug === data.branchSlug) : null) ?? branches[0];
      if (!branch) return { ok: false as const, code: "unavailable" as const, error: "لا يوجد فرع" };
      const [hourRows, catRows, prodRows] = await Promise.all([
        sql`select * from branch_hours where branch_id = ${branch.id} order by weekday`,
        sql`select * from categories where tenant_id = ${tenant.id} order by sort_order`,
        sql`select * from products where tenant_id = ${tenant.id} order by sort_order`,
      ]);
      return {
        ok: true as const,
        data: {
          tenant,
          branch,
          branches,
          hours: hourRows.map((r) => mapHour(r as Record<string, unknown>)),
          categories: catRows.map((r) => mapCategory(r as Record<string, unknown>)),
          products: prodRows.map((r) => mapProduct(r as Record<string, unknown>)),
        },
      };
    } catch (err) {
      console.error("getOwnerPreviewMenu failed", err);
      return { ok: false as const, code: "unavailable" as const, error: "تعذر تحميل المعاينة" };
    }
  });
