-- Menu V3 Level 4B: make the client onboarding owner lifecycle idempotent.
-- A client account may own at most one tenant; concurrent onboarding requests
-- therefore converge on the same tenant instead of creating duplicates.
set search_path = menu_v3, public;

create unique index if not exists tenants_owner_user_id_uidx
  on menu_v3.tenants (owner_user_id);
