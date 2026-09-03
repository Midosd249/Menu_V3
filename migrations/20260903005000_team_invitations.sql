create table if not exists team_invitations (
  id text primary key,
  tenant_id text not null references tenants(id) on delete cascade,
  email text not null,
  role text not null check (role in ('admin', 'editor')),
  token_hash text not null unique,
  expires_at timestamptz not null,
  created_by text not null,
  accepted_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create unique index if not exists team_invitations_pending_email_idx
  on team_invitations (tenant_id, lower(email))
  where accepted_at is null and revoked_at is null;

create index if not exists team_invitations_tenant_idx
  on team_invitations (tenant_id, created_at desc);

create index if not exists team_invitations_token_hash_idx
  on team_invitations (token_hash);

alter table team_invitations enable row level security;

-- Server-side application code is the authorization boundary for this table.
-- No direct client grants are added here.
