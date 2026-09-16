-- The old self-serve workspace function is no longer part of the customer lifecycle.
-- Keep its historical migrations intact, but remove the executable path.
set search_path to menu_v3, public;

drop function if exists menu_v3.create_self_serve_workspace(text,text,text,text,text,text,text,text);
