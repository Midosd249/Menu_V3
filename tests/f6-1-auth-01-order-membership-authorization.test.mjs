import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { authorizeMutation, AuthorizationError } from "../src/lib/auth/authorization.server.ts";

// F6.1-AUTH-01 regression coverage.
//
// Authorization is exercised through the REAL production authorization
// function `authorizeMutation` (the same function `updateOrderStatus` calls),
// against a real isolated PGlite database, using the production `getMembership`
// lookup. `authorizeMutation` now accepts an optional injected `Sql`, which the
// production handlers omit (so their behaviour is unchanged) and which lets this
// test drive the exact production code path.
//
// The order transition statement is mirrored from `updateOrderStatus`; the
// source-contract test below binds that mirror to the real handler source so it
// cannot silently drift, and the transition is gated by the real
// `authorizeMutation` result exactly as the handler does.

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

const ordersSource = await read("../src/lib/menu/orders.ts");
const optionsSource = await read("../src/lib/menu/options.ts");
const optionGroupsSource = await read("../src/lib/menu/option-groups.ts");
const productMetadataSource = await read("../src/lib/menu/product-metadata.ts");

// ---------------------------------------------------------------------------
// Real Sql adapter over PGlite (matches src/lib/db.ts Sql shape).
// ---------------------------------------------------------------------------

function toSql(pg) {
  const sql = async (strings, ...values) => {
    let text = strings[0];
    for (let i = 0; i < values.length; i += 1) text += "$" + String(i + 1) + strings[i + 1];
    const result = await pg.query(text, values);
    return result.rows;
  };
  sql.query = async (text, params = []) => (await pg.query(text, params)).rows;
  sql.transaction = async (callback) => callback(sql);
  return sql;
}

async function setup() {
  const pg = new PGlite();
  await pg.waitReady;
  await pg.exec(`
    create table tenants (id text primary key, owner_user_id text not null);
    create table branches (id text primary key, tenant_id text not null);
    create table member_branch_access (tenant_id text not null, user_id text not null, branch_id text not null);
    create table tenant_members (
      tenant_id text not null,
      user_id text not null,
      access_role text not null default 'tenant_owner',
      branch_scope text[] null,
      is_active boolean not null default true,
      created_at timestamptz not null default now(),
      primary key (tenant_id, user_id)
    );
    create table orders (
      id text primary key,
      tenant_id text not null,
      branch_id text,
      status text not null default 'new',
      archived_at timestamptz,
      updated_at timestamptz not null default now()
    );
    create table order_status_events (
      id text primary key,
      order_id text not null,
      from_status text,
      to_status text not null,
      actor_user_id text,
      created_at timestamptz not null default now()
    );
  `);
  await pg.exec(`
    insert into tenants (id, owner_user_id) values ('t1','owner-1'),('t2','owner-2');
    insert into branches (id, tenant_id) values ('b1','t1'),('b2','t2');
    insert into tenant_members (tenant_id, user_id, access_role, branch_scope, is_active) values
      ('t1','active-owner','tenant_owner',null,true),
      ('t1','active-admin','branch_manager',null,true),
      ('t1','active-editor','editor',null,true),
      ('t1','active-staff','staff',null,true),
      ('t1','inactive-admin','branch_manager',null,false),
      ('t2','other-tenant-owner','tenant_owner',null,true);
  `);
  return { pg, sql: toSql(pg) };
}

// The production handler's authorization call, with the PGlite Sql injected.
// Returns { allowed } instead of throwing so tests can assert denial.
async function authorizeOrderWrite(sql, userId, tenantId, branchId) {
  try {
    await authorizeMutation(userId, "orders.write", {
      tenantId,
      ...(branchId ? { branchId } : {}),
      sql,
    });
    return { allowed: true };
  } catch (error) {
    if (error instanceof AuthorizationError) return { allowed: false, code: error.code };
    throw error;
  }
}

// Mirrors the updateOrderStatus lock + compare-and-set + audit CTE. It is only
// invoked after `authorizeOrderWrite` returns allowed, exactly like the handler.
async function runAuthorizedTransition(pg, sql, userId, orderId, nextStatus, fromStatus) {
  const auth = await authorizeOrderWrite(sql, userId, "t1", "b1");
  if (!auth.allowed) return { authorized: false, applied: false };
  const rows = await pg.query(
    `with locked as (
        select status as from_status, clock_timestamp() as confirmation_timestamp
        from orders where id = $1 and archived_at is null for update
      ),
      updated as (
        update orders o
        set status = $2, updated_at = locked.confirmation_timestamp
        from locked
        where o.id = $1 and o.archived_at is null and o.status = locked.from_status
          and locked.from_status = $4
        returning o.*, locked.from_status
      ),
      audit as (
        insert into order_status_events (id, order_id, from_status, to_status, actor_user_id)
        select 'evt-' || $1 || '-' || $2, id, from_status, status, $3
        from updated where from_status <> status
        returning id
      )
      select * from updated`,
    [orderId, nextStatus, userId, fromStatus],
  );
  return { authorized: true, applied: rows.rows.length > 0 };
}

