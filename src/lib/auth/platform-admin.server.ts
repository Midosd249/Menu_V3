import { getSql } from "@/lib/db";

function csvEnv(key: string): string[] {
  return (process.env[key] ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export function isPlatformAdminConfigured(userId: string, email: string | null | undefined): boolean {
  const normalizedUserId = userId.trim().toLowerCase();
  const normalizedEmail = String(email ?? "").trim().toLowerCase();
  return (
    csvEnv("PLATFORM_ADMIN_USER_IDS").includes(normalizedUserId) ||
    (!!normalizedEmail && csvEnv("PLATFORM_ADMIN_EMAILS").includes(normalizedEmail))
  );
}

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
