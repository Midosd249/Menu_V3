# Session Log — 2026-09-07 — Heritage Design Agent Full Refinement

## Current position
- **VERIFIED:** Heritage is the active atomic template refinement target.
- **VERIFIED:** source is `Midosd249/Menu_V3`; implementation is isolated on `feat/heritage-full-refinement`.
- **VERIFIED:** supplied evidence is a 695×1536 mobile screenshot; exact physical browser/device is UNKNOWN.

## Audit
- **VERIFIED:** supplied screenshot shows an oversized white logo block, dominant cover imagery, compressed kicker metadata, and weak first-screen menu utility.
- **VERIFIED:** `contemporary-restaurant.tsx` uses dedicated hero media/logo classes, but the existing Heritage presentation layer did not explicitly isolate and bound the logo.
- **VERIFIED:** shared Heritage rules introduce an alternating card radius; this conflicts with stable menu scanning.
- **INFERRED:** the oversized logo is amplified by the source logo asset's light background and unconstrained shared image presentation.

## Implementation
- **VERIFIED:** added `src/theme-heritage-hardening.css` scoped exclusively to `data-menu-theme="heritage"`.
- **VERIFIED:** hero media is isolated as a bounded background layer.
- **VERIFIED:** brand logo is bounded, uses `contain`, and is protected from generic image positioning/filtering/transform behavior.
- **VERIFIED:** mobile hero density is reduced.
- **VERIFIED:** product cards use one stable horizontal geometry with fixed `4 / 3` media.
- **VERIFIED:** inherited alternating radii and layout transforms are neutralized without changing shared renderer behavior.
- **VERIFIED:** RTL/LTR and bidi-safe handling is preserved for volume and price runs.
- **VERIFIED:** reduced-motion behavior remains explicit.
- **VERIFIED:** no database, auth/authz, subscription, tenant/branch, dependency, CI/CD, Vercel, environment, or deployment configuration was intentionally changed.

## Regression protection
- **VERIFIED:** added `tests/heritage-browser-hardening.test.mjs`.
- **VERIFIED:** registered the test in the existing default test suite.
- **VERIFIED:** no package dependency was added or upgraded; the package manifest matches the `main` baseline except for the test registration.

## Documentation
- **VERIFIED:** full audit is recorded in `docs/template-audits/heritage-full-refinement.md`.
- **VERIFIED:** `PLAN.md` and `TASKS.md` record the active Heritage refinement milestone.

## Verification
- **VERIFIED:** PR #25 is open as a draft against `main`.
- **VERIFIED:** package-manifest correction removed unrelated dependency drift from the PR diff.
- **UNKNOWN:** GitHub Actions workflow result for the latest PR head remains pending.
- **UNKNOWN:** final browser pixel evidence for the new commit remains pending.
- **UNKNOWN:** physical-device rendering remains pending.
- **VERIFIED:** no Vercel deployment was intentionally triggered.

## Exact next task
Run the complete repository quality gate for the latest PR #25 head, inspect Heritage browser screenshots at supported viewports and content states, fix only evidence-backed Heritage defects, then update the continuity state and stop. Do not start another template.
