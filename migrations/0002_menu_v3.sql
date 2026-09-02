-- MENU V3 independent schema. Does not touch production Supabase.

create table if not exists tenants (
  id text primary key,
  owner_user_id text not null,
  slug text not null unique,
  name_ar text not null,
  name_en text not null default '',
  tagline_ar text,
  tagline_en text,
  logo_url text,
  cover_url text,
  instagram_url text,
  whatsapp text,
  whatsapp_template text not null default 'السلام عليكم، أريد الاستفسار عن {product} من {restaurant}.',
  primary_color text not null default '#171411',
  accent_color text not null default '#8f4e32',
  currency text not null default 'SAR',
  city text,
  country text not null default 'SA',
  is_published boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tenants_slug_ck check (slug ~ '^[a-z0-9][a-z0-9-]{0,62}$')
);

create table if not exists tenant_members (
  tenant_id text not null references tenants(id) on delete cascade,
  user_id text not null,
  role text not null default 'owner',
  created_at timestamptz not null default now(),
  primary key (tenant_id, user_id),
  constraint tenant_members_role_ck check (role in ('owner', 'admin', 'editor'))
);

create table if not exists branches (
  id text primary key,
  tenant_id text not null references tenants(id) on delete cascade,
  slug text not null,
  name_ar text not null,
  name_en text not null default '',
  address_ar text,
  address_en text,
  maps_url text,
  phone text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, slug),
  constraint branches_slug_ck check (slug ~ '^[a-z0-9][a-z0-9-]{0,62}$')
);

create table if not exists branch_hours (
  branch_id text not null references branches(id) on delete cascade,
  weekday smallint not null,
  opens_at text,
  closes_at text,
  is_closed boolean not null default false,
  primary key (branch_id, weekday),
  constraint branch_hours_weekday_ck check (weekday between 0 and 6)
);

create table if not exists categories (
  id text primary key,
  tenant_id text not null references tenants(id) on delete cascade,
  sort_order integer not null default 0,
  name_ar text not null,
  name_en text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id text primary key,
  tenant_id text not null references tenants(id) on delete cascade,
  category_id text references categories(id) on delete set null,
  sort_order integer not null default 0,
  name_ar text not null,
  name_en text not null default '',
  description_ar text,
  description_en text,
  price numeric not null default 0,
  currency text not null default 'SAR',
  image_url text,
  calories integer,
  is_available boolean not null default true,
  is_featured boolean not null default false,
  allergens text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_price_ck check (price >= 0),
  constraint products_calories_ck check (calories is null or calories >= 0)
);

create table if not exists menu_events (
  id text primary key,
  tenant_id text not null references tenants(id) on delete cascade,
  branch_id text references branches(id) on delete set null,
  product_id text references products(id) on delete set null,
  event_type text not null,
  lang text,
  session_id text,
  created_at timestamptz not null default now(),
  constraint menu_events_type_ck check (event_type in ('visit', 'product_view', 'qr_scan', 'whatsapp'))
);

create table if not exists leads (
  id text primary key,
  business_name text not null,
  city text,
  contact_name text not null,
  contact_phone text not null,
  contact_email text,
  details text,
  created_at timestamptz not null default now()
);

create index if not exists tenants_owner_idx on tenants (owner_user_id);
create index if not exists tenant_members_user_idx on tenant_members (user_id);
create index if not exists branches_tenant_idx on branches (tenant_id);
create index if not exists categories_tenant_idx on categories (tenant_id, sort_order);
create index if not exists products_tenant_idx on products (tenant_id, sort_order);
create index if not exists products_category_idx on products (category_id);
create index if not exists menu_events_tenant_created_idx on menu_events (tenant_id, created_at desc);
create index if not exists menu_events_session_idx on menu_events (tenant_id, session_id, event_type, created_at desc);

-- Demo restaurant: fictional café «نَفَس» — original content, not a real client.
insert into tenants (
  id, owner_user_id, slug, name_ar, name_en, tagline_ar, tagline_en,
  instagram_url, whatsapp, primary_color, accent_color, city, is_published, is_active
) values (
  'demo-nafas',
  'system-demo',
  'nafas',
  'نَفَس',
  'Nafas',
  'قهوة مختصة ومخبوزات يومية في العليا',
  'Specialty coffee and daily pastry in Al Olaya',
  'https://instagram.com/nafas',
  '966500000000',
  '#1c1712',
  '#9a5a38',
  'الرياض',
  true,
  true
) on conflict (id) do nothing;

insert into tenant_members (tenant_id, user_id, role)
values ('demo-nafas', 'system-demo', 'owner')
on conflict do nothing;

insert into branches (
  id, tenant_id, slug, name_ar, name_en, address_ar, address_en, maps_url, phone, is_active
) values (
  'demo-nafas-olaya',
  'demo-nafas',
  'olaya',
  'فرع العليا',
  'Olaya branch',
  'طريق الملك فهد، حي العليا، الرياض',
  'King Fahd Road, Al Olaya, Riyadh',
  'https://maps.google.com/?q=Al+Olaya+Riyadh',
  '0110000000',
  true
) on conflict (id) do nothing;

