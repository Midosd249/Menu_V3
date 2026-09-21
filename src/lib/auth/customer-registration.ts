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
      if (existing[0]) return { ok: false, code: "unavailable", error: GENERIC_REGISTRATION_ERROR.ar };

      const sessionRows = await sql<{ user_created_at: string; session_created_at: string }>`
        select u."createdAt" as user_created_at, s."createdAt" as session_created_at
        from "user" u
        join "session" s on s."userId" = u."id"
        where u."id" = ${context.userId}
        order by s."createdAt" desc
        limit 1
      `;
      const session = sessionRows[0];
      const userCreatedAt = session ? new Date(session.user_created_at).getTime() : 0;
      const sessionCreatedAt = session ? new Date(session.session_created_at).getTime() : 0;
      const isNewRegistration = userCreatedAt > 0 && sessionCreatedAt >= userCreatedAt && sessionCreatedAt - userCreatedAt <= NEW_REGISTRATION_SESSION_WINDOW_MS;

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
