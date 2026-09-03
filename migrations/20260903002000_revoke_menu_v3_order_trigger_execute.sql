-- Trigger-only helpers must not be callable by API roles.
revoke all on function menu_v3.validate_order_item_integrity() from public;
revoke all on function menu_v3.validate_order_status_transition() from public;
