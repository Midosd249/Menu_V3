# TASKS

## Completed Tasks

### P0 — Public Order Hardening — CLOSED / VERIFIED
- Database-backed public-order rate limiting and idempotency are implemented.
- Server-side product, availability, variant, modifier, quantity, note, tenant, and price validation remains authoritative.

### P1 — Production/Continuity Hardening — CLOSED / VERIFIED
- Package manifest / lockfile reconciliation completed.
- GitHub `main` branch protection / required quality status completed.

### P2 — Growth & Differentiation — CLOSED / VERIFIED / DEPLOYED
- Advanced analytics storytelling uses the canonical owner analytics source.
- Local visibility readiness uses verified tenant/branch fields only.
- Experimentation is hypothesis-led and does not invent measured significance.

### Platform Approval Center — CLOSED / VERIFIED
- Existing server-authorized lead controls are preserved.
- Approval renders the one-time registration URL with copy/open actions.
- No secret token persistence was introduced.

### Onboarding Creation Recovery — CLOSED / VERIFIED / MERGED
- PR #75 merged as `32d46be53f099069c20923afeb83ef1f8a48d1cc`.
- Quality check for the merge commit passed.
- Recovery is server-authorized from authenticated owner context.
- The owner uniqueness constraint remains intact.

### Menu Intelligence V5 Report Center — CLOSED / VERIFIED / MERGED
- PR #81 merged as `b9ff93e1bf599e249fda67dd684a0eabe0f33c26`.
- 7/30-day reports, menu-health summary, actionable recommendations, print/PDF, mailto handoff, Web Share, responsive Studio navigation, and focused regression coverage are present.
- No fabricated revenue/conversion/compliance claims were introduced.

### R2.7 — WhatsApp Report Sharing — CLOSED / VERIFIED / MERGED
- Owner reviews generated report text before copying/opening WhatsApp.
- Safe click-to-chat is used; no autonomous outbound messaging was introduced.
- Restaurant WhatsApp use-case research is recorded in `docs/research/2026-09-12-whatsapp-restaurant-use-cases.md`.

### AI Provider Routing & Multimodal Fallback — CLOSED / VERIFIED / MERGED
- PR #89 merged as `da2885ff970d46bd1f679b6b31d53b8f973ff8a0`.
- Current structured routing supports Inception/Mercury, Gemini, Z.AI, OpenRouter, and xKiro.
- Current multimodal routing supports Gemini, OpenRouter, Z.AI, and xKiro.
- Server-only credentials, schema validation, tenant/user rate limiting, prompt-injection safeguards, and human-review boundaries remain protected.

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

### R4.4 — Intelligence Data Quality — CLOSED / VERIFIED
- Deterministic evidence-quality contract derives `fresh`, `stale`, or `insufficient` only from existing OwnerAnalytics data.
- Explicit `now` input makes freshness deterministic and testable.
- Invalid observation dates are ignored.
- Duplicate dates count once as observed days.
- No new metrics, database writes, AI providers, dependencies, or duplicate UI were introduced.
- R4.4 merge commit: `8fd3f580cee9d740ffa323588f15215b8e7764e1`.
- GitHub Quality passed before merge.

### R4.5 — Owner Decision Loop — CLOSED / VERIFIED
- Existing Owner Intelligence Action Center consumes deterministic evidence quality.
- Fresh/stale/insufficient evidence state and freshness context are visible in Arabic and English.
- Recommendations remain grounded in verified analytics and owner-reviewed actions.
- Existing refresh is the re-check mechanism.
- No autonomous production mutation, new provider, dependency, migration, or duplicate dashboard was introduced.
- Focused regression coverage was added.
- GitHub Quality passed before merge.
- Merge commit: `08565c47550df828450c76c8ce27fb6c373b04fd`.
- Vercel reported deployment completion for the merge commit.

## R5 — Growth Extensions — CLOSED / VERIFIED
- Selected target from current-main discovery: convert the existing zero-activity baseline into an explicit owner distribution action when the menu is already published.
- Added deterministic `distribution` action using only `OwnerAnalytics` entry/interaction fields and verified publication state.
- Routed to existing `/studio/brand`; no duplicate dashboard or route.
- Preserved the existing unpublished-menu `publish-menu` action and prevented duplicate distribution guidance.
- Added regression coverage for published zero-activity and unpublished cases.
- R5 merge commit: `1e2364cde7c9ecc0b40538f2cf606179d24646d9`.
- No new metric, conversion claim, migration, dependency, AI provider, autonomous messaging, or production mutation was introduced.

