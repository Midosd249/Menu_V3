# W7.7 Customers Workspace

## Status
`IMPLEMENTATION_IN_PROGRESS` pending current-head quality verification.

## Purpose

W7.7 turns the existing `/studio/guests` route into a focused Customers Workspace without changing the customer data contract, backend behavior, permissions, or route URL.

The workspace answers:
1. What guest data is actually known?
2. What relationship signals are recorded?
3. Which customer-related capabilities are genuinely supported?
4. What is not available yet?

It is not a generic CRM, marketing automation system, or predictive retention product.

## Existing sources reused

- `useStudio()` for restaurant context and currency.
- `getGuestRelationshipOverview({ data: {} })` for the existing server-authorized relationship overview.
- `GuestRelationshipOverview` for the existing aggregate contract.
- Existing W7.2 internal design-system primitives: `PageHeader`, `SectionHeader`, `MetricRow`, `InsightCard`, `StatusBadge`, `EmptyState`, `LoadingState`, `ErrorState`, `PermissionDeniedState`.
- Existing Studio Shell Customers navigation at `/studio/guests`.

No new query, API, migration, schema, permission, RLS policy, dependency, or route was introduced.

## Information architecture

### 1. What customer data exists?

Shows only the existing aggregate guest signals:
- known guest profiles;
- repeat guests;
- active guests in the last 30 days;
- lapsed guests 60+ days.

When no guest profiles exist, the workspace uses an explicit empty state and states that no recorded profiles does not mean the restaurant has no customers.

### 2. Signals that need interpretation

- Feedback: real record count and average rating when available; the page does not claim unresolved/review status because the current overview source does not expose it.
- Retention: existing `verified` / `insufficient` evidence state; no predictive retention rate, cohort, or churn score is invented.

### 3. Supported relationship capabilities

The workspace reflects the existing R9 capability foundation:
- Loyalty: real members/points aggregate when present.
- Campaigns: real draft count only; outbound delivery remains manual.
- Feedback: real aggregate count/rating only.
- Guest profiles: real aggregate count.

These are presentation states, not new standalone navigation routes.

### 4. Current limits

The current repository does not provide a dedicated customer list/detail data source or route. Therefore W7.7 intentionally does not add:
- customer search/filter;
- guest detail panel;
- individual customer contact fields;
- customer timeline;
- customer segmentation;
- cohort analysis;
- CLV;
- churn score;
- next-best-action recommendations;
- campaign creation/sending;
- feedback moderation/reply workflow.

## Data honesty

`VERIFIED`
- All displayed customer/guest values come from the existing server function.
- No guest names, contacts, orders, spend, loyalty points, campaign results, feedback records, ratings, segments, cohorts, retention rates, CLV, churn, or recommendations are fabricated.
- Observed average order value is retained only as the existing aggregate signal and is explicitly not presented as customer lifetime value.
- Empty, loading, error, permission-denied, and unsupported capability states are distinct.

## Accessibility / RTL / responsive

- Arabic RTL is the default.
- Existing language switching supports English LTR.
- Logical layout utilities and existing internal primitives are reused.
- Refresh has an accessible name and visible focus.
- State components expose semantic status/alert roles.
- Content is tested at 390×844, 430×932, 768×1024, and 1280×800.
- No standalone Loyalty/Campaigns/Feedback/Retention links are rendered.
- No horizontal page overflow is accepted.

## Security boundary

The existing `getGuestRelationshipOverview` remains the only relationship data entry point. Its server-side authentication, owner/admin authorization, tenant scope, optional branch scope, RLS-backed R9 tables, and public access restrictions are untouched.

## Explicit non-goals

- No database/schema/Supabase/RLS changes.
- No auth/authz/permission changes.
- No subscription/entitlement changes.
- No AI provider/business-logic changes.
- No orders business-logic changes.
- No public-menu changes.
- No Platform Admin work.
- No dependency/package changes.
- No route restructuring.
- No W7.8+ work.
- No merge or deployment.

## Verification target

Required current-head evidence:
- route generation and generated freshness;
- typecheck;
- repository tests;
- W7.7 focused contract tests;
- lint;
- production build;
- public browser QA;
- Studio Shell/Home/Menu/Growth/Customers browser QA;
- performance audit where configured;
- final diff review.

Physical real-device QA remains release-stage evidence only.
