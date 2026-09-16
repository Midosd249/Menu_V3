import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { getMyStudio } from "@/lib/menu/owner";
import type { FnResult, StudioSnapshot } from "@/lib/menu/types";

export const selfServeWorkspaceSetupSchema = z.object({
  nameAr: z.string().trim().min(2).max(80),
  nameEn: z.string().trim().max(80).optional(),
  businessType: z.enum(["restaurant", "cafe", "bakery", "dessert", "food_truck", "other"]),
  descriptionAr: z.string().trim().max(160).optional(),
});

export type SelfServeWorkspaceSetup = z.infer<typeof selfServeWorkspaceSetupSchema>;

const PROVISIONING_ERROR: Record<string, { ar: string; en: string }> = {
  CUSTOMER_PHONE_REQUIRED: {
    ar: "أكمل رقم الجوال السعودي قبل إنشاء مساحة العمل.",
    en: "Complete your Saudi phone number before creating the workspace.",
  },
  CUSTOMER_APPROVAL_REQUIRED: {
    ar: "هذا الحساب مرتبط بمسار اعتماد سابق. أكمل مسار الاعتماد الموجود.",
    en: "This account is linked to an existing approval flow. Continue with that flow.",
  },
  PROVISIONING_USER_NOT_FOUND: {
    ar: "تعذر العثور على الحساب. سجّل الدخول مرة أخرى.",
    en: "We couldn't find your account. Sign in again and retry.",
  },
  INVALID_BRAND_NAME: {
    ar: "أدخل اسم براند صحيحًا.",
    en: "Enter a valid brand name.",
  },
  INVALID_ENGLISH_BRAND_NAME: {
    ar: "تحقق من الاسم بالإنجليزية.",
    en: "Check the English brand name.",
  },
  INVALID_BRAND_DESCRIPTION: {
    ar: "تحقق من الوصف المختصر.",
    en: "Check the short description.",
  },
  INVALID_BUSINESS_TYPE: {
    ar: "اختر نوع النشاط.",
    en: "Choose a business type.",
  },
};

function publicError(message: unknown, lang: "ar" | "en") {
  const code = message instanceof Error ? message.message : String(message ?? "");
  return PROVISIONING_ERROR[code]?.[lang] ?? (lang === "ar" ? "تعذر إنشاء مساحة العمل. حاول مرة أخرى." : "We couldn't create the workspace. Try again.");
}

export const provisionCustomerWorkspace = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(selfServeWorkspaceSetupSchema)
  .handler(async ({ context, data }): Promise<FnResult<StudioSnapshot>> => {
    try {
      const sql = await getSql();
      const baseSlug = slugify(data.nameEn || data.nameAr) || `brand-${context.userId.slice(-8).toLowerCase()}`;
      const slug = baseSlug.slice(0, 63);
      const result = await sql<{ tenant_id: string; slug: string }>`
        select * from menu_v3.provision_customer_workspace(
          ${context.userId},
          ${slug},
          ${data.nameAr},
          ${data.nameEn ?? ""},
          ${data.descriptionAr ?? ""},
          ${data.businessType}
        )
      `;
      if (!result[0]) return { ok: false, code: "unavailable", error: "تعذر إنشاء مساحة العمل" };

      const studio = await getMyStudio();
      if (!studio.ok) return studio;
      if (!("tenant" in studio.data) || !studio.data.tenant) {
        return { ok: false, code: "unavailable", error: "تعذر تحميل مساحة العمل بعد إنشائها" };
      }
      return { ok: true, data: studio.data as StudioSnapshot };
    } catch (err) {
      console.error("provisionCustomerWorkspace failed", err);
      const code = err instanceof Error ? err.message : "";
      return { ok: false, code: code === "CUSTOMER_APPROVAL_REQUIRED" ? "forbidden" : "unavailable", error: publicError(err, "ar") };
    }
  });

export function buildSelfServeWorkspaceSlug(nameAr: string, nameEn: string | undefined, userId: string) {
  const base = slugify(nameEn || nameAr) || `brand-${userId.slice(-8).toLowerCase()}`;
  return base.slice(0, 63);
}
