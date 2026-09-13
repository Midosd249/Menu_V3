# Studio Capability Discoverability — 2026-09-13

## Classification
- Atomic task: owner-facing Studio discoverability and R9 bilingual UX correction.
- Research level: Focused.
- Scope: existing Studio routes and owner navigation/accessibility only; no schema, auth, tenant isolation, subscription, deployment, or Vercel changes.

## Verified repository findings
- `main` before this task: `86a82ad94a9ef14a58ab792bddb3cbdbd2bbdd27`.
- Existing protected owner-facing routes include menu, import, options, branches, brand, design, QR, preview, intelligence, intelligence actions, analytics, reports, growth, guests, orders, team, and settings.
- `src/components/studio-shell.tsx` exposes only a subset of these routes in the primary navigation; several completed capabilities were reachable only by direct URL or secondary links.
- `src/routes/studio/guests.tsx` was English-only despite the application being Arabic-first and bilingual.
- R9 guest relationships remain owner-controlled and non-autonomous; this task does not add automatic messaging, rewards, pricing changes, predictive claims, or guest mutation.

## Implemented
- Added a bilingual `/studio` capability directory grouped into:
  - Menu & presentation
  - Intelligence, analytics & growth
  - Guest relationships
  - Operations & account
- Added direct links for every existing protected Studio route in the directory.
- Localized the R9 Guest Relationships page in Arabic and English, including Loyalty, Feedback/Reviews, Campaigns, and Retention.
- Added regression tests protecting route discoverability and bilingual/non-autonomous R9 behavior.

## Design decisions
- The Studio overview is the canonical capability map instead of adding another dashboard route.
- Existing route ownership and permissions remain unchanged.
- Direct access is descriptive: each link explains the purpose of the existing capability rather than exposing implementation terminology.
- The directory is responsive and uses existing design primitives; it does not replace the protected theme system.

## External research actually used
- Google Search Central Local Business guidance: structured data should describe real, visible business information and should be validated before production indexing.
- Schema.org Restaurant/LocalBusiness/Menu definitions: restaurant pages can expose real location, hours, contact, and menu relationships through appropriate structured data.
- Research was used as a quality lens only; no external UI, copy, assets, or proprietary implementation was copied.

## Acceptance criteria
- Every completed owner-facing Studio route has a clear entry point from `/studio`.
- R9 guest relationship UI is fully bilingual.
- Loyalty is explicitly represented in Arabic and English.
- Existing authorization, tenant/branch scoping, and non-autonomous boundaries remain untouched.
- Regression tests cover the route directory and bilingual R9 surface.

## Verification
- GitHub Actions quality gate is the release verification source for the branch.
- Vercel Preview was not intentionally used as the development loop; any automatically generated PR preview is treated only as incidental platform status.
- Production deployment is not claimed by this task.

## Status
- Implementation: `IMPLEMENTATION_IN_PROGRESS` until CI completes.
- Deployment: `UNKNOWN` for Production and intentionally not changed.
- R7: remains independent and active.
- R10: remains deferred.
