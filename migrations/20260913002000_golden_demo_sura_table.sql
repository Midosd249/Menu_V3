-- Golden Demo Restaurant: Sura Table / مائدة سُرى
-- Scope: the explicitly authorized existing tenant only.
-- This migration preserves the user, tenant id, branch id, orders, and memberships.
-- It replaces only the tenant's menu content and option metadata. No images are created.

begin;

update menu_v3.tenants
set slug = 'sura-table',
    name_ar = 'مائدة سُرى',
    name_en = 'Sura Table',
    tagline_ar = 'مذاق سعودي معاصر، يُقدّم بهدوء وكرم',
    tagline_en = 'Contemporary Saudi dining, served with calm generosity',
    logo_url = '',
    cover_url = '',
    instagram_url = '',
    whatsapp = '',
    whatsapp_template = 'السلام عليكم، أريد الاستفسار عن {product} من {restaurant}.',
    primary_color = '#344331',
    accent_color = '#b78a42',
    city = 'الرياض',
    country = 'SA',
    theme_key = 'editorial',
    is_published = true,
    is_active = true,
    updated_at = now()
where id = '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497';

update menu_v3.branches
set slug = 'nakheel',
    name_ar = 'فرع النخيل',
    name_en = 'Al Nakheel Branch',
    address_ar = 'حي النخيل، الرياض',
    address_en = 'Al Nakheel, Riyadh',
    maps_url = '',
    phone = '',
    is_active = true,
    updated_at = now()
where id = (select id from menu_v3.branches where tenant_id = '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497' order by created_at, id limit 1)
  and tenant_id = '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497';

insert into menu_v3.branch_hours (branch_id, weekday, opens_at, closes_at, is_closed)
select b.id, h.weekday, h.opens_at, h.closes_at, h.is_closed
from menu_v3.branches b
cross join (values
  (0, '07:00', '23:30', false),
  (1, '07:00', '23:30', false),
  (2, '07:00', '23:30', false),
  (3, '07:00', '23:30', false),
  (4, '07:00', '00:30', false),
  (5, '13:00', '00:30', false),
  (6, '07:00', '23:30', false)
) as h(weekday, opens_at, closes_at, is_closed)
where b.tenant_id = '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497'
  and b.id = (select id from menu_v3.branches where tenant_id = '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497' order by created_at, id limit 1)
on conflict (branch_id, weekday) do update set opens_at = excluded.opens_at, closes_at = excluded.closes_at, is_closed = excluded.is_closed;

-- Replace only menu content and option metadata; orders and order history remain intact.
delete from menu_v3.product_modifier_groups
where product_id in (select id from menu_v3.products where tenant_id = '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497');
delete from menu_v3.product_variants where tenant_id = '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497';
delete from menu_v3.modifier_options where tenant_id = '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497';
delete from menu_v3.modifier_groups where tenant_id = '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497';
delete from menu_v3.products where tenant_id = '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497';
delete from menu_v3.categories where tenant_id = '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497';

insert into menu_v3.categories (id, tenant_id, sort_order, name_ar, name_en, is_active) values
('golden-cat-breakfast', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 10, 'الفطور', 'Breakfast', true),
('golden-cat-appetizers', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 20, 'المقبلات', 'Appetizers', true),
('golden-cat-mains', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 30, 'الأطباق الرئيسية', 'Main Dishes', true),
('golden-cat-saudi', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 40, 'مختارات سعودية', 'Saudi Specials', true),
('golden-cat-grills', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 50, 'المشاوي', 'Grills', true),
('golden-cat-casual', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 60, 'سريع وخفيف', 'Casual', true),
('golden-cat-desserts', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 70, 'الحلى', 'Desserts', true),
('golden-cat-hot', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 80, 'المشروبات الساخنة', 'Hot Drinks', true),
('golden-cat-cold', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 90, 'المشروبات الباردة', 'Cold Drinks', true),
('golden-cat-kids', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 100, 'قائمة الصغار', 'Kids Menu', true);

