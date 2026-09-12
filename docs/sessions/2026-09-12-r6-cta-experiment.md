# Session — 2026-09-12 — R6 Experiments

## Classification
- Task: R6 bounded experimentation milestone.
- Workflow: BOOT → PROVE → SCOPE → RESEARCH → DESIGN → BUILD → TEST → SECURE → DIFF → STATE.
- Research level: Focused / repository-first.
- Scope: one experiment only; preserve completed R2/R3/R4/R5, themes, orders, AI infrastructure, security, tenant isolation, and release controls.

## Current Position
- VERIFIED: started from `main` at `109c5a2683c6538458dc357b1dcd71ffb7631b80`.
- VERIFIED: existing analytics uses the canonical four-event `menu_events` stream: `visit`, `qr_scan`, `product_view`, and `whatsapp`.
- VERIFIED: the existing experimentation surface was hypothesis-led but did not persist experiment variants.
- VERIFIED: the existing public anonymous session id is already used by the canonical event recorder.

## Experiment Decision
- VERIFIED: selected `whatsapp-cta-v1` because the product already exposes a WhatsApp action and records a corresponding event.
- Hypothesis: making the existing WhatsApp action slightly more visually prominent will increase WhatsApp-intent sessions without reducing product exploration.
- Control: existing presentation.
- Treatment: existing presentation plus stronger font weight and subtle shadow.
- Primary: WhatsApp-click sessions / exposed sessions.
- Guardrail: product-view sessions / exposed sessions.
- Exposure: distinct anonymous session ids with experiment-tagged visit events.
- Minimum collection target: 50 exposed sessions per variant.
- Decision is directional only; no statistical significance is claimed.

## Implementation
- Added `src/lib/menu/experiment.ts` with stable session-based assignment and the explicit experiment contract.
- Added migration `migrations/20260912001000_experiment_variant_tracking.sql` with nullable experiment fields, variant validation, and an index.
- Updated the canonical public event recorder to derive the experiment variant server-side and persist it only for published menus with configured WhatsApp.
- Updated the existing shared WhatsApp action presentation only; preview mode remains excluded.
- Added focused regression coverage.

## Verification
- VERIFIED: GitHub Quality run `1408` passed Typecheck, Tests, Lint, Production build, Playwright runtime/Chromium, all-theme Browser Template QA, performance upload, and preview shutdown.
- VERIFIED: one existing analytics-integrity assertion was updated because the tenant lookup now intentionally selects `id, whatsapp` to establish experiment eligibility; the tenant/published/active predicate remains unchanged.
- BLOCKED: Vercel deployment is blocked by the free daily deployment limit (`api-deployments-free-per-day`). No deployment retry was performed.
- UNKNOWN: direct physical-device production QA is unavailable through the current connector environment.
- UNKNOWN: R6 production outcome is not yet measurable until real traffic accumulates.

## Merge
- PR: #114 — `feat(r6): launch bounded WhatsApp CTA experiment`.
- VERIFIED: merged to `main` as `16bd37e51870740df547bb5840a0237fe3657f0a`.

## Guardrails
- No second analytics event source.
- No third-party analytics SDK.
- No IP or fingerprint collection.
- No autonomous messaging.
- No pricing, ordering, availability, allergen, authentication, authorization, tenant, or branch behavior changes.
- No new AI provider.
- No duplicate analytics dashboard.
- No Vercel development loop.

## Exact Next Task
R7 — Post-Experiment Evidence Review / Controlled Optimization. Wait for real exposure, compare canonical experiment events, and decide whether the evidence supports control, treatment, or ending the experiment. Do not start another experiment before this review.