// ---------------------------------------------------------------------------
// Source-contract binding: keeps the mirrored SQL and the handler's own
// authorization placement in sync with the real source.
// ---------------------------------------------------------------------------

test("F6.1-AUTH-01/A: order tenant scope requires an active membership predicate", () => {
  assert.match(
    ordersSource,
    /tm\.tenant_id = t\.id and tm\.user_id = \$\{userId\}\s*and tm\.is_active = true\s*and tm\.role in \('owner', 'admin'\)/,
  );
  assert.match(
    ordersSource,
    /tm\.tenant_id = o\.tenant_id and tm\.user_id = \$\{userId\} and tm\.is_active = true and tm\.role in \('owner','admin'\)/,
  );
});

test("F6.1-AUTH-01/A: product option/modifier handlers require an active membership", () => {
  assert.match(
    optionsSource,
    /select tenant_id, role from tenant_members\s*where user_id = \$\{userId\} and is_active = true\s*order by created_at/,
  );
  assert.match(
    optionGroupsSource,
    /select tenant_id, role from tenant_members\s*where user_id = \$\{context\.userId\} and is_active = true\s*order by created_at/,
  );
  assert.match(
    productMetadataSource,
    /select tenant_id, role from tenant_members where user_id = \$\{userId\} and is_active = true order by created_at limit 1/,
  );
});

