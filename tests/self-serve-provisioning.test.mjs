import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import pg from "pg";

const { Pool } = pg;
const migration = readFileSync("migrations/20260917100000_self_serve_workspace_provisioning.sql", "utf8");
const lifecycleMigration = readFileSync("migrations/20260916100000_customer_activation_lifecycle.sql", "utf8");
const edgeMigration = readFileSync("migrations/20260916130000_fix_activation_function_edge_cases.sql", "utf8");
const idempotencyMigration = readFileSync("migrations/20260916140000_make_activation_retries_strictly_idempotent.sql", "utf8");
const retiredMigration = readFileSync("migrations/20260916110000_retire_self_serve_workspace.sql", "utf8");
const provisioning = readFileSync("src/lib/menu/self-serve-provisioning.ts", "utf8");
const onboarding = readFileSync("src/routes/onboarding.tsx", "utf8");
const owner = readFileSync("src/lib/menu/owner.ts", "utf8");
const registration = readFileSync("src/lib/auth/customer-registration.ts", "utf8");

function isolateMigration(sql, schema) {
  return sql.replace(/\bmenu_v3\b/g, schema);
}

async function createFixture(pool, schema) {
  await pool.query(`create schema ${schema}`);
  await pool.query(`
    create table ${schema}."user" (
      "id" text primary key,
      "name" text not null,
      "email" text not null unique,
      "phoneNumber" text,
      "phoneNumberVerified" boolean not null default false
    );
    create table ${schema}.leads (
      id text primary key,
      business_name text not null,
      brand_name_en text not null default '',
      business_type text not null default 'restaurant',
      city text,
      contact_name text not null default '',
      contact_phone text not null default '',
      contact_email text not null default '',
      details text,
      status text not null default 'new',
      notes text not null default '',
      source text not null default 'website',
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );
    create table ${schema}.lead_onboarding (
      id text primary key,
      lead_id text,
      token_hash text,
      expires_at timestamptz,
      approved_at timestamptz,
      used_at timestamptz,
      revoked_at timestamptz,
      tenant_id text,
      created_by text
    );
    create table ${schema}.tenants (
      id text primary key,
      owner_user_id text not null,
      slug text not null unique,
      name_ar text not null,
      name_en text not null default '',
      tagline_ar text not null default '',
      business_type text not null default 'restaurant',
      is_published boolean not null default false,
      is_active boolean not null default true,
      created_at timestamptz not null default now()
    );
    create table ${schema}.tenant_members (
      tenant_id text not null,
      user_id text not null,
      role text not null,
      created_at timestamptz not null default now(),
      is_active boolean not null default true,
      primary key (tenant_id, user_id)
    );
    create table ${schema}.branches (
      id text primary key,
      tenant_id text not null,
      slug text not null,
      name_ar text not null,
      name_en text not null,
      address_ar text not null,
      is_active boolean not null default true,
      created_at timestamptz not null default now(),
      unique (tenant_id, slug)
    );
    create table ${schema}.branch_hours (
      branch_id text not null,
      weekday smallint not null,
      opens_at text not null,
      closes_at text not null,
      is_closed boolean not null,
      primary key (branch_id, weekday)
    );
    create unique index ${schema}_tenants_owner_uidx on ${schema}.tenants(owner_user_id);
  `);
  await pool.query(isolateMigration(lifecycleMigration, schema));
  await pool.query(isolateMigration(edgeMigration, schema));
  await pool.query(isolateMigration(idempotencyMigration, schema));
  await pool.query(isolateMigration(retiredMigration, schema));
  await pool.query(isolateMigration(migration, schema));
}

test("PH-01.3 keeps the self-serve authority server-side and does not use retired grant paths", () => {
  assert.match(provisioning, /\.middleware\(\[authMiddleware\]\)/);
  assert.match(provisioning, /context\.userId/);
  assert.match(provisioning, /provision_customer_workspace/);
  assert.doesNotMatch(provisioning, /self_serve_registration_grants/);
  assert.doesNotMatch(provisioning, /create_self_serve_workspace/);
  assert.doesNotMatch(onboarding, /\?new=1/);
  assert.match(onboarding, /provisionCustomerWorkspace/);
  assert.doesNotMatch(onboarding, /createSelfServeWorkspace/);
  assert.doesNotMatch(onboarding, /localStorage/);
  assert.doesNotMatch(onboarding, /tenantId/);
  assert.doesNotMatch(onboarding, /role/);
  assert.doesNotMatch(owner, /self_serve_registration_grants/);
  assert.doesNotMatch(registration, /self_serve_registration_grants/);
  assert.match(retiredMigration, /drop function if exists menu_v3\.create_self_serve_workspace/);
});

test("PH-01.3 migration preserves legacy approval and adds a distinct trusted provisioning marker", () => {
  assert.match(migration, /CUSTOMER_APPROVAL_REQUIRED/);
  assert.match(migration, /lead_onboarding/);
  assert.match(migration, /current_setting\('menu_v3\.provision_customer_workspace', true\)/);
  assert.match(migration, /current_user = provisioner_role/);
  assert.match(migration, /revoke all on function menu_v3\.provision_customer_workspace/);
  assert.match(migration, /grant execute on function menu_v3\.provision_customer_workspace[^\n]*to postgres/);
  assert.match(migration, /for update/);
  assert.match(migration, /on conflict \(tenant_id, user_id\) do update/);
  assert.match(migration, /on conflict \(branch_id, weekday\) do nothing/);
});

