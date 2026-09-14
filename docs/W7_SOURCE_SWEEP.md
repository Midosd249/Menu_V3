# W7 Source Sweep

## Scope

- Mission: W7.1 Internal Product Experience Architecture and information-architecture audit.
- Role: ATLAS — Internal Experience Director, operating inside the existing Menu V3 control system.
- Research date: 2026-09-14.
- Base branch: `main`.
- Base SHA: `9995848b747bdb238e45b7ed6fe6b551c6779fcc`.
- Working branch: `w7-1-ia-audit`.
- Implementation status: `ANALYSIS COMPLETE / IMPLEMENTATION NOT STARTED`.

## Repository sources actually inspected

| Source | Accessed | What was learned | Application | Anti-copy / limitation | Status |
|---|---|---|---|---|---|
| `AGENTS.md` | 2026-09-14 | Main is source of truth; repository-first workflow; one atomic task; evidence labels; release-only Vercel; protected public themes; RTL/mobile quality rules | Governs W7.1 scope and evidence discipline | Do not turn policy into new duplicate process docs | VERIFIED |
| `SESSION_PROTOCOL.md` | 2026-09-14 | Startup, research, design-agent, connected-tools, QA, documentation and stop rules | W7.1 is research/architecture only | No implementation or deployment | VERIFIED |
| `PROJECT_STATE.md` | 2026-09-14 | Continuity is stale against current Git head; R9 is recorded; production evidence remains separate | Reconciled current SHA and next-task boundary | Do not trust stale SHA | VERIFIED |
| `PLAN.md` | 2026-09-14 | Current plan is still production-readiness oriented; R8/R9 protected | W7.1 is an explicitly owner-authorized architecture task and must not start R10 | Preserve protected milestones | VERIFIED |
| `TASKS.md` | 2026-09-14 | R8/R9 complete; production readiness remains open | W7.1 recorded as a new atomic architecture task | Do not reopen closed feature work | VERIFIED |
| `QA_NOTES.md` | 2026-09-14 | Owner Studio previously passed readiness checks at 1280x800 and 390x844; mobile bottom navigation exists | Baseline for internal-shell redesign; no fresh browser claim | Historical QA is not current visual proof | VERIFIED |
| `DELETE_CANDIDATES.md` | 2026-09-14 | Destructive deletion requires evidence and explicit approval | No deletion in W7.1 | Do not infer cleanup from filenames | VERIFIED |
| `README.md` | 2026-09-14 | Stack and repository architecture; internal product is part of existing app | Confirms no framework replacement | No package/framework changes | VERIFIED |
| `package.json` | 2026-09-14 | React 19, TanStack Router/Start, Tailwind, Radix, cmdk, Vaul, resizable panels already available | Existing foundation is sufficient for W7.2 | Do not add Refine/shadcn/template dependency | VERIFIED |
| `src/components/studio-shell.tsx` | 2026-09-14 | Flat Studio navigation, permission-filtered items, four-slot mobile nav plus More, order notification surface, preview/open-menu actions | Primary evidence for IA overload and current mobile shell | Do not remove notification/auth behavior | VERIFIED |
| `src/routes/admin.tsx` | 2026-09-14 | `/admin` is one large tab-driven route with 12 tabs and substantial mixed responsibilities | Primary Admin IA/deep-link risk | Do not split during W7.1 | VERIFIED |
| `src/routeTree.gen.ts` | 2026-09-14 | Generated route tree contains 16 Studio child routes but does not include `growth` or `guests` despite those source files existing | Critical route-generation drift evidence | Runtime availability must be verified by generation/build later | VERIFIED |
| `src/routes/studio/growth.tsx` | 2026-09-14 | Real `/studio/growth` source route implements growth loop and evidence-based upsell | Growth belongs as first-class workspace | No new growth backend feature proposed | VERIFIED |
| `src/routes/studio/guests.tsx` | 2026-09-14 | Real `/studio/guests` source route implements R9 relationship overview | Customers should be first-class workspace | No autonomous CRM feature proposed | VERIFIED |
| `src/routes/studio/settings.tsx` | 2026-09-14 | Settings currently contains Publishing, public URL, preview and role/member summary | Publishing is misplaced inside generic Settings | Preserve existing publish semantics | VERIFIED |
| `src/routes/studio/reports.tsx` | 2026-09-14 | Professional analytics report with owner-reviewed WhatsApp sharing | Reports belong under Growth/Measure | Do not add autonomous outbound messaging | VERIFIED |
| `src/routes/studio/qr.tsx` | 2026-09-14 | Branch QR generation, print/download/copy and theme-preview QR links | QR belongs in Publishing | Preserve branch-scoped destinations | VERIFIED |
| `docs/product/DESIGN_SYSTEM.md` | 2026-09-14 | Public five-theme hospitality system; Arabic-first, RTL-native, mobile-first; no generic SaaS gradients/glassmorphism | Internal shell must share tokens/principles without becoming public theme skins | Do not redesign public themes | VERIFIED |
| `docs/agents/design-agent.md` | 2026-09-14 | Design workflow, real-data states, RTL/LTR, mobile, accessibility, no implementation without authorization | W7.1 is architecture-only handoff | No visual implementation now | VERIFIED |
| `docs/agents/research-connected-tools-agent.md` | 2026-09-14 | Repository-first deep research hierarchy and evidence rules | Defines W7 research depth | No unavailable source claims | VERIFIED |
| `docs/automatic-specialist-routing.md` | 2026-09-14 | IA/UI work routes through memory, research, Design, QA, security as relevant | Confirms ATLAS role is internal workflow, not a parallel agent system | No duplicate agent files | VERIFIED |
| `docs/project-memory/problems-learned.md` | 2026-09-14 | Repeated lesson: reconcile continuity, avoid fragmented branches, avoid visual iteration through Vercel | W7 stays local/documentation-only and protects current architecture | No deployment iteration | VERIFIED |
| `docs/design-research-log.md` | 2026-09-14 | Existing research log requires source/date/finding/principle/relevance/limitation/confidence/anti-copy | W7 source sweep follows same evidence pattern | This W7 sweep is the task-specific IA record | VERIFIED |

