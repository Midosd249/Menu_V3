# TASKS

## Completed Strategic Tasks

- P0 Public Order Hardening — CLOSED / VERIFIED.
- P1 Production/Continuity Hardening — CLOSED / VERIFIED.
- P2 Growth & Differentiation — CLOSED / VERIFIED / DEPLOYED.
- Platform Approval Center — CLOSED / VERIFIED.
- Registration-link rendering — CLOSED / VERIFIED.
- Onboarding Creation Recovery — CLOSED / VERIFIED / MERGED.
- Menu Intelligence V5 Report Center — CLOSED / VERIFIED / MERGED.
- AI Provider Routing & Multimodal Fallback — CLOSED / VERIFIED / MERGED.
- Grounded Guest Menu Assistant — CLOSED / VERIFIED.
- Gallery + Noir Theme Hardening — CLOSED / VERIFIED / MERGED.
- Continuity reconciliation — CLOSED / VERIFIED / MERGED.

## R2 — Menu Intelligence Product Layer — CLOSED / VERIFIED

```text
R2.1 Menu Health / Completeness       DONE
R2.2 Problem Detection                DONE
R2.3 Priority + Actionable Fixes      DONE
R2.4 Owner Menu Intelligence UX       DONE
R2.5 Verified Analytics Intelligence  DONE
R2.6 Professional Analytics Reports   DONE
R2.7 WhatsApp Report Sharing          DONE
```

## R4 — Owner Intelligence — CLOSED / VERIFIED

```text
R4.1 Verified Owner Signals           DONE / VERIFIED
R4.2 Intelligence Action Center       DONE / VERIFIED
R4.3 Action Center Follow-through     DONE / VERIFIED
R4.4 Intelligence Data Quality        DONE / VERIFIED
R4.5 Owner Decision Loop              DONE / VERIFIED
```

## R5 — Growth Extensions — CLOSED / VERIFIED

- Deterministic distribution action for published zero-activity menus.
- Uses only existing OwnerAnalytics evidence and verified publication state.
- Reuses `/studio/brand`; no duplicate dashboard or route.
- No fabricated metrics or autonomous messaging.

## R6 — Experiments — CLOSED / VERIFIED

- Experiment: `whatsapp-cta-v1`.
- Stable `control` / `prominent` assignment from existing anonymous session id.
- Server derives the recorded variant.
- Participation is limited to published menus with configured WhatsApp.
- Existing `menu_events` remains canonical through nullable experiment fields.
- Preview/owner-preview does not activate or record the experiment.
- Primary metric: WhatsApp-click sessions / exposed sessions.
- Guardrail: product-view sessions / exposed sessions.
- Collection target: 50 exposed sessions per variant.
- Directional results only; no statistical significance claim.
- Production outcome remains UNKNOWN until real exposure accumulates.

## R7 — Initial Evidence Review — IN PROGRESS / NON-BLOCKING

- VERIFIED: canonical table is `menu_v3.menu_events`.
- VERIFIED: current observed exposure remains 1 distinct `control` session and 2 distinct `prominent` sessions.
- VERIFIED: no treatment decision is justified; continue eligible real exposure.
- R7 remains independent and must not be closed using synthetic or insufficient traffic.

## R8 — Closed-Loop Menu Growth Engine — CLOSED / VERIFIED / MERGED

- VERIFIED: `/studio/growth` provides the unified owner-facing Observe → Act → Measure surface.
- VERIFIED: recommendations are deterministic and grounded in existing analytics evidence.
- VERIFIED: thin traffic is explicitly treated as insufficient evidence.
- VERIFIED: recommendations route to existing supported Studio destinations; no automatic menu mutation.
- VERIFIED: R8.1–R8.5 are complete and protected.

## R9 — Guest Relationships — CLOSED / VERIFIED / MERGED

- VERIFIED: PR #136 merged into `main`.
- VERIFIED: owner-facing Studio guest relationship surface covers Guest CRM, Loyalty, Campaigns, Feedback, and Retention.
- VERIFIED: relationship data is server-authorized and tenant/branch scoped; owner/admin are the elevated roles in the existing permission contract.
- VERIFIED: loyalty accounts and ledger, owner-controlled campaign drafts, and feedback records use RLS with public access revoked.
- VERIFIED: retention and relationship overview are derived from real guest/order data; no synthetic evidence is introduced.
- VERIFIED: autonomous outbound messaging, automatic rewards, autonomous campaign execution, predictive claims, and pricing mutation are excluded.
- VERIFIED: final GitHub Actions quality run 1453 passed route generation, typecheck, 265 tests, lint, production build, Playwright runtime/Chromium, all-theme browser QA, performance artifact upload, and cleanup.
- VERIFIED: a PGlite portability failure from unconditional `anon`/`authenticated` role revocation was fixed without weakening Supabase security semantics.

## R10 — DEFERRED / NOT STARTED

R10 is intentionally not started. Do not begin R10 until the owner explicitly authorizes it.

