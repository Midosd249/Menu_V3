import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { getSubscription } from "@/lib/menu/subscriptions";
import { invalidatePublicMenuCache } from "@/lib/menu/public";
import { canUseTheme, normalizeThemeKey } from "./registry";
import { isThemeTestingOverrideEnabled } from "./testing-access";
import type { ThemeKey } from "./types";
import type { FnResult } from "@/lib/menu/types";

const themeSchema = z.string().trim().min(1).max(40);

export const saveTenantTheme = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ themeKey: themeSchema }))
  .handler(async ({ context, data }): Promise<FnResult<{ themeKey: ThemeKey }>> => {
    const themeKey = normalizeThemeKey(data.themeKey);
    if (!themeKey) return { ok: false, code: "invalid", error: "القالب غير صالح" };
    try {
      const sql = await getSql();
      const members = await sql<{ tenant_id: string; role: "owner" | "admin" }>`
        select tenant_id, role from tenant_members
        where user_id = ${context.userId} and role in ('owner', 'admin')
        order by created_at limit 1
      `;
      const member = members[0];
      if (!member) return { ok: false, code: "forbidden", error: "ليست لديك صلاحية تغيير التصميم" };

      const subscription = await getSubscription(sql, member.tenant_id);
      const testingOverride = isThemeTestingOverrideEnabled();
      if (!canUseTheme(themeKey, subscription?.code) && !testingOverride) {
        return { ok: false, code: "forbidden", error: "هذا التصميم متاح ضمن الخطط المدفوعة. يمكنك معاينته ثم الترقية لاستخدامه." };
      }
      if (testingOverride && themeKey !== "essential") {
        console.warn("MENU_THEME_TESTING_OVERRIDE is active for premium theme selection", {
          tenantId: member.tenant_id,
          themeKey,
          expiresAt: process.env.MENU_THEME_TESTING_OVERRIDE_EXPIRES_AT,
          vercelEnv: process.env.VERCEL_ENV,
        });
      }
      if (subscription && !["trialing", "active"].includes(subscription.status)) {
        return { ok: false, code: "forbidden", error: "اشتراكك غير نشط حالياً. لا يمكن نشر تصميم Premium." };
      }

      const rows = await sql<{ theme_key: string; slug: string }>`
        update tenants set theme_key = ${themeKey}, updated_at = now()
        where id = ${member.tenant_id} returning theme_key, slug
      `;
      const saved = normalizeThemeKey(rows[0]?.theme_key);
      const slug = rows[0]?.slug;
      if (!saved || !slug) return { ok: false, code: "unavailable", error: "تعذر تأكيد حفظ القالب" };
      invalidatePublicMenuCache(slug);
      return { ok: true, data: { themeKey: saved } };
    } catch (err) {
      console.error("saveTenantTheme failed", err);
      return { ok: false, code: "unavailable", error: "تعذر حفظ القالب حالياً" };
    }
  });
