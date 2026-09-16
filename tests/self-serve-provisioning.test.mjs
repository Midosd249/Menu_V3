import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import pg from "pg";

const migration = readFileSync("migrations/20260917100000_self_serve_workspace_provisioning.sql", "utf8");
const provisioning = readFileSync("src/lib/menu/self-serve-provisioning.ts", "utf8");
const onboarding = readFileSync("src/routes/onboarding.tsx", "utf8");
const owner = readFileSync("src/lib/menu/owner.ts", "utf8");
const registration = readFileSync("src/lib/auth/customer-registration.ts", "utf8");
const retiredGrantMigration = readFileSync("migrations/20260916110000_retire_self_serve_workspace.sql", "utf8");

const databaseUrl = process.env.SELF_SERVE_PROVISIONING_DATABASE_URL?.trim() || "";

function assertWorkspaceCounts(row, expected = { tenants: "1", members: "1", branches: "1", hours: "7" }) {
  assert.deepEqual(row, expected);
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
  assert.match(retiredGrantMigration, /drop function if exists menu_v3\.create_self_serve_workspace/);
  assert.doesNotMatch(registration, /self_serve_registration_grants/);
});

test("PH-01.3 migration preserves legacy approval and adds a distinct trusted provisioning marker", () => {
  assert.match(migration, /CUSTOMER_APPROVAL_REQUIRED/);
  assert.match(migration, /lead_onboarding/);
  assert.match(migration, /current_setting\('menu_v3\.provision_customer_workspace', true\)/);
  assert.match(migration, /current_user = provisioner_role/);
  assert.match(migration, /revoke all on function menu_v3\.provision_customer_workspace/);
  assert.match(migration, /grant execute on function menu_v3\.provision_customer_workspace[^\n]*to postgres/);
  assert.match(migration, /for update/);
  assert.match(migration, /tenants_owner_user_id_uidx/);
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

test("PH-01.3 isolated PostgreSQL concurrency creates exactly one workspace", { skip: !databaseUrl }, async () => {
  const pool = new pg.Pool({ connectionString: databaseUrl, max: 8 });
  const userId = `ph013-${randomUUID()}`;
  const email = `${userId}@example.test`;
  try {
    await pool.query(
      `insert into menu_v3."user" ("id", "name", "email", "emailVerified", "phoneNumber", "phoneNumberVerified") values ($1,$2,$3,true,$4,false)`,
      [userId, "PH-01.3 Test", email, "+966512345678"],
    );

    const run = (name) => pool.query(
      `select * from menu_v3.provision_customer_workspace($1,$2,$3,$4,$5,$6)`,
      [userId, "ph-013-test", name, "", "", "restaurant"],
    );
    const results = await Promise.allSettled([run("Concurrent One"), run("Concurrent Two")]);
    assert.equal(results.filter((result) => result.status === "fulfilled").length, 2, "retries should converge on one existing workspace");

    const counts = await pool.query(`
      select
        (select count(*) from menu_v3.tenants where owner_user_id = $1) as tenants,
        (select count(*) from menu_v3.tenant_members where user_id = $1 and is_active = true) as members,
        (select count(*) from menu_v3.branches where tenant_id = (select id from menu_v3.tenants where owner_user_id = $1)) as branches,
        (select count(*) from menu_v3.branch_hours where branch_id = (select id from menu_v3.branches where tenant_id = (select id from menu_v3.tenants where owner_user_id = $1) order by created_at limit 1)) as hours
    `, [userId]);
    assertWorkspaceCounts(counts.rows[0]);

    const third = await run("Third Attempt");
    assert.equal(third.rows.length, 1, "repeated provisioning should return the existing workspace");
  } finally {
    await pool.query("delete from menu_v3.tenants where owner_user_id = $1", [userId]);
    await pool.query('delete from menu_v3."user" where "id" = $1', [userId]);
    await pool.end();
  }
});

test("PH-01.3 unauthorized direct tenant inserts remain approval-guarded", { skip: !databaseUrl }, async () => {
  const pool = new pg.Pool({ connectionString: databaseUrl, max: 2 });
  const userId = `ph013-unauth-${randomUUID()}`;
  const email = `${userId}@example.test`;
  try {
    await pool.query(
      `insert into menu_v3."user" ("id", "name", "email", "emailVerified", "phoneNumber", "phoneNumberVerified") values ($1,$2,$3,true,$4,false)`,
      [userId, "Unauthorized Test", email, "+966512345679"],
    );
    await assert.rejects(
      pool.query(
        `insert into menu_v3.tenants (id, owner_user_id, slug, name_ar, name_en, tagline_ar, business_type, is_published, is_active) values ($1,$2,$3,$4,'','','restaurant',false,true)`,
        [randomUUID(), userId, `unauth-${randomUUID().slice(0, 8)}`, "Unauthorized"],
      ),
      /CUSTOMER_APPROVAL_REQUIRED/,
    );
  } finally {
    await pool.query('delete from menu_v3."user" where "id" = $1', [userId]);
    await pool.end();
  }
});
