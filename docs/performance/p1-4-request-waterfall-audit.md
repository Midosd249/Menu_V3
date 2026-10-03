# P1.4 Request Waterfall Audit — 2026-10-03

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

## Verification limitations

Source and GitHub inspection prove the duplicate existed and that the child calls were removed. They do not prove an exact browser request count, DCL/LCP, or end-to-end network waterfall. Those remain UNKNOWN until browser-capable QA is performed.
