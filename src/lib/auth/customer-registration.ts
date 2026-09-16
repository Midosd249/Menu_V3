import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "./middleware";
import { getSql } from "@/lib/db";
import { normalizePhoneDigits } from "@/lib/menu/public-actions";
import type { FnResult } from "@/lib/menu/types";

const phoneSchema = z.string().trim().min(8).max(30);

const GENERIC_REGISTRATION_ERROR = "تعذر إنشاء الحساب. راجع البيانات وحاول مرة أخرى.";

export const saveCustomerRegistrationPhone = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ phone: phoneSchema }))
  .handler(async ({ context, data }): Promise<FnResult<{ phone: string }>> => {
    try {
      const digits = normalizePhoneDigits(data.phone, "SA");
      if (!digits || !digits.startsWith("9665")) {
        return { ok: false, code: "invalid", error: "أدخل رقم جوال سعودي صحيح" };
      }
      const phone = `+${digits}`;
      const sql = await getSql();
      const existing = await sql`select "id" from "user" where "phoneNumber" = ${phone} and "id" <> ${context.userId} limit 1`;
      if (existing[0]) return { ok: false, code: "conflict", error: GENERIC_REGISTRATION_ERROR };
      await sql`
        update "user"
        set "phoneNumber" = ${phone}, "phoneNumberVerified" = false, "updatedAt" = now()
        where "id" = ${context.userId}
      `;
      return { ok: true, data: { phone } };
    } catch (err) {
      console.error("saveCustomerRegistrationPhone failed", err);
      return { ok: false, code: "unavailable", error: GENERIC_REGISTRATION_ERROR };
    }
  });

export { GENERIC_REGISTRATION_ERROR };
