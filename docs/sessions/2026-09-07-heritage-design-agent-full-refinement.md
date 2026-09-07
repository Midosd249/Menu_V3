# Session Log — 2026-09-07 — Heritage Design Agent Full Refinement

## Current position
- **VERIFIED:** Heritage is the active atomic template refinement target.
- **VERIFIED:** source is `Midosd249/Menu_V3`.
- **VERIFIED:** supplied evidence is a 695×1536 mobile screenshot; exact physical browser/device is UNKNOWN.

## Audit
- **VERIFIED:** supplied screenshot shows an oversized white logo block, dominant cover imagery, compressed kicker metadata, and weak first-screen menu utility.
- **VERIFIED:** `contemporary-restaurant.tsx` provides dedicated hero media/logo classes, while existing Heritage presentation rules did not explicitly isolate and bound the logo.
- **VERIFIED:** existing Heritage presentation included asymmetric card geometry that conflicts with stable scanning.
- **INFERRED:** the oversized logo effect is amplified by the light background of the supplied logo asset.

## Implementation
- **VERIFIED:** added `src/theme-heritage-hardening.css`, scoped exclusively to `data-menu-theme="heritage"`.
- **VERIFIED:** hero media is isolated as a bounded background layer.
- **VERIFIED:** brand logo is bounded, uses `contain`, and is protected from generic image positioning/filtering/transform behavior.
- **VERIFIED:** mobile hero density is reduced.
- **VERIFIED:** product cards use one stable horizontal geometry with fixed `4 / 3` media.
- **VERIFIED:** inherited alternating radii and layout transforms are neutralized without changing shared renderer behavior.
- **VERIFIED:** RTL/LTR and bidi-safe handling is preserved.
- **VERIFIED:** reduced-motion behavior remains explicit.
- **VERIFIED:** no database, auth/authz, subscription, tenant/branch, dependency, CI/CD, Vercel, environment, or deployment configuration was intentionally changed.

## Regression protection
- **VERIFIED:** added `tests/heritage-browser-hardening.test.mjs` and registered it in the default test suite.
- **VERIFIED:** no package dependency was added or upgraded.

## Integration
- **VERIFIED:** Heritage implementation was integrated into the canonical `main` after Noir had already been merged.
- **VERIFIED:** the integration used the current `main` tree as the base, preserving the newer Noir state.

## Verification
- **VERIFIED:** Noir was previously merged to `main` at commit `d2401a9276719bdab4305f89160aba2ca15f0b58`.
- **VERIFIED:** Heritage code/test integration is present in `main` at commit `6137082b307a42ac3b9fd15f96e95d7e327927e1`.
- **UNKNOWN:** a fresh GitHub Actions quality run for the direct main integration commit is not exposed yet.
- **BLOCKED:** Vercel status is currently blocked by the account's deployment-rate limit; no intentional deployment was triggered.

## Exact next task
Run the repository quality gate against the integrated `main` head when GitHub Actions evidence is available, then perform final visual/browser verification. Do not start another template.
