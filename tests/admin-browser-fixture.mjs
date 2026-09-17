import { readFile } from "node:fs/promises";
import { join } from "node:path";
import pg from "pg";

export async function ensurePlatformAdminSubscriptionSchema() {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) return;

  const pool = new pg.Pool({
    connectionString: databaseUrl,
    options: "-c search_path=menu_v3,public",
    max: 1,
  });
  const client = await pool.connect();
  try {
    await client.query("create schema if not exists menu_v3");
    await client.query("set search_path to menu_v3, public");
    const sql = await readFile(join(process.cwd(), "migrations", "20260903025817_subscription_plans.sql"), "utf8");
    await client.query("begin");
    try {
      await client.query(sql);
      await client.query("commit");
    } catch (error) {
      await client.query("rollback");
      throw error;
    }

    // The legacy website-project surface is still read by the Platform Admin
    // dashboard for compatibility, but it is not part of the active self-serve
    // customer lifecycle and receives no new records.
    await client.query(`
      create table if not exists public.website_projects (
        id uuid primary key,
        tenant_id uuid null,
        name_ar text null,
        status text null,
        contact_name text null,
        contact_phone text null,
        city text null,
        created_at timestamptz not null default now()
      )
    `);
  } finally {
    client.release();
    await pool.end();
  }
}