insert into menu_v3.products
(id, tenant_id, category_id, sort_order, name_ar, name_en, description_ar, description_en, price, currency, image_url, calories, sodium_mg, caffeine_mg, caffeine_basis, is_available, is_featured, allergens, tags, dietary_labels)
values
('golden-p-shakshuka', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 'golden-cat-breakfast', 10, 'شكشوكة سُرى', 'Sura Shakshuka', 'بيض مخبوز في طماطم وفلفل مع خبز تنور طازج.', 'Baked eggs in tomato and pepper sauce with fresh tannour bread.', 32, 'SAR', '', 410, 860, null, null, true, true, 'بيض,غلوتين', ARRAY['فطور','مميز']::text[], ARRAY[]::text[]),
('golden-p-najdi-breakfast', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 'golden-cat-breakfast', 20, 'فطور نجدي', 'Najdi Breakfast', 'تمر، جبن، لبنة، بيض وخبز بر مع شاي بالنعناع.', 'Dates, cheese, labneh, eggs and whole-wheat bread with mint tea.', 38, 'SAR', '', 520, 980, null, null, true, false, 'حليب,بيض,غلوتين', ARRAY['فطور','مشاركة']::text[], ARRAY[]::text[]),
('golden-p-labneh-toast', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 'golden-cat-breakfast', 30, 'توست لبنة وزعتر', 'Labneh Zaatar Toast', 'توست حبوب كاملة، لبنة، زعتر وزيت زيتون.', 'Whole-grain toast with labneh, zaatar and olive oil.', 24, 'SAR', '', 290, 640, null, null, true, false, 'حليب,غلوتين', ARRAY['فطور','نباتي']::text[], ARRAY['نباتي']::text[]),
('golden-p-hummus', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 'golden-cat-appetizers', 10, 'حمص سُرى', 'Sura Hummus', 'حمص كريمي بزيت الزيتون مع خبز عربي دافئ.', 'Silky hummus with olive oil and warm Arabic bread.', 19, 'SAR', '', 330, 740, null, null, true, false, 'سمسم,غلوتين', ARRAY['مقبلات','مشاركة']::text[], ARRAY['نباتي']::text[]),
('golden-p-samosa', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 'golden-cat-appetizers', 20, 'سمبوسة لحم', 'Beef Samosa', 'ثلاث حبات محشوة بلحم متبل وبصل وبهارات دافئة.', 'Three pastry parcels filled with spiced beef and onion.', 22, 'SAR', '', 360, 1120, null, null, true, false, 'غلوتين', ARRAY['مقبلات','مشاركة']::text[], ARRAY[]::text[]),
('golden-p-kabsa-chicken', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 'golden-cat-mains', 10, 'كبسة دجاج على الحطب', 'Wood-Fired Chicken Kabsa', 'أرز كبسة عطري مع دجاج محمر وصلصة دقوس.', 'Fragrant kabsa rice with roasted chicken and daqqous.', 49, 'SAR', '', 720, 1380, null, null, true, true, 'لا توجد', ARRAY['رئيسي','سعودي']::text[], ARRAY[]::text[]),
('golden-p-jareesh', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 'golden-cat-mains', 20, 'جريش اللحم', 'Jareesh with Beef', 'جريش مطهو ببطء مع لحم طري وبصل محمر.', 'Slow-cooked jareesh with tender beef and caramelized onion.', 46, 'SAR', '', 610, 1560, null, null, true, false, 'حليب', ARRAY['رئيسي','تراثي']::text[], ARRAY[]::text[]),
('golden-p-freekeh-bowl', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 'golden-cat-mains', 30, 'وعاء فريكة ورمان', 'Freekeh Pomegranate Bowl', 'فريكة، خضروات مشوية، رمان ولوز مع صلصة ليمون.', 'Freekeh, roasted vegetables, pomegranate and almonds with lemon dressing.', 42, 'SAR', '', 480, 760, null, null, true, false, 'غلوتين,مكسرات', ARRAY['رئيسي','نباتي']::text[], ARRAY['نباتي']::text[]),
('golden-p-mutabbaq', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 'golden-cat-saudi', 10, 'مطبق لحم', 'Beef Mutabbaq', 'عجينة رقيقة محشوة باللحم والبيض والبصل الأخضر.', 'Thin pastry filled with beef, egg and spring onion.', 29, 'SAR', '', 540, 1240, null, null, true, false, 'غلوتين,بيض', ARRAY['سعودي','مشاركة']::text[], ARRAY[]::text[]),
('golden-p-saleeg', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 'golden-cat-saudi', 20, 'سليق الطائف', 'Taif Saleeg', 'أرز كريمي بالحليب مع دجاج مشوي وسمن بلدي.', 'Creamy rice with milk, grilled chicken and clarified butter.', 44, 'SAR', '', 680, 1490, null, null, true, false, 'حليب', ARRAY['سعودي','طائفي']::text[], ARRAY[]::text[]),
('golden-p-mixed-grill', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 'golden-cat-grills', 10, 'مكس مشاوي سُرى', 'Sura Mixed Grill', 'كباب لحم، أوصال دجاج وريش مع أرز وسلطة.', 'Beef kofta, chicken cubes and lamb chops with rice and salad.', 78, 'SAR', '', 930, 2180, null, null, true, true, 'حليب,غلوتين', ARRAY['مشاوي','مشاركة','تنبيه ملح']::text[], ARRAY[]::text[]),
('golden-p-chicken-skewers', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 'golden-cat-grills', 20, 'أوصال دجاج بالليمون', 'Lemon Chicken Skewers', 'أوصال دجاج متبلة بالليمون والأعشاب مع خضار مشوية.', 'Herb and lemon-marinated chicken with grilled vegetables.', 52, 'SAR', '', 560, 1180, null, null, true, false, 'لا توجد', ARRAY['مشاوي','خفيف']::text[], ARRAY[]::text[]),
('golden-p-grilled-fish', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 'golden-cat-grills', 30, 'سمك مشوي بالكمون', 'Cumin Grilled Fish', 'فيليه سمك أبيض، كمون، ليمون وسلطة موسمية.', 'White fish fillet with cumin, lemon and seasonal salad.', 59, 'SAR', '', 430, 640, null, null, true, false, 'سمك', ARRAY['مشاوي','خفيف']::text[], ARRAY[]::text[]),
('golden-p-sura-burger', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 'golden-cat-casual', 10, 'برجر لحم بالتمر الهندي', 'Tamarind Beef Burger', 'برجر لحم، صلصة تمر هندي، جبن وخبز بريوش.', 'Beef patty, tamarind relish, cheese and brioche bun.', 45, 'SAR', '', 760, 1760, null, null, true, true, 'غلوتين,حليب', ARRAY['سريع','مميز']::text[], ARRAY[]::text[]),
('golden-p-chicken-wrap', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 'golden-cat-casual', 20, 'راب دجاج مشوي', 'Grilled Chicken Wrap', 'دجاج مشوي، خس، طماطم وصلصة لبن في خبز صاج.', 'Grilled chicken, lettuce, tomato and yogurt sauce in saj bread.', 34, 'SAR', '', 510, 1320, null, null, true, false, 'حليب,غلوتين', ARRAY['سريع']::text[], ARRAY[]::text[]),
('golden-p-kunafa', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 'golden-cat-desserts', 10, 'كنافة زعفران', 'Saffron Kunafa', 'كنافة ذهبية بحشوة قشطة ولمسة زعفران.', 'Golden kunafa with cream filling and saffron.', 31, 'SAR', '', 510, 620, null, null, true, true, 'حليب,غلوتين', ARRAY['حلى','مشاركة']::text[], ARRAY[]::text[]),
('golden-p-date-cake', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 'golden-cat-desserts', 20, 'كيكة تمر نجدية', 'Najdi Date Cake', 'كيكة تمر دافئة مع صلصة طحينة وسمسم.', 'Warm date cake with tahini and sesame sauce.', 27, 'SAR', '', 460, 710, null, null, true, false, 'سمسم,غلوتين,حليب', ARRAY['حلى']::text[], ARRAY[]::text[]),
('golden-p-saudi-coffee', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 'golden-cat-hot', 10, 'قهوة سعودية بالهيل', 'Cardamom Saudi Coffee', 'دلة صغيرة من القهوة السعودية مع تمر سكري.', 'A small dallah of Saudi coffee with sukkari dates.', 18, 'SAR', '', 35, 45, 65, 'per_cup', true, true, 'لا توجد', ARRAY['ساخن','سعودي']::text[], ARRAY[]::text[]),
('golden-p-cardamom-latte', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 'golden-cat-hot', 20, 'لاتيه هيل', 'Cardamom Latte', 'إسبريسو وحليب مبخر مع هيل مطحون طازج.', 'Espresso and steamed milk with freshly ground cardamom.', 24, 'SAR', '', 170, 120, 110, 'per_cup', true, false, 'حليب', ARRAY['ساخن','قهوة']::text[], ARRAY[]::text[]),
('golden-p-mint-tea', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 'golden-cat-hot', 30, 'شاي نعناع', 'Fresh Mint Tea', 'شاي أسود مع نعناع طازج ويُقدّم ساخناً.', 'Black tea with fresh mint, served hot.', 14, 'SAR', '', 5, 10, 45, 'per_cup', true, false, 'لا توجد', ARRAY['ساخن']::text[], ARRAY[]::text[]),
('golden-p-mint-lemonade', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 'golden-cat-cold', 10, 'ليمون ونعناع', 'Mint Lemonade', 'ليمون طازج، نعناع وماء بارد دون كافيين.', 'Fresh lemon, mint and chilled water. Caffeine-free.', 18, 'SAR', '', 140, 25, null, null, true, false, 'لا توجد', ARRAY['بارد','منعش']::text[], ARRAY['نباتي']::text[]),
('golden-p-tamarind', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 'golden-cat-cold', 20, 'تمر هندي مثلج', 'Iced Tamarind', 'تمر هندي بارد بنكهة حلوة وحامضة متوازنة.', 'Chilled tamarind with a balanced sweet-tart finish.', 17, 'SAR', '', 160, 55, null, null, true, false, 'لا توجد', ARRAY['بارد','سعودي']::text[], ARRAY['نباتي']::text[]),
('golden-p-iced-tea', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 'golden-cat-cold', 30, 'شاي مثلج بالليمون', 'Iced Lemon Tea', 'شاي أسود بارد مع ليمون طازج وثلج.', 'Chilled black tea with fresh lemon and ice.', 19, 'SAR', '', 95, 40, 18, 'per_100ml', true, false, 'لا توجد', ARRAY['بارد']::text[], ARRAY[]::text[]),
('golden-p-kids-kabsa', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 'golden-cat-kids', 10, 'كبسة دجاج للصغار', 'Kids Chicken Kabsa', 'حصة صغيرة من كبسة الدجاج مع خيار ولبن.', 'A small chicken kabsa portion with cucumber and yogurt.', 24, 'SAR', '', 390, 720, null, null, true, false, 'حليب', ARRAY['صغار']::text[], ARRAY[]::text[]),
('golden-p-kids-burger', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 'golden-cat-kids', 20, 'برجر صغير بالجبن', 'Mini Cheese Burger', 'برجر لحم صغير مع جبن وخيار مقطع.', 'Mini beef burger with cheese and sliced cucumber.', 25, 'SAR', '', 420, 850, null, null, true, false, 'غلوتين,حليب', ARRAY['صغار']::text[], ARRAY[]::text[]),
('golden-p-kids-pasta', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 'golden-cat-kids', 30, 'مكرونة جبن للصغار', 'Kids Cheese Pasta', 'مكرونة قصيرة بصلصة جبن كريمية خفيفة.', 'Short pasta with a light creamy cheese sauce.', 22, 'SAR', '', 380, 680, null, null, true, false, 'غلوتين,حليب', ARRAY['صغار']::text[], ARRAY[]::text[]),
('golden-p-kids-fruit', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 'golden-cat-kids', 40, 'كوب فواكه موسمية', 'Seasonal Fruit Cup', 'تشكيلة فواكه موسمية مقطعة بعناية.', 'A selection of carefully cut seasonal fruit.', 16, 'SAR', '', 120, 5, null, null, true, false, 'لا توجد', ARRAY['صغار','خفيف']::text[], ARRAY['نباتي']::text[]),
('golden-p-kids-cocoa', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 'golden-cat-kids', 50, 'كاكاو دافئ للصغار', 'Warm Kids Cocoa', 'حليب دافئ مع كاكاو خفيف وسكر محدود.', 'Warm milk with light cocoa and modest sweetness.', 18, 'SAR', '', 210, 95, null, null, false, false, 'حليب', ARRAY['صغار','غير متاح حالياً']::text[], ARRAY[]::text[]);

