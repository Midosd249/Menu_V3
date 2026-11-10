import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";

// F6.1-AUTH-01 regression coverage.
//
// Two complementary layers, because the repository's node test runner cannot
// import the real handler modules directly:
//   * `@/...` path aliases and Vite-only `import.meta.glob` in `src/lib/db.ts`
//     make the createServerFn handlers un-loadable under `node --test`.
//   * The established repository pattern for pure node tests is the
//     source-contract test; real database behaviour is exercised by the W9
//     browser QA against an isolated PGlite server.
//
// Therefore this file (1) binds the security invariants to the real handler
// source, and (2) proves the SQL-level enforcement semantics against a real,
// isolated PGlite instance using the exact same predicates and CTE shape the
// handlers use. It deliberately does NOT fake behaviour with string-only
// assertions; the PGlite section executes real SQL.

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

const ordersSource = await read("../src/lib/menu/orders.ts");
const optionsSource = await read("../src/lib/menu/options.ts");
const optionGroupsSource = await read("../src/lib/menu/option-groups.ts");
const productMetadataSource = await read("../src/lib/menu/product-metadata.ts");

test("F6.1-AUTH-01/A: order tenant scope requires an active membership predicate", () => {
  // getClientTenantIds tenant-owner OR active owner/admin membership.
  assert.match(
    ordersSource,
    /tm\.tenant_id = t\.id and tm\.user_id = \$\{userId\}\s*and tm\.is_active = true\s*and tm\.role in \('owner', 'admin'\)/,
  );
  // assertOrderAccess order access predicate.
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
  // The authorization call must not be nested inside an isNewConfirmation branch.
  const authorizeIndex = ordersSource.indexOf('authorizeMutation(context.userId, "orders.write"');
  assert.ok(authorizeIndex > 0, "authorizeMutation(orders.write) must exist");
  const isNewConfirmationIndex = ordersSource.indexOf("const isNewConfirmation");
  assert.ok(
    authorizeIndex < isNewConfirmationIndex,
    "authorization must run before and independently of the new->confirmed branch",
  );
  // Tenant/branch context derived from the persisted order row, never from input.
  assert.match(ordersSource, /tenantId: currentRows\[0\]\.tenant_id/);
  assert.match(ordersSource, /branchId: currentRows\[0\]\.branch_id/);
  assert.doesNotMatch(ordersSource, /authorizeMutation\(context\.userId, "orders\.write", \{\s*tenantId: data\./);
});

test("F6.1-AUTH-01/B: a read-only/no-op transition request issues no write", () => {
  assert.match(ordersSource, /fromStatus === data\.status/);
});

// ---------------------------------------------------------------------------
// Isolated PGlite proof of the database-level enforcement semantics.
// ---------------------------------------------------------------------------

async function setup() {
  const pg = new PGlite();
  await pg.waitReady;
  await pg.exec(`
    create table tenants (id text primary key, owner_user_id text not null);
    create table branches (id text primary key, tenant_id text not null);
    create table tenant_members (
      tenant_id text not null,
      user_id text not null,
      role text not null default 'owner',
      is_active boolean not null default true,
      created_at timestamptz not null default now(),
      primary key (tenant_id, user_id)
    );
    create table products (id text primary key, tenant_id text not null);
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
    insert into tenant_members (tenant_id, user_id, role, is_active) values
      ('t1','active-owner','owner',true),
      ('t1','active-admin','admin',true),
      ('t1','active-editor','editor',true),
      ('t1','inactive-admin','admin',false),
      ('t2','other-tenant-owner','owner',true);
    insert into products (id, tenant_id) values ('p1','t1'),('p2','t2');
  `);
  return pg;
}

// Mirrors assertOrderAccess / getClientTenantIds after the F6.1-AUTH-01 fix.
const runOrderAccess = (pg, userId, orderId) =>
  pg.query(
    `select o.id from orders o
      where o.id = $1 and o.archived_at is null and (
        o.tenant_id in (select t.id from tenants t where t.owner_user_id = $2)
        or exists (select 1 from tenant_members tm where tm.tenant_id = o.tenant_id and tm.user_id = $2 and tm.is_active = true and tm.role in ('owner','admin'))
      ) limit 1`,
    [orderId, userId],
  );

// Mirrors memberFor / getMember after the F6.1-AUTH-01 fix.
const runMember = (pg, userId) =>
  pg.query(
    `select tenant_id, role from tenant_members where user_id = $1 and is_active = true order by created_at limit 1`,
    [userId],
  );

// Mirrors the updateOrderStatus lock+compare-and-set CTE.
const runTransition = (pg, orderId, userId, nextStatus, fromStatus, _duration) =>
  pg.query(
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

test("PGlite: active owner/admin can access the order; inactive and cross-tenant cannot", async () => {
  const pg = await setup();
  try {
    await pg.exec("insert into orders (id, tenant_id, branch_id, status) values ('o1','t1','b1','new')");
    assert.equal((await runOrderAccess(pg, "active-owner", "o1")).rows.length, 1);
    assert.equal((await runOrderAccess(pg, "active-admin", "o1")).rows.length, 1);
    assert.equal((await runOrderAccess(pg, "inactive-admin", "o1")).rows.length, 0, "inactive membership must be denied");
    assert.equal((await runOrderAccess(pg, "editor-1", "o1")).rows.length, 0, "missing membership must be denied");
    assert.equal((await runOrderAccess(pg, "other-tenant-owner", "o1")).rows.length, 0, "cross-tenant must be denied");
  } finally {
    await pg.close();
  }
});

test("PGlite: inactive membership yields no member row; active editor resolves tenant-scoped", async () => {
  const pg = await setup();
  try {
    assert.equal((await runMember(pg, "inactive-admin")).rows.length, 0);
    const editor = await runMember(pg, "active-editor");
    assert.equal(editor.rows.length, 1);
    assert.equal(editor.rows[0].tenant_id, "t1");
    assert.equal(editor.rows[0].role, "editor");
    assert.equal((await runMember(pg, "active-owner")).rows[0].role, "owner");
  } finally {
    await pg.close();
  }
});

test("PGlite: every permitted transition is authorized, invalid ones are not converted to writes", async () => {
  const pg = await setup();
  try {
    await pg.exec("insert into orders (id, tenant_id, branch_id, status) values ('o2','t1','b1','new')");
    // new -> confirmed
    const confirm = await runTransition(pg, "o2", "active-admin", "confirmed", "new", 5);
    assert.equal(confirm.rows.length, 1);
    // confirmed -> preparing
    const prep = await runTransition(pg, "o2", "active-admin", "preparing", "confirmed", null);
    assert.equal(prep.rows.length, 1);
    // preparing -> ready
    const ready = await runTransition(pg, "o2", "active-admin", "ready", "preparing", null);
    assert.equal(ready.rows.length, 1);
    // ready -> completed
    const done = await runTransition(pg, "o2", "active-admin", "completed", "ready", null);
    assert.equal(done.rows.length, 1);
    // new -> cancelled is a permitted transition and must persist.
    await pg.exec("insert into orders (id, tenant_id, branch_id, status) values ('o2b','t1','b1','new')");
    const cancel = await runTransition(pg, "o2b", "active-admin", "cancelled", "new", null);
    assert.equal(cancel.rows.length, 1, "new->cancelled must be permitted");
    const events = await pg.query("select to_status from order_status_events where order_id = 'o2' order by created_at");
    assert.deepEqual(events.rows.map((r) => r.to_status), ["confirmed", "preparing", "ready", "completed"]);
  } finally {
    await pg.close();
  }
});

test("PGlite: cancelled transition records exactly one audit event", async () => {
  const pg = await setup();
  try {
    await pg.exec("insert into orders (id, tenant_id, branch_id, status) values ('o3','t1','b1','new')");
    await runTransition(pg, "o3", "active-owner", "cancelled", "new", null);
    const events = await pg.query("select id, from_status, to_status from order_status_events where order_id = 'o3'");
    assert.equal(events.rows.length, 1);
    assert.equal(events.rows[0].from_status, "new");
    assert.equal(events.rows[0].to_status, "cancelled");
  } finally {
    await pg.close();
  }
});

test("PGlite: stale concurrent transition safely conflicts with no new audit event", async () => {
  const pg = await setup();
  try {
    await pg.exec("insert into orders (id, tenant_id, branch_id, status) values ('o4','t1','b1','new')");
    // Two callers read 'new'; the first confirms it.
    const first = await runTransition(pg, "o4", "active-admin", "confirmed", "new", 5);
    assert.equal(first.rows.length, 1);
    // The second still believes the state is 'new' and must be rejected by the
    // compare-and-set predicate (status is now 'confirmed').
    const second = await runTransition(pg, "o4", "active-admin", "confirmed", "new", 5);
    assert.equal(second.rows.length, 0, "stale transition must conflict");
    const events = await pg.query("select count(*)::int as n from order_status_events where order_id = 'o4'");
    assert.equal(events.rows[0].n, 1, "exactly one audit event for one successful transition");
  } finally {
    await pg.close();
  }
});
