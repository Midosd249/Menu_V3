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

### R2 — Menu Intelligence Product Layer — CLOSED / VERIFIED
```text
R2.1 Menu Health / Completeness       DONE
R2.2 Problem Detection                DONE
R2.3 Priority + Actionable Fixes      DONE
R2.4 Owner Menu Intelligence UX      DONE
R2.5 Verified Analytics Intelligence DONE
R2.6 Professional Analytics Reports  DONE
R2.7 WhatsApp Report Sharing         DONE
```

### R3 — Guest Experience Hardening — CLOSED / VERIFIED / MERGED
- PR #103 merged as `45e20a8b760ec4ec4571a8839b5194b33cbd4b61`.
- Existing grounded Guest Assistant remains read-only and catalog-grounded.
- Dialog accessibility was hardened with Escape handling, focus containment/restoration, body scroll locking, and assistive-technology semantics.
- Focused regression contracts were added.
- Shared Button refs were forwarded to support correct focus restoration.
- GitHub Quality run `34675215594` passed before merge.
- No theme, order, auth, RLS, tenant-isolation, provider, database, or deployment configuration changes were introduced.

## Protected Scope
- Essential, Editorial, Noir, Heritage/Taste, and Gallery remain protected.
- Shared public-menu behavior, customer actions, authentication, authorization, tenant/branch isolation, routing, migrations, and deployment controls remain protected.
- Quick Add, Item Notes, Cart, canonical public rendering, Orders, Notifications, Import, AI provider infrastructure, Platform Admin security, subscription protection, and release-only Vercel workflow remain protected.
- Do not repeat completed work without current reproducible regression evidence.

## Current Release Evidence
- VERIFIED: `main` SHA `45e20a8b760ec4ec4571a8839b5194b33cbd4b61`.
- VERIFIED: R3 PR Quality run `34675215594` passed.
- VERIFIED: the R3 merge commit is on `main`.
- BLOCKED: Vercel deployment of the R3 merge is not established because the account build-rate quota rejects deployment attempts.
- VERIFIED: the prior production release remains separately evidenced at its previously recorded successful SHA until a new production deployment is directly confirmed.

## UNKNOWN / BLOCKED
- UNKNOWN: direct physical-device observations are not available through the current connector environment.
- BLOCKED: new Vercel deployment while the account build-rate quota is exhausted.

## Exact Next TODO — R4 Owner Intelligence Discovery
1. Inspect the existing Analytics, Menu Intelligence, Growth Advisor, reports, and relevant server contracts on `main`.
2. Map verified facts, insights, recommendations, and owner actions already present.
3. Identify duplicated or fragmented owner UX before adding anything.
4. Select one atomic R4 capability with an explicit acceptance contract.
5. Implement only the smallest safe extension.
6. Run relevant quality, browser, accessibility, performance, and security/data checks.
7. Keep deployment deferred until the single coherent release batch is ready and Vercel quota permits it.

## Working Rules
- `main` is source of truth.
- Use `VERIFIED`, `INFERRED`, `PROPOSED`, `UNKNOWN`, `BLOCKED`.
- Preserve completed work.
- One atomic task at a time unless the user explicitly names a complete milestone.
- Never claim deployment without direct deployment evidence.
- Update continuity at task completion.