insert into menu_v3.modifier_groups (id, tenant_id, name_ar, name_en, min_select, max_select, sort_order, is_required, is_active)
values
('golden-mod-size', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 'حجم المشروب', 'Drink Size', 1, 1, 10, true, true),
('golden-mod-milk', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 'اختيار الحليب', 'Milk Choice', 1, 1, 20, false, true);

insert into menu_v3.modifier_options (id, tenant_id, group_id, name_ar, name_en, price_delta, sort_order, is_available)
values
('golden-opt-regular', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 'golden-mod-size', 'عادي', 'Regular', 0, 10, true),
('golden-opt-large', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 'golden-mod-size', 'كبير', 'Large', 5, 20, true),
('golden-opt-full-fat', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 'golden-mod-milk', 'حليب كامل الدسم', 'Whole milk', 0, 10, true),
('golden-opt-oat', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 'golden-mod-milk', 'حليب شوفان', 'Oat milk', 4, 20, true);

insert into menu_v3.product_modifier_groups (product_id, modifier_group_id, sort_order)
values
('golden-p-cardamom-latte', 'golden-mod-size', 10),
('golden-p-cardamom-latte', 'golden-mod-milk', 20),
('golden-p-mint-tea', 'golden-mod-size', 10),
('golden-p-saudi-coffee', 'golden-mod-size', 10);

insert into menu_v3.product_variants (id, tenant_id, product_id, name_ar, name_en, price, sort_order, is_available)
values
('golden-var-coffee-dallah', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 'golden-p-saudi-coffee', 'دلة صغيرة', 'Small dallah', 18, 10, true),
('golden-var-coffee-thermos', '2e3f3c63-7dbd-4af2-920a-5f0c9ced8497', 'golden-p-saudi-coffee', 'ترمس', 'Thermos', 42, 20, true);

commit;
