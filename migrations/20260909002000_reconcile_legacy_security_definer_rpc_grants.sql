revoke execute on function public.get_public_menu(text,text) from anon, authenticated;
revoke execute on function public.record_public_menu_event(text,text,text,uuid,text,text) from anon, authenticated;
revoke execute on function public.submit_service_request(jsonb) from anon, authenticated;
revoke execute on function public.submit_visibility_audit(jsonb) from anon, authenticated;
revoke execute on function public.submit_website_brief(jsonb) from anon, authenticated;
revoke execute on function public.manage_tenant_member_by_email(uuid,text,text,text) from anon, authenticated;

alter function public.get_public_menu(text,text) set search_path = public, pg_temp;
alter function public.record_public_menu_event(text,text,text,uuid,text,text) set search_path = public, pg_temp;
alter function public.submit_service_request(jsonb) set search_path = public, pg_temp;
alter function public.submit_visibility_audit(jsonb) set search_path = public, pg_temp;
alter function public.submit_website_brief(jsonb) set search_path = public, pg_temp;
alter function public.manage_tenant_member_by_email(uuid,text,text,text) set search_path = public, pg_temp;
