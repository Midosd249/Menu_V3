# W8 Internal Visual Directions

Status: PROPOSED — Phase 1 complete
Scope: Internal product surfaces only. Public Menu themes remain protected.

## Design brief

Menu V3 internal surfaces should feel like a premium operational workspace for Arabic-first restaurant teams: calm, dense, legible, hospitality-aware, and materially different from the public menu themes. Color carries semantic meaning rather than decoration.

---

## Direction A — Editorial Olive & Paper

### Product personality
A restrained hospitality workspace with an editorial paper character. It connects naturally to premium restaurant operations while keeping olive subordinate to content hierarchy.

### Candidate semantic palette
| Role | Candidate |
|---|---|
| App background | `#F4F0E8` |
| Surface | `#FCFAF5` |
| Elevated surface | `#FFFFFF` |
| Subtle surface | `#E9E4D8` |
| Primary | `#354334` |
| Primary hover | `#293529` |
| Primary muted | `#DDE4DA` |
| On primary | `#FFFFFF` |
| Secondary/accent | `#A67C43` |
| Accent muted | `#E9DDC8` |
| Ink | `#1D241E` |
| Muted foreground | `#5E665E` |
| Border | `#D5D0C4` |
| Strong border | `#B9B3A6` |
| Focus | `#8A642F` |

Status colors would remain restrained green / amber / red / blue and would not inherit olive meaning.

### Light surface plan
Warm paper canvas, near-white work surfaces, and slightly deeper paper bands for grouping. Cards remain sparse; sections are primarily separated through spacing, rules, and surface changes.

### Optional dark navigation treatment
Deep olive navigation with cream text and a muted sand selected state.

### Typography hierarchy
IBM Plex Sans Arabic remains the primary family. Page titles use 24–30px, section titles 17–20px, body 14–16px, supporting metadata 12–13px. Arabic remains the visual first read; English labels are secondary.

### Table / filter / form treatment
Quiet rules, compact but touch-safe rows, warm white table surfaces, filters grouped in one horizontal/stacked band, and visible field labels. Avoid zebra-striping as a primary hierarchy mechanism.

### Active / focus / status treatment
Active navigation uses a filled muted-sand block plus icon/text weight. Focus uses a clear olive/gold ring. Status uses icon + text + tinted surface, never color alone.

### Mobile behavior
Primary workspaces remain visible through the existing bottom navigation. Contextual navigation moves into the existing More surface. Tables remain horizontally scrollable rather than compressing numeric information into unreadable columns.

### RTL considerations
Use logical padding/margins, keep icons visually associated with Arabic labels, preserve number/date/SAR directionality, and avoid decorative rules that create accidental bidi ambiguity.

### Contrast risks
Muted olive text can fall below 4.5:1 on paper. Accent gold must not be used as normal body text unless its darker text role is used. Dark olive navigation needs a verified light foreground.

### What makes it non-generic
The paper/olive material relationship is hospitality-specific and editorial without importing a generic SaaS sidebar aesthetic.

### What must not be done
Do not flood the interface with olive, use gradients as identity, turn every section into a card, or use gold for ordinary text.

### Arabic mood-board — Studio
«ورق دافئ هادئ، أخضر زيتوني عميق كحبر التشغيل، خطوط دقيقة تفصل المعلومات، عناوين عربية واضحة، ومساحات تنفس محسوبة تجعل لوحة المطعم تبدو كدفتر تشغيل فاخر لا كلوحة SaaS جاهزة.»

### Arabic mood-board — Platform Admin
«نسخة أكثر صرامة من الورق والزيتوني: مساحة عمل نظيفة، تنقل داكن هادئ، جداول كثيفة لكنها مقروءة، وحضور إداري واضح دون ألوان صاخبة أو مؤثرات استعراضية.»

---

## Direction B — Midnight Ink & Sand

### Product personality
An operational command center with a dark ink navigation spine and a warm, light work surface. It is the strongest balance of premium hospitality character, high information density, and accessibility.

### Candidate semantic palette
| Role | Candidate |
|---|---|
| App background | `#F2EDE3` |
| Surface | `#FBF8F2` |
| Elevated surface | `#FFFFFF` |
| Subtle surface | `#E7DED0` |
| Primary | `#1F2522` |
| Primary hover | `#161B19` |
| Primary muted | `#DDE4DF` |
| On primary | `#FFFFFF` |
| Secondary/accent | `#8B642E` |
| Accent muted | `#E8DCC8` |
| Ink | `#1D2421` |
| Muted foreground | `#5E655F` |
| Border | `#D3CBC0` |
| Strong border | `#B6ADA1` |
| Focus | `#8B642E` |
| Success | `#246044` |
| Warning | `#7A5218` |
| Danger | `#9A3B32` |
| Info | `#2D5C76` |

### Light surface plan
The work canvas is warm sand. Primary content surfaces are near-white. Elevated surfaces are white with restrained shadow. Subtle surfaces provide grouping without creating a wall of cards.

### Optional dark navigation treatment
Navigation is deep ink, with cream/white foreground. Selected navigation is a clearly filled darker/lighter ink state with an accent edge or indicator rather than a large colored pill.

### Typography hierarchy
IBM Plex Sans Arabic remains unchanged as the base family to avoid unnecessary font risk. Page titles 24–30px/700, section titles 17–20px/650–700, body 14–16px/400–500, metadata 12–13px/400. Numeric values use tabular numerals.

### Table / filter / form treatment
Tables use high-contrast ink headings, warm-white rows, strong enough rules, and a quiet selected/hover surface. Filter bars are a single compositional unit. Inputs use visible labels, clear focus, and enough height for touch.