## R6 — Experiments — CLOSED / VERIFIED
- Selected `whatsapp-cta-v1` as one bounded experiment against the existing shared WhatsApp action.
- Hypothesis: stronger visual prominence may increase WhatsApp-intent sessions without reducing product exploration.
- Added stable `control` / `prominent` assignment from the existing anonymous session id.
- Server derives the recorded variant; the client does not choose it.
- Participation is limited to published menus with configured WhatsApp.
- Added nullable `experiment_key` and `experiment_variant` to `menu_events` with a validation constraint and index.
- Treatment is limited to the existing WhatsApp action presentation (`font-semibold shadow-sm`).
- Preview/owner-preview does not activate the treatment or record experiment clicks.
- Primary metric: WhatsApp-click sessions / exposed sessions.
- Guardrail: product-view sessions / exposed sessions.
- Collection threshold: 50 exposed sessions per variant.
- Directional results only; no statistical significance is claimed.
- GitHub Quality run `1408` passed all required steps before merge.
- R6 merge commit: `16bd37e51870740df547bb5840a0237fe3657f0a`.
- Production outcome remains UNKNOWN until real traffic accumulates.

## Theme Interaction Hardening — CLOSED / VERIFIED / MERGED
### PR #119 — Gallery + Noir
- PR #119 merged as `42b67382d3e1f1c3d66ed8fd8ba582101cf7da7a`.
- Gallery assistant dialog hides only the Gallery floating bottom action dock while open and restores it on close.
- Gallery assistant state is exposed structurally with `data-public-menu-assistant-dialog="true"`; no duplicate controls or global z-index escalation were introduced.
- Noir no longer traps shared dialogs inside `.menu-public-shell > * { position: relative; z-index: 1; }`.
- Noir preserves intentional header/main/footer content layers while ProductSheet and Assistant can stack correctly.
- Noir shared dialogs use existing semantic surface/content/border tokens so item-option labels remain readable.
- Focused Gallery and Noir structural regression tests were added.
- Full repository quality gates passed before merge, including Typecheck, Tests, Lint, Production Build, Playwright/Chromium, all-theme Browser QA, and performance baseline.
- No ordering, pricing, availability, tenant/branch isolation, auth, AI grounding, provider routing, cart, or database behavior was changed.

## Protected Scope
- Essential, Editorial, Noir, Heritage/Taste, and Gallery remain protected.
- Shared public-menu behavior, customer actions, authentication, authorization, tenant/branch isolation, routing, migrations, and deployment controls remain protected.
- Quick Add, Item Notes, Cart, canonical public rendering, Orders, Notifications, Import, AI provider infrastructure, Platform Admin security, subscription protection, and release-only Vercel workflow remain protected.
- Do not repeat completed work without current reproducible regression evidence.

## Current Release Evidence
- VERIFIED: current `main` SHA is `42b67382d3e1f1c3d66ed8fd8ba582101cf7da7a`.
- VERIFIED: R6 GitHub Quality run `1408` passed all required steps before merge.
- VERIFIED: PR #119 passed the repository Quality Gate before merge and is merged to `main`.
- VERIFIED: latest known Production deployment is READY for `887077710808aeae448ccf3d00b027adea165c77`.
- BLOCKED: Vercel deployment for `42b67382...` is blocked by the account free daily deployment limit (`api-deployments-free-per-day`).
- UNKNOWN: direct physical-device production QA is not available through the current connector environment.

## Exact Next Task
### R7 — Post-Experiment Evidence Review / Controlled Optimization
1. Allow real R6 exposure to accumulate.
2. Read the canonical `menu_events` experiment fields.
3. Compare control vs prominent using the declared primary and guardrail metrics.
4. Decide keep control, keep treatment, or end the experiment.
5. Do not claim statistical significance without sufficient data.
6. Do not start a second experiment before this review.
7. Before treating the Gallery/Noir fix as released, clear the current Vercel deployment limit, perform one production deployment of `42b67382...`, then complete real-device QA for Gallery and Noir.

## Working Rules
- `main` is source of truth.
- Use `VERIFIED`, `INFERRED`, `PROPOSED`, `UNKNOWN`, `BLOCKED`.
- Preserve completed work.
- One atomic task at a time unless the user explicitly names a complete milestone.
- Never claim deployment without direct deployment evidence.
- Update continuity at task completion.