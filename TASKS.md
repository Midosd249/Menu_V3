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
- VERIFIED: R8.1 Action Loop, R8.2 Evidence-based Recommendations, R8.3 Experiment Expansion, R8.4 Evidence-based Upsell, and R8.5 Restaurant Discovery are complete and protected.

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
- VERIFIED: created `docs/W7_SOURCE_SWEEP.md`.
- VERIFIED: created `docs/W7_1_IA_AUDIT.md`.
- VERIFIED: created `docs/W7_1_ROUTE_MAP.md`.
- VERIFIED: created `docs/W7_1_WIREFRAMES.md`.
- VERIFIED: `/admin` is a tab-driven monolith with 12 tab/pseudo-route states.
- VERIFIED: `/studio/growth` and `/studio/guests` source files exist but are absent from the checked-in generated route tree.
- PROPOSED: Studio hierarchy = Home, Menu, Orders, Growth, Customers, Settings.
- PROPOSED: Appearance and Publishing are consolidated subdomains.
- PROPOSED: mobile primary navigation = Home, Menu, Orders, Growth, More.
- BLOCKED: Mobbin direct MCP inspection was unavailable/paid.
- VERIFIED: no UI implementation or route change occurred.

### W7.2 — ACCEPTED / VERIFIED

- VERIFIED: created route-independent shared internal primitives in `src/components/internal-design-system.tsx`.
- VERIFIED: created `docs/W7_2_INTERNAL_DESIGN_SYSTEM.md` and `docs/W7_2_COMPONENT_INVENTORY.md`.
- VERIFIED: added `tests/internal-design-system-contract.test.mjs` for static contract coverage.
- VERIFIED: no pages were migrated and no Studio/Admin navigation behavior changed during W7.2.
- VERIFIED: no route, router configuration, backend, RLS, auth, permissions, subscription, AI, orders, or public menu code changed.
- VERIFIED: no dependency was added.
- VERIFIED: `npx vite build --mode development` generated Growth and Guests in the TanStack route tree during GitHub Actions run `34898237425`.
- VERIFIED: generated `src/routeTree.gen.ts` was committed by generator-producing CI as `0b4057bbfabadff156fd7f2fd48ecf1e1d8c118d`.
- VERIFIED: route-tree freshness check, typecheck, tests, lint, and production build passed in the same run.
- VERIFIED: Growth and Guests are now safe to expose in Studio navigation.
- `DetailPanel` and `ConfirmDialog` remain deferred.

### W7.3 — IMPLEMENTATION IN PROGRESS

- VERIFIED: transformed `src/components/studio-shell.tsx` into the approved workspace architecture.
- VERIFIED: desktop primary workspaces = Home, Menu, Orders, Growth, Customers, Settings.
- VERIFIED: contextual groups expose only real routes for Menu, Growth, Customers, Appearance/Publishing, and Settings.
- VERIFIED: non-existent standalone Loyalty/Campaigns/Feedback/Retention/Restaurant/Subscription/Advanced routes were not invented.
- VERIFIED: mobile primary = Home, Menu, Orders, Growth, More using W7.2 `MobileBottomNav`.
- VERIFIED: W7.2 `WorkspaceNavigation` is reused for the desktop workspace layer.
- VERIFIED: existing permission gates remain active for settings/team destinations.
- VERIFIED: Platform Admin remains separate.
- VERIFIED: created `docs/W7_3_STUDIO_SHELL.md` and `docs/W7_3_NAVIGATION_MAP.md`.
- VERIFIED: created `tests/w7-3-studio-shell.test.mjs`.
- PENDING_BROWSER_QA: actual desktop/mobile/RTL/keyboard/focus validation remains.

## Exact Next Task
### W7.3 — Execute quality and browser verification, then review diff

Run route generation, generated-artifact freshness, typecheck, tests, lint, production build, navigation/component contract tests, and browser/visual/RTL/accessibility QA. Review forbidden-file changes and keep W7.4 untouched.

R7 remains active independently. R10 remains untouched.

## Working Rules
- `main` is source of truth.
- Use `VERIFIED`, `INFERRED`, `PROPOSED`, `UNKNOWN`, `BLOCKED`.
- Preserve completed work.
- One atomic task at a time unless the user explicitly names a complete milestone.
- Never claim deployment without direct deployment evidence.
- Reconcile continuity files against Git history at every session boundary.