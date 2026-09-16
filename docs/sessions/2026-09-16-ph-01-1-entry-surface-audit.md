# PH-01.1 — Entry Surface Audit

Date: 2026-09-16
Plan: `PH`
Status: `DONE`
Execution boundary: audit/planning only

## 1. Scope and Evidence

`VERIFIED`: This audit was performed against the current `main` commit `25f2f1db404bebc79ec7535e5e3eff8ae3d91b0d` and the current PH plan branch `docs/ph-self-serve-customer-lifecycle-plan`.

`VERIFIED`: PR #158 is open, Draft, unmerged, and targets `main`.

`VERIFIED`: PR #157 is merged into `main` at `25f2f1db404bebc79ec7535e5e3eff8ae3d91b0d`; no change was made to PR #157 or its merged runtime code.

`VERIFIED`: The current repository still contains the approval lifecycle implementation from PR #157. The audit therefore treats the repository implementation as the current baseline rather than assuming the previously documented self-serve branch is active.

`VERIFIED`: No runtime code, database schema, migration, authentication, authorization, production data, deployment configuration, pricing, billing, trials, AI, Admin workflow, invoice, WhatsApp, or menu-creation change was made by this audit.

## 2. Canonical PH-01 Target

The approved target is:

```text
Landing
  ├─ ابدأ مجانًا → /login?mode=signup
  │    → registration
  │    → account/workspace provisioning in a later phase
  │    → Studio
  │
  └─ تسجيل الدخول → /login
       → authenticate existing account
       → active tenant membership
       → Studio
```

`VERIFIED`: The public lead/contact form remains a separate sales/contact path.

`PROPOSED`: Customer-facing copy should consistently expose the two primary account actions as `ابدأ مجانًا` and `تسجيل الدخول`; equivalent wording such as `دخول` may remain only where it is unambiguous and intentionally part of the navigation hierarchy.

## 3. Entry-Surface Inventory

