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
  } finally {
    client.release();
    await pool.end();
  }
}
