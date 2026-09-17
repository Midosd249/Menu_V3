# 2026-09-17 — Homepage React.Children.only Runtime Regression

## Status

- Status: CLOSED / VERIFIED / MERGED
- PR: #172
- Merge commit: `8050d2f08a2904f5ee2d9085454c47bdba601392`
- Base: `main`

## Symptom

The public homepage rendered a `Something went wrong` screen with:

`React.Children.only expected to receive a single React element child.`

## Root Cause

The homepage used `Button asChild` with two direct children: a `Link` and a trailing `ArrowUpLeft` icon. `Button` is built on Radix `Slot`, whose `asChild` composition requires a slottable child when multiple siblings are rendered.

## Fix

`src/components/ui/button.tsx` now follows the official Radix multi-child composition pattern:

- preserves the first child as the slotted interactive element;
- uses `Slottable` for that child;
- preserves trailing sibling content;
- leaves the existing single-child `asChild` behavior unchanged.

The homepage itself did not require a route or business-logic rewrite.

## Regression Protection

`tests/public-pages-themes-contract.test.mjs` now verifies the homepage multi-child `asChild` usage and the Button `Slottable` contract.

## Verification Evidence

- Quality run `35266109690`: SUCCESS.
- W9 Orders QA run `35266109691`: SUCCESS.
- Typecheck: SUCCESS.
- Full repository tests: SUCCESS.
- Lint: SUCCESS.
- Production build: SUCCESS.
- Public all-theme browser QA: SUCCESS.
- Studio browser QA: SUCCESS.
- Platform Admin browser QA: SUCCESS.
- Performance and diagnostics stages: SUCCESS.

## Deployment Boundary

The PR received a Vercel deployment failure caused by the known free daily deployment limit (`api-deployments-free-per-day`). No deployment retry was used. The fix was verified through GitHub Actions and merged without using Vercel as a development loop.

Physical real-device Production QA for the latest `main` remains release-stage evidence and is not claimed as completed.

## Durable Lesson

For any reusable `asChild` primitive, audit both single-child and multi-child composition. If sibling icons or content are allowed by the component contract, use Radix `Slottable` rather than passing multiple direct children to `Slot`.
