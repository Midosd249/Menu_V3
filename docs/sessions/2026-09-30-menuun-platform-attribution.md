# 2026-09-30 — Menuun Platform Attribution — CLOSED

## Final verified state
- VERIFIED: implementation landed through PR #324.
- VERIFIED: merge commit / current `main`: `78550457a7ba7e2c23f2190856c1fb5c8cf71c3e`.
- VERIFIED: GitHub Quality #2590 passed.
- VERIFIED: W9 Orders QA #751 passed.
- VERIFIED: Vercel Production deployment `dpl_APMeXne3rQkaVa9VtjDuHYMpSpW4` is READY and targets production.
- VERIFIED: deployed commit exactly equals `main`: `78550457a7ba7e2c23f2190856c1fb5c8cf71c3e`.
- VERIFIED: Production aliases include `www.menuun.com` and `menuun.com`.
- VERIFIED: no runtime errors were found in the checked 30-minute post-deployment window.
- UNKNOWN: direct physical Android/iOS rendering of the new attribution footer was not captured in this task.

## Delivered
- Shared `MenuunPoweredBy` footer for every public-menu render.
- Charcoal `#0F1115` platform surface with the approved Menuun logo.
- Arabic/English `مقدم من` / `Powered by` labels.
- Menuun logo in Studio desktop sidebar and mobile header.
- Regression coverage and brand-manifest wiring status.
- No tenant identity, ordering, auth, RLS, subscription, or database behavior changes.

## Release status
- IMPLEMENTATION STATUS: DONE.
- DEPLOYMENT STATUS: DEPLOYED / VERIFIED.
- No further action is required for this atomic task.
## Classification
Shared public-menu branding + Studio workspace presentation.

## Evidence
- VERIFIED: `main` HEAD at task start is `2e38263dfdc5d73a3e21f97fe029bf5fdd2d22cd`.
- VERIFIED: approved Menuun production assets exist under `assets/brand/menuun/final/`.
- VERIFIED: `src/components/menuun-logo.tsx` already provides the bilingual platform logo.
- VERIFIED: customer/restaurant identity is already represented by tenant `logoUrl`; this task must not replace it.
- VERIFIED: the supplied screenshot demonstrates a small dark platform-attribution footer at the bottom of a public menu.

## Design decision
- PROPOSED/IMPLEMENTED: use a shared charcoal `#0F1115` footer with the existing Menuun logo rendered in white through a presentation-only filter, plus the bilingual labels `مقدم من` / `Powered by`.
- PROPOSED/IMPLEMENTED: place the attribution after the public menu renderer and existing customer-action footer so it is always the final platform surface across theme families.
- PROPOSED/IMPLEMENTED: add the existing Menuun logo to the Studio desktop sidebar brand area and mobile header without changing tenant identity.

## Research
- Menuo public product material documents custom restaurant branding and removal of Menuo footer branding on a higher plan: https://menuo.io/
- W3C WCAG 2.2 documents 4.5:1 minimum contrast for normal text and 3:1 for required non-text UI indicators: https://www.w3.org/TR/wcag/

## Scope
- `src/components/menuun-powered-by.tsx`
- `src/components/studio-shell.tsx`
- `src/routes/m.$slug.tsx`
- `tests/menuun-brand-wiring.test.mjs`
- continuity/research documentation only.

## Acceptance criteria
1. Every public-menu render includes exactly one Menuun platform attribution footer after the menu/action content.
2. Attribution uses the approved Menuun logo and a compact dark visual treatment.
3. Tenant restaurant branding remains untouched.
4. Studio desktop and mobile surfaces expose the real Menuun logo.
5. Arabic/English labels are localized.
6. Existing public-menu actions, theme ownership, and ordering behavior remain unchanged.
7. Regression tests cover the platform-brand wiring.
8. Repository CI/browser QA is used before merge/release.

## Verification boundary
Browser/device visual verification is not yet complete at implementation time. No Production deployment is performed by this task.
