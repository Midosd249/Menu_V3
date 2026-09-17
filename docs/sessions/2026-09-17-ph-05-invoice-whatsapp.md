# PH-05 — Invoice Generation + WhatsApp Sharing

Date: 2026-09-17
Status: IN_PROGRESS
Branch: `ph-05-invoice-whatsapp`
Base main: `633c1ef00806fb7c7f3e6d0dab767eb5b01477cc`

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
- Production deployment remains NOT VERIFIED because the known Vercel free-tier deployment-rate limit is still a separate release blocker.
- PH-05 is the next authorized milestone; PH-06/R10 and unrelated work are not started.

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

## Implemented in this branch

- `migrations/20260917150000_ph05_invoices.sql`
- `src/lib/menu/billing.ts`
- `src/lib/menu/billing.test.ts`
- `src/routes/studio/billing.tsx`
- `src/routes/studio/settings.tsx`
- `package.json`
- `docs/PH_SELF_SERVE_CUSTOMER_LIFECYCLE_PLAN.md`

## Vercel handling

No Vercel deployment or retry is part of PH-05 implementation. Continue development and GitHub Actions verification locally/remotely. A future production deployment must remain a single release batch after all PH-05 gates pass and after the actual Vercel Usage/Billing limit is resolved.

## Verification plan

- Focused billing contract tests.
- Route generation/freshness.
- Typecheck.
- Full repository tests.
- W7.4–W7.10 contract coverage.
- Lint.
- Production build.
- Migration/schema verification.
- Auth/security checks.
- Playwright/Chromium and relevant Studio browser QA.
- Diff review and continuity update before merge.

## Known exceptions

- PH-01.4 PR #161 remains separately open with its existing browser-selector CI exception; PH-05 does not modify or close it.
- Current repository pricing catalog remains the code source of truth. PH-05 does not silently change pricing.
