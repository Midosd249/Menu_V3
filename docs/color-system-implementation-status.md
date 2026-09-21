# W7 — Color / Surface / Contrast System

## Status
- Implementation: IN_PROGRESS pending full Quality Gate.
- Scope: shared semantic color/surface contract above the protected five-theme system.
- Repository source of truth: `main`.

## Decision
Menu V3 uses semantic color roles for meaning and lets each protected theme supply its own personality values. Theme identity is preserved; status meaning is not theme-colored.

### Semantic roles
- `surface.canvas`
- `surface.primary`
- `surface.secondary`
- `surface.elevated`
- `surface.inverse`
- `surface.overlay`
- `content.primary`
- `content.secondary`
- `content.muted`
- `content.inverse`
- `border.subtle`
- `border.strong`
- `action.primary`
- `action.primary-hover`
- `action.primary-foreground`
- `action.secondary`
- `action.secondary-hover`
- `action.secondary-foreground`
- `focus.ring`
- `status.success`
- `status.warning`
- `status.danger`
- `status.info`
- disabled and interactive state roles

## Accessibility basis — VERIFIED
W3C WCAG guidance establishes 4.5:1 minimum contrast for normal text, 3:1 for large text, and 3:1 for relevant non-text user-interface components. WCAG 2.2 also adds Focus Not Obscured requirements; focus must not be hidden by author-created content. Sources:
- https://www.w3.org/WAI/standards-guidelines/wcag/
- https://www.w3.org/WAI/test-evaluate/preliminary/
- https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/

## Palette verification — VERIFIED
The regression contract verifies the default critical semantic palette at or above the selected AA thresholds. The Noir primary accent is also checked against its dark canvas.

The current contract deliberately avoids using the theme accent as the semantic definition of success, warning, or danger.

## Theme boundary — VERIFIED
Adapters exist for all five protected themes:
- Essential
- Editorial
- Noir
- Heritage
- Gallery

Each adapter changes surfaces/content/action personality while leaving status semantics shared.

## Implementation
- `src/colors.css` owns the semantic contract and theme adapters.
- `src/routes/__root.tsx` loads the color contract before typography and protected theme layers.
- `scripts/color-contract.test.mjs` verifies required roles, five-theme coverage, status-semantic separation, critical contrast, focus/disabled/placeholder states, and reduced/extra-contrast media behavior.
- `package.json` includes the regression test in the normal test command.

## UNKNOWN / pending evidence
- Full GitHub Quality Gate for the corrected W7 commit is pending.
- Browser/device visual verification across all five themes is pending until the Quality workflow reaches the browser stage.
- Runtime contrast across every dynamic tenant-branded combination is not proven by static contract tests; this remains a later runtime/a11y audit item.

## Do not do
- Do not replace the five themes with one palette.
- Do not redefine success/warning/danger per theme.
- Do not use color as the only carrier of status meaning.
- Do not weaken tenant branding to satisfy a single global accent.
- Do not add a sixth theme.
