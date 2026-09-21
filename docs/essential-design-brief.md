# Essential Premium Refinement — Design Brief

## Discovery and evidence
- Template / family: `SmallMenuTemplate` / `small-menu`
- Supported `ThemeKey`: `essential`
- Current route(s): `/m/$slug`, `/m/$slug/$branch`, theme preview surfaces using the same public renderer
- Repository evidence reviewed: `AGENTS.md`, `PROJECT_STATE.md`, `PLAN.md`, `TASKS.md`, `SESSION_PROTOCOL.md`, `README.md`, `src/components/templates/small-menu.tsx`, `src/components/public-menu.tsx`, `src/theme-essential.css`, `src/styles.css`, `src/lib/theme/registry.ts`, `tests/preview-shell.test.mjs`, `.github/workflows/quality.yml`
- Material visual evidence: five user-provided screenshots showing Essential public/owner-preview states at mobile widths
- Evidence labels: `VERIFIED` / `INFERRED` / `PROPOSED` / `UNKNOWN` / `BLOCKED`

## Segment and business intent
- Target restaurant segment: everyday restaurants, cafes, bakeries, and food businesses that need a fast QR-first menu.
- Saudi-market relevance: Arabic-first RTL, bilingual fallback, SAR pricing, branch context, WhatsApp/location/phone actions where configured.
- Target customer: mobile guest scanning a QR code or opening a shared menu link.
- Business goal: make browsing and ordering/contact actions obvious without making the free theme look generic.
- Primary action: browse menu; cart/order is primary only when the existing ordering capability is used.
- Secondary action: WhatsApp, map, phone, and social actions only when verified/configured.
- Conversion goal: reduce time from menu arrival to product discovery and supported customer action.
- Critical information: restaurant identity, branch, category navigation, product name, price, availability, and supported customer actions.

## Visual personality
- Visual promise: quiet, warm, precise hospitality with strong mobile readability.
- Art direction: warm paper + ink + restrained terracotta accent; product imagery is editorial support rather than the only contrast source.
- Typography: IBM Plex Sans Arabic for Arabic and Latin; strong display/heading hierarchy, comfortable Arabic line-height, tabular SAR numerals.
- Anti-generic rule: Essential should feel like a designed restaurant menu, not a delivery marketplace or SaaS dashboard.
- Anti-copy rule: use transferable principles only; no proprietary layout/assets/branding are copied.

## Content and language
- Default language: Arabic when selected/available.
- Arabic RTL: logical spacing/alignment, readable line-height, no forced LTR punctuation behavior.
- English LTR: same hierarchy with intentional LTR flow.
- Mixed-direction: allow Latin names, SAR values, tags, phone numbers, and URLs to reflow without horizontal overflow.
- Long text: wrap rather than clip; descriptions remain secondary but readable.
- SAR: consistent `formatSar` output and tabular numerals; price remains visually stronger than description.

## Layout and hierarchy
- First screen: one public header/hero, compact search, horizontally scrollable categories, then featured items and menu sections.
- Header/identity: compact brand block with logo/name/city, language control, branch/status chips, and quiet customer actions.
- Category navigation: sticky utility bar; active category is dark/high-contrast and non-active categories use a muted surface.
- Section rhythm: large enough separation to create editorial rhythm without excessive vertical whitespace.
- Product cards: compact horizontal cards for dense menu browsing; image, name, price, description, and dietary metadata remain stable.
- Featured treatment: vertical image-led cards with consistent media ratio; one item becomes a balanced split card instead of leaving a large empty column.
- Density: optimized for one-handed mobile scanning; no decorative element may consume more space than menu information.
- Decorative constraints: no circular clipping, heavy gradients, glassmorphism, or motion that hides content.

## Interaction hierarchy
- Primary controls: category/search, product selection, cart/order when supported.
- Secondary controls: WhatsApp, map, phone, Instagram.
- Touch targets: important mobile controls target approximately 44×44 CSS pixels where practical; 24×24 CSS pixels is the minimum WCAG baseline with exceptions.
- Focus: visible accent outline and no fixed element should fully obscure focused content.
- Feedback: product detail opens clearly; cart remains discoverable when empty; order submission keeps existing validation/error behavior.
- Motion: only small transform/image transitions; all motion yields to `prefers-reduced-motion`.

## Cart and customer actions
- Cart placement: one fixed shared action dock below menu content, with document clearance and safe-area support.
- Cart count: always accurate; zero remains a visible entry point.
- WhatsApp: secondary compact icon action in the dock and labeled action in the hero only when configured.
- Phone/map/social: rendered only from existing verified branch/tenant data.
- No payment/checkout behavior is introduced.

## Owner preview
- Public menu and owner preview use the same public renderer and Essential visual system.
- Owner-only chrome is outside the public menu layout and visually subordinate.
- Fixed customer action dock is excluded from owner preview.

## Browser and first-render policy
- Essential explicitly uses `color-scheme: light` and deterministic document/body backgrounds.
- Existing SSR/head theme bootstrap remains the first-paint source of theme identity; no client-only timeout/mask is used.
- Actual Opera and first-paint timing remain `UNKNOWN` until browser evidence is captured.

## Real-data resilience
- Long names/descriptions: wrap safely.
- Missing images: existing intentional fallback remains part of the surface hierarchy.
- Mixed image ratios: stable card media containers use fixed/aspect-ratio treatment.
- Featured counts 1–many: grid rules avoid accidental empty space and preserve a deliberate composition.
- Sparse/dense categories: search/category controls remain usable.
- Branches: branch navigation remains horizontally reachable without obscuring the menu.
- Sold-out/modifier states: preserve shared renderer semantics; Essential CSS must not hide these states.

## Verification plan
- Source-level regression: `tests/preview-shell.test.mjs`
- Repository quality: `npm run typecheck`, `npm test`, `npm run test:platform`, `npm run lint`, `npm run build`, `npm run qa:template`, `npm run performance:audit`
- CI browser: Chromium template QA across all themes using `.github/workflows/quality.yml`
- Visual evidence: user screenshots are baseline evidence; CI/browser screenshots are required for final closure.
- Known limits: no local executable browser/device environment is available in the current session.

## Change boundary
Only Essential presentation and the existing shared rendering safety contract are touched. No schema, migration, authorization, subscription, tenant/branch isolation, dependency, or Vercel configuration change is required.
