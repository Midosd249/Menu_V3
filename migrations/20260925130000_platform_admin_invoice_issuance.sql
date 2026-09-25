-- Platform-admin invoice issuance hardening.
-- Reuses menu_v3.subscription_invoices; adds only invoice notes and a sequential invoice-number generator.
-- No payment provider, automatic charging, webhook, or payment-status logic is introduced.

ALTER TABLE menu_v3.subscription_invoices
  ADD COLUMN IF NOT EXISTS notes TEXT;

CREATE SEQUENCE IF NOT EXISTS menu_v3.subscription_invoice_number_seq
  AS BIGINT
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;

REVOKE ALL ON SEQUENCE menu_v3.subscription_invoice_number_seq FROM PUBLIC, anon, authenticated;
