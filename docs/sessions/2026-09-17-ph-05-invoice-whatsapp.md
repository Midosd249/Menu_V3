# PH-05 — Invoice Generation + WhatsApp Sharing

Date: 2026-09-17
Status: DONE / VERIFIED / MERGED
Branch: `ph-05-invoice-whatsapp`
Final main merge: `f093fcfc445e08849e41b3e965e36f40a1c23b8b`

## Request classification

Commercial lifecycle / subscription billing document / tenant-scoped server authorization / owner-facing Studio feature / WhatsApp click-to-chat / migration / regression verification.

## Workflows used

- Principal Engineer repository-first execution.
- Research and connected-tools workflow: GitHub repository evidence and current PH lifecycle documents.
- Security/data workflow: server-derived tenant membership, subscription snapshot, RLS, no client entitlement or payment claims.
- QA/release workflow: focused contract coverage plus the repository CI quality gate; Vercel intentionally excluded from the development loop.

## Verified starting position

- PH-04 is DONE / VERIFIED / MERGED through PR #163.
- PH-04 merge commit: `f98f1f6efdf6feac200eeb679fb947dd030d39a5`.
- PH-04 documentation closeout PR #164 was merged to `main` at `633c1ef00806fb7c7f3e6d0dab767eb5b01477cc`.
- PR #164 Quality run `35179579783` and W9 run `35179579700` passed.
- Production deployment remained NOT VERIFIED because of the known Vercel free-tier deployment-rate limit.
- PH-05 was the only authorized active milestone; PH-06/R10 was not started.

## PH-05 design boundary

1. Invoice records are tenant-scoped and server-generated.
2. Invoice rows snapshot plan identity, plan names, SAR amount, and billing period at issuance.
3. Invoice status is document status only: `issued` or `void`.
4. Customer billing operations derive tenant identity from authenticated membership; no client tenant id is accepted.
5. Only owner/admin membership can access the billing workspace.
6. Invoice issuance is allowed only for paid `active` or `past_due` subscriptions.
7. Free/trialing/cancelled/suspended subscriptions do not issue invoices through this path.
8. WhatsApp uses click-to-chat only (`https://wa.me/?text=`); no autonomous sending or Business API is introduced.
9. Invoice messages explicitly state they are not proof of payment or electronic collection.
10. No payment gateway, automatic charging, webhook payment state, refund flow, or payment-success inference is introduced.

## Implemented

- `migrations/20260917150000_ph05_invoices.sql`
- `src/lib/menu/billing.ts`
- `src/lib/menu/billing-whatsapp.ts`
- `src/lib/menu/billing.test.ts`
- `src/routes/studio/billing.tsx`
- `src/routes/studio/settings.tsx`
- `src/routeTree.gen.ts`
- `package.json`
- `docs/PH_SELF_SERVE_CUSTOMER_LIFECYCLE_PLAN.md`

## Verification

Final Quality Run: `35181146973` — PASSED.

Passed gates:
- route generation and generated-tree freshness;
- typecheck;
- full test suite;
- PH-05 billing/WhatsApp tests;
- W7.4–W7.10 contract tests;
- lint;
- production build;
- Playwright/Chromium installation;
- all-theme browser template QA;
- Customer Lifecycle browser fixture;
- Studio shell/home/menu/growth/customers responsive browser QA;
- Platform Admin browser fixture and responsive browser QA;
- browser performance diagnostics.

Final W9 Orders QA: `35181146952` — PASSED.

The first PH-05 test cycle exposed a server-bootstrap side effect because the pure billing test imported the server billing module. The fix isolated the pure WhatsApp helpers in `src/lib/menu/billing-whatsapp.ts`; the final full test suite then passed.

The first CI cycle also exposed a stale generated route tree after adding `/studio/billing`. The generated artifact was regenerated and committed, and the temporary generation helper was removed from the final scope.

## Merge

PR #165 was merged successfully.

Final `main` merge commit:
`f093fcfc445e08849e41b3e965e36f40a1c23b8b`

## Vercel handling

No deployment or deployment retry was used to unblock PH-05 development. GitHub verification completed successfully without relying on Vercel. Production deployment remains a separate release-stage action and is not claimed from this merge.

## Exceptions preserved

- PH-01.4 PR #161 remains a separate open verification exception and was not modified by PH-05.
- Repository pricing catalog remains the source of truth; PH-05 did not silently change pricing.

## Completion state

PH-05 is DONE / VERIFIED / MERGED.
No PH-06/R10 work is started automatically.
