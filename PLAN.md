# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`; active implementation branch: `feat/premium-theme-redesign`.
- Existing G1–G7.2 completed work remains protected.

## Current Atomic Task
### Premium Theme System — 8 → 5

**Objective:** turn Menu V3 themes into complete, commercially meaningful visual systems rather than color variations. Reduce the catalog to five focused experiences: one Free baseline and four Premium designs.

### Catalog
- `essential` — Free — quiet, fast, highly legible baseline.
- `editorial` — Premium — magazine rhythm, asymmetric emphasis, typography-led composition.
- `noir` — Premium — cinematic fine dining, dark surfaces, warm glow, immersive opening.
- `heritage` — Premium — contemporary Arabic/Saudi hospitality with material and geometric cues.
- `gallery` — Premium — image-first catalogue with art-directed media blocks and crops.

### Files changed in this task
- `src/lib/theme/types.ts`
- `src/lib/theme/registry.ts`
- `src/lib/theme/index.ts`
- `src/lib/theme/server.ts`
- `src/components/menu-theme-controller.tsx`
- `src/routes/studio/design.tsx`
- `src/routes/themes/index.tsx`
- `src/styles.css`
- `scripts/template-qa.mjs`
- `.github/workflows/quality.yml`
- `migrations/20260904001000_five_theme_system.sql`
- `src/lib/theme/registry.test.ts`
- `docs/product/DESIGN_SYSTEM.md`
- `PROJECT_STATE.md`
- `TASKS.md`

### Acceptance criteria
1. Exactly five public theme keys exist.
2. Exactly one theme is Free and four are Premium.
3. Premium themes differ in composition, typography, surfaces, image treatment, navigation rhythm, product presentation and motion—not only color.
4. Premium preview remains available before payment; publishing requires an eligible non-free subscription server-side.
5. Legacy keys normalize and database records migrate safely.
6. Public URLs, menu data, tenant/branch isolation, SEO, auth, ordering and analytics contracts remain intact.
7. RTL and LTR remain supported; Arabic is a first-class layout.
8. Mobile, tablet and desktop layouts have no horizontal overflow.
9. Premium motion progressively enhances and respects `prefers-reduced-motion`.
10. Browser QA covers all five themes.
11. Typecheck, tests, lint and production build pass.

## Research / design decisions
- **VERIFIED:** Menu Author treats a theme as a coordinated system controlling fonts, layout, dish presentation, colors and background. urlMenu Author themeshttps://menuauthor.com/themes
- **VERIFIED:** MENU TIGER uses professionally designed restaurant templates, mobile-responsive layouts and editable brand presentation. urlMENU TIGER templateshttps://www.menutiger.com/features/website-and-menu-templates
- **VERIFIED:** Popmenu positions restaurant websites around mobile-first design, visual menu presentation and conversion-oriented guest experience. urlPopmenu website designhttps://get.popmenu.com/solutions/website-design
- **VERIFIED:** CSS scroll-driven animation is available as progressive enhancement but is not universal; implementation is therefore guarded by `@supports`. citeturn2search11turn2search12
- **VERIFIED:** WAI recommends `prefers-reduced-motion` to allow users to suppress interaction-triggered motion. citeturn2search13turn2search14
- **INFERRED:** Five focused visual systems provide a stronger commercial story than eight shallow variations and reduce maintenance surface.

## Entitlement decision
- Current plans in repository: `free`, `starter`, `pro`. fileciteturn63file0L2-L2
- Premium themes are previewable by everyone.
- Publishing a Premium theme is allowed only for a non-free plan with `trialing` or `active` status.
- Payment-provider integration is not invented in this task; the existing subscription model remains the source of entitlement state.

## Verification
- **VERIFIED:** dedicated implementation branch created from main commit `040e625889f203e07e7fc87dd275c5be949d9566`.
- **VERIFIED:** theme registry, controller, studio catalog, public gallery, migration, server entitlement check, tests and browser QA were updated.
- **UNKNOWN:** GitHub Actions result for the final branch commit until CI completes.
- **UNKNOWN:** final visual judgment from a real browser screenshot review until the branch deployment is available.
- **UNKNOWN:** local working-tree status outside GitHub connector.

## Stop condition
Do not mark this task DONE until CI/browser verification provides evidence for the acceptance criteria. Do not start an unrelated task in the same session.