insert into branch_hours (branch_id, weekday, opens_at, closes_at, is_closed) values
  ('demo-nafas-olaya', 0, '07:00', '00:00', false),
  ('demo-nafas-olaya', 1, '07:00', '00:00', false),
  ('demo-nafas-olaya', 2, '07:00', '00:00', false),
  ('demo-nafas-olaya', 3, '07:00', '00:00', false),
  ('demo-nafas-olaya', 4, '07:00', '00:00', false),
  ('demo-nafas-olaya', 5, '13:00', '00:00', false),
  ('demo-nafas-olaya', 6, '07:00', '00:00', false)
on conflict do nothing;

insert into categories (id, tenant_id, sort_order, name_ar, name_en, is_active) values
  ('demo-cat-coffee', 'demo-nafas', 10, 'القهوة', 'Coffee', true),
  ('demo-cat-bakery', 'demo-nafas', 20, 'المخبوزات', 'Bakery', true),
  ('demo-cat-kitchen', 'demo-nafas', 30, 'المطبخ', 'Kitchen', true),
  ('demo-cat-sweet', 'demo-nafas', 40, 'الحلى', 'Sweets', true)
on conflict (id) do nothing;

insert into products (
  id, tenant_id, category_id, sort_order, name_ar, name_en, description_ar, description_en,
  price, currency, calories, is_available, is_featured, allergens
) values
  ('demo-p-v60', 'demo-nafas', 'demo-cat-coffee', 10, 'في ٦٠', 'V60',
   'تحضير يدوي من محصول موسمي مختار. نكهة نظيفة وحموضة متوازنة.',
   'Hand-poured seasonal lot. Clean cup, balanced acidity.',
   22, 'SAR', 5, true, true, ''),
  ('demo-p-flatwhite', 'demo-nafas', 'demo-cat-coffee', 20, 'فلات وايت', 'Flat White',
   'شات من الحليب المبخر فوق إسبرسو مزدوج.',
   'Steamed milk over a double espresso.',
   18, 'SAR', 140, true, true, 'حليب'),
  ('demo-p-arabic', 'demo-nafas', 'demo-cat-coffee', 30, 'قهوة عربية بالهيل', 'Arabic coffee with cardamom',
   'دلة صغيرة تُقدَّم مع تمر محشي.',
   'Small dallah service with stuffed dates.',
   16, 'SAR', 20, true, false, ''),
  ('demo-p-spiced', 'demo-nafas', 'demo-cat-coffee', 40, 'لاتيه هيل', 'Cardamom latte',
   'لاتيه مع هيل مطحون طازج وعسل طلح.',
   'Latte with fresh cardamom and Talh honey.',
   21, 'SAR', 180, true, false, 'حليب'),
  ('demo-p-croissant', 'demo-nafas', 'demo-cat-bakery', 10, 'كرواسون زبدة', 'Butter croissant',
   'طبقات يومية من الزبدة الفرنسية. يُخبز فجراً.',
   'Laminated daily with French butter. Baked at dawn.',
   14, 'SAR', 280, true, true, 'غلوتين,حليب,بيض'),
  ('demo-p-zaatar', 'demo-nafas', 'demo-cat-bakery', 20, 'مناقيش زعتر', 'Zaatar manakish',
   'عجينة رقيقة، زعتر بلدي، وزيت زيتون الجوف.',
   'Thin dough, local zaatar, and Al-Jouf olive oil.',
   15, 'SAR', 320, true, false, 'غلوتين'),
  ('demo-p-date', 'demo-nafas', 'demo-cat-bakery', 30, 'سكونز تمر', 'Date scone',
   'تمر سكري مع زبده وسمن بلدي.',
   'Sukkari dates with butter and samneh.',
   13, 'SAR', 260, true, false, 'غلوتين,حليب'),
  ('demo-p-shakshuka', 'demo-nafas', 'demo-cat-kitchen', 10, 'شكشوكة الفرن', 'Oven shakshuka',
   'طماطم مطهية، فلفل، بيض، وخبز تنور.',
   'Slow tomatoes, peppers, eggs, and tannour bread.',
   32, 'SAR', 410, true, true, 'بيض,غلوتين'),
  ('demo-p-halloumi', 'demo-nafas', 'demo-cat-kitchen', 20, 'صحن حلومي مشوي', 'Grilled halloumi plate',
   'حلومي، بندورة كرزية، زعتر، وعيش صاج.',
   'Halloumi, cherry tomato, zaatar, and saj bread.',
   29, 'SAR', 380, true, false, 'حليب,غلوتين'),
  ('demo-p-salad', 'demo-nafas', 'demo-cat-kitchen', 30, 'سلطة فريكة', 'Freekeh salad',
   'فريكة، رمان، نعناع، ولوز محمص.',
   'Freekeh, pomegranate, mint, and toasted almonds.',
   27, 'SAR', 240, true, false, 'مكسرات'),
  ('demo-p-kunafa', 'demo-nafas', 'demo-cat-sweet', 10, 'كنافة نَفَس', 'Nafas kunafa',
   'كنافة ناعمة بقشطة طازجة، تُحضر عند الطلب.',
   'Fine kunafa with fresh cream, made to order.',
   24, 'SAR', 450, true, true, 'حليب,غلوتين'),
  ('demo-p-basbousa', 'demo-nafas', 'demo-cat-sweet', 20, 'بسبوسة هيل', 'Cardamom basbousa',
   'بسبوسة سميد مع قطر خفيف وهيل.',
   'Semolina cake with light syrup and cardamom.',
   12, 'SAR', 310, false, false, 'غلوتين,حليب')
on conflict (id) do nothing;
