import { getSql } from "@/lib/db";
import { isPlatformAdminConfigured } from "./platform-admin-config.ts";

export { isPlatformAdminConfigured } from "./platform-admin-config.ts";

export async function requirePlatformAdmin(userId: string): Promise<void> {
  const sql = await getSql();
  const durable = await sql<{ is_admin: boolean }>`
    select menu_v3.is_platform_admin(${userId}) as is_admin
  `;
  if (Boolean(durable[0]?.is_admin)) return;

  const users = await sql<{ email: string }>`
    select "email" as email from "user" where "id" = ${userId} limit 1
  `;
  if (isPlatformAdminConfigured(userId, users[0]?.email)) return;

  throw new Error("PLATFORM_ADMIN_REQUIRED");
}
