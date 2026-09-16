import { pendingMigrations } from "../../scripts/migration-plan.mjs";

export type DbSource = "postgres" | "pglite";

const databaseUrlCandidates =
  typeof process !== "undefined"
    ? [
        process.env.DATABASE_URL,
        process.env.POSTGRES_URL,
        process.env.POSTGRES_PRISMA_URL,
        process.env.SUPABASE_DB_URL,
        process.env.POSTGRES_URL_NON_POOLING,
      ]
    : [];
const databaseUrl = databaseUrlCandidates.find((value) => Boolean(value?.trim()))?.trim();
export const dbSource: DbSource = databaseUrl ? "postgres" : "pglite";

export const POSTGRES_SCHEMA = "menu_v3";

export interface Sql {
  <T = Record<string, unknown>>(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): Promise<T[]>;
  query<T = Record<string, unknown>>(
    text: string,
    params?: unknown[],
  ): Promise<T[]>;
}

const globalRef = globalThis as typeof globalThis & {
  __pgSqlPromise__?: Promise<Sql>;
  __pgliteInstance__?: Promise<import("@electric-sql/pglite").PGlite>;
  __pgliteMigrateChain__?: Promise<void>;
};

const OID_INT8 = 20;
const OID_DATE = 1082;
const OID_INTERVAL = 1186;
const identity = (v: string) => v;
type Run = <T>(text: string, params: unknown[]) => Promise<T[]>;

export function isPgliteIncompatibleMigration(sql: string): boolean {
  return /\bmenu_v3\./i.test(sql);
}

function toSql(run: Run): Sql {
  const sql = (async <T = Record<string, unknown>>(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): Promise<T[]> => {
    let text = strings[0];
    for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
    return run<T>(text, values);
  }) as unknown as Sql;
  sql.query = <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
    run<T>(text, params);
  return sql;
}

function createPostgresSql(): Promise<Sql> {
  globalRef.__pgSqlPromise__ ??= (async () => {
    const { Pool, types } = await import("pg");
    types.setTypeParser(OID_INT8, Number);
    types.setTypeParser(OID_DATE, identity);
    types.setTypeParser(OID_INTERVAL, identity);
    const pool = new Pool({
      connectionString: databaseUrl,
      options: `-c search_path=${POSTGRES_SCHEMA},public`,
      max: 2,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 5000,
      keepAlive: true,
    });
    return toSql(async <T>(text: string, params: unknown[]) => {
      const res = await pool.query(text, params);
      return res.rows as T[];
    });
  })().catch((err) => {
    globalRef.__pgSqlPromise__ = undefined;
    throw err;
  });
  return globalRef.__pgSqlPromise__;
}

