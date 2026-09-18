# Menu V3 — Current Product Gap Audit
Date: 2026-09-18
Baseline: main `c3afb623559ea1d6e015a5abeb6a59ebc26a4f27`

## Audit purpose
Reconcile the strategic product direction with the implementation that actually exists in the repository. This is a gap audit, not a redesign proposal.

## Repository evidence
- 731 tracked files.
- 221 `src/` files, including 122 `src/lib/` files and 33 components.
- 53 migrations, 66 tests, 41 scripts, 209 documentation files.
- Public routes, Studio, Platform Admin, onboarding, pricing, auth, theme preview and API/auth routes inspected through the current repository tree.
- Auth/authorization, tenant/branch isolation, public menu, cart/order, analytics, experiments, intelligence, growth, guest relationships, AI, commercial/subscriptions, self-serve, themes, SEO, accessibility/performance tooling, migrations and browser/regression suites were included in the sweep.

## Already implemented — protected
### Public/guest
- Arabic/English, RTL/LTR.
- Essential, Editorial, Noir, Heritage/Taste, Gallery.
- Search and category filtering.
- Product view/details and availability.
- Variants/modifiers and required selections.
- Quick Add, cart, Item Notes and public order flow.
- WhatsApp/configured actions.
- Grounded Guest Assistant.
- Nutrition/disclosure and public resilience/theme/price contracts.

### Commerce
- Server-side product/options/price validation.
- Public-order rate limiting and idempotency.
- Studio Orders, status updates/history and notifications.
- Payment boundary.

### Intelligence/growth/relationships
- Menu Intelligence, Owner Intelligence, Growth Engine, Reports.
- Evidence-based upsell with owner approval.
- Experiments and variant tracking.
- Guest profiles, loyalty, campaigns, feedback and retention.

### AI
- Mercury, Gemini, Z.AI, OpenRouter, xKiro routing.
- Structured output.
- Image/PDF ingestion.
- Menu AI assistance.
- Guest Assistant.
- AI rate limiting/security contracts.

### Commercial/admin
- Pricing/commercial catalog.
- Subscriptions/entitlements/limits.
- Self-serve lifecycle/provisioning/recovery.
- Platform Admin controls.
- Teams, branches, import, billing and QR.

### Discovery/quality
- Canonical/hreflang/robots/sitemap/Restaurant structured data.
- Accessibility/performance contracts.
- Playwright/browser suites and CI.
- Release-only Vercel workflow.

## Verified gaps
### GAP-01 — End-to-end journey telemetry
The public event recorder currently accepts only `visit`, `qr_scan`, `product_view`, `whatsapp`. Public search/category/cart behavior exists but is not in that event contract.

### GAP-02 — Anonymous session → order linkage
Public order submission does not receive the anonymous menu `sessionId`. Orders therefore cannot be cleanly connected to the menu session that produced them without introducing a new privacy-preserving linkage.

### GAP-03 — One canonical analytics journey contract
R6 experiment assignment/variant tracking exists, but the broader journey vocabulary remains narrow and fragmented across menu events, order data and downstream metrics. Do not replace it wholesale; audit first.

### GAP-04 — International market boundary
Tenant currency/country and bilingual presentation exist, but current code contains SAR fallbacks and SAR-specific subscription price fields. The market-dependent boundary is not yet proven to be a complete adapter/configuration model.

### GAP-05 — Public deep-link/shareability proof
Menu-level public SEO/shareability exists. Current route inventory has no dedicated product/category public route. Whether existing query/state sharing is sufficient is UNKNOWN and must be audited before adding routes.

### GAP-06 — Action → outcome linkage
Owner Intelligence, Growth, recommendations, reports and guest relationships already exist. The remaining gap is stronger measurement of whether an owner action changed the intended outcome, not another dashboard.

### GAP-07 — Release evidence
R6 meaningful real exposure, physical Android/iOS Production QA, and current Production configuration evidence remain incomplete. These are evidence/release tasks, not feature gaps.

## Explicit non-gaps
Do not create duplicate work for guest CRM/loyalty/campaigns/feedback, AI provider infrastructure, themes, cart/order hardening, intelligence/growth surfaces, self-serve, subscriptions/admin, basic SEO, accessibility/performance, QR or import.

## Gap-only roadmap
1. A.1 Customer Journey & Event Truth Audit.
2. A.2 Minimal Journey Instrumentation, only where A.1 proves it missing.
3. A.3 Outcome-Linked Owner Intelligence using existing systems.
4. A.4 International Boundary Audit.
5. A.5 Public Shareability/Deep-Link Audit.
6. Separate release evidence track: R6 exposure + physical-device QA.

## Anti-regression rules
- Current `main` is the baseline for every task.
- Prove absence before adding a capability.
- Extend existing contracts; never create parallel analytics/cart/order/theme/AI/customer systems.
- Preserve server-side identity, tenant/branch, price and entitlement trust.
- Add focused regression coverage with runtime changes.
- One atomic task per session.
- No Vercel iteration loop.
- Reconcile Git/CI/deployment/device evidence at completion.

## Evidence labels
VERIFIED = directly observed. INFERRED = logical consequence. PROPOSED = future recommendation. UNKNOWN = insufficient evidence. BLOCKED = missing authorization/evidence.
