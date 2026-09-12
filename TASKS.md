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
- Current `main` SHA: `3c1c08e3b19d19332b11d37d781736f4cdd4a3e2`.
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

## Protected Scope
- Essential, Editorial, Noir, Heritage/Taste, and Gallery remain protected.
- Shared public-menu behavior, customer actions, authentication, authorization, tenant/branch isolation, routing, migrations, and deployment controls remain protected.
- Quick Add, Item Notes, Cart, canonical public rendering, Orders, Notifications, Import, AI provider infrastructure, Platform Admin security, subscription protection, and release-only Vercel workflow remain protected.
- Do not repeat completed work without current reproducible regression evidence.

## Current Release Evidence
- VERIFIED: `main` SHA `3c1c08e3b19d19332b11d37d781736f4cdd4a3e2`.
- VERIFIED: GitHub Quality run `34673634043` passed.
- VERIFIED: Supabase check passed.
- VERIFIED: Vercel status for the same SHA is `success` / `Deployment has completed`.
- STATUS: `DEPLOYED`.

## UNKNOWN / BLOCKED
- UNKNOWN: direct physical-device observations are not available through the current connector environment.
- UNKNOWN: current account-level Vercel Usage/Billing limits unless separately inspected.

## Exact Next TODO — R3 Guest Experience Hardening
1. Audit the current public-menu customer journey and grounded Guest Assistant on `main`.
2. Verify Arabic RTL, English LTR, mixed-direction content, mobile/responsive behavior, search/category discovery, product details, availability, and supported customer actions.
3. Verify grounding and read-only/security boundaries.
4. Identify only reproducible defects and implement the smallest safe fixes.
5. Run relevant quality, browser, accessibility, performance, and security/data checks.
6. Prepare one coherent release batch; do not use Vercel as the development loop.
7. Stop at R3 atomic boundary.

## Working Rules
- `main` is source of truth.
- Use `VERIFIED`, `INFERRED`, `PROPOSED`, `UNKNOWN`, `BLOCKED`.
- Preserve completed work.
- One atomic task at a time unless the user explicitly names a complete milestone.
- Never claim deployment without direct deployment evidence.
- Update continuity at task completion.
