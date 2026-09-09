# Menu V3 — Final Audit Continuity Baseline

**Date:** 2026-09-09

This file is a durable restart point created after the final comprehensive read-only audit.

## Current verified baseline

- Repository: `Midosd249/Menu_V3`
- Canonical branch: `main`
- Current `main` HEAD: `d4c50d1b774ee1cb16c7cda2dff0c8b410d97a8c`
- HEAD message: `docs: record successful cross-theme preview verification`
- Supabase project ref: `ublxptcqefujkbeepylc`
- Supabase status: `ACTIVE_HEALTHY`
- Supabase region: `ap-northeast-2`
- Canonical application schema: `menu_v3`
- Vercel project: `menu-v3`
- Vercel project ID: `prj_ydfrFBE7ZJVmuNnCOTv3WjWkhuH1`
- Current production deployment: `dpl_2jWoXyPwoeKFzAL54MKSiaEvHL43`
- Production deployment commit: `d4c50d1b774ee1cb16c7cda2dff0c8b410d97a8c`
- Production deployment state: `READY`
- Current Vercel 24-hour runtime error aggregation: no runtime errors found.

## Important continuity correction

`PROJECT_STATE.md` still contains an older recorded main head and older deployment commit. Do **not** treat those older values as the current repository/deployment identity. GitHub and Vercel direct evidence above are authoritative for the current state.

## Protected work

The five canonical themes remain protected:

- Essential
- Editorial
- Noir
- Heritage / Taste (`مذاق` / `Taste`)
- Gallery

Also protected:

- canonical `ThemeRenderer`
- Studio Preview → `MenuThemeController` + `ThemeRenderer`
- Gallery hero scroll fix
- Gallery header/action-dock composition
- Quick Add conservative rule
- Item Notes integration
- shared cart/order flow
- tenant/branch/auth/authz boundaries
- migration history
- release-only Vercel workflow

## Final audit decision

**GO WITH CONDITIONS.** The theme/rendering system is stable enough to move forward. Do not start another broad theme redesign.

### P0 remaining
1. Inventory the live Supabase `SECURITY DEFINER` RPCs, owners, definitions, `search_path`, and grants; resolve the six Security Advisor warnings intentionally.
2. Add abuse/rate-limit/idempotency protection to public guest order submission.
3. Run live negative authorization tests against the canonical Supabase project.

### P1 remaining
1. Reconcile continuity state files with current `main` and production deployment evidence.
2. Reconcile `package.json` and `package-lock.json`; make CI dependency installation deterministic.
3. Protect `main` with required quality checks.

### P2 remaining
Real-device/manual gate: Android/iOS, QR camera, screen reader, Owner keyboard traversal, RTL/LTR/mixed-direction content, long names/prices, missing images, cart/order/error states, safe areas.

## Audit artifact

Full findings and remediation plan:

`docs/audits/2026-09-09-final-comprehensive-read-only-audit.md`

## Research/tool evidence used

- GitHub: repository, branch, commits, source files, tests, workflow, PRs.
- Supabase: canonical project identity, security advisors, performance advisors, generated live database types.
- Vercel: project identity, production deployment, deployment metadata, runtime error aggregation.
- AI Wisebase: searched for prior Menu V3 knowledge; no relevant current knowledge-base result was found, so it was not treated as source of truth.
- Exa/external web research: used only for current platform/standards cross-checks; repository/platform evidence remained authoritative.

## Restart rule

If the session is interrupted, resume from this file and the full audit artifact. Re-verify current `main` HEAD and Vercel production commit before doing any implementation. Do not trust stale chat memory or older continuity commit hashes.
