# W7.6 Growth Workspace

Status: IMPLEMENTATION IN PROGRESS — current-head quality pending.

## Purpose

W7.6 consolidates the existing owner-facing Growth capabilities into one coherent `/studio/growth` workspace organized as:

**Observe → Understand → Act → Measure**

This is an experience-layer consolidation, not a new analytics, recommendation, or experiment backend.

## Verified existing capabilities inspected

- `/studio/growth` — existing R8 growth engine, evidence-bound recommendations, existing upsell review/measurement flow, and bounded experiment opportunity data.
- `/studio/intelligence` — existing menu intelligence score, deterministic issues, evidence-backed insights, and growth advisor.
- `/studio/intelligence-actions` — existing owner-controlled action center and evidence-quality state.
- `/studio/analytics` — existing OwnerAnalytics metrics, directional growth ratios, visibility readiness, and existing experimentation board.
- `/studio/reports` — existing professional report generation and owner-reviewed WhatsApp sharing; kept contextual and outside primary Studio navigation.
- No standalone `/studio/experiments` route was found.

## Real sources reused

- `useStudio()`
- `getOwnerAnalytics({ days: 7 })`
- `buildMenuGrowthEngine(snapshot, analytics)`
- `buildMenuGrowthAdvisor(snapshot, analytics)`
- `buildMenuIntelligence(snapshot, analytics)`
- `buildIntelligenceDataQuality(analytics, new Date())`
- existing `/studio/intelligence`, `/studio/intelligence-actions`, `/studio/analytics`, and `/studio/reports` routes
- existing W7.2 internal design-system primitives

No new data query, backend service, business rule, AI provider, experiment engine, or analytics contract was introduced.

## Information architecture

### Observe

Shows real OwnerAnalytics values for the existing seven-day window:
- visits;
- unique sessions;
- product views;
- WhatsApp clicks.

When the source contains no activity, the workspace uses an explicit no-data state and links to existing Analytics only.

### Understand

Separates:
- menu health signal;
- evidence-backed analytics interpretation;
- existing Intelligence destination.

The menu health score is presented explicitly as a content/operations signal, not a financial result. Existing advisor evidence remains guidance rather than fact.

### Act

Surfaces up to three existing evidence-bound recommendations from `buildMenuGrowthEngine` and routes each to its existing supported destination. There is no automatic apply button and no new action execution logic.

### Measure

Shows only recorded OwnerAnalytics outcomes and an explicit operational ratio where the existing source supports it. The existing `whatsapp-cta-v1` experiment is presented as active with outcome undecided because its real-exposure threshold is not met; no lift, ROI, conversion, or causal result is invented. Design-ready experiment opportunities are labeled design-only and do not gain a new activation mechanism.

## Navigation

The Growth workspace exposes contextual links to verified existing routes:

- Overview — `/studio/growth`
- Intelligence — `/studio/intelligence`
- Actions — `/studio/intelligence-actions`
- Analytics — `/studio/analytics`
- Reports — `/studio/reports`

Reports remains outside primary Studio navigation by existing repository contract. No Experiments route is invented.

## State and accessibility contract

- Loading uses the existing accessible `LoadingState`.
- Data failures use the existing `ErrorState` and retry action.
- No-activity conditions use the existing `EmptyState` and do not imply poor performance.
- Evidence freshness is shown using the existing `buildIntelligenceDataQuality` result.
- Navigation exposes `aria-current` for the active Growth destination.
- Sections use semantic headings and `aria-labelledby`.
- Important controls retain visible keyboard focus.
- Contextual navigation is horizontally scrollable on narrow screens rather than causing page overflow.
- Arabic RTL is the default; existing language switching supports English LTR and mixed content remains source-controlled.

## Explicit non-goals

W7.6 does not:
- add a new charting library;
- create a generic analytics dashboard;
- add a recommendation engine;
- add an experiment engine or activation mechanism;
- change AI providers, prompts, models, or persistence;
- change analytics data contracts;
- change routes or deep-link structure;
- change Menu, Customers, Orders, Platform Admin, public menu, authentication, authorization, subscriptions, RLS, Supabase, database schema, dependencies, or deployment;
- begin W7.7, W7.8, W7.9, W7.10, or W7.11.

## Verification target

The W7.6 quality gate must run route generation/freshness, typecheck, repository tests, W7.4/W7.5/W7.6 focused contracts, lint, production build, public browser QA, Studio Shell/Home/Menu/Growth browser QA, performance audit, diagnostics, and cleanup.

The browser matrix is 390×844, 430×932, 768×1024, and 1280×800 with Arabic RTL and supported English LTR, contextual-link reachability, keyboard focus, active navigation semantics, and horizontal-overflow checks.
