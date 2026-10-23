import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const resolvePublicTableQrContext = createServerFn({ method: "POST" })
  .validator(z.object({
    slug: z.string().min(1).max(63).regex(/^[a-z0-9][a-z0-9-]*$/),
    token: z.string().trim().min(16).max(128),
    branchSlug: z.string().min(1).max(63).optional(),
  }))
  .handler(async ({ data }): Promise<{ branchSlug: string; tableLabel: string } | null> => {
    const { resolveTableQrToken } = await import("./table-qr");
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const context = await resolveTableQrToken(sql, data.token);
    if (!context || context.tenantSlug !== data.slug) return null;
    if (data.branchSlug && context.branchSlug !== data.branchSlug) return null;
    return { branchSlug: context.branchSlug, tableLabel: context.tableLabel };
  });
