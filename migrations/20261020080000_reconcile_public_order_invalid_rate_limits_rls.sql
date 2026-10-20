-- Reconcile production drift for the server-only invalid-order throttle table.
-- Keep this as a new migration: the original migration is already recorded in
-- some databases, but the live table was observed with RLS disabled.
ALTER TABLE menu_v3.public_order_invalid_rate_limits
  ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE menu_v3.public_order_invalid_rate_limits
  FROM PUBLIC, anon, authenticated;