async function createPgliteSql(): Promise<Sql> {
  const { PGlite } = await import("@electric-sql/pglite");
  globalRef.__pgliteInstance__ ??= (async () => {
    const pg = new PGlite({
      parsers: {
        [OID_INT8]: Number,
        [OID_DATE]: identity,
        [OID_INTERVAL]: identity,
      },
    });
    await pg.waitReady;
    await pg.exec(
      "create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())",
    );
    return pg;
  })().catch((err) => {
    globalRef.__pgliteInstance__ = undefined;
    throw err;
  });

  const pg = await globalRef.__pgliteInstance__;
  const migrate = async (): Promise<void> => {
    const migrations = import.meta.glob("/migrations/*.sql", {
      query: "?raw",
      import: "default",
      eager: true,
    }) as Record<string, string>;
    const doneRows = await pg.query<{ name: string }>("select name from _migrations");
    const done = doneRows.rows.map((r) => r.name);
    for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) {
      await pg.transaction(async (tx) => {
        const sql = migrations[path];
        if (isPgliteIncompatibleMigration(sql)) {
          await tx.query("insert into _migrations (name) values ($1)", [name]);
          return;
        }
        await tx.exec(sql);
        await tx.query("insert into _migrations (name) values ($1)", [name]);
      });
    }
  };

  const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve())
    .catch(() => undefined)
    .then(migrate);
  globalRef.__pgliteMigrateChain__ = pass;
  await pass;

  const isCustomerLifecycleBrowserFixture =
    typeof process !== "undefined" &&
    process.env.VITE_AUTH_ENABLED === "false" &&
    process.env.MENU_V3_DEV_USER_ID === "customer-lifecycle-user" &&
    !databaseUrl;

  if (isCustomerLifecycleBrowserFixture) {
    await pg.exec(`
      create schema if not exists menu_v3;
      alter table leads add column if not exists account_user_id text;
      alter table leads add column if not exists brand_name_en text not null default '';
      alter table leads add column if not exists business_type text not null default 'restaurant';
      alter table leads add column if not exists activation_status text not null default 'legacy';
      alter table leads add column if not exists activation_requested_at timestamptz;
      alter table leads add column if not exists decision_at timestamptz;
      alter table leads add column if not exists decision_by text;
      alter table leads add column if not exists decision_reason text not null default '';
      alter table leads add column if not exists activation_tenant_id text;
      create table if not exists member_branch_access (
        tenant_id text not null,
        user_id text not null,
        branch_id text not null,
        created_at timestamptz not null default now(),
        primary key (user_id, branch_id),
        foreign key (tenant_id) references tenants(id) on delete cascade,
        foreign key (branch_id) references branches(id) on delete cascade
      );
      create index if not exists member_branch_access_tenant_user_idx on member_branch_access (tenant_id, user_id);
      create index if not exists member_branch_access_branch_idx on member_branch_access (branch_id, user_id);
      insert into "user" ("id", "name", "email", "emailVerified", "phoneNumber", "phoneNumberVerified")
      values ('customer-lifecycle-user', 'Customer Lifecycle Test', 'customer-lifecycle@example.test', true, '+966500000001', true)
      on conflict ("id") do update set
        "name" = excluded."name",
        "email" = excluded."email",
        "emailVerified" = excluded."emailVerified",
        "phoneNumber" = excluded."phoneNumber",
        "phoneNumberVerified" = excluded."phoneNumberVerified";
      create or replace function menu_v3.activate_customer_workspace(
        p_request_id text,
        p_user_id text,
        p_tenant_id text,
        p_branch_id text,
        p_slug text
      )
      returns table (tenant_id text, slug text)
      language plpgsql
      as $$
      declare
        request_status text;
        request_user text;
        existing_tenant text;
        existing_slug text;
      begin
        select activation_status, account_user_id into request_status, request_user from leads where id = p_request_id for update;
        if request_status is null then raise exception using errcode = 'P0002', message = 'ACTIVATION_REQUEST_NOT_FOUND'; end if;
        if request_user <> p_user_id then raise exception using errcode = '42501', message = 'ACTIVATION_REQUEST_USER_MISMATCH'; end if;
        if request_status = 'activated' then
          select activation_tenant_id into existing_tenant from leads where id = p_request_id;
          if existing_tenant is not null then
            select slug into existing_slug from tenants where id = existing_tenant limit 1;
            if existing_slug is not null then return query select existing_tenant, existing_slug; return; end if;
          end if;
          raise exception using errcode = '23505', message = 'ACTIVATION_ALREADY_COMPLETED';
        end if;
        if request_status <> 'approved' then raise exception using errcode = '42501', message = 'ACTIVATION_APPROVAL_REQUIRED'; end if;
        insert into tenants (id, owner_user_id, slug, name_ar, name_en, tagline_ar, business_type, is_published, is_active)
        select p_tenant_id, p_user_id, p_slug, business_name, brand_name_en, coalesce(details, ''), business_type, false, true from leads where id = p_request_id;
        insert into tenant_members (tenant_id, user_id, role) values (p_tenant_id, p_user_id, 'owner');
        insert into branches (id, tenant_id, slug, name_ar, name_en, address_ar, is_active) values (p_branch_id, p_tenant_id, 'main', 'الفرع الرئيسي', 'Main branch', '', true);
        insert into branch_hours (branch_id, weekday, opens_at, closes_at, is_closed) values
          (p_branch_id, 0, '07:00', '00:00', false), (p_branch_id, 1, '07:00', '00:00', false),
          (p_branch_id, 2, '07:00', '00:00', false), (p_branch_id, 3, '07:00', '00:00', false),
          (p_branch_id, 4, '07:00', '00:00', false), (p_branch_id, 5, '13:00', '00:00', false),
          (p_branch_id, 6, '07:00', '00:00', false);
        update leads set activation_status = 'activated', activation_tenant_id = p_tenant_id, status = 'converted', updated_at = now() where id = p_request_id and activation_status = 'approved';
        if not found then raise exception using errcode = '40001', message = 'ACTIVATION_REQUEST_STATE_CHANGED'; end if;
        return query select p_tenant_id, p_slug;
      end;
      $$;
    `);
  }

  return toSql(async <T>(text: string, params: unknown[]) => {
    const result = await pg.query<T>(text, params);
    return result.rows;
  });
}

let sqlPromise: Promise<Sql> | null = null;
async function createSql(): Promise<Sql> {
  if (typeof window !== "undefined") throw new Error("@/lib/db is server-only");
  return dbSource === "postgres" ? createPostgresSql() : createPgliteSql();
}

export function getSql(): Promise<Sql> {
  sqlPromise ??= createSql().catch((err) => {
    sqlPromise = null;
    throw err;
  });
  return sqlPromise;
}

export async function getPglite(): Promise<import("@electric-sql/pglite").PGlite> {
  if (dbSource !== "pglite") throw new Error("getPglite() is unavailable on Postgres");
  await getSql();
  const pg = await globalRef.__pgliteInstance__;
  if (!pg) throw new Error("PGlite instance failed to initialize");
  return pg;
}

export function ensureDbReady(): Promise<void> {
  if (dbSource !== "pglite") return Promise.resolve();
  return getSql().then(() => undefined);
}

const globalBoot = globalThis as typeof globalThis & { __pgBootstrapPromise__?: Promise<void> };
if (typeof window === "undefined" && dbSource === "pglite") {
  globalBoot.__pgBootstrapPromise__ ??= ensureDbReady().catch((err) => {
    globalBoot.__pgBootstrapPromise__ = undefined;
    console.error("[db] PGLite bootstrap failed:", err);
    throw err;
  });
}
