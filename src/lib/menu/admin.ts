import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { requirePlatformAdmin } from "@/lib/auth/platform-admin.server";
import type { FnResult } from "./types";

export const getPlatformAdminAccess = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<FnResult<{ isAdmin: boolean }>> => {
    try {
      await requirePlatformAdmin(context.userId);
      return { ok: true, data: { isAdmin: true } };
    } catch (error) {
      if (error instanceof Error && error.message === "PLATFORM_ADMIN_REQUIRED") return { ok: true, data: { isAdmin: false } };
      console.error("getPlatformAdminAccess failed", error);
      return { ok: false, code: "unavailable", error: "تعذر التحقق من صلاحيات الإدارة" };
    }
  });
