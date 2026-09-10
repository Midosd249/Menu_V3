-- customer_requests is an internal platform-admin workflow and is not a public menu table.
-- Keep browser/API roles from reading or mutating it directly; server functions perform
-- their own platform-admin authorization before using the direct database connection.
set search_path = menu_v3, public;

alter table customer_requests enable row level security;
revoke all on table customer_requests from anon, authenticated;
