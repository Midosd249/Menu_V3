# Menu V3 — Customer & Product Master Blueprint

## Status
- Date: 2026-09-18
- Status: STRATEGIC BLUEPRINT / PROPOSED
- Canonical branch: `main`
- Strategy baseline: `c3afb623559ea1d6e015a5abeb6a59ebc26a4f27`
- Implementation authorization: NOT IMPLIED

## 1. Product North Star

Menu V3 should evolve from a digital menu into a restaurant-owned **guest experience + direct commerce + relationship + decision-intelligence platform**.

Core loop:

```text
DISCOVERY / QR
→ FAST UNDERSTANDING
→ EXPLORATION
→ CONFIDENT DECISION
→ ORDER / CONTACT / SAVE / SHARE
→ OUTCOME
→ FEEDBACK
→ RETURN
→ OWNER INSIGHT
→ OWNER ACTION
→ MEASURED RESULT
→ BETTER GUEST EXPERIENCE
```

Guest job:
> Understand the restaurant, find something suitable, trust the information, and take the next action with minimal friction.

Owner job:
> Know what guests do, why it matters, what to change, and whether the change worked.

## 2. Research Synthesis

### VERIFIED
Research reviewed across hospitality studies, accessibility guidance, restaurant platforms, search guidance, and maintained open-source systems converges on several principles:

- Information quality materially affects digital-menu satisfaction and behavioral intention.
- Simplicity and system reliability materially affect adoption and satisfaction.
- QR menus can create friction when the experience is inconvenient; QR alone is not a loyalty strategy.
- Mature restaurant products increasingly connect menu, ordering, guest data, loyalty, promotions, analytics, and direct relationships.
- Open-source restaurant/menu systems repeatedly expose patterns for multi-tenancy, branch context, availability, RBAC, analytics, localization, structured data, QR resolution, and resilient commerce state.

### INFERRED
The biggest strategic opportunity is to connect capabilities Menu V3 already has into one measurable closed loop rather than continuously adding disconnected features.

## 3. Existing Product Position

### VERIFIED
Current repository history/documentation shows substantial existing capability in:

- Multi-tenant restaurant/branch foundation.
- Public menu and protected themes: Essential, Editorial, Noir, Heritage/Taste, Gallery.
- Cart, Quick Add, Item Notes, and order flows.
- Menu Intelligence and Owner Intelligence.
- Growth capabilities and bounded experimentation.
- Guest CRM, loyalty, campaigns, feedback, and retention foundations.
- Grounded Guest Menu Assistant.
- AI provider routing/fallback and multimodal import.
- SEO/local discovery foundations.
- Platform Admin and self-serve customer lifecycle.
- Subscription/entitlement foundations.
- Operational order surfaces.
- Security, QA, CI, and release controls.

### Strategic implication
Do not restart, re-theme, or rebuild the product. The next value layer is integration, measurement, refinement, and international readiness.

## 4. Real Guest Journey

### A. Arrival
Entry sources:
- QR.
- Website.
- Search.
- Social.
- Shared menu/product URL.
- NFC/link where supported.
- Repeat visit.

Guest questions:
- Am I in the right restaurant/branch?
- Is this the current menu?
- Can I use it without an app?
- Can I find what I want quickly?

### B. Orientation
Critical information:
- Categories.
- Search.
- Product name.
- Price.
- Description.
- Images where useful.
- Availability.
- Verified dietary/allergen information where configured.

Rule: **information hierarchy beats decoration.**

### C. Decision
Useful behaviors:
- Compare products.
- Open details.
- Check options.
- Check price/availability.
- Ask a grounded question.
- Review recommendations.

Rules:
- Evidence before recommendation.
- Never invent price, availability, allergens, ingredients, or promotions.
- Public commercial recommendations remain controlled/owner-approved where required.

### D. Action
Only expose supported actions:
- Add to cart.
- Configure item.
- Start/submit order.
- WhatsApp/call/map when valid configured data exists.
- Favorite/share when supported.

### E. Outcome
Strategic measurement target:

```text
visit
→ product_view
→ add_to_cart
→ cart_view
→ order_start
→ order_submitted
→ order_completed
→ feedback
→ return_visit
→ repeat_order
```

This is a proposed future funnel, not a claim that every event currently exists.