| Surface | Route/component | User type | Current behavior | PH-01 target | Status | Required change | Phase | Risk |
|---|---|---|---|---|---|---|---|---|
| Landing primary CTA | `/` — `src/routes/index.tsx` | New visitor | Hero CTA `ابدأ مجانًا` links to `/login` with `mode=signup`. | Same direct path to registration. | VERIFIED | Preserve route; later align surrounding copy if needed. | PH-01.1 | Low |
| Landing sign-in | `/` — `src/routes/index.tsx` | Existing customer | Signed-out header shows `دخول` → `/login`; signed-in header shows `الاستوديو` → `/studio`. | Existing customer uses login; authenticated customer goes to Studio. | VERIFIED | Optional copy normalization only. | PH-01.1 | Low |
| Landing navigation | `/` — `src/routes/index.tsx` | All visitors | Main navigation exposes Features/Themes/How it works/Pricing/FAQ; mobile navigation mirrors these sections. | Account actions remain visually primary; informational navigation stays secondary. | VERIFIED | No runtime change required by audit. | PH-01.1 | Low |
| Landing contact/request form | `/` — `src/routes/index.tsx` | Sales/contact visitor | `submitLead` sends business/contact details through the existing public lead path. | Remains separate from account registration. | VERIFIED | Do not merge with signup. | PH-01.1 | Medium compatibility |
| Pricing header CTA | `/pricing` — `src/routes/pricing.tsx` | Visitor evaluating plans | Header CTA says `ابدأ الآن` / `Get started` and links to `/login` without `mode=signup`, therefore the login route defaults to sign-in mode. | Account entry must be unambiguous; a new-customer CTA should reach signup, while existing customers should use login. | CONFLICT | Resolve copy/target during a later scoped UI change; do not change in this audit. | PH-01.1 finding; implementation later | Medium |
| Pricing plan CTA | `/pricing` — `src/routes/pricing.tsx` | Visitor evaluating plans | Free CTA returns to `/`; paid plans use `Request upgrade` back to `/`. | Pricing should not silently become a separate account-creation path; detailed commercial flow is later PH-03. | VERIFIED | Keep commercial behavior out of PH-01.1. | Later PH-03 | Medium |
| Login route | `/login` — `src/routes/login.tsx` | New/existing customer | Supports `mode=signup`; default is sign-in. Existing authenticated users are redirected to `/studio`, except valid invite token handling. | New visitor can select signup; existing customer goes to Studio. | VERIFIED | Later refactor signup contract in PH-01.2; preserve safe authenticated redirect. | PH-01.1 / PH-01.2 | High |
| Signup fields | `/login` — `src/routes/login.tsx` | New customer | Current form has full name, Saudi phone, email, password, confirmation. Brand name is not collected here. | Six required fields include brand/restaurant name. | CONFLICT | Add/relocate brand-name capture as part of PH-01.2 contract. | PH-01.2 | High |
| Signup success | `/login` — `src/routes/login.tsx` | New customer | Better Auth signup succeeds, phone is persisted server-side, then navigation goes to `/onboarding`. | Successful registration must eventually create the workspace and hand off to Studio. | CONFLICT | Change only in PH-01.3 after PH-01.2 contract is complete. | PH-01.3 | High |
| Existing login | `/login` — `src/routes/login.tsx` | Existing customer | Email or phone/password authentication; successful sign-in navigates to `/studio`, or invite flow when `invite` exists. | Direct existing-customer login → Studio. | VERIFIED | Preserve authentication and invite boundaries. | PH-01.1 | High security |
| Authenticated visit to login | `/login` — `src/routes/login.tsx` | Already authenticated user | User is redirected to `/studio`; valid invite token takes precedence and routes to `/invite/$token`. | Must not expose/re-run ordinary signup for an authenticated customer. | VERIFIED | Preserve. | PH-01.1 | High security |
| Invite entry | `/invite/$token` — `src/routes/invite.$token.tsx` | Invited team member | Dedicated invitation flow exists and is routed from login when a valid invite token is present. | Remains a separate team-membership path, not customer self-serve signup. | VERIFIED | Keep separate; do not collapse into PH-01 customer signup. | Outside PH-01.1 runtime change | High |
| Customer lifecycle route | `/onboarding` — `src/routes/onboarding.tsx` | Signed-in account without tenant | Current route checks Studio/access state and presents activation-request, review, approval, and activation states. | Ordinary self-serve signup must not stop for approval; later self-serve flow may reuse route only if its role is deliberately redefined. | CONFLICT | Reconcile/remove approval dependency only in PH-01.7 after provisioning design. | PH-01.7 | Critical |
| Legacy query parameter | `/onboarding?new=1` | Historical/self-serve path | Historical documentation records this parameter as a previous self-serve entry that called the retired workspace path. Current `onboarding.tsx` does not read `new` directly. | No query parameter should authorize workspace creation. | VERIFIED + UNKNOWN | Keep non-authoritative; audit all external links before removing or repurposing. | PH-01.7 | Critical |
| Legacy token onboarding | `/onboarding/$token` — `src/routes/onboarding/$token.tsx` | Legacy approved customer | Existing secure registration-link fallback can create/activate a legacy workspace after authentication. | Must remain isolated from primary new-customer self-serve entry unless a later decision retires it. | VERIFIED | Preserve for compatibility; do not reuse its authorization mechanics for signup. | PH-01.7 / compatibility | Critical |
| Studio protected handoff | `/studio` + `src/lib/menu/studio.tsx` | Authenticated customer | `StudioGate` requires a user; `getMyStudio()` resolves active membership; no tenant routes non-admin users to `/onboarding`; platform admins route to `/admin`. | New self-serve customer should reach Studio only after authoritative workspace/membership creation. | VERIFIED | Preserve gate; later provisioning must satisfy it server-side. | PH-01.3 / PH-01.4 | Critical |
| Direct Studio without tenant | `/studio` | Authenticated account without workspace | User is not granted Studio; non-admin is sent to `/onboarding`. | During future self-serve flow this must become a safe provisioning/setup handoff, not unauthorized access. | VERIFIED | Change only with PH-01.3/PH-01.4 architecture. | PH-01.3 / PH-01.4 | Critical |
| Workspace creation server entry | `src/lib/menu/owner.ts` — `createRestaurant` | Authenticated caller | Exported server function can create tenant/membership/branch/hours when database policy permits; current customer lifecycle tests confirm `/onboarding` no longer calls it. | Future self-serve provisioning must use a new authoritative/idempotent path, not blindly expose the legacy creation function. | CONFLICT | Audit/contain/replace as part of secure provisioning. | PH-01.3 / PH-01.7 | Critical |
| Registration phone persistence | `src/lib/auth/customer-registration.ts` | New customer | Authenticated server function normalizes Saudi number, rejects conflicting phone, stores `+966...`, marks unverified. | Remains part of registration contract with server validation. | VERIFIED | Contract expansion belongs to PH-01.2. | PH-01.2 | High |
| Public lead path | `submitLead` from `/` | Sales/contact visitor | Writes lead/contact information to the existing lead path. | Separate from account signup and workspace creation. | VERIFIED | Preserve separation. | PH-01.1 | Medium |
| Platform Admin activation queue | `/admin/onboarding` | Platform Admin | Current unified activation-request queue supports approval/rejection/action-required plus legacy requests. | Ordinary self-serve customers should not be presented as awaiting approval. Admin visibility is later PH-01.6/PH-02. | VERIFIED as legacy/current baseline | Do not modify in PH-01.1. | PH-01.6 / PH-02 | High |
| Main Admin CTA | `/admin` — `src/routes/admin.tsx` | Platform Admin | Button `اعتماد العملاء الجدد` calls `selectTab("leads")`, mapping to `/admin/leads`; current dedicated activation queue is `/admin/onboarding`. | New self-serve customers should eventually appear in customer visibility, not an approval-only queue. | CONFLICT / compatibility finding | Resolve in PH-01.6/PH-02 after customer record model is defined. | PH-01.6 / PH-02 | Medium |
| Admin login redirect | `/admin` and child admin routes | Platform Admin | Admin routes send signed-out users to `/login` with a `redirect` query; login currently does not consume that parameter and defaults successful sign-in to Studio. | Admin routing must remain safe; arbitrary client redirect must not be introduced. | VERIFIED safety; UNKNOWN UX | Treat as separate Admin UX issue, not PH-01 customer routing. | Outside PH-01.1 | Medium |

