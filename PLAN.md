# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Canonical branch: `main`.
- Source of truth: `main`.

## Completed Strategic Milestones
- Premium Theme System — DONE / VERIFIED / MERGED.
- Essential, Editorial, Noir, Heritage/Taste, Gallery — protected.
- Permanent visual/functional/research quality workflow — DONE / VERIFIED.
- P0 Public Order Hardening — DONE / VERIFIED.
- P1 Production/Continuity Hardening — DONE / VERIFIED for implemented scope.
- P1-H1 package/lockfile reconciliation — CLOSED / VERIFIED.
- P1-H2 main branch protection — CLOSED / VERIFIED.
- P2 Growth & Differentiation — DONE / VERIFIED / DEPLOYED.
- Platform Approval Center — CLOSED / VERIFIED.
- Registration-link rendering — CLOSED / VERIFIED.
- Onboarding Creation Recovery — CLOSED / VERIFIED / MERGED.
- Menu Intelligence V5 Report Center — CLOSED / VERIFIED / MERGED.
- R2.7 WhatsApp Report Sharing — CLOSED / VERIFIED / MERGED.
- AI Provider Routing & Multimodal Fallback — CLOSED / VERIFIED / MERGED.

## R2 — Menu Intelligence Product Layer
STATUS: CLOSED / VERIFIED

```text
R2.1 Menu Health / Completeness       DONE
R2.2 Problem Detection                DONE
R2.3 Priority + Actionable Fixes      DONE
R2.4 Owner Menu Intelligence UX       DONE
R2.5 Verified Analytics Intelligence  DONE
R2.6 Professional Analytics Reports   DONE
R2.7 WhatsApp Report Sharing          DONE
```

All seven are complete and protected. Do not reopen without a current reproducible regression.

## R4 — Owner Intelligence
STATUS: IN_PROGRESS

```text
R4.1 Verified Owner Signals           DONE / VERIFIED
R4.2 Intelligence Action Center       DONE / VERIFIED
R4.3 Action Center Follow-through     DONE / VERIFIED
R4.4 Intelligence Data Quality        DONE / VERIFIED
R4.5 Owner Decision Loop              NEXT
```

R4 principle:
**verified evidence → evidence quality → insight → priority → owner action → re-check**

The Owner Intelligence layer must remain deterministic at the data boundary. AI may explain or prepare recommendations, but it cannot become the source of truth or autonomously mutate production data.

## AI Provider Infrastructure
- VERIFIED: server-side provider abstraction is merged.
- VERIFIED: structured routing: Inception/Mercury → Gemini → Z.AI → OpenRouter → xKiro, configurable by server environment.
- VERIFIED: multimodal routing: Gemini → OpenRouter → Z.AI → xKiro.
- VERIFIED: Inception key rotation is server-side and secrets are not stored in Git.
- VERIFIED: schema validation, tenant/user rate limiting, prompt-injection safeguards, and human-review boundaries remain intact.

## Release-Only Vercel Policy
Normal path:

**LOCAL DEVELOPMENT → LOCAL QA → LOCAL BROWSER / VISUAL QA → TESTS → GITHUB ACTIONS QUALITY GATES → DIFF REVIEW → ONE COHERENT RELEASE BATCH → MERGE TO MAIN → ONE VERCEL PRODUCTION DEPLOYMENT → REAL-DEVICE PRODUCTION QA → RECORD RESULT**

Do not use Vercel for ordinary development or visual iteration. CI success and HTTP 200 are not deployment identity evidence. Do not randomly retry deployments or Redeploy.

## Current Verified Main
- VERIFIED: current `main` SHA is `8fd3f580cee9d740ffa323588f15215b8e7764e1`.
- VERIFIED: R4.4 was merged at that SHA.
- UNKNOWN: production deployment identity for that exact SHA until directly rechecked.

## Current Atomic Task — R4.5 Owner Decision Loop
### Objective
Connect the existing Owner Intelligence Action Center to the deterministic R4.4 evidence-quality contract and close the decision loop without creating a duplicate dashboard or autonomous action system.

### Scope
1. Reuse existing `/studio/intelligence` and `/studio/intelligence-actions` surfaces.
2. Consume `buildIntelligenceDataQuality` from the existing analytics evidence.
3. Show fresh/stale/insufficient evidence state and latest observed date beside relevant intelligence.
4. Make recommendations traceable from verified evidence to reason to existing owner action.
5. Use the existing refresh flow as the re-check mechanism after owner-approved changes.
6. Preserve all authentication, authorization, tenant/branch isolation, RLS, pricing, availability, allergen, and order boundaries.
7. Add focused regression coverage for evidence status and decision-loop behavior.
8. Run relevant typecheck, tests, lint, build, browser/accessibility/security/data checks available in the repository.
9. Release only after one coherent quality-gated batch.

### Acceptance criteria
- No duplicate Intelligence dashboard is introduced.
- Every displayed evidence state is deterministic and derived from existing data.
- Fresh/stale/insufficient states are understandable in Arabic and English.
- Recommendations remain owner-reviewed and do not mutate production automatically.
- Refresh/re-check uses the existing analytics flow.
- Existing R2/R3/theme/order/import/provider/security behavior is unchanged.
- Relevant quality gates pass.
- Continuity documents are reconciled at completion.

## Research
Research level: Focused; repository-first. Use external sources only when they materially improve a customer or platform decision and record material findings.

## Exact Next Action
Implement R4.5 from `main @ 8fd3f580cee9d740ffa323588f15215b8e7764e1` on the dedicated feature branch. Do not reopen completed milestones.
