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
  CUSTOMER_PHONE_REQUIRED: { ar: "أكمل رقم الجوال السعودي قبل إنشاء مساحة العمل.", en: "Complete your Saudi phone number before creating the workspace." },
  CUSTOMER_APPROVAL_REQUIRED: { ar: "هذا الحساب مرتبط بمسار اعتماد سابق. أكمل مسار الاعتماد الموجود.", en: "This account is linked to an existing approval flow. Continue with that flow." },
  PROVISIONING_USER_NOT_FOUND: { ar: "تعذر العثور على الحساب. سجّل الدخول مرة أخرى.", en: "We couldn't find your account. Sign in again and retry." },
  INVALID_BRAND_NAME: { ar: "أدخل اسم براند صحيحًا.", en: "Enter a valid brand name." },
  INVALID_ENGLISH_BRAND_NAME: { ar: "تحقق من الاسم بالإنجليزية.", en: "Check the English brand name." },
  INVALID_BRAND_DESCRIPTION: { ar: "تحقق من الوصف المختصر.", en: "Check the short description." },
  INVALID_BUSINESS_TYPE: { ar: "اختر نوع النشاط.", en: "Choose a business type." },
};

function errorCode(message: unknown) {
  const code = message instanceof Error ? message.message : String(message ?? "");
  if (code in PROVISIONING_ERROR) return code;
  return "unavailable";
}

export const getSelfServeWorkspaceEligibility = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<FnResult<{ eligible: boolean }>> => {
    try {
      const sql = await getSql();
      const rows = await sql<{ eligible: boolean }>`select "selfServeEligibleAt" is not null as eligible from "user" where "id" = ${context.userId} limit 1`;
      return { ok: true, data: { eligible: Boolean(rows[0]?.eligible) } };
    } catch (err) {
      console.error("getSelfServeWorkspaceEligibility failed", err);
      return { ok: false, code: "unavailable", error: "تعذر التحقق من أهلية الإعداد الذاتي" };
    }
  });

export const provisionCustomerWorkspace = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(selfServeWorkspaceSetupSchema)
  .handler(async ({ context, data }): Promise<FnResult<StudioSnapshot>> => {
    try {
      const sql = await getSql();
      const eligibility = await sql<{ eligible: boolean }>`select "selfServeEligibleAt" is not null as eligible from "user" where "id" = ${context.userId} limit 1`;
      if (!eligibility[0]?.eligible) return { ok: false, code: "forbidden", error: "CUSTOMER_APPROVAL_REQUIRED" };
      const baseSlug = slugify(data.nameEn || data.nameAr) || `brand-${context.userId.slice(-8).toLowerCase()}`;
      const slug = baseSlug.slice(0, 63);
      const result = await sql<{ tenant_id: string; slug: string }>`
        select * from menu_v3.provision_customer_workspace(
          ${context.userId}, ${slug}, ${data.nameAr}, ${data.nameEn ?? ""},
          ${data.descriptionAr ?? ""}, ${data.businessType}
        )
      `;
      if (!result[0]) return { ok: false, code: "unavailable", error: "PROVISIONING_UNAVAILABLE" };
      const studio = await getMyStudio();
      if (!studio.ok) return studio;
      if (!("tenant" in studio.data) || !studio.data.tenant) return { ok: false, code: "unavailable", error: "PROVISIONING_UNAVAILABLE" };
      return { ok: true, data: studio.data as StudioSnapshot };
    } catch (err) {
      console.error("provisionCustomerWorkspace failed", err);
      const code = errorCode(err);
      const message = PROVISIONING_ERROR[code]?.ar ?? "تعذر إنشاء مساحة العمل. حاول مرة أخرى.";
      return { ok: false, code: code === "CUSTOMER_APPROVAL_REQUIRED" ? "forbidden" : code === "PROVISIONING_USER_NOT_FOUND" ? "not_found" : code === "CUSTOMER_PHONE_REQUIRED" ? "invalid" : "unavailable", error: message };
    }
  });
