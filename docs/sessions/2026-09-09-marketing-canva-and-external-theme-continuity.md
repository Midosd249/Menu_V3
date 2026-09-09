# 2026-09-09 — Canva Marketing Home & External Theme Continuity

## Status

- Branch: `feat/marketing-canva-home`
- Scope: marketing home integration plus continuity record for successful external theme work.
- Production deployment: not performed.
- `main`: unchanged by this session.

## Verified theme continuity

The repository contains the successful theme work completed before the marketing-home work:

1. `726dcc36f6d3d5ed4c18f2b5b7faf42c837e0c75` — canonical renderer coverage for all five themes.
2. `567744001b131029fc7534b769ff8089d7d50d8c` — premium cover imagery added to the theme registry.
3. `cd746bd9209b350ad103a9e903420ce72075ffc9` — real cover imagery used by the theme gallery.
4. `ec3464111e4c14b5dda2ae13b724187344258ae9` — preview data synchronized with Owner Studio.

The canonical registry currently defines five themes: `essential`, `editorial`, `noir`, `heritage`, and `gallery`. `heritage` is the Arabic `مذاق` / English `Taste` identity. Theme resolution is centralized through `normalizeThemeKey` and the canonical renderer.

## Continuity rule

Work completed in an external chat or specialist workflow is not considered disposable. When its result is successfully incorporated into the repository, record:

- the relevant commit SHAs;
- the affected theme names and stable keys;
- the visual/design decisions that must not be regressed;
- the canonical source files/registries;
- tests or QA contracts added to protect the result;
- any known limitations or follow-up work.

Do not recreate a theme from screenshots or memory when the canonical implementation already exists in the repository.

## Marketing-home integration

The Canva-inspired marketing home is implemented in `src/routes/index.tsx` and uses the canonical commercial and theme contracts rather than duplicating business rules:

- `COMMERCIAL_PLANS` for current pricing and plan limits;
- `COMMERCIAL_FEATURES` for commercial feature messaging;
- `MENU_THEMES` and `normalizeThemeKey` for theme selection;
- `submitLead` for lead submission;
- existing auth gates and `/themes/preview` routing.

The marketing page is Arabic-first, bilingual, mobile-first, and includes hero, feature, theme, workflow, pricing, lead-request, FAQ, and footer sections.

## Engineering guardrails

- Do not weaken `ThemeKey` typing to bypass compiler errors.
- Do not create a second theme registry.
- Do not invent plan prices or capabilities in the marketing page.
- Do not represent illustrative customer scenarios as real testimonials.
- Do not change `main` or production as part of local/feature validation.
- Browser/theme QA must exercise all five canonical themes after marketing-home changes that affect theme selection or preview links.

## Known verification state at creation

The marketing-home branch previously failed CI during route generation because of invalid JSX in `src/routes/index.tsx`. The file was rebuilt into a smaller, structurally valid implementation while preserving the canonical theme and commercial contracts. A fresh Quality Gate must be treated as the source of truth before merge.