## External sources actually reached

| Source | URL | Accessed | Finding | Menu V3 application | Anti-copy lesson | Status |
|---|---|---:|---|---|---|---|
| shadcn/ui Sidebar | https://ui.shadcn.com/docs/components/base/sidebar | 2026-09-14 | Composable grouped sidebar, collapsible groups, active states, workspace header, mobile sheet, explicit RTL support | Grouped desktop IA and responsive shell patterns | Reference composition only; do not install shadcn/ui | VERIFIED |
| shadcn/ui GitHub | https://github.com/shadcn-ui/ui | 2026-09-14 | Open-code component philosophy; reusable customizable component library | Confirms we can reproduce principles using existing Radix/Tailwind foundation | Do not add framework/dependency | VERIFIED |
| Radix Accessibility | https://www.radix-ui.com/primitives/docs/overview/accessibility | 2026-09-14 | WAI-ARIA, keyboard navigation and focus management are core primitive concerns | W7.2 interaction contract for menus, dialogs, drawers and command surfaces | Do not copy component visuals | VERIFIED |
| Radix Primitives | https://www.radix-ui.com/primitives | 2026-09-14 | RTL support, screen-reader support, keyboard navigation and focus management | Confirms existing Radix foundation is appropriate | No framework replacement | VERIFIED |
| Tailwind logical properties | https://tailwindcss.com/blog/tailwindcss-v3-3 | 2026-09-14 | `start/end`, `ms/me`, `ps/pe`, logical borders and radii support LTR/RTL | Internal shell should use logical positioning instead of physical left/right assumptions | No new CSS framework | VERIFIED |
| Tailwind padding logical properties | https://tailwindcss.com/docs/padding | 2026-09-14 | Logical padding changes sides according to direction | RTL/LTR implementation rule | Do not rely on translated physical CSS | VERIFIED |
| Nielsen Norman Group IA | https://www.nngroup.com/reports/topic/information-architecture/ | 2026-09-14 | IA, navigation and menus help users find information quickly; hierarchy and grouping matter | Justifies grouping by user jobs rather than feature inventory | Do not copy screenshots or proprietary layouts | VERIFIED |
| Nielsen Norman Group sitemap/IA | https://www.nngroup.com/articles/information-architecture-sitemaps/ | 2026-09-14 | IA is structure, relationships and nomenclature; sitemap is only one representation | W7 route map is a blueprint, not the full UX | No literal sitemap copy | VERIFIED |
| Nielsen Norman Group mobile/enterprise | https://www.nngroup.com/reports/enterprise-mobile-showcase/ | 2026-09-14 | Mission-critical enterprise mobile apps need task-oriented mobile optimization and field-friendly access | Supports dedicated mobile IA rather than shrinking desktop | No copied mobile shell | VERIFIED |
| WCAG 2.2 | https://www.w3.org/TR/WCAG22/ | 2026-09-14 | Target Size Minimum is 24×24 CSS px with exceptions; focus and interaction criteria apply | W7.2 touch and keyboard acceptance criteria | Standard, not a visual template | VERIFIED |
| Toast Orders Hub | https://support.toasttab.com/en/article/Orders-Hub-FAQ | 2026-09-14 | Central operational view for takeout/delivery orders with status actions and permissions | Supports keeping Orders operationally separate from analytics | Do not copy Toast workflow/branding | VERIFIED |
| Toast Menu Reports | https://support.toasttab.com/en/article/Menu-Report-Overview-1492794696577 | 2026-09-14 | Menu reporting is organized around item/category performance, locations and out-of-stock signals | Supports Growth/Measure and menu health grouping | No proprietary report layout | VERIFIED |
| Square menu management | https://squareup.com/help/us/en/article/8553-manage-your-menus-across-locations-and-sales-channels | 2026-09-14 | Menu management can centralize channel/location visibility; categories have operational/reporting roles | Supports Menu workspace boundaries and branch/channel context | Menu V3 has different capabilities; do not copy terminology wholesale | VERIFIED |
| Square menu creation | https://squareup.com/help/us/en/article/6424-create-menus-with-square-for-restaurants | 2026-09-14 | Menus act as a central management hub across channels/locations; import/manual creation are distinct entry points | Supports Items/Categories/Options/Import as one menu workspace | No Square UI/brand copy | VERIFIED |
| SaaSFrame Side Panel | https://www.saasframe.io/patterns/side-panel | 2026-09-14 | Side panels preserve list context while showing details, filters or subtasks | Supports item/order/guest/branch detail panels | Visual inspiration only; library is partially paywalled | VERIFIED |
| SaaSFrame patterns | https://www.saasframe.io/product/patterns | 2026-09-14 | Common SaaS patterns include tables, empty states, metrics, settings and side panels | Supports internal component inventory | Do not copy product screens | VERIFIED |
| Dribbble SaaS dashboards | https://dribbble.com/search/saas-dashboard | 2026-09-14 | Large volume of dashboard visual inspiration | Used only for visual atmosphere, density and composition vocabulary | Maximum 12 references; never implementation authority | VERIFIED |
| Dribbble SaaS dashboard UI | https://dribbble.com/search/saas-dashboard-ui-design | 2026-09-14 | Shows common dashboard visual patterns and high-density layouts | Helps reject over-decoration and compare density | No copying of shots | VERIFIED |
| Refine GitHub | https://github.com/refinedev/refine | 2026-09-14 | Resource-oriented CRUD/admin architecture, routing, access control, tables and internal tools | Reference for information architecture concepts only | Explicitly not installed; no dependency or framework change | VERIFIED |