### F. Return
Potential retention loop:
- Favorites.
- Reorder.
- Loyalty.
- Feedback recovery.
- Campaigns.
- Personalized offers.
- Shareability.

All relationship features must remain consent-aware, tenant-scoped, and non-autonomous unless explicitly authorized.

## 5. Owner Journey

Replace "dashboard reading" with:

```text
WHAT HAPPENED?
→ WHY DOES IT MATTER?
→ WHAT SHOULD I DO?
→ DID IT WORK?
```

An insight should contain:
- Observed evidence.
- Confidence.
- Scope.
- Possible explanation(s).
- Suggested action.
- Expected measurable outcome.
- Dismiss/ignore path.

Never present hypotheses as measured causality.

## 6. Eight Strategic Product Layers

### 1. Guest Experience Engine
Optimize the first 10–30 seconds:
- First-screen hierarchy.
- Branch context.
- Search/category discovery.
- Product details.
- Availability.
- Recommendation placement.
- Action clarity.
- Loading/empty/error/offline states.
- Mobile/RTL/LTR quality.

### 2. Commerce Journey Intelligence
Connect discovery to outcomes:
- Event contract.
- Session semantics.
- Deduplication.
- Privacy.
- Server-authoritative order facts.
- Funnel metrics.
- Branch/item comparisons.

### 3. Decision Engine
Help guests decide without dark patterns:
- Views.
- Cart signals.
- Orders where authorized.
- Availability.
- Context.
- Approved pairings.
- Explicit preferences.

### 4. Order Intelligence
Explain:
- Interest → cart.
- Cart → order.
- Drop-off.
- Availability effects.
- Modifier/notes friction.
- Branch patterns.

Do not become a full POS/accounting product.

### 5. Guest Relationship Engine
Connect:
- Profiles.
- Loyalty.
- Feedback.
- Campaigns.
- Retention.
- Favorites/reorder.
- Consent/preferences.

No autonomous messaging, pricing, rewards, or order changes.

### 6. Owner Action Center
Prioritize:
- Today.
- Needs attention.
- Opportunities.
- Recent wins.
- Experiments.
- Feedback.
- Retention.
- Menu health.

### 7. Growth Engine
Build around:
- Approved upsells.
- SEO.
- Shareable products.
- Direct-order optimization.
- QR acquisition.
- Campaigns.
- Controlled experiments.

### 8. International Platform Core
Make geography configurable instead of hard-coded.

## 7. International-First Architecture

Saudi Arabia is a launch/market configuration, not the product identity.

### Platform core
```text
Tenant
Branch
Menu
Catalog
Availability
Cart / Order
Guest
Analytics
Growth
AI
SEO
Entitlements
```

### Market configuration
```text
country
locale
supportedLocales[]
currency
timezone
taxPresentation
phoneRules
addressRules
paymentProviders
messagingProviders
maps/discovery
complianceAdapters
```

### Rules
- Never hard-code SAR in generic domain logic.
- Never assume Saudi phone formats.
- Never assume Arabic is the only RTL language.
- Never assume English is the only LTR language.
- Never embed Saudi-only payment logic in generic checkout.
- Keep country-specific compliance in adapters/configuration.
- Do not create premature global tax/accounting abstractions without a real requirement.

A non-Saudi test configuration should eventually pass through the same core without code forks.

## 8. Analytics Direction

### VERIFIED current baseline
Documented public events include:
- `visit`
- `qr_scan`
- `product_view`
- `whatsapp`

Existing metrics include product interest, session engagement, WhatsApp intent, QR-to-visit, and product views/session.

### PROPOSED evolution
Use a versioned domain taxonomy:

```text
discovery.*
menu.*
commerce.*
relationship.*
growth.*
system.*
```

Examples:
```text
discovery.qr_scan
discovery.visit
menu.search
menu.category_view
menu.product_view
commerce.add_to_cart
commerce.cart_view
commerce.order_start
commerce.order_submitted
commerce.order_completed
relationship.feedback_submitted
relationship.favorite
growth.recommendation_impression
growth.recommendation_click
```

Do not replace the existing contract wholesale. First map current events, consumers, compatibility requirements, and observability.

## 9. Experimentation

The current WhatsApp CTA experiment has implementation/measurement foundations, but meaningful exposure remains insufficient for a reliable outcome.