### Active / focus / status treatment
Active navigation is an ink-filled state with a slim brass signal. Focus is a high-contrast brass ring. Success/warning/danger/info use dedicated semantic foreground + surface pairs and an icon/label combination.

### Mobile behavior
Keep the existing W7 navigation model. Bottom navigation uses a warm surface with a strong selected state and remains at least 44px tall. Header actions wrap at narrow widths; dense tables scroll instead of collapsing critical data.

### RTL considerations
The dark navigation spine remains direction-neutral. Logical properties are required. Arabic headings are primary; English terminology follows naturally without forced mirroring of numeric content, URLs, IDs, or phone numbers.

### Contrast risks
Brass is suitable for UI/focus use but should not become muted body text. Muted foreground must remain at or above 4.5:1 on the warm surface. Disabled states need visible structure without looking active.

### What makes it non-generic
The combination of midnight ink, warm sand, and controlled brass creates a hospitality operations identity without the typical blue/purple SaaS palette or glossy dashboard treatment.

### What must not be done
Do not turn the whole application dark, use brass as decoration everywhere, use giant gradients, add glass blur, or replace real evidence with decorative dashboard graphics.

### Arabic mood-board — Studio
«مساحة تشغيل بلون الرمل الهادئ، وعمود تنقل بلون الحبر الليلي، لمسات نحاسية محدودة فقط للإشارة والفعل، وعناوين عربية قوية تجعل كل رقم وحالة وإجراء واضحاً قبل أن يكون جميلاً.»

### Arabic mood-board — Platform Admin
«غرفة تحكم إدارية هادئة: حبر داكن في العمود الجانبي، سطح رملي فاتح للجداول، خطوط فاصلة واضحة، حالات تشغيل ذات معنى، ونبرة مؤسسية راقية بلا لمعان أو ازدحام بصري.»

---

## Direction C — Modern Saudi Neutral

### Product personality
A contemporary Saudi-neutral system with warm stone surfaces, deep green/ink primary controls, and a restrained date/terracotta accent. It is modern and approachable with less traditional material character.

### Candidate semantic palette
| Role | Candidate |
|---|---|
| App background | `#F3F0EB` |
| Surface | `#FFFFFF` |
| Elevated surface | `#FFFFFF` |
| Subtle surface | `#E9E4DE` |
| Primary | `#20382F` |
| Primary hover | `#182B24` |
| Primary muted | `#DCE7E1` |
| On primary | `#FFFFFF` |
| Secondary/accent | `#9A5B3C` |
| Accent muted | `#EEDDD4` |
| Ink | `#17201C` |
| Muted foreground | `#5E6762` |
| Border | `#D4D0CA` |
| Strong border | `#B7B2AA` |
| Focus | `#8A4E33` |

### Light surface plan
Neutral stone canvas with clean white working surfaces. Accent appears only at action points, key dividers, and selected states.

### Optional dark navigation treatment
Deep green/ink navigation with neutral text and a narrow terracotta indicator for the current workspace.

### Typography hierarchy
IBM Plex Sans Arabic, same readable scale as Direction B. Use weight and spacing rather than decorative typography for hierarchy.

### Table / filter / form treatment
White tables with crisp rules, compact filter rows, clearly labeled fields, and stronger separation between filters and results.

### Active / focus / status treatment
Deep green active state, terracotta focus/attention signal, and independent semantic status colors. Selection always includes weight/surface/icon changes.

### Mobile behavior
Prioritize vertical rhythm, touch-safe controls, and horizontal table scroll. Keep the current mobile navigation and route structure intact.

### RTL considerations
Warm neutral surfaces provide clean Arabic text rendering. Logical CSS properties and bidi-safe numeric containers are mandatory.

### Contrast risks
Terracotta is the main risk if used as muted text. Neutral gray can also become too light in dense metadata. Use dedicated dark muted foreground and stronger borders.

### What makes it non-generic
It expresses a contemporary Saudi material palette without relying on the expected green-everywhere treatment.

### What must not be done
Do not use terracotta for all actions, add decorative desert motifs, or make the interface look like a government portal or generic CRM.

### Arabic mood-board — Studio
«حياد دافئ يشبه الحجر الناعم، أخضر داكن كهوية تشغيل، لمسة طينية/تمرية صغيرة عند نقاط القرار، ونظام عربي حديث يركز على الوضوح قبل الزخرفة.»

### Arabic mood-board — Platform Admin
«مركز إدارة حديث ومحايد: سطح أبيض نظيف فوق أرضية دافئة، تنقل أخضر عميق، إشارات طينية دقيقة للحالات المهمة، وجداول عملية تحافظ على كثافة المعلومات دون توتر بصري.»

---

## Phase 2 — Decision

### Selected: Direction B — Midnight Ink & Sand

Decision: `VERIFIED` design selection based on the requested rules and current W7 architecture.

Direction B wins because it gives Arabic content the cleanest foreground/background separation, supports dense operational screens through a light work surface, creates a clear Studio/Admin identity through a dark navigation treatment, and is visually independent from the five Public Menu themes. It also requires the least architectural change because W7 already centralizes internal navigation, headers, tables, filters, states, and semantic colors.

### Why A was not selected
Direction A is strong and hospitality-friendly, but the olive family risks becoming too close to existing Menu V3 personality and can make semantic color usage less distinct if expanded across dense internal surfaces.

### Why C was not selected
Direction C is highly modern, but the terracotta/date accent introduces a second warm brand signal that can compete with status colors and adds slightly more contrast-management risk in dense operational states.

### Implementation rule
Direction B is implemented as an internal-only layer. Existing Public Menu theme adapters and public visual selectors remain untouched.
