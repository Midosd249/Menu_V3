# Essential Language Selector Contrast and Five-Theme Audit — 2026-10-23

## Scope and evidence boundary
- Task: correct language-selector contrast in Essential and inspect the five public theme implementations for directly related regressions.
- Reference branch base: `main` at the repository's latest observed commit `f6e888ded688ba682b3c5862719b76adb96a5f21`.
- Code evidence is available through GitHub repository reads. No local runtime or rendered browser session was available during this audit; visual rendering claims remain UNKNOWN until browser QA.

## Root cause — Essential
- **VERIFIED (source):** `src/components/public-menu.tsx` renders the shared `LangToggle` inside the public header.
- **VERIFIED (source):** `src/theme-essential.css` applies white foreground and translucent dark styling to every button inside the Essential header. This generic selector outranks the utility classes on the language selector's child buttons, including the muted inactive state.
- **INFERRED:** this specificity/inheritance collision explains the reported white selector text against its light selector surface. Rendered computed styles were not available to independently confirm the pixels.
- Fix: add narrowly scoped Essential-only rules for the selector surface, inactive state, selected state, and visible keyboard focus. No global selector or other theme was changed.

## Five-theme audit

| Theme | Source inspection | Finding | Severity | Status |
|---|---|---|---|---|
| Essential | `src/components/public-menu.tsx`, `src/components/lang-toggle.tsx`, `src/theme-essential.css` | Generic hero-button foreground styles collide with selector state colors; targeted override added | P2 | VERIFIED source / browser UNKNOWN |
| Signal Table / Gather | `src/components/templates/signal-table.tsx` | Dedicated `SignalLanguageControl` with explicit label, disabled state, minimum 44px control and theme utility classes | — | VERIFIED source / rendered states UNKNOWN |
| Noir | Shared public renderer and theme CSS registry; direct component file path assumed by request was not present | No additional confirmed defect established from available evidence | — | UNKNOWN |
| Heritage | Shared public renderer and theme CSS registry; direct component file path assumed by request was not present | No additional confirmed defect established from available evidence | — | UNKNOWN |
| Gallery | Shared public renderer and theme CSS registry; direct component file path assumed by request was not present | No additional confirmed defect established from available evidence | — | UNKNOWN |

## Deferred / blocked checks
- **BLOCKED:** no browser/device visual run from this connected-tool environment; cannot verify computed colors, hover/focus rendering, breakpoints, clipping, or actual Arabic/English screenshots.
- **UNKNOWN:** complete component/CSS mapping for Noir, Heritage, and Gallery requires resolving their actual registered renderer paths and running the template QA/browser suite.
- No unrelated theme changes are authorized by the current evidence.

## Verification required on the PR
- Focused test: `node --test tests/essential-language-switcher.test.mjs`
- `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`
- Browser QA for Essential, Signal Table/Gather, Noir, Heritage, and Gallery in Arabic RTL, English LTR, mixed-direction content, mobile and desktop, including hover/focus/disabled states where supported.
