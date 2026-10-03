# P1.4 Request Waterfall Audit — 2026-10-03 — CLOSED / VERIFIED

## Scope
Repository-first audit of request boundaries across public menu, Studio, Admin, Auth, preview, and not-found flows. No browser request count is claimed from source inspection.

| Flow | Existing request boundary | Finding | Action |
|---|---|---|---|
| /studio/* parent | StudioGate -> getMyStudio() | Shared authorized StudioSnapshot already available to children | Preserve |
| /studio/ | getOwnerAnalytics() + getOrdersDashboard() | Calls launch independently; no proven waterfall | Preserve |
| /studio/analytics | StudioGate + analytics + Order Value tenants + Order Value analytics | Duplicate Studio snapshot request was proven; Order Value analytics depends on selected tenant | Fixed duplicate only |
| /studio/reports | StudioGate + analytics | Duplicate Studio snapshot request was proven | Fixed duplicate |
| /studio/team | getTeamMembers() + listTeamInvitations() | Already Promise.all; no waterfall proven | Preserve |
| /studio/preview | StudioGate + getOwnerPreviewMenu() | Payloads overlap, but replacing the boundary is not proven to reduce requests or improve UX | Defer |
| /admin | Platform-admin dashboard plus tab-specific operations | Dedicated server functions and server-side authorization exist; runtime waterfall not measured | No change |
| /login and auth | useCurrentUserState() / refreshCurrentUser() | 15s cache and in-flight sharing already deduplicate session reads | Preserve |
| Public menu | SSR getPublicMenu() loader | P1.1 already removed the known hydration duplicate when initialMenu exists | Preserve |
| not-found | No dedicated not-found source was found in repository search | Runtime boundary not established from source alone | UNKNOWN |

## Proven P1.4 issue

StudioGate and Analytics/Reports previously requested the same full StudioSnapshot independently. The fix reuses useStudio().snapshot and leaves analytics as its own loading boundary.

## Security boundary

No client-supplied tenant, branch, role, permission, or entitlement was introduced. The reused snapshot originates from the existing server-authorized getMyStudio() call inside StudioGate.

## External framework evidence

Official TanStack Router documentation confirms route loaders are loaded in parallel at the route level and preload/navigation can share in-flight loader work. This supports using existing route/context boundaries instead of speculative client fetch orchestration.

## Verification

- VERIFIED: GitHub Quality #2824 passed, including typecheck, full tests, lint, production build, Studio/Admin browser QA, theme/browser QA, and performance fixtures.
- VERIFIED: W9 Orders QA #949 passed, including Orders browser QA.
- VERIFIED: final PR #370 diff was reviewed and squash-merged into `main` as `1bb30fc675ee2cdf448cba380223dd00240dee0a`.
- UNKNOWN: these CI browser suites do not establish a production-like exact request count for this P1.4 change, nor production DCL/LCP. Those remain runtime evidence gaps.

## P1.4 closeout

The task is closed. No additional request consolidation was introduced without stronger evidence. The next performance task is P1.5 Database Query Consolidation and Pagination.