## 4. Current vs Target Behavior Matrix

| Journey | Current verified state | PH-01 target | Result |
|---|---|---|---|
| New visitor → `ابدأ مجانًا` | `/login?mode=signup` | Same | VERIFIED / aligned |
| New visitor → registration | Full name + phone + email + password + confirmation | Same plus required brand name | CONFLICT / PH-01.2 |
| New signup → workspace | Signup → `/onboarding`; approval lifecycle blocks workspace | Account → workspace → Studio | CONFLICT / PH-01.3 + PH-01.7 |
| Existing customer → login | Successful email/phone login → `/studio` | Same | VERIFIED / aligned |
| Existing authenticated user → `/login` | Redirect → `/studio` unless invite | Do not show signup | VERIFIED / aligned |
| Customer without tenant → `/studio` | Redirect → `/onboarding` | Safe provisioning/setup path, never unauthorized Studio | VERIFIED gate; future change |
| Public contact form | Separate `submitLead` path | Separate | VERIFIED / aligned |
| Legacy registration token | `/onboarding/$token` remains fallback | Keep isolated from primary self-serve | VERIFIED / compatible |
| Query-based self-serve authorization | Historical `new=1` existed; current route does not use it | Query must never authorize workspace creation | VERIFIED security principle |
| Workspace creation | Legacy `createRestaurant` remains in server domain code; customer onboarding no longer calls it | New authoritative/idempotent provisioning path | CONFLICT / PH-01.3 |
| Admin new-customer visibility | Current activation queue is approval-oriented; main Admin CTA still points to legacy leads | Customer record visibility without approval semantics | CONFLICT / PH-01.6 / PH-02 |

## 5. Arabic RTL / English LTR Audit

`VERIFIED`: `/login` and `/onboarding` explicitly set `dir` from the active language: Arabic → `rtl`, English → `ltr`.

`VERIFIED`: Login/signup labels, headings, errors, helper text, and mode-switch copy have Arabic and English variants.

`VERIFIED`: Landing page uses the shared language context and provides Arabic/English labels for its primary navigation and CTA.

`VERIFIED`: The current registration route has no separate signup route; mode is selected through `mode=signup`.

