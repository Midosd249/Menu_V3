import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import pg from "pg";

const { Pool } = pg;
const grantMigration = readFileSync(
  "migrations/20260916060000_self_serve_registration_grant.sql",
  "utf8",
);
const atomicMigration = readFileSync(
  "migrations/20260916070000_self_serve_workspace_atomic.sql",
  "utf8",
);
const hardeningMigration = readFileSync(
  "migrations/20260916080000_self_serve_registration_grant_atomic_consumption.sql",
  "utf8",
);

const databaseUrl = process.env.SELF_SERVE_CONCURRENCY_TEST_DATABASE_URL?.trim() ||
  (process.env.CI ? "postgresql://postgres:postgres@127.0.0.1:5432/menu_v3_ci" : "");

function isolateMigration(sql, schema) {
  return sql.replace(/\bmenu_v3\b/g, schema);
}

test("self-serve grant authorizes exactly one concurrent workspace creation", { skip: !databaseUrl }, async () => {
  const pool = new Pool({ connectionString: databaseUrl, max: 4 });
  const schema = `self_serve_concurrency_${randomUUID().replaceAll("-", "")}`;
  const userId = "self-serve-concurrency-user";
  const tenantIds = [randomUUID(), randomUUID()];
  const branchIds = [randomUUID(), randomUUID()];

  try {
    await pool.query(`create schema ${schema}`);
    await pool.query("create role anon nologin").catch((error) => {
      if (error.code !== "42710") throw error;
    });
    await pool.query("create role authenticated nologin").catch((error) => {
      if (error.code !== "42710") throw error;
    });

    await pool.query(`
      create table ${schema}.self_serve_registration_grants (
        user_id text primary key,
        created_at timestamptz not null default now(),
        used_at timestamptz
      );
      create table ${schema}."user" (
        id text primary key,
        "phoneNumber" text
      );
      create table ${schema}.tenants (
        id text primary key,
        owner_user_id text not null,
        slug text not null,
        name_ar text not null,
        name_en text not null default '',
        tagline_ar text not null default '',
        business_type text not null,
        is_published boolean not null default false,
        is_active boolean not null default true
      );
      create table ${schema}.tenant_members (
        tenant_id text not null,
        user_id text not null,
        role text not null
      );
      create table ${schema}.branches (
        id text primary key,
        tenant_id text not null,
        slug text not null,
        name_ar text not null,
        name_en text not null,
        address_ar text not null,
        is_active boolean not null default true
      );
      create table ${schema}.branch_hours (
        branch_id text not null,
        weekday integer not null,
        opens_at text not null,
        closes_at text not null,
        is_closed boolean not null
      );
      create table ${schema}.lead_onboarding (
        id text,
        lead_id text,
        approved_at timestamptz,
        used_at timestamptz,
        revoked_at timestamptz,
        expires_at timestamptz
      );
      create table ${schema}.leads (
        id text,
        status text,
        contact_email text
      );
    `);

    await pool.query(isolateMigration(grantMigration, schema));
    await pool.query(isolateMigration(atomicMigration, schema));
    await pool.query(isolateMigration(hardeningMigration, schema));

    await pool.query(
      `insert into ${schema}."user" (id, "phoneNumber") values ($1, $2)`,
      [userId, "+966512345678"],
    );
    await pool.query(
      `insert into ${schema}.self_serve_registration_grants (user_id) values ($1)`,
      [userId],
    );

    const runWorkspace = (tenantId, branchId, name) => pool.query(
      `select ${schema}.create_self_serve_workspace($1,$2,$3,$4,$5,$6,$7,$8)`,
      [userId, tenantId, branchId, `${name}-slug`, name, "", "", "restaurant"],
    );

    const results = await Promise.allSettled([
      runWorkspace(tenantIds[0], branchIds[0], "Concurrent One"),
      runWorkspace(tenantIds[1], branchIds[1], "Concurrent Two"),
    ]);

    const fulfilled = results.filter((result) => result.status === "fulfilled");
    const rejected = results.filter((result) => result.status === "rejected");
    assert.equal(fulfilled.length, 1, "exactly one concurrent workspace creation must succeed");
    assert.equal(rejected.length, 1, "the competing workspace creation must fail");
    assert.match(
      rejected[0].reason?.message ?? "",
      /SELF_SERVE_GRANT_(ALREADY_USED|REQUIRED)/,
    );

    const counts = await pool.query(`
      select
        (select count(*) from ${schema}.tenants) as tenants,
        (select count(*) from ${schema}.tenant_members) as members,
        (select count(*) from ${schema}.branches) as branches,
        (select count(*) from ${schema}.branch_hours) as hours,
        (select count(*) from ${schema}.self_serve_registration_grants where used_at is not null) as consumed_grants
    `);
    assert.deepEqual(counts.rows[0], {
      tenants: "1",
      members: "1",
      branches: "1",
      hours: "7",
      consumed_grants: "1",
    });

    const repeated = await pool.query(
      `select ${schema}.create_self_serve_workspace($1,$2,$3,$4,$5,$6,$7,$8)`,
      [userId, randomUUID(), randomUUID(), "repeated-slug", "Repeated Attempt", "", "", "restaurant"],
    ).then(
      () => ({ ok: true }),
      (error) => ({ ok: false, error }),
    );
    assert.equal(repeated.ok, false, "a repeated attempt must fail after the grant is consumed");
    assert.match(repeated.error?.message ?? "", /SELF_SERVE_GRANT_(ALREADY_USED|REQUIRED)/);

    const afterRepeat = await pool.query(`
      select
        (select count(*) from ${schema}.tenants) as tenants,
        (select count(*) from ${schema}.tenant_members) as members,
        (select count(*) from ${schema}.branches) as branches,
        (select count(*) from ${schema}.branch_hours) as hours,
        (select count(*) from ${schema}.self_serve_registration_grants where used_at is not null) as consumed_grants
    `);
    assert.deepEqual(afterRepeat.rows[0], counts.rows[0], "a failed repeated attempt must leave workspace state unchanged");
  } finally {
    await pool.query(`drop schema if exists ${schema} cascade`);
    await pool.end();
  }
});

test("self-serve grant hardening uses an affected-row-checked conditional update", () => {
  assert.match(hardeningMigration, /update menu_v3\.self_serve_registration_grants/);
  assert.match(hardeningMigration, /where user_id = new\.owner_user_id\s+and used_at is null\s+returning user_id into consumed_user_id/);
  assert.match(hardeningMigration, /if consumed_user_id is not null then/);
  assert.match(hardeningMigration, /SELF_SERVE_GRANT_ALREADY_USED/);
  assert.doesNotMatch(hardeningMigration, /if exists \(\s*select 1\s*from menu_v3\.self_serve_registration_grants/);
});