test("PH-01.3 setup contract covers the agreed minimum fields and bilingual UI", () => {
  assert.match(provisioning, /nameAr: z\.string\(\)\.trim\(\)\.min\(2\)\.max\(80\)/);
  assert.match(provisioning, /nameEn: z\.string\(\)\.trim\(\)\.max\(80\)\.optional\(\)/);
  assert.match(provisioning, /businessType: z\.enum/);
  assert.match(provisioning, /descriptionAr: z\.string\(\)\.trim\(\)\.max\(160\)\.optional\(\)/);
  assert.match(onboarding, /dir=\{lang === "ar" \? "rtl" : "ltr"\}/);
  assert.match(onboarding, /Brand \/ restaurant name/);
  assert.match(onboarding, /اسم البراند أو المطعم/);
  assert.match(onboarding, /Business type/);
  assert.match(onboarding, /نوع النشاط/);
  assert.match(onboarding, /aria-pressed/);
});

test("PH-01.3 isolated PostgreSQL concurrency creates exactly one workspace", { skip: !process.env.CI && !process.env.SELF_SERVE_PROVISIONING_DATABASE_URL }, async () => {
  const databaseUrl = process.env.SELF_SERVE_PROVISIONING_DATABASE_URL?.trim() || "postgresql://postgres:postgres@127.0.0.1:5432/menu_v3_ci";
  const pool = new Pool({ connectionString: databaseUrl, max: 8 });
  const schema = `ph013_provision_${randomUUID().replaceAll("-", "")}`;
  const userId = `ph013-${randomUUID()}`;
  const email = `${userId}@example.test`;
  try {
    await createFixture(pool, schema);
    await pool.query(
      `insert into ${schema}."user" ("id", "name", "email", "phoneNumber", "phoneNumberVerified") values ($1,$2,$3,$4,false)`,
      [userId, "PH-01.3 Test", email, "+966512345678"],
    );

    const run = (name) => pool.query(
      `select * from ${schema}.provision_customer_workspace($1,$2,$3,$4,$5,$6)`,
      [userId, "ph-013-test", name, "", "", "restaurant"],
    );
    const results = await Promise.allSettled([run("Concurrent One"), run("Concurrent Two")]);
    assert.equal(results.filter((result) => result.status === "fulfilled").length, 2, "concurrent retries must converge on one existing workspace");

    const counts = await pool.query(`
      select
        (select count(*) from ${schema}.tenants where owner_user_id = $1) as tenants,
        (select count(*) from ${schema}.tenant_members where user_id = $1 and is_active = true) as members,
        (select count(*) from ${schema}.branches where tenant_id = (select id from ${schema}.tenants where owner_user_id = $1)) as branches,
        (select count(*) from ${schema}.branch_hours where branch_id = (select id from ${schema}.branches where tenant_id = (select id from ${schema}.tenants where owner_user_id = $1) order by created_at limit 1)) as hours
    `, [userId]);
    assert.deepEqual(counts.rows[0], { tenants: "1", members: "1", branches: "1", hours: "7" });

    const repeated = await run("Third Attempt");
    assert.equal(repeated.rows.length, 1, "repeated provisioning should return the existing workspace");
  } finally {
    await pool.query(`drop schema if exists ${schema} cascade`);
    await pool.end();
  }
});

test("PH-01.3 unauthorized direct tenant inserts remain approval-guarded", { skip: !process.env.CI && !process.env.SELF_SERVE_PROVISIONING_DATABASE_URL }, async () => {
  const databaseUrl = process.env.SELF_SERVE_PROVISIONING_DATABASE_URL?.trim() || "postgresql://postgres:postgres@127.0.0.1:5432/menu_v3_ci";
  const pool = new Pool({ connectionString: databaseUrl, max: 2 });
  const schema = `ph013_guard_${randomUUID().replaceAll("-", "")}`;
  const userId = `ph013-unauth-${randomUUID()}`;
  const email = `${userId}@example.test`;
  try {
    await createFixture(pool, schema);
    await pool.query(
      `insert into ${schema}."user" ("id", "name", "email", "phoneNumber", "phoneNumberVerified") values ($1,$2,$3,$4,false)`,
      [userId, "Unauthorized Test", email, "+966512345679"],
    );
    await assert.rejects(
      pool.query(
        `insert into ${schema}.tenants (id, owner_user_id, slug, name_ar, name_en, tagline_ar, business_type, is_published, is_active) values ($1,$2,$3,$4,'','','restaurant',false,true)`,
        [randomUUID(), userId, `unauth-${randomUUID().slice(0, 8)}`, "Unauthorized"],
      ),
      /CUSTOMER_APPROVAL_REQUIRED/,
    );
  } finally {
    await pool.query(`drop schema if exists ${schema} cascade`);
    await pool.end();
  }
});
