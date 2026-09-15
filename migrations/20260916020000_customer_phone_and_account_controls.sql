-- Customer phone login and Platform Owner account controls.
-- Phone numbers are provisioned from an approved service request and are
-- platform-verified; SMS OTP is intentionally not enabled until an SMS provider
-- is configured. Better Auth still owns credential verification and sessions.

alter table "user"
  add column if not exists "phoneNumber" text,
  add column if not exists "phoneNumberVerified" boolean not null default false,
  add column if not exists "role" text not null default 'user',
  add column if not exists "banned" boolean not null default false,
  add column if not exists "banReason" text,
  add column if not exists "banExpires" timestamptz;

alter table "session"
  add column if not exists "impersonatedBy" text;

create unique index if not exists "user_phoneNumber_uidx"
  on "user" ("phoneNumber")
  where "phoneNumber" is not null;

create index if not exists "user_banned_idx"
  on "user" ("banned", "banExpires");

-- Menu V3's existing Platform Owner authorization remains authoritative.
-- Better Auth Admin plugin fields provide standard ban/session semantics.