Future experiment contract:
- Real traffic.
- Stable assignment.
- Experiment ID.
- Variant ID.
- Exposure denominator.
- Conversion event.
- Guardrail.
- Minimum sample threshold.
- Stop rule.
- No synthetic traffic.
- No cherry-picking.

## 10. AI Strategy

AI is a controlled capability layer.

Good uses:
- Import/OCR/PDF/image extraction.
- Description assistance.
- Grounded guest Q&A.
- Owner summaries.
- Pattern detection.
- Recommendation candidates.
- Translation assistance.
- Content-quality checks.

Guardrails:
- Server-only provider keys.
- Fallback routing.
- Structured outputs.
- Source grounding.
- No fabricated restaurant facts.
- No autonomous payment/order/commercial changes.
- No cross-tenant leakage.
- Explicit uncertainty.

International requirement: provider routing must not assume one geography or language.

## 11. SEO & Discovery

Priority:
- Restaurant/LocalBusiness structured data.
- Menu URLs.
- Canonical URLs.
- hreflang.
- Sitemap/robots.
- Public-only indexing.
- Shareable product/category URLs.
- Social previews.
- Branch/location context.

Never expose session IDs, guest profiles, internal analytics, or private tenant data to search indexes.

## 12. Accessibility & Visual Quality

Target WCAG 2.2 AA-oriented quality.

Check:
- Touch targets.
- Keyboard access.
- Focus.
- Screen-reader labels.
- Semantic hierarchy.
- Contrast.
- Reduced motion.
- RTL/LTR.
- Text resizing.
- Error recovery.

Keep important mobile controls around 44×44 CSS px where practical; WCAG 2.2 AA includes a 24×24 CSS-pixel target criterion with exceptions.

Do not create a sixth theme. Improve behavioral performance within the protected five themes.

## 13. Open-Source Pattern Research

Maintained/open-source references reviewed included:
- TastyIgniter.
- MySagra.
- FeastQR.
- MenuQR.
- AtlasQR.
- Crave.js web template.

Transferable patterns:
- Multi-tenancy.
- Branch/location context.
- RBAC.
- Availability.
- Analytics.
- Localization.
- Structured data.
- QR resolution.
- PWA/cache resilience.
- Favorites.
- Variants/options.
- Commerce-state resilience.
- Separation of presentation and commerce logic.

These are pattern references only. Do not copy proprietary assets, branding, layouts, text, or code.

## 14. Comprehensive Execution Plan

### Phase A — Measurement Truth / P0
Goal: know the real customer journey.

Tasks:
1. Inventory current events and schemas.
2. Map event → source → consumer → metric.
3. Identify funnel gaps.
4. Define privacy/deduplication/session rules.
5. Define authoritative metric formulas.
6. Document experiment measurement requirements.

Exit:
- One definition per strategic metric.
- No synthetic evidence.
- Tenant/branch/session boundaries explicit.
- Unknowns documented.

### Phase B — Guest Friction / P0
Goal: remove decision friction.

Tasks:
1. Audit public journey.
2. Audit first screen.
3. Audit search/category navigation.
4. Audit product detail.
5. Audit availability and options.
6. Audit cart/action path.
7. Audit loading/empty/error/offline states.
8. Browser/mobile/RTL/LTR/accessibility review.

Exit:
- Critical path works with realistic data.
- No critical clipping/overlap/action ambiguity.
- Accessibility baseline verified.
- Performance budget respected.

### Phase C — Commerce Intelligence / P0-P1
Goal: connect intent to orders.

Tasks:
1. Map order facts to menu sessions.
2. Define intent → cart → order funnel.
3. Add branch/item diagnostic views where evidence supports them.
4. Build owner-facing actionable insights.
5. Protect server-authoritative order facts.

Exit:
- Every insight traces to observable evidence.
- No false causal claims.

### Phase D — Guest Relationship Loop / P1
Goal: measurable permission-aware retention.

Tasks:
1. Refine favorites/reorder where justified.
2. Connect loyalty to measurable behavior.
3. Connect feedback to recovery.
4. Add consent/preferences.
5. Improve retention reporting.

Exit:
- Consent and tenant isolation verified.
- No autonomous outbound action.
- Retention outcome measurable.

### Phase E — Growth Optimization / P1
Goal: improve restaurant-owned acquisition and conversion.

