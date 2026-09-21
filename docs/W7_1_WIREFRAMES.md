# W7.1 Wireframes

> All wireframes in this document are **NOT IMPLEMENTED — ARCHITECTURE REFERENCE ONLY**.

## 1. Arabic Studio Home — Riyadh restaurant / Main Branch / late morning

**NOT IMPLEMENTED — ARCHITECTURE REFERENCE ONLY**

```text
┌──────────────────────────────────────────────────────────────────────┐
│ مطعم السرايا                     الفرع الرئيسي ▾     🔔   حسابي      │
├───────────────┬──────────────────────────────────────────────────────┤
│ الرئيسية      │ صباح الخير                                          │
│ القائمة       │ الفرع الرئيسي · الرياض · مفتوح                       │
│ الطلبات       │                                                      │
│ النمو         │ ┌────────────── اليوم ────────────────────────────┐ │
│ العملاء       │ │ الطلبات  18     المبيعات  2,840 ر.س     زوار 126 │ │
│ الإعدادات     │ └─────────────────────────────────────────────────┘ │
│               │                                                      │
│               │ ┌──────────── يحتاج انتباه ──────────────────────┐ │
│               │ │ 3 أصناف بدون صور          [مراجعة القائمة]      │ │
│               │ │ طلبان جديدان              [فتح الطلبات]         │ │
│               │ └─────────────────────────────────────────────────┘ │
│               │                                                      │
│               │ ┌──────── الطلبات الأخيرة ───────────────────────┐ │
│               │ │ #1042  طاولة/عميل     89 ر.س     قيد التحضير   │ │
│               │ │ #1041  عميل           142 ر.س    جاهز           │ │
│               │ │ #1040  عميل           67 ر.س     مكتمل          │ │
│               │ └─────────────────────────────────────────────────┘ │
│               │                                                      │
│               │ ┌──────── صحة القائمة ───────┐ ┌─ فرصة نمو ─────┐ │
│               │ │ جاهزية 92/100              │ │ طبق يُشاهد كثيراً│ │
│               │ │ 3 صور ناقصة · 1 غير متاح   │ │ + اقتراح جانبي   │ │
│               │ │ [تحسين القائمة]            │ │ [مراجعة]         │ │
│               │ └─────────────────────────────┘ └─────────────────┘ │
└───────────────┴──────────────────────────────────────────────────────┘
```

### Home rules

- Arabic is the primary reading direction.
- The first screen prioritizes operational attention, not feature discovery.
- Metrics are a compact decision layer, not a wall of cards.
- Every recommendation includes evidence and a direct next action.
- Restaurant/branch context is visible but is not an authorization source.

## 2. Menu workspace — health summary + categories + item list + Kabsa detail panel

**NOT IMPLEMENTED — ARCHITECTURE REFERENCE ONLY**

```text
┌──────────────────────────────────────────────────────────────────────┐
│ القائمة                                  [استيراد] [معاينة] [نشر]   │
│ الرئيسية / القائمة / الأصناف                                           │
├──────────────────────────────────────────────────────────────────────┤
│ صحة القائمة: 92/100   3 صور ناقصة   1 غير متاح   0 بدون سعر          │
├───────────────────┬──────────────────────────────────────────────────┤
│ التصنيفات          │ الأصناف                                         │
│                   │ [بحث عن صنف...] [متاح ▾] [تصنيف ▾]               │
│ المقبلات      8   │                                                  │
│ الأطباق        14  │ ┌────────────────────────────────────────────┐ │
│ الكبسة         6   │ │ صورة │ كبسة لحم        58 ر.س   متاح   ⋮ │ │
│ المشروبات      12  │ │      │ وصف مختصر...                 │ │
│ الحلويات       7   │ ├────────────────────────────────────────────┤ │
│                   │ │ صورة │ كبسة دجاج        42 ر.س   متاح   ⋮ │ │
│ [+ تصنيف]          │ ├────────────────────────────────────────────┤ │
│                   │ │ ...                                        │ │
└───────────────────┴───────────────────────────────┬──────────────────┘
                                                    │
                                                    │ Detail Panel
                                                    ▼
                                   ┌──────────────────────────────────┐
                                   │ كبسة لحم                    ✕   │
                                   │ متاح · الأطباق · Main Branch   │
                                   ├──────────────────────────────────┤
                                   │ [صورة]                           │
                                   │ الاسم العربي: كبسة لحم           │
                                   │ الاسم الإنجليزي: Lamb Kabsa     │
                                   │ السعر: 58.00 ر.س                 │
                                   │ الوصف: ...                       │
                                   │ الخيارات: 2 مجموعات              │
                                   │ التوفر: متاح                     │
                                   ├──────────────────────────────────┤
                                   │ [حفظ] [فتح المحرر الكامل]       │
                                   └──────────────────────────────────┘
```

### Menu rules

- The list remains visible when an item is inspected on desktop.
- The detail panel is contextual; long editing remains a full page.
- Arabic and English values are visually distinct but share one semantic field hierarchy.
- Prices remain LTR-readable inside RTL UI.

## 3. Growth workspace — Observe → Understand → Act → Measure

**NOT IMPLEMENTED — ARCHITECTURE REFERENCE ONLY**