`UNKNOWN`: Browser-level visual proof for the exact PH-01 signup interaction at physical device level is not available from this audit. Existing W7/W8 browser evidence does not prove the new future self-serve flow because the current `main` still implements the approval lifecycle.

`PROPOSED`: PH-01.2 must test Arabic-only, English-only, and mixed-direction names/brand names while preserving the route-level language and document direction contract.

## 6. Mobile / Navigation Audit

`VERIFIED`: Landing uses a mobile menu at `md:hidden` and preserves account actions in the header.

`VERIFIED`: Login uses a single-column mobile-first form with responsive max width and language toggle.

`VERIFIED`: Studio has existing mobile navigation and responsive protections from W7/W8; the Studio gate itself is not the mobile defect surface identified by this audit.

`UNKNOWN`: Physical Android/iOS interaction with the future self-serve flow is not verified and is correctly deferred to release-stage device QA.

`PROPOSED`: PH-01.2/PH-01.3 browser coverage should include at least 320px-class narrow mobile, 390px-class standard mobile, 430px-class large mobile, tablet, and desktop states, with Arabic RTL, English LTR, and mixed-direction input.

## 7. Dead Links / Contradictory Copy / Duplicate CTA Findings

### Finding A — Pricing `ابدأ الآن`

`VERIFIED`: `/pricing` has a CTA labelled `ابدأ الآن` / `Get started` that links to `/login` without `mode=signup`. Because `/login` defaults to sign-in mode, this is semantically ambiguous for a new customer.

`PROPOSED`: During a later focused UI change, either make the label explicitly `تسجيل الدخول`/`Sign in` or route a clearly new-customer CTA to `/login?mode=signup`. Do not change it during PH-01.1.

### Finding B — Signup copy still describes approval

`VERIFIED`: `/login` signup copy says the user creates an account first and then submits a brand activation request, with no restaurant workspace before approval.

`VERIFIED`: `/onboarding` copy states that Studio remains unavailable until approval.

`CONFLICT`: Both contradict the approved PH-01 target. The correction belongs to PH-01.7 and the provisioning work, not this audit.

### Finding C — Existing `/onboarding` route is still approval-oriented

`VERIFIED`: The route supports `pending`, `action_required`, `approved`, `rejected`, and `converted` states and exposes activation actions.

`CONFLICT`: It cannot remain the ordinary mandatory post-signup gate under the new self-serve product decision.

### Finding D — Admin CTA naming/routing mismatch

`VERIFIED`: The main Admin button says `اعتماد العملاء الجدد` but routes to the legacy `leads` tab, while `/admin/onboarding` contains the dedicated activation queue.

`PROPOSED`: This should be reconciled only when PH-01.6/PH-02 defines the final customer visibility surface. It is not a reason to modify Admin during PH-01.1.

### Finding E — No dedicated `/signup` route

`VERIFIED`: No `createFileRoute("/signup")` was found. Signup is intentionally a mode of `/login`.

`PROPOSED`: Keep one auth surface unless implementation evidence later shows a dedicated route materially improves clarity without duplicating authentication logic.

## 8. Security-Sensitive Navigation Findings

`VERIFIED`: Current `/login` does not use a client-controlled `redirect` query to authorize Studio or tenant access. Successful normal sign-in routes to `/studio`.

`VERIFIED`: Valid invite tokens are handled separately through `/invite/$token` and do not become a general tenant-selection mechanism.

`VERIFIED`: `StudioGate` resolves the authenticated user and server-side membership before exposing Studio content.

`VERIFIED`: Current customer lifecycle documentation and tests establish that signup alone must not create a tenant under the merged PR #157 architecture.

`VERIFIED`: The historical `self_serve_registration_grants` mechanism remains in migration history but is no longer issued by signup; the retired `create_self_serve_workspace` function must not be restored as the PH-01 solution.

`UNKNOWN`: Whether the exported legacy `createRestaurant` server function is externally invokable without an application import was not established by source search alone. This is a PH-01.3/PH-01.7 implementation/security question, not a basis for changing it now.

`PROPOSED`: PH-01.3 must establish one authoritative provisioning boundary where user identity, tenant identity, membership, branch, and subscription initialization are server/database controlled and retry-safe.

## 9. Related Files Map

### PH-01.1 audit / entry surfaces

