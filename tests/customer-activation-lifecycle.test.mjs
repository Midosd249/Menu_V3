import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import pg from "pg";

const { Pool } = pg;
const migration = readFileSync("migrations/20260916100000_customer_activation_lifecycle.sql", "utf8");
const databaseUrl = process.env.CUSTOMER_ACTIVATION_TEST_DATABASE_URL?.trim() ||
  (process.env.CI ? "postgresql://postgres:postgres@127.0.0.1:5432/menu_v3_ci" : "");

function isolateMigration(sql, schema) { return sql.replace(/\bmenu_v3\b/g, schema); }

test("customer activation lifecycle blocks signup-only tenant creation and is idempotent", { skip: !databaseUrl }, async () => {
  const pool = new Pool({ connectionString: databaseUrl, max: 8 });
  const schema = `customer_activation_${randomUUID().replaceAll("-", "")}`;
  const userId = randomUUID();
  const requestId = randomUUID();
  try {
    await pool.query(`create schema ${schema}`);
    await pool.query(`
      create table ${schema}."user" (id text primary key, "email" text not null, "name" text not null, "phoneNumber" text);
      create table ${schema}.leads (
        id text primary key, business_name text not null, brand_name_en text not null default '', business_type text not null default 'restaurant',
        city text, contact_name text not null default '', contact_phone text not null default '', contact_email text not null default '', details text,
        status text not null default 'new', notes text not null default '', source text not null default 'website', created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
        account_user_id text, activation_status text not null default 'legacy', activation_requested_at timestamptz, decision_at timestamptz, decision_by text, decision_reason text not null default ''
      );
      create table ${schema}.lead_onboarding (id text primary key, lead_id text, token_hash text, expires_at timestamptz, approved_at timestamptz, used_at timestamptz, revoked_at timestamptz, tenant_id text, created_by text);
      create table ${schema}.tenants (
        id text primary key, owner_user_id text not null, slug text not null unique, name_ar text not null, name_en text not null default '', tagline_ar text not null default '', business_type text not null, is_published boolean not null default false, is_active boolean not null default true
      );
      create table ${schema}.tenant_members (tenant_id text not null, user_id text not null, role text not null, created_at timestamptz not null default now(), is_active boolean not null default true);
      create table ${schema}.branches (id text primary key, tenant_id text not null, slug text not null, name_ar text not null, name_en text not null, address_ar text not null, is_active boolean not null default true);
      create table ${schema}.branch_hours (branch_id text not null, weekday integer not null, opens_at text not null, closes_at text not null, is_closed boolean not null);
    `);
    await pool.query(isolateMigration(migration, schema));

    await pool.query(`insert into ${schema}."user" (id, "email", "name", "phoneNumber") values ($1,$2,$3,$4)`, [userId, "customer@example.com", "Customer", "+966512345678"]);

    await assert.rejects(
      pool.query(`insert into ${schema}.tenants (id, owner_user_id, slug, name_ar, name_en, business_type) values ($1,$2,$3,$4,$5,$6)`, [randomUUID(), userId, "signup-only", "Signup Only", "", "restaurant"]),
      /CUSTOMER_APPROVAL_REQUIRED/,
      "signup alone must not authorize tenant creation",
    );

    await pool.query(`insert into ${schema}.leads (id,business_name,contact_name,contact_phone,contact_email,account_user_id,activation_status,activation_requested_at) values ($1,$2,$3,$4,$5,$6,'pending',now())`, [requestId, "Test Brand", "Customer", "+966512345678", "customer@example.com", userId]);

    const decisions = await Promise.allSettled([
      pool.query(`update ${schema}.leads set activation_status='approved', decision_at=now(), decision_by='admin-a' where id=$1 and activation_status in ('pending','action_required','rejected') returning id`, [requestId]),
      pool.query(`update ${schema}.leads set activation_status='rejected', decision_at=now(), decision_by='admin-b' where id=$1 and activation_status in ('pending','action_required','rejected') returning id`, [requestId]),
    ]);
    const decided = decisions.filter((result) => result.status === "fulfilled" && result.value.rowCount === 1);
    assert.equal(decided.length, 1, "exactly one concurrent admin decision must win");

    await pool.query(`update ${schema}.leads set activation_status='approved', status='qualified' where id=$1`, [requestId]);
    const runActivation = (tenantId, branchId) => pool.query(`select * from ${schema}.activate_customer_workspace($1,$2,$3,$4,$5)`, [requestId, userId, tenantId, branchId, `test-brand-${requestId.slice(-6)}`]);
    const activations = await Promise.allSettled([runActivation(randomUUID(), randomUUID()), runActivation(randomUUID(), randomUUID())]);
    assert.equal(activations.filter((result) => result.status === "fulfilled").length, 2, "concurrent activation retries must be idempotent");

    const counts = await pool.query(`select (select count(*) from ${schema}.tenants) tenants, (select count(*) from ${schema}.tenant_members) members, (select count(*) from ${schema}.branches) branches, (select count(*) from ${schema}.branch_hours) hours`);
    assert.deepEqual(counts.rows[0], { tenants: "1", members: "1", branches: "1", hours: "7" });

    const request = await pool.query(`select activation_status, status from ${schema}.leads where id=$1`, [requestId]);
    assert.deepEqual(request.rows[0], { activation_status: "activated", status: "converted" });
  } finally {
    await pool.query(`drop schema if exists ${schema} cascade`);
    await pool.end();
  }
});

test("customer activation migration removes self-serve grant authorization", () => {
  assert.match(migration, /activation_status/);
  assert.match(migration, /CUSTOMER_APPROVAL_REQUIRED/);
  assert.match(migration, /activate_customer_workspace/);
  assert.match(migration, /activate_legacy_customer_workspace/);
  assert.doesNotMatch(migration, /self_serve_registration_grants[\s\S]*used_at is null[\s\S]*return new/);
});