```text
┌──────────────────────────────────────────────────────────────────────┐
│ النمو                                      الفرع الرئيسي ▾  تحديث ↻  │
├──────────────────────────────────────────────────────────────────────┤
│ 01 راقب ───────── 02 افهم ───────── 03 نفّذ ───────── 04 قِس       │
│   ●                         ●                  ○               ○     │
├──────────────────────────────────────────────────────────────────────┤
│ الإشارة الموثقة                                                     │
│ 126 جلسة · 42 مشاهدة منتجات · 7 نقرات واتساب                        │
│                                                                      │
│ لماذا يهم؟                                                          │
│ طبق X يحصل على مشاهدة عالية مقارنة ببقية القائمة.                  │
│ الدليل: بيانات الجلسات المسجلة خلال آخر 7 أيام.                    │
│                                                                      │
│ الإجراء المقترح                                                      │
│ إبراز طبق X في موضع مناسب أو تحسين وصفه.                             │
│ [مراجعة الإجراء]                                                     │
├──────────────────────────────────────────────────────────────────────┤
│ القياس                                                               │
│ قبل: 12 مشاهدة/100 جلسة       بعد: غير متاح                         │
│ الحالة: لا توجد أدلة كافية بعد                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Growth rules

- Evidence state is always visible.
- Recommendations never imply guaranteed revenue.
- Owner approval precedes supported actions.
- Measurement is separated from recommendation so weak evidence remains weak.

## 4. Platform Admin overview — distinct from Studio

**NOT IMPLEMENTED — ARCHITECTURE REFERENCE ONLY**

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Menu V3 Platform Admin                         Security   حسابي       │
├───────────────┬──────────────────────────────────────────────────────┤
│ Overview      │ صحة المنصة                                           │
│ Customers     │                                                      │
│ Commerce      │ ┌──────────┐ ┌──────────┐ ┌──────────┐             │
│ Sales         │ │ 42 مطعم  │ │ 67 فرع   │ │ 18 طلب   │             │
│ Intelligence │ │ 39 نشط   │ │ منشور 31 │ │ مفتوح 4  │             │
│ System        │ └──────────┘ └──────────┘ └──────────┘             │
│               │                                                      │
│               │ يحتاج متابعة                                        │
│               │ 5 طلبات خدمة · 3 Leads جديدة · 2 اشتراكات          │
│               │                                                      │
│               │ نشاط المنصة                                         │
│               │ [timeline / table]                                  │
│               │                                                      │
│               │ صحة النظام                                          │
│               │ Auth ✓  Data ✓  Queue ✓  Deployment ?              │
└───────────────┴──────────────────────────────────────────────────────┘
```

### Admin distinction

- Studio is tenant/restaurant operational.
- Admin is platform operational.
- Admin navigation should not inherit restaurant vocabulary or branch-level assumptions.
- Security/platform health is a system concern, not a restaurant setting.

## 5. 390px mobile shell

**NOT IMPLEMENTED — ARCHITECTURE REFERENCE ONLY**

```text
┌──────────────────────────┐
│ ☰   مطعم السرايا     🔔 │
│     الفرع الرئيسي       │
├──────────────────────────┤
│                          │
│ صباح الخير               │
│                          │
│ ┌──────────────────────┐ │
│ │ اليوم                │ │
│ │ 18 طلب · 2,840 ر.س   │ │
│ └──────────────────────┘ │
│                          │
│ يحتاج انتباه             │
│ ┌──────────────────────┐ │
│ │ 3 صور ناقصة          │ │
│ │ [مراجعة]             │ │
│ └──────────────────────┘ │
│                          │
│ الطلبات الأخيرة          │
│ #1042  89 ر.س  تحضير    │
│ #1041 142 ر.س  جاهز      │
│                          │
│                          │
├──────────────────────────┤
│ الرئيسية  القائمة  الطلبات│
│ النمو      المزيد        │
└──────────────────────────┘
```

### Mobile placement

- Home = persistent.
- Menu = persistent.
- Orders = persistent.
- Growth = persistent.
- More = secondary workspaces.
- More contains Customers, Appearance, Branches, Team, Settings and Publishing.

## 6. RTL and mixed-content behavior

**NOT IMPLEMENTED — ARCHITECTURE REFERENCE ONLY**

```text
RTL UI:             [ اسم الصنف                         58.00 SAR ]
Mixed title:        [ كبسة دجاج — Chicken Kabsa       42.00 SAR ]
Phone:              [ +966 50 123 4567 ]
URL:                [ https://example.com/m/restaurant ]
Date:               [ 14 Sep 2026 · 11:30 ]
Breadcrumb:         الرئيسية  /  القائمة  /  الأصناف
Directional icon:   follows logical inline direction, not a hard-coded side
```

### Behavior notes

- Use logical CSS properties (`start/end`, `ms/me`, `ps/pe`) wherever possible.
- Do not reverse phone numbers, URLs or currency digits as if they were Arabic prose.
- Keep currency values in a stable numeric direction with the SAR label readable.
- Directional chevrons should communicate navigation direction in the active locale.
- Dialogs, drawers and detail panels must open from the correct logical side.
- Keyboard order follows DOM/task order, not visual mirroring alone.
- Tables need explicit column alignment rules for numeric and mixed-direction cells.
- Arabic is authored as the primary composition; English is not merely a late translation layer.
