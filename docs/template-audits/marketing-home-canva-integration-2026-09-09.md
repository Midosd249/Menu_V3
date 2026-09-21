# Marketing Home — Canva Reference Integration Audit

Date: 2026-09-09
Branch: `feat/marketing-canva-home`
Status: `IMPLEMENTATION_IN_PROGRESS`

## Request classification

- Marketing/public landing-page redesign.
- Visual design implementation from a user-provided Canva reference/code artifact.
- Arabic-first bilingual responsive experience.

## Evidence used

- User-provided `Page1.md`: source design/content structure.
- User-provided reference image: visual direction and long-form page composition.
- Current Menu V3 `main` branch, repository code, commercial catalog, theme registry, lead submission path, language system, and route structure.
- `docs/agents/design-agent.md` and existing design-system continuity documents.

## Reconciliation rules

The Canva artifact is treated as a design/content reference, not as the application source of truth.

Verified application data and behavior remain authoritative:

- `COMMERCIAL_PLANS` supplies current plan names, limits, and monthly prices.
- `submitLead` remains the existing lead/request submission path.
- `MENU_THEMES` remains the theme registry.
- Existing authenticated/public routes are preserved.
- No fabricated customer testimonials are presented as real; the reference testimonial section is labeled as illustrative usage examples.
- Unsupported external contact destinations were not invented; the CTA routes back to the existing request flow.

## Implemented design direction

- Warm ivory / paper foundation.
- Deep emerald primary brand surface.
- Soft mint utility surfaces.
- Warm amber accent.
- Editorial rounded cards with restrained shadows.
- Strong Arabic-first hero hierarchy.
- Mobile-first responsive navigation and content stacking.
- Phone, dashboard, branch, analytics, and menu previews built as lightweight UI compositions rather than heavy image assets.
- Reduced-motion support and visible keyboard focus treatment.

## Sections integrated

1. Sticky bilingual navigation.
2. Hero / product promise.
3. Capability strip.
4. QR menu story + mobile menu preview.
5. Feature grid.
6. Menu-management dashboard preview.
7. Product management section.
8. Branch-management section.
9. Analytics section.
10. Public digital-presence preview.
11. Traditional-vs-digital comparison.
12. How-it-works flow.
13. Current commercial pricing catalog presentation.
14. Illustrative hospitality use cases.
15. FAQ.
16. Existing lead/request flow CTA and form.
17. Footer/navigation.

## Risks / UNKNOWN

- Physical-device rendering has not been directly observed in this connector environment.
- Full CI quality-gate execution remains pending after the branch changes.
- Browser screenshot comparison against the Canva reference remains pending.
- The annual pricing control is explicitly labeled as a pricing preview because the current commercial catalog does not establish an annual billing product.

## Acceptance criteria

- Preserve Menu V3 routes, auth boundaries, lead submission path, commercial catalog, and theme registry.
- Implement the Canva page's visual hierarchy and major content sections without copying proprietary assets.
- Maintain Arabic/English and RTL/LTR behavior.
- Maintain responsive mobile/tablet/desktop composition.
- Avoid fabricated customer claims and unsupported external links.
- Pass typecheck, lint, tests, and production build before merge.
