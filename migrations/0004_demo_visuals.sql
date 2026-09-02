-- Demo visual pass for Menu V3. Uses generated editorial imagery for the fictional Nafas demo.

update tenants
set cover_url = 'https://cdn-pipeline-output.picsart.com/pipeline-output/d89fb75b-a8fa-4c54-9f4f-5ab0c7c6e4d7.png',
    updated_at = now()
where id = 'demo-nafas';

update products
set image_url = case
  when category_id in ('demo-cat-coffee', 'demo-cat-bakery') then 'https://cdn-pipeline-output.picsart.com/pipeline-output/d89fb75b-a8fa-4c54-9f4f-5ab0c7c6e4d7.png'
  when category_id in ('demo-cat-kitchen', 'demo-cat-sweet') then 'https://cdn-pipeline-output.picsart.com/pipeline-output/5dec344a-27fb-4da1-b99d-2669d11fd8c7.png'
  else image_url
end,
updated_at = now()
where tenant_id = 'demo-nafas';
