-- A.3 server-controlled anonymous sessions and order attribution.
set search_path to menu_v3, public;
-- The session is tenant-bound; orders enforce tenant/session consistency at the database boundary.

create table if not exists anonymous_sessions (
  id text primary key,
  tenant_id text not null references tenants(id) on delete cascade,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  expires_at timestamptz not null,
  revoked_at timestamptz
);

alter table anonymous_sessions
  drop constraint if exists anonymous_sessions_expiry_ck;

alter table anonymous_sessions
  add constraint anonymous_sessions_expiry_ck
  check (expires_at > created_at);

alter table anonymous_sessions
  drop constraint if exists anonymous_sessions_tenant_id_id_key;

alter table anonymous_sessions
  add constraint anonymous_sessions_tenant_id_id_key unique (tenant_id, id);

alter table orders
  add column if not exists anonymous_session_id text;

alter table orders
  drop constraint if exists orders_anonymous_session_tenant_fkey;

alter table orders
  add constraint orders_anonymous_session_tenant_fkey
  foreign key (tenant_id, anonymous_session_id)
  references anonymous_sessions (tenant_id, id)
  on delete set null (anonymous_session_id);

create index if not exists anonymous_sessions_tenant_last_seen_idx
  on anonymous_sessions (tenant_id, last_seen_at desc);

create index if not exists anonymous_sessions_expires_idx
  on anonymous_sessions (expires_at);

create index if not exists orders_anonymous_session_idx
  on orders (tenant_id, anonymous_session_id, created_at desc);
