import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { isThemeKey, type ThemeKey } from "./registry";
import type { FnResult } from "@/lib/menu/types";

const themeSchema = z.string().trim().min(1).max(40);

export const saveTenantTheme = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ themeKey: themeSchema }))
  .handler(async ({ context, data }): Promise<FnResult<{ themeKey: ThemeKey }>> => {
    if (!isThemeKey(data.themeKey)) {
      return { ok: false, code: "invalid", error: "القالب غير صالح" };
    }

    try {
      const sql = await getSql();
      const members = await sql<{ tenant_id: string; role: "owner" | "admin" | "editor" }>`
        select tenant_id, role
        from tenant_members
        where user_id = ${context.userId}
          and role in ('owner', 'admin')
        order by created_at
        limit 1
      `;
      const member = members[0];
      if (!member) return { ok: false, code: "forbidden", error: "ليست لديك صلاحية تغيير التصميم" };

      const rows = await sql<{ theme_key: string }>`
        update tenants
        set theme_key = ${data.themeKey}, updated_at = now()
        where id = ${member.tenant_id}
        returning theme_key
      `;
      const saved = rows[0]?.theme_key;
      if (!isThemeKey(saved)) return { ok: false, code: "unavailable", error: "تعذر تأكيد حفظ القالب" };
      return { ok: true, data: { themeKey: saved } };
    } catch (err) {
      console.error("saveTenantTheme failed", err);
      return { ok: false, code: "unavailable", error: "تعذر حفظ القالب حالياً" };
    }
  });
