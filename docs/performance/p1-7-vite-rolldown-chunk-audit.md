# P1.7 — Vite/Rolldown Chunk Optimization Audit

**Date:** 2026-10-03  
**Repository:** `Midosd249/Menu_V3`  
**Base:** `main` at `1f1dbc3a853efcfaa3aca620989635dcc3ffecc5`  
**Scope:** production client chunk graph only

## Classification

**VERIFIED:** P1.7 was started after P1.6 continuity closeout PR #374 was merged into `main`.

## Repository findings

- **VERIFIED:** `vite.config.ts` uses Vite `8.2.2` through the current lockfile and the production build is already running on Rolldown.
- **VERIFIED:** `vite.config.ts` already uses `tanstackStart()`; P1.3 previously established that TanStack Start provides automatic route code splitting.
- **VERIFIED:** no `manualChunks` or `rolldownOptions` chunk override currently exists.
- **VERIFIED:** Nitro production/preview configuration currently uses `inlineDynamicImports: true` for the SSR/Nitro environment because of the documented existing `ssr_exports` runtime issue. This remains protected and was not changed.

## Production client baseline

GitHub Quality run #2846 / job #111286147999 built the current merged P1.6 continuity head.

The production client build reported **142 client JavaScript asset rows** in the Vite output listing. The largest client chunks were:

| Chunk | Raw | Gzip |
|---|---:|---:|
| `index-BDOzjaAe.js` | 272.62 kB | 88.49 kB |
| `schemas-CjBuQMJL.js` | 81.30 kB | 22.62 kB |
| `menu-Cmv8vNcM.js` | 44.25 kB | 11.44 kB |
| `admin-pTn1_c7L.js` | 40.86 kB | 11.10 kB |
| `middleware-Ch4D3HsJ.js` | 38.88 kB | 12.60 kB |
| `admin-BVKVoyhS.js` | 36.50 kB | 9.24 kB |
| `public-menu-BTFv3aEd.js` | 34.90 kB | 9.88 kB |
| `client-BYbkFW30.js` | 33.49 kB | 12.64 kB |

**VERIFIED:** no client chunk exceeded Vite's default 500 kB warning threshold. The largest client chunk was approximately 54.5% of that threshold.

## Rolldown/Vite research

- **VERIFIED:** Vite 8 uses Rolldown for production builds.
- **VERIFIED:** Rolldown automatic code splitting is enabled by default.
- **VERIFIED:** manual `output.codeSplitting` groups can change chunk boundaries, but Rolldown warns that manual splitting can change application behavior when side effects/order-sensitive modules are involved.
- **VERIFIED:** `manualChunks` is a deprecated Rollup-compatibility path in current Rolldown guidance; `output.codeSplitting` is the supported mechanism.
- **VERIFIED:** a `minSize`/vendor/common grouping can create additional shared chunks and therefore additional browser requests.

## Decision

**VERIFIED:** no safe P1.7 code-level chunking change is justified by the current evidence.

Reasoning:

1. Automatic route/code splitting is already active.
2. The largest client chunk is 272.62 kB raw / 88.49 kB gzip, below the configured/default 500 kB warning threshold.
3. The current evidence does not identify duplicated module ownership inside that chunk.
4. A speculative vendor/common split could increase request count and cache fragmentation without proving a net improvement.
5. The repository contains SSR/Nitro chunking constraints; broad bundler changes would increase regression risk without a measured client benefit.

## Protected decisions

No change to:

- `vite.config.ts`
- route splitting
- `tanstackStart()`
- Nitro `inlineDynamicImports`
- SSR/client boundaries
- auth/RLS
- tenant/branch isolation
- themes/CSS
- database/schema/migrations
- deployment configuration

## Remaining measurement gap

**UNKNOWN:** browser-level initial JS transfer, client transition requests, cache reuse, main-thread execution cost, and route-specific chunk dependency graphs are not established by the build listing alone.

Those measurements belong to the later performance-gate work unless new evidence identifies a concrete chunk regression.

## P1.7 conclusion

**CLOSED / VERIFIED — NO CODE CHANGE REQUIRED.**

The correct optimization at this evidence level is to preserve Rolldown's automatic chunking rather than introduce speculative manual groups.

**Exact next task:** P1.8 — Performance Gates.
