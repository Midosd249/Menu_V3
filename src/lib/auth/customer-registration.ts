import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "./middleware";
import { getSql } from "@/lib/db";
import { normalizePhoneDigits } from "@/lib/menu/public-actions";
import type { FnResult } from "@/lib/menu/types";
import { customerRegistrationSchema, GENERIC_REGISTRATION_ERROR } from "./customer-registration-contract";

const phoneSchema = z.string().trim().min(8).max(30);
const NEW_REGISTRATION_SESSION_WINDOW_MS = 60 * 60 * 1000;

export const validateCustomerRegistrationContract = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const parsed = customerRegistrationSchema.safeParse(data);
    if (!parsed.success) throw new Error("INVALID_REGISTRATION_DATA");
    return parsed.data;
  })
  .handler(async ({ data }): Promise<FnResult<{ phone: string }>> => {
    try {
      const digits = normalizePhoneDigits(data.phone, "SA");
      if (!digits || !digits.startsWith("9665")) return { ok: false, code: "invalid", error: "أدخل رقم جوال سعودي صحيح" };
      return { ok: true, data: { phone: `+${digits}` } };
    } catch (err) {
      console.error("validateCustomerRegistrationContract failed", err);
      return { ok: false, code: "unavailable", error: GENERIC_REGISTRATION_ERROR.ar };
    }
  });

export const saveCustomerRegistrationPhone = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ phone: phoneSchema }))
  .handler(async ({ context, data }): Promise<FnResult<{ phone: string }>> => {
    try {
      const digits = normalizePhoneDigits(data.phone, "SA");
      if (!digits || !digits.startsWith("9665")) return { ok: false, code: "invalid", error: "أدخل رقم جوال سعودي صحيح" };
      const phone = `+${digits}`;
      const sql = await getSql();
      const existing = await sql`select "id" from "user" where "phoneNumber" = ${phone} and "id" <> ${context.userId} limit 1`;
      if (existing[0]) return { ok: false, code: "conflict", error: "رقم الجوال مستخدم بالفعل. / Phone number is already in use." };

      const userRows = await sql<{ phone_number: string | null; user_created_at: string; self_serve_eligible_at: string | null }>`
        select "phoneNumber" as phone_number, "createdAt" as user_created_at, "selfServeEligibleAt" as self_serve_eligible_at
        from "user"
        where "id" = ${context.userId}
        limit 1
      `;
      const userRow = userRows[0];
      if (!userRow) return { ok: false, code: "not_found", error: GENERIC_REGISTRATION_ERROR.ar };
      if (userRow.phone_number != null || userRow.self_serve_eligible_at != null) {
        return { ok: false, code: "unavailable", error: GENERIC_REGISTRATION_ERROR.ar };
      }

      const sessionRows = await sql<{ session_created_at: string }>`
        select "createdAt" as session_created_at
        from "session"
        where "userId" = ${context.userId}
        order by "createdAt" desc
        limit 1
      `;
      const session = sessionRows[0];
      const userCreatedAt = new Date(userRow.user_created_at).getTime();
      const sessionCreatedAt = session ? new Date(session.session_created_at).getTime() : 0;
      const isNewRegistration = userCreatedAt > 0 && sessionCreatedAt >= userCreatedAt && sessionCreatedAt - userCreatedAt <= NEW_REGISTRATION_SESSION_WINDOW_MS;
      if (!isNewRegistration) return { ok: false, code: "unavailable", error: GENERIC_REGISTRATION_ERROR.ar };

      await sql`
        update "user"
        set
          "phoneNumber" = ${phone},
          "phoneNumberVerified" = false,
          "selfServeEligibleAt" = case when ${isNewRegistration} then coalesce("selfServeEligibleAt", now()) else "selfServeEligibleAt" end,
          "updatedAt" = now()
        where "id" = ${context.userId}
      `;
      return { ok: true, data: { phone } };
    } catch (err) {
      console.error("saveCustomerRegistrationPhone failed", err);
      return { ok: false, code: "unavailable", error: GENERIC_REGISTRATION_ERROR.ar };
    }
  });
