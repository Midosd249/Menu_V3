# W17 Public Pages & Themes — Design Brief

## Objective
Upgrade the existing Menu V3 public marketing journey so the homepage clearly communicates the product, shows the canonical Free/Starter/Pro plans, lets a prospective customer select a plan or one of the five protected themes, and routes the selection into the existing new-lead request flow.

## Source of truth
- Repository: `Midosd249/Menu_V3`
- Branch for this task: `w17-public-pages-themes-integration`
- Canonical base: `main`
- Existing commercial catalog: `src/lib/menu/commercial-catalog.ts`
- Existing theme registry: `src/lib/theme/registry.ts`
- Existing lead server function: `src/lib/menu/public.ts` (`submitLead`)

## Protected boundaries
- Do not change Supabase schema, migrations, authentication, authorization, RLS, tenant isolation, branch isolation, analytics event taxonomy, Owner Studio, or public-menu rendering architecture.
- Do not create a sixth theme.
- Do not introduce an online checkout or claim payment functionality that does not exist.
- Do not replace the real Menu V3 theme preview with a static HTML preview.
- All five current themes remain available; the commercial catalog and theme registry are authoritative.

## Customer journey
1. Homepage hero communicates the product and provides a clear start action.
2. Theme section explains the five personalities and provides Preview and Use Theme actions.
3. Pricing section displays canonical plan values and operational limits.
4. Selecting a plan or theme scrolls to the new-customer request form and visibly preserves the selection.
5. Submission uses the existing `submitLead` server function.
6. Success displays a reference ID; failure remains actionable.

## Theme presentation principles
- Use theme registry metadata rather than duplicating commercial/theme identifiers.
- Keep technical theme keys (`essential`, `editorial`, `noir`, `heritage`, `gallery`) separate from localized display names.
- Present personality through hierarchy, product presentation, imagery emphasis, density, and layout metadata.
- `/themes/preview` must continue to render through `MenuThemeController` plus the existing public-menu/template system.
- Theme selection must never imply a paywall because the current registry intentionally allows all five themes.

## Pricing principles
- Prices and limits are read from `COMMERCIAL_PLANS`; no duplicated plan values are introduced in business logic.
- Display Free `0 SAR`, Starter `99 SAR`, and Pro `199 SAR`.
- Display branch, product, and team-member limits.
- Make the selection action explicit and connect it to the request form.

## i18n / RTL
- Arabic remains the primary presentation language.
- English labels must remain available through the existing language system.
- Use the existing `useLang`, `copy`, and `t` infrastructure where a shared copy key exists; inline copy is acceptable only for narrowly scoped UI labels where no key currently exists.
- Preserve mixed-direction safety for technical keys, prices, and reference IDs.

## Accessibility / responsive requirements
- Keyboard-reachable plan/theme controls.
- Visible selected state.
- No action relies only on hover.
- Touch-friendly controls on mobile.
- No horizontal overflow from long Arabic/English content or plan values.
- Preview controls remain usable without covering the rendered menu content.

## Verification
Required before merge:
- `npm run typecheck`
- `npm test`
- `npm run lint`
- `npm run build`
- `npm run qa:template`
- inspect final diff and changed files
- browser/visual QA where available

If a check cannot run, record the exact blocker and do not claim it passed.
