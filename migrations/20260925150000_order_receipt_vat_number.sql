-- Menu V3: optional tenant VAT registration metadata for informal order receipts.
-- This does not add tax calculation, tax authority integration, or e-invoicing.

alter table menu_v3.tenants
  add column if not exists vat_registration_number text not null default '';
