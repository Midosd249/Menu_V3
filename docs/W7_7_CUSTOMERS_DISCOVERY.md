# W7.7 Customers Discovery

## Status
`VERIFIED` — discovery completed against branch `w7-2-internal-design-system` at HEAD `c07cbb0f14028693631f3e784f360fa73e3ecab2` before W7.7 implementation.

## Request classification
- Classification: internal Studio workspace / customer-relationship UX consolidation.
- Research level: `Focused` — repository-first, project-memory/design-system review, current route/data inspection, and WCAG 2.2 accessibility reference.
- Scope: existing `/studio/guests` presentation and directly related Customers navigation/tests/docs only.

## Actual routes

`VERIFIED`
- `/studio/guests` — the only existing Customers/Guests Studio route.
- `/studio/growth`, `/studio/intelligence`, `/studio/intelligence-actions`, `/studio/analytics`, `/studio/reports` exist but are Growth/reporting surfaces, not Customers child routes.
- No generated or source route was found for `/studio/loyalty`, `/studio/campaigns`, `/studio/feedback`, or `/studio/retention`.
- `src/routeTree.gen.ts` includes `/studio/guests` and the other verified Studio routes.

## Actual components

`VERIFIED`
- `src/routes/studio/guests.tsx` was the previous single-page Guests presentation and called `getGuestRelationshipOverview` directly.
- W7.7 moves presentation into `src/components/studio-customers-workspace.tsx` while preserving `/studio/guests`.
- `src/components/studio-shell.tsx` already exposes Customers as a first-class desktop workspace and keeps Loyalty/Campaigns/Feedback/Retention out of navigation.
- Existing W7.2 internal design-system primitives are reused; no parallel component system is introduced.

## Actual data sources

`VERIFIED`
- `getGuestRelationshipOverview({ data: {} })` is the existing server-authorized source.
- It reads real tenant/branch-scoped `guest_profiles`, `guest_feedback`, `guest_loyalty_accounts`, and `guest_campaigns` data.
- `guest_profiles` is built from real order/customer contact data by the existing R9 migration trigger/backfill.
- The overview returns: profiles, repeat guests, active 30d, lapsed 60d+, average order value, feedback count/rating, loyalty members/points, campaign drafts, and an evidence state.

## Permissions and security

`VERIFIED`
- `getGuestRelationshipOverview` uses `authMiddleware`.
- Membership is resolved server-side with `getMembership`.
- Access is restricted to `owner` / `admin` roles.
- Optional branch scope is checked with `canAccessBranch`.
- R9 relationship tables use RLS and public access is revoked by the existing migration.
- W7.7 does not change any of these boundaries.

## Capability classification

| Capability | Evidence | W7.7 treatment |
|---|---|---|
| Guest overview | `/studio/guests` + server overview | `VERIFIED` — integrated as Customers Workspace |
| Guest list/detail | No route or existing server list/detail source | `NOT_AVAILABLE` — explicitly documented, not invented |
| Loyalty | Existing R9 table + aggregate overview | `VERIFIED` — shown only as real aggregate capability state; no dead route |
| Campaigns | Existing R9 draft table + aggregate count | `VERIFIED` — shown as real draft state; no send action invented |
| Feedback | Existing R9 table + aggregate count/rating | `VERIFIED` — shown as real recorded signal; review status detail is not claimed |
| Retention | Existing evidence flag + guest recency aggregates | `VERIFIED` — descriptive evidence only; no predictive score/cohort invented |
| Segments/cohorts/CLV/churn | No supporting route/source in current Customers surface | `NOT_AVAILABLE` |

## Intentional omissions

`VERIFIED`
- No standalone Loyalty, Campaigns, Feedback, or Retention links were added.
- No customer search/filter UI was added because no real customer-list source exists in the current route/data contract.
- No guest detail panel was added because no existing detail route or safe reusable customer detail source exists.
- No campaign creation/send action was added.
- No feedback moderation/reply action was added because the current source exposes aggregate feedback only.
- No retention rate, churn score, cohort, segment, CLV, conversion, or recommendation was added.

## State model

`VERIFIED`
- Loading → `LoadingState`.
- Permission denied → `PermissionDeniedState` when the existing server function returns `forbidden`.
- Other server failure/unavailable → `ErrorState` with retry.
- No guest records → `EmptyState` with the explicit distinction that no recorded guest profiles does not mean no restaurant customers.
- Populated state → only values returned by the existing overview source.
- Unsupported independent routes/features → explicitly described as unavailable rather than represented by dead links.

## Accessibility / responsive design basis

`VERIFIED`
- Arabic RTL is the default; existing language switching preserves English LTR.
- Logical layout and existing internal primitives are reused.
- Focus-visible controls, semantic headings, accessible state roles, and no-overflow checks are included.
- The W7.7 browser matrix follows the established 390×844, 430×932, 768×1024, and 1280×800 Studio QA pattern.
- W3C WCAG 2.2 guidance confirms minimum target sizing and focus-not-obscured requirements for interactive UI; W7.7 keeps important controls at the existing project touch-target baseline.

## UNKNOWN / BLOCKED
- `UNKNOWN`: physical real-device Android/iOS QA remains release-stage evidence.
- `UNKNOWN`: the current source does not expose individual guest detail/list actions, so those cannot be visually verified or added without a future data-contract task.
- `BLOCKED`: none for the authorized W7.7 presentation scope.

## Boundary
No production database/schema, Supabase, RLS, authentication, authorization, subscriptions, AI provider/business logic, orders business logic, public menu, Platform Admin, dependency, route URL restructuring, merge, or deployment is part of W7.7.
