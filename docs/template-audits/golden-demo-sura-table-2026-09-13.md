# Golden Demo Theme Compatibility Audit — 2026-09-13

## Scope

This audit covers the fictional `مائدة سُرى / Sura Table` Golden Demo applied to the authorized existing tenant `2e3f3c63-7dbd-4af2-920a-5f0c9ced8497`. The data contains 10 categories, 28 bilingual products, 5 Kids Menu products, empty image fields, nutrition disclosure, varied allergens, 2 sodium-derived high-salt cases, one unavailable item, modifier groups, and variants.

No image was generated, fetched, uploaded, or processed.

## Evidence

**VERIFIED:** Supabase direct checks confirmed one tenant, one branch, 10 categories, 28 products, zero orders, zero orphan products, zero duplicate Arabic names, zero invalid nutrition values, and zero non-empty image fields. The target user remains the owner.

**VERIFIED:** static repository contracts passed for the canonical five themes, shared renderer ownership, RTL/LTR language behavior, product wrapping, price consistency, image fallback, safe-area clearance, cart/order surfaces, and public-menu resilience.

**BLOCKED:** browser execution could not be completed. The Playwright package was initially absent; after local-only installation, its browser executable was also absent. The local PGlite development database additionally lacks the pre-existing `public_content_version` migration state, so the public route remained in a loading/error state. No visual pass or visual defect claim is made from source inspection alone.

## Theme results

| Theme | Static contract result | Visual browser result | Fix |
|---|---|---|---|
| Essential | PASS | BLOCKED | None; no defect evidenced |
| Editorial | PASS | BLOCKED | None; no defect evidenced |
| Noir | PASS | BLOCKED | None; no defect evidenced |
| Heritage / Taste | PASS | BLOCKED | None; no defect evidenced |
| Gallery | PASS | BLOCKED | None; no defect evidenced |

## Review findings

The content uses the existing shared public renderer and does not introduce theme-specific markup or CSS. Product names and descriptions remain within supported data fields, nutrition disclosure is presented as secondary information, unavailable state is represented by existing availability data, and all image URLs are empty so the existing fallback path is exercised by data rather than by a new asset.

No theme implementation change is justified without actual browser evidence. The next visual action is to provide a working Playwright browser binary or a connected authenticated/local browser environment after the PGlite schema is synchronized.

## Commands

```text
node --test tests/public-pages-themes-contract.test.mjs tests/theme-renderer-contract.test.mjs tests/public-menu-theme-coherence-refinement.test.mjs tests/public-menu-resilience.test.mjs tests/public-menu-price-consistency.test.mjs tests/public-order-hardening.test.mjs
```

Result: **19 passed, 0 failed**.

```text
node --experimental-strip-types --test src/lib/menu/analytics-integrity.test.ts src/lib/menu/seo.test.ts src/lib/menu/seo-discovery.test.ts src/lib/theme/registry.test.ts src/lib/theme/testing-access.test.ts
```

Result: **24 passed, 0 failed**.

The full repository test suite also passed: **263 passed, 0 failed**. `npm run typecheck`, `npm run build`, and `npm run lint` passed after restoring the lockfile dependencies.