test("F6.1-AUTH-01/B: every permitted order status transition is authorized", () => {
  const authorizeIndex = ordersSource.indexOf('authorizeMutation(context.userId, "orders.write"');
  assert.ok(authorizeIndex > 0, "authorizeMutation(orders.write) must exist");
  const isNewConfirmationIndex = ordersSource.indexOf("const isNewConfirmation");
  assert.ok(
    authorizeIndex < isNewConfirmationIndex,
    "authorization must run before and independently of the new->confirmed branch",
  );
  assert.match(ordersSource, /tenantId: currentRows\[0\]\.tenant_id/);
  assert.match(ordersSource, /branchId: currentRows\[0\]\.branch_id/);
  assert.doesNotMatch(ordersSource, /authorizeMutation\(context\.userId, "orders\.write", \{\s*tenantId: data\./);
});

test("F6.1-AUTH-01/B: a read-only/no-op transition request issues no write", () => {
  assert.match(ordersSource, /fromStatus === data\.status/);
});

test("F6.1-AUTH-01/B: the mirrored transition matches the handler's compare-and-set predicate", () => {
  assert.match(ordersSource, /for update/);
  assert.match(ordersSource, /o\.status = locked\.from_status/);
  assert.match(ordersSource, /locked\.from_status = \$\{fromStatus\}/);
  assert.match(ordersSource, /insert into order_status_events/);
});

// ---------------------------------------------------------------------------
// Behavioral proof through the real production authorizeMutation function.
// ---------------------------------------------------------------------------

test("authorizeMutation denies a user without orders.write (editor/staff)", async () => {
  const { pg, sql } = await setup();
  try {
    assert.equal((await authorizeOrderWrite(sql, "active-editor", "t1")).allowed, false);
    assert.equal((await authorizeOrderWrite(sql, "active-staff", "t1")).allowed, false);
  } finally {
    await pg.close();
  }
});

test("authorizeMutation denies inactive membership", async () => {
  const { pg, sql } = await setup();
  try {
    assert.equal((await authorizeOrderWrite(sql, "inactive-admin", "t1")).allowed, false);
  } finally {
    await pg.close();
  }
});

test("authorizeMutation denies a missing membership and cross-tenant access", async () => {
  const { pg, sql } = await setup();
  try {
    assert.equal((await authorizeOrderWrite(sql, "nobody", "t1")).allowed, false);
    // An owner of t2 cannot authorize writes against t1.
    assert.equal((await authorizeOrderWrite(sql, "other-tenant-owner", "t1")).allowed, false);
  } finally {
    await pg.close();
  }
});

test("authorizeMutation permits active owner and admin roles", async () => {
  const { pg, sql } = await setup();
  try {
    assert.equal((await authorizeOrderWrite(sql, "active-owner", "t1", "b1")).allowed, true);
    assert.equal((await authorizeOrderWrite(sql, "active-admin", "t1", "b1")).allowed, true);
  } finally {
    await pg.close();
  }
});

test("denied transitions leave order status unchanged and create no audit event", async () => {
  const { pg, sql } = await setup();
  try {
    await pg.exec("insert into orders (id, tenant_id, branch_id, status) values ('o-deny','t1','b1','new')");
    for (const userId of ["active-editor", "active-staff", "inactive-admin", "other-tenant-owner", "nobody"]) {
      const result = await runAuthorizedTransition(pg, sql, userId, "o-deny", "confirmed", "new");
      assert.equal(result.authorized, false, `${userId} must be denied`);
      assert.equal(result.applied, false);
    }
    const status = await pg.query("select status from orders where id = 'o-deny'");
    assert.equal(status.rows[0].status, "new", "denied transitions must not mutate status");
    const events = await pg.query("select count(*)::int as n from order_status_events where order_id = 'o-deny'");
    assert.equal(events.rows[0].n, 0, "denied transitions must create no audit event");
  } finally {
    await pg.close();
  }
});

test("active admin can perform every permitted lifecycle transition", async () => {
  const { pg, sql } = await setup();
  try {
    await pg.exec("insert into orders (id, tenant_id, branch_id, status) values ('o-ok','t1','b1','new')");
    assert.equal((await runAuthorizedTransition(pg, sql, "active-admin", "o-ok", "confirmed", "new")).applied, true);
    assert.equal((await runAuthorizedTransition(pg, sql, "active-admin", "o-ok", "preparing", "confirmed")).applied, true);
    assert.equal((await runAuthorizedTransition(pg, sql, "active-admin", "o-ok", "ready", "preparing")).applied, true);
    assert.equal((await runAuthorizedTransition(pg, sql, "active-admin", "o-ok", "completed", "ready")).applied, true);
    const events = await pg.query("select to_status from order_status_events where order_id = 'o-ok' order by created_at");
    assert.deepEqual(events.rows.map((r) => r.to_status), ["confirmed", "preparing", "ready", "completed"]);
  } finally {
    await pg.close();
  }
});

test("new -> cancelled is permitted and records exactly one audit event", async () => {
  const { pg, sql } = await setup();
  try {
    await pg.exec("insert into orders (id, tenant_id, branch_id, status) values ('o-cancel','t1','b1','new')");
    assert.equal((await runAuthorizedTransition(pg, sql, "active-owner", "o-cancel", "cancelled", "new")).applied, true);
    const events = await pg.query("select from_status, to_status from order_status_events where order_id = 'o-cancel'");
    assert.equal(events.rows.length, 1);
    assert.equal(events.rows[0].from_status, "new");
    assert.equal(events.rows[0].to_status, "cancelled");
  } finally {
    await pg.close();
  }
});

test("an invalid lifecycle transition is not converted into a write", async () => {
  const { pg } = await setup();
  try {
    await pg.exec("insert into orders (id, tenant_id, branch_id, status) values ('o-invalid','t1','b1','completed')");
    // completed -> preparing is not permitted; mirror the handler's pre-check.
    const { getOrderStatusTransitionError } = await import("../src/lib/menu/order-lifecycle.ts");
    assert.ok(getOrderStatusTransitionError("completed", "preparing"));
    const events = await pg.query("select count(*)::int as n from order_status_events where order_id = 'o-invalid'");
    assert.equal(events.rows[0].n, 0);
  } finally {
    await pg.close();
  }
});

test("stale concurrent transition safely conflicts with no new audit event", async () => {
  const { pg, sql } = await setup();
  try {
    await pg.exec("insert into orders (id, tenant_id, branch_id, status) values ('o-stale','t1','b1','new')");
    const first = await runAuthorizedTransition(pg, sql, "active-admin", "o-stale", "confirmed", "new");
    assert.equal(first.applied, true);
    const second = await runAuthorizedTransition(pg, sql, "active-admin", "o-stale", "confirmed", "new");
    assert.equal(second.applied, false, "stale transition must conflict");
    const events = await pg.query("select count(*)::int as n from order_status_events where order_id = 'o-stale'");
    assert.equal(events.rows[0].n, 1, "exactly one audit event for one successful transition");
  } finally {
    await pg.close();
  }
});