## Connected design/tool sources

| Tool/source | Result | Status |
|---|---|---|
| `AI_Color_Picker_-_Design_Tool` | Existing Menu V3 palette was reviewed; selected core colors include `#344331` and `#B78A42`, with `#1F2421` also surfaced as deep ink | VERIFIED |
| `Mobbin` | Connected source was identified, but direct MCP access was unavailable/paid in this session | BLOCKED |
| GitHub connector | Repository, current commit, source files, route tree, GitHub open-source references and documentation were reachable | VERIFIED |
| Browser/device runtime | No live browser/device rendering was performed in W7.1 | UNKNOWN |

## Important repository contradiction discovered

`VERIFIED`: current source files contain `/studio/growth` and `/studio/guests`, but the checked-in generated `src/routeTree.gen.ts` at `main` does not import or expose those two routes. This is a route-generation/reconciliation issue, not permission to edit routes during W7.1. W7.2 must first regenerate/verify the route tree locally and determine whether the mismatch is build-time generated state or a real runtime availability defect.

## Research conclusion

`VERIFIED`: Menu V3 already has the technical foundation for a premium internal workspace: React 19, TanStack Router/Start, Tailwind logical utilities, Radix primitives, command/menu infrastructure, existing Studio shell, and server-side permission boundaries.

`INFERRED`: the largest internal UX problem is not missing features; it is that capabilities have accumulated faster than the navigation model. The current shell exposes a flat feature list while additional real routes are not surfaced consistently.

`PROPOSED`: W7.2 should reorganize the existing capabilities around restaurant jobs-to-be-done: Home, Menu, Orders, Growth, Customers, Settings, with Appearance and Publishing treated as coherent settings/publishing domains rather than top-level feature islands.

`BLOCKED`: Mobbin direct connected inspection was unavailable. No claim about inaccessible screens is used in the IA decision.