## Production / Commercial Readiness — IN PROGRESS

- VERIFIED: repository-side R9 implementation and quality gates are complete.
- VERIFIED: canonical `main` contains the protected product work.
- UNKNOWN: direct current Vercel Production environment-variable values.
- UNKNOWN: current Production deployment commit/state requires direct Vercel evidence.
- UNKNOWN: physical real-device Production QA.
- BLOCKED: do not retry Vercel deployment while the known free daily deployment quota is exhausted.

## Protected Scope

- Essential, Editorial, Noir, Heritage/Taste, and Gallery.
- Public menu behavior, customer actions, authentication, authorization, tenant/branch isolation, routing, migrations, and deployment controls.
- Quick Add, Item Notes, Cart, Orders, Notifications, Import, AI provider infrastructure, Platform Admin security, subscription protection, and release-only Vercel workflow.
- Do not repeat completed work without current reproducible regression evidence.

## W7 — Internal Product Experience Architecture

### W7.1 — COMPLETE / ANALYSIS ONLY

- VERIFIED: audited current Studio/Admin architecture from `main` SHA `9995848b747bdb238e45b7ed6fe6b551c6779fcc`.
- VERIFIED: created W7.1 source sweep, IA audit, route map, and wireframe documents.
- VERIFIED: `/admin` is a tab-driven monolith and `/studio/growth` + `/studio/guests` source routes exist.
- VERIFIED: no UI implementation or route change occurred.

### W7.2 — ACCEPTED / VERIFIED

- VERIFIED: created route-independent shared internal primitives in `src/components/internal-design-system.tsx`.
- VERIFIED: created W7.2 design-system documentation and static contract coverage.
- VERIFIED: no pages were migrated and no Studio/Admin navigation behavior changed during W7.2.
- VERIFIED: no route, backend, RLS, auth, permissions, subscription, AI, orders, or public-menu code changed.
- VERIFIED: no dependency was added.
- VERIFIED: route generation run `34898237425` generated Growth and Guests and passed freshness, typecheck, tests, lint, and production build.
- VERIFIED: generator-produced route tree commit `0b4057bbfabadff156fd7f2fd48ecf1e1d8c118d` was used; no hand edit.
- `DetailPanel` and `ConfirmDialog` remain deferred.

### W7.3 — DONE / VERIFIED

- VERIFIED: transformed `src/components/studio-shell.tsx` into the approved workspace architecture.
- VERIFIED: desktop primary = Home, Menu, Orders, Growth, Customers, Settings.
- VERIFIED: contextual groups expose only real routes for Menu, Growth, Customers, Appearance/Publishing, and Settings.
- VERIFIED: non-existent standalone child routes were not invented.
- VERIFIED: mobile primary = Home, Menu, Orders, Growth, More using W7.2 `MobileBottomNav`.
- VERIFIED: existing permission gates remain active.
- VERIFIED: Platform Admin remains separate.
- VERIFIED: accepted GitHub Actions run `34905256209` passed all required quality gates and actual `/studio` browser QA.
- VERIFIED: temporary PGlite fixture solved the browser-only schema blocker and was removed from the runner; no production migration was committed.
- VERIFIED: physical device QA remains release-stage evidence only.

### W7.4 — IMPLEMENTATION IN PROGRESS / PENDING CI

- VERIFIED: created `src/components/studio-home.tsx` as the focused operational Home presentation component.
- VERIFIED: `/studio/` now renders `StudioHome` without changing the route URL.
- VERIFIED: Home reads only existing `useStudio`, `getOwnerAnalytics`, `getOrdersDashboard`, and `buildMenuGrowthAdvisor` sources.
- VERIFIED: added W7.4 focused contract test and browser spec.
- VERIFIED: Home contains loading, error, empty, populated, RTL/LTR, responsive, focus, and semantic progress states.
- VERIFIED: no fabricated metrics, sample orders, revenue, guests, conversion rates, recommendations, charts, rankings, or activity were added.
- VERIFIED: no database, Supabase, RLS, auth, permissions, subscriptions, AI, orders business logic, public menu, Platform Admin, dependency, merge, or deployment changes are in scope.
- PENDING_CI_VERIFICATION: current-head W7.4 quality and browser run must pass before W7.4 can be marked DONE.

## Exact Next Task
### W7.4 — Execute current-head quality and browser verification, then review diff

Run route generation, generated-artifact freshness, typecheck, repository tests, focused W7.4 contract tests, lint, production build, Studio Home browser QA, and final diff/forbidden-area review. Mark W7.4 DONE only after direct current-head evidence passes.

R7 remains active independently. R10 remains untouched.

## Working Rules
- `main` is source of truth.
- Use `VERIFIED`, `INFERRED`, `PROPOSED`, `UNKNOWN`, `BLOCKED`.
- Preserve completed work.
- One atomic task at a time unless the user explicitly names a complete milestone.
- Never claim deployment without direct deployment evidence.
- Reconcile continuity files against Git history at every session boundary.