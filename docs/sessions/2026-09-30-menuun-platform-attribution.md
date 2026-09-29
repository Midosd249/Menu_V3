# 2026-09-30 — Menuun Platform Attribution

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
