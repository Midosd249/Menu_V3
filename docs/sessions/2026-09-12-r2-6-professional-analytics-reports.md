# 2026-09-12 — R2.6 Professional Analytics Reports

## Scope
R2.6 refines the existing Analytics report workflow rather than introducing a second reporting system.

## Verified contract
- Reports are generated from canonical `OwnerAnalytics`, `StudioSnapshot`, `Menu Intelligence`, and the verified Growth Advisor.
- No revenue, profitability, customer satisfaction, or unsupported conversion claims are introduced.
- The report distinguishes observed analytics from menu-health findings and owner recommendations.
- Arabic and English remain first-class report languages.
- 7-day and 30-day windows remain available.
- Print / Save as PDF remains browser-native; no server PDF service or new dependency is introduced.
- WhatsApp remains owner-initiated: the application generates text and opens WhatsApp; it does not send automatically.
- No new analytics events, database migration, authentication, RLS, tenant-isolation, or provider changes are introduced.

## Layout principles
- Preserve the existing Studio shell and route structure.
- Keep report sections separated into executive header, observed metrics, health breakdown, content check, verified insights, priorities, and delivery.
- Use print-only styling to remove interactive controls without changing the on-screen Studio experience.
- Avoid fixed/absolute overlays, oversized z-index values, or stacked floating UI.
- Use wrapping-safe Arabic/English typography and grid/flex layouts rather than brittle positioning.

## Completion criteria
- Report content is deterministic and evidence-backed.
- Report has an executive summary, KPI block, health breakdown, verified analytics signals, content findings, and prioritized actions.
- Long Arabic/English content wraps without clipping or overlap.
- Print output remains legible and excludes interactive delivery controls.
- Existing tests plus the R2.6 report contract tests are part of the repository quality gate.
