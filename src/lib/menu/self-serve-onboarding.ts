import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { newId, slugify } from "@/lib/utils";
import type { FnResult, StudioSnapshot } from "@/lib/menu/types";
import { getMyStudio } from "@/lib/menu/owner";

const businessTypeSchema = z.enum(["restaurant", "cafe", "bakery", "dessert", "food_truck", "other"]);

export const createSelfServeWorkspace = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({
    nameAr: z.string().trim().min(2).max(80),
    nameEn: z.string().trim().max(80).optional(),
    businessType: businessTypeSchema,
    descriptionAr: z.string().trim().max(160).optional(),
  }))
  .handler(async ({ context, data }): Promise<FnResult<StudioSnapshot>> => {
    try {
      const sql = await getSql();
      const existing = await sql<{ tenant_id: string; role: string }>`
        select tenant_id, role from tenant_members
        where user_id = ${context.userId} and is_active = true
        order by created_at
        limit 1
      `;
      if (existing[0]) {
        const studio = await getMyStudio();
        if (studio.ok && "tenant" in studio.data && studio.data.tenant) return studio as FnResult<StudioSnapshot>;
        return { ok: false, code: "unavailable", error: "تعذر تحميل مساحة العمل الحالية" };
      }

      const account = await sql<{ phone: string | null }>`
        select "phoneNumber" as phone
        from "user"
        where "id" = ${context.userId}
        limit 1
      `;
      const phone = account[0]?.phone?.trim() ?? "";
      if (!/^\+9665\d{8}$/.test(phone)) {
        return { ok: false, code: "invalid", error: "أكمل رقم الجوال السعودي قبل إنشاء البراند" };
      }

      const grant = await sql`
        select user_id
        from self_serve_registration_grants
        where user_id = ${context.userId} and used_at is null
        limit 1
      `;
      if (!grant[0]) return { ok: false, code: "forbidden", error: "يجب إكمال التسجيل قبل إنشاء البراند" };

      let slug = slugify(data.nameEn || data.nameAr) || `brand-${Date.now().toString(36)}`;
      const clash = await sql`select id from tenants where slug = ${slug} limit 1`;
      if (clash[0]) slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;

      const tenantId = newId();
      const branchId = newId();
      await sql`
        select menu_v3.create_self_serve_workspace(
          ${context.userId}, ${tenantId}, ${branchId}, ${slug},
          ${data.nameAr}, ${data.nameEn ?? ""}, ${data.descriptionAr ?? ""}, ${data.businessType}
        )
      `;

      const studio = await getMyStudio();
      if (!studio.ok) return studio;
      if (!("tenant" in studio.data) || !studio.data.tenant) {
        return { ok: false, code: "unavailable", error: "تم إنشاء البراند لكن تعذر تحميل الاستوديو" };
      }
      return studio;
    } catch (err) {
      console.error("createSelfServeWorkspace failed", err);
      return { ok: false, code: "unavailable", error: "تعذر إنشاء البراند ومساحة العمل" };
    }
  });