- `src/routes/index.tsx`
- `src/routes/login.tsx`
- `src/routes/pricing.tsx`
- `src/routes/onboarding.tsx`
- `src/routes/onboarding/$token.tsx`
- `src/routes/invite.$token.tsx`
- `src/lib/auth/gates.tsx`
- `src/lib/auth/customer-registration.ts`
- `src/lib/menu/studio.tsx`
- `src/lib/menu/owner.ts`
- `src/routeTree.gen.ts`
- `tests/customer-lifecycle.test.mjs`

### Later PH-01 work

**PH-01.2 — Registration Contract**
- `src/routes/login.tsx`
- `src/lib/auth/customer-registration.ts`
- Better Auth integration under `src/lib/auth/`
- registration/customer lifecycle tests

**PH-01.3 — Secure Workspace Provisioning**
- `src/lib/menu/owner.ts` and/or a new focused server-side domain module if justified
- `migrations/` only if required by the authoritative provisioning design
- tenant/member/branch/subscription data paths
- authorization/RLS/security tests

**PH-01.4 — Existing Customer Login**
- `src/routes/login.tsx`
- `src/lib/auth/gates.tsx`
- `src/lib/auth/use-current-user.ts`
- `src/lib/menu/studio.tsx`
- login/auth regression tests

**PH-01.5 — Studio Setup Guidance**
- existing Studio shell/workspace components and supported destination routes
- no duplicate setup system unless current architecture requires one

**PH-01.6 — New Customer Platform Admin Visibility**
- `src/routes/admin.tsx`
- `src/routes/admin/onboarding.tsx`
- `src/lib/menu/admin.ts`
- `src/lib/menu/platform.ts`
- authoritative account/tenant/subscription data sources

**PH-01.7 — Remove/Bypass Legacy Approval Dependency Safely**
- `src/routes/onboarding.tsx`
- `src/routes/onboarding/$token.tsx`
- `src/lib/menu/customer-lifecycle.ts`
- `src/lib/menu/platform-onboarding.ts`
- relevant approval migrations/functions and regression tests
- historical `self_serve_registration_grants` migrations remain protected history unless a later explicit migration safely changes behavior

**PH-01.8 — Verification Gate**
- repository quality scripts in `package.json`
- `tests/customer-lifecycle.test.mjs`
- relevant Playwright/browser specs
- auth/security/tenant isolation tests

## 10. PH-01.2 Readiness Recommendation

`PROPOSED`: PH-01.2 is **READY TO START**, subject to the following fixed boundary:

1. Treat the six-field registration contract as authoritative: full name, brand/restaurant name, Saudi phone, email, password, confirmation.
2. Preserve the existing Better Auth identity creation and server-side Saudi phone persistence security properties.
3. Do not create the workspace in PH-01.2; PH-01.2 defines and verifies the registration contract only.
4. Do not restore `self_serve_registration_grants` or `create_self_serve_workspace`.
5. Define safe duplicate-email and duplicate-phone behavior without account enumeration leakage.
6. Keep `mode=signup` as a navigation hint only; it must never authorize tenant/workspace creation.
7. Remove approval-oriented signup copy only as part of the authorized PH-01 implementation boundary when the registration contract is changed.
8. Keep pricing, billing, trials, entitlements, Admin lifecycle controls, invoices, WhatsApp, AI, and menu creation out of PH-01.2.

`VERIFIED`: PH-01.2 and every later PH step remain `TODO` in the approved plan. This audit does not activate or begin any of them.

## 11. Closure

`DONE`: PH-01.1 Entry Surface Audit is complete.

`VERIFIED`: No runtime implementation was changed.

`VERIFIED`: No database or migration was changed.

`VERIFIED`: No authentication or authorization behavior was changed.

`VERIFIED`: No production data was mutated.

`VERIFIED`: No Vercel deployment was triggered intentionally.

`VERIFIED`: PR #157, W8, and W9 merged/protected runtime work were not modified.

`UNKNOWN`: Physical real-device verification of the future self-serve flow remains pending and must not be claimed from this audit.

`UNKNOWN`: Direct Vercel Production serving state remains outside this audit and was not needed for the entry-surface findings.

## Exact Next Action

`PH-01.2 — Registration Contract` remains `TODO` and requires a separate explicit owner authorization before implementation begins.
