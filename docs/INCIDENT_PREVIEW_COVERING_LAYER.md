# Preview Covering-Layer Incident — Engineering Learning

## Status
- Date: 2026-09-05
- Status: CLOSED / LEARNING CAPTURED
- Scope: theme preview rendering only
- User-visible outcome: preview is working again; no product feature was intentionally changed by this learning record.

## What happened
The theme-preview work introduced a visual failure where a layer obscured the menu. Multiple attempted fixes focused on presentation symptoms such as stacking and overlay behavior before the complete rendering chain had been reduced to its simplest structure.

The successful correction sequence in `main` is preserved in the commit history. It included:

1. Stabilizing preview theme selection and explicitly marking preview mode.
2. Loading a dedicated preview-layer stylesheet.
3. Preventing preview animation from depending on scroll/view timelines and forcing preview menu items into a visible final state.
4. Removing preview stacking blockers so the preview shell does not create an unnecessary stacking trap.
5. Removing the full-screen child rule `.menu-public-shell > div { min-height: 100dvh; }`, which could turn a direct child into a full-viewport layout layer.
6. Removing the extra outer `.menu-public-shell` from the preview routes so the actual menu template remains the owner of its presentation shell.

## Root-cause lessons
### 1. Diagnose the whole paint system
A transparent or covering layer is not automatically a `z-index` bug. Inspect DOM nesting, positioned elements, pseudo-elements, `isolation`, viewport sizing, overflow, animation state, and route wrappers together.

### 2. Do not create defensive stacking contexts blindly
The early preview safety implementation used `isolation: isolate` and child `z-index: 1`. The later correction deliberately returned preview content to normal paint order with `isolation: auto`. The lesson is to avoid adding a stacking context until the actual stacking relationship is proven.

### 3. Preview is a separate rendering mode
A published-menu animation can be valid while being wrong for a static preview. Preview content must have a deterministic visible state and must not depend on scroll-driven animation progress.

### 4. Avoid duplicate presentation ownership
If a template already renders `.menu-public-shell`, wrapping it in another shell creates an unnecessary presentation boundary and increases the probability of CSS and stacking conflicts.

### 5. HTTP success is not visual success
An endpoint returning HTTP 200 proves routing/HTTP availability, not that the user can actually see the menu. Visual regressions require browser-level verification when possible.

## Diagnostic order for future visual bugs
Use this order before editing:

**DOM structure → positioning/sizing → stacking contexts → pseudo-elements → animation/paint timing → responsive constraints → targeted `z-index` only when proven necessary.**

## Regression rule
Every future preview/template change must preserve these invariants:

- No nested preview menu shell unless there is a documented architectural reason.
- Preview content must remain visibly rendered without scroll interaction.
- Decorative pseudo-elements must not intercept pointer input.
- Preview-specific CSS must not create an unnecessary full-viewport child layer.
- Preview fixes must not weaken authentication, authorization, tenant isolation, or publish/save rules.
- Structural invariants should have focused regression tests where practical.

## Evidence
- `47b0d2c4536dd8ddc2ffb574214f2acbded8abc4` — preview content forced into a deterministic visible state.
- `bd5083c3dd2178a4354ebc4c4b34557fbd8dfe9b` — preview stacking blockers removed.
- `1031598d234e2dad1f5cb467cf9e0bdf2410584e` — full-screen child layer removed.
- `ce2295cd7ac7be4a1d7d5966ae03394b5352fca3` / `e14eee02ea45888e5c003387ca1872f11272218d` — nested preview shell removed.
- Current `main` source confirms the preview routes now render the theme controller and menu template directly.

## Agent learning rule
When another coding agent solves a defect that we previously failed to isolate, do not copy the patch blindly. Reconstruct the causal chain from the commit history, identify which earlier assumptions were wrong, record the general engineering principle, and add a regression invariant before returning to feature work.