Tasks:
1. Evidence-based upsells.
2. SEO/shareability.
3. QR acquisition attribution.
4. Controlled experiments.
5. Growth action center.

Exit:
- Every experiment has denominator/conversion/guardrail/stop rule.
- Recommendations have evidence.
- No dark patterns.

### Phase F — Internationalization Core / P1
Goal: support multiple countries without forks.

Tasks:
1. Locale abstraction audit.
2. Currency abstraction audit.
3. Timezone audit.
4. Phone/address rules.
5. Market configuration.
6. Provider adapter boundaries.
7. Compliance extension points.
8. Non-Saudi fixture/test configuration.

Exit:
- Saudi configuration still works.
- At least one non-Saudi configuration works locally.
- No generic domain logic requires Saudi assumptions.

### Phase G — Platform Scale / P2
Goal: maintainability and commercial leverage.

Tasks:
- Entitlement/capability refinement.
- Provider abstraction.
- Observability.
- Tenant-level limits.
- Import/export portability.
- Recovery/backup checks.
- Operational health.
- Documentation.

## 15. Priority Matrix

| Area | Value | Risk | Priority |
| --- | --- | --- | --- |
| Customer funnel truth | Very high | Medium | P0 |
| Guest friction | Very high | Medium | P0 |
| Intent → order linkage | Very high | High | P0 |
| Owner action center | High | Medium | P1 |
| Guest relationship loop | High | High | P1 |
| SEO/shareability | High | Low/Medium | P1 |
| Controlled experimentation | High | Medium | P1 |
| International core | High | High | P1 |
| Advanced AI | Medium/High | High | P2 |
| New theme | Low | Medium | P3 / avoid |
| Full POS/accounting | Out of scope | Very high | Do not pursue |

## 16. Non-Goals

Do not turn Menu V3 into:
- Full POS replacement.
- Accounting suite.
- Full inventory/warehouse platform.
- Delivery fleet management.
- Generic CRM.
- Generic chatbot platform.
- Autonomous restaurant operator.
- Marketplace that owns the customer relationship.
- Saudi-only architecture.
- Feature-count competition.

## 17. Success Framework

### Guest
**Time to confident action**

Track how quickly and reliably a guest reaches a meaningful next action.

### Restaurant
**Menu-to-outcome visibility**

Track how much of the customer journey the owner can understand and improve.

### Platform
**Measured guest-to-owner loop**

Can Menu V3 observe a journey, produce a safe evidence-based recommendation, and measure the result?

No single metric should replace these three dimensions.

## 18. Evidence Ledger

### VERIFIED
- Existing repository is a mature multi-tenant restaurant platform.
- Public analytics baseline exists.
- Guest relationship foundations exist.
- Upsell evidence/approval logic exists.
- SEO/local discovery foundations exist.
- Five public themes are protected.
- Security/release/QA operating rules are established.
- GitHub `main` currently resolves to `c3afb623559ea1d6e015a5abeb6a59ebc26a4f27`.

### INFERRED
- Integration and measurement are the strongest next strategic leverage.
- Saudi requirements can be preserved through market configuration.
- Guest friction and information quality are high-leverage surfaces.

### PROPOSED
- Execute phases A→G in order unless new evidence changes priority.
- Treat international readiness as a constraint now, while implementing only justified abstractions.
- Build measurement truth before broad conversion claims.

### UNKNOWN
- Current production funnel values across representative real traffic.
- Latest real-device production behavior.
- Actual first international markets.
- Which proposed events can be reliably observed without schema changes.
- Current production environment configuration.

### BLOCKED
- This document alone does not authorize production implementation.
- Browser/device claims require direct browser/device evidence.
- Experiment conclusions require sufficient real exposure.

## 19. Exact Handoff

**Next atomic implementation task proposed:** Phase A.1 — Customer Journey & Event Truth Audit.

Scope:
- Inspect current event emitters, schemas, metrics, order linkage, session identity, and existing tests.
- Produce a gap matrix.
- Do not redesign UI.
- Do not change schema unless a later implementation task explicitly authorizes it.
- Do not trigger Vercel deployment.

Acceptance:
- Current event contract is mapped to actual code.
- Proposed funnel gaps are classified VERIFIED / INFERRED / PROPOSED / UNKNOWN.
- Tenant/branch/session/privacy boundaries are documented.
- A smallest safe implementation sequence is identified.

