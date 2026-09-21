# W15 — Growth, Analytics, and Experimentation

## Status
- Implementation target: measurable, privacy-preserving growth loop.
- Current state: implementation complete pending Quality Gate.

## Research signals
Current product-analytics guidance consistently favors a small event taxonomy, a clear activation/conversion path, segmentation, and experiments with an explicit primary metric and guardrail. Amplitude's product analytics documentation describes product overview, onboarding funnels, feature engagement, and retention as core views; its experimentation guidance requires a hypothesis, variants, and a trusted goal metric. Google Analytics guidance likewise recommends controlled event naming and explicit custom-event contracts.

Sources reviewed:
- https://amplitude.com/docs/analytics/product-analytics
- https://amplitude.com/docs/quick-guides/run-your-first-experiment
- https://amplitude.com/docs/analytics/charts/funnel-analysis/funnel-analysis-build
- https://developers.google.com/data-manager/api/reference/analytics/recommended-events

## Repository evidence
Menu V3 already has a server-side event recorder and owner analytics endpoint. The public recorder supports exactly four customer events:

| Event | Meaning | Deduplication | Primary use |
| --- | --- | --- | --- |
| `visit` | menu entry | same tenant + session + event within 30 min | acquisition baseline |
| `qr_scan` | QR-origin signal | same tenant + session + event within 30 min | distribution |
| `product_view` | product interest | event-level | content engagement |
| `whatsapp` | high-intent contact | event-level | conversion intent |

The event recorder resolves the tenant from the published slug and validates product ownership before recording product views. Owner aggregation is tenant-scoped through authenticated membership. This existing contract is deliberately preserved rather than creating a parallel analytics system.

## Growth metrics
W15 derives four decision metrics from server-reported owner analytics:

1. Product interest rate = product views / visits.
2. Session engagement rate = engaged sessions / unique sessions.
3. WhatsApp intent rate = WhatsApp clicks / unique sessions.
4. QR-to-visit rate = visits / QR scans.

Supporting signal: average product views per unique session.

These are directional operating metrics, not claims of statistical significance. A denominator of zero renders as unavailable rather than a fabricated percentage.

## Opportunity model
The Studio now classifies the current opportunity without inventing business truth:
- `baseline`: no meaningful traffic yet.
- `discovery`: traffic exists but product interest is absent.
- `conversion`: product interest exists but WhatsApp intent is absent.
- `content`: interaction exists but there is insufficient ranked product/category evidence.
- `distribution`: core interaction exists and distribution/QR becomes the next lever.

## Experimentation policy
W15 intentionally does **not** ship a fake A/B test or client-only conversion truth. A real experiment requires an exposure/variant property tied to the measured outcome. The current `menu_events` schema does not carry an experiment key or variant, so production experimentation is marked `UNKNOWN / NOT READY` rather than fabricated.

When experimentation is opened, every experiment must define:
- hypothesis;
- control and treatment;
- exposure event;
- primary success metric;
- guardrail metric;
- target audience;
- minimum run window/sample rule;
- rollback condition;
- owner and decision date.

Recommended first experiment once the event model supports variants: a reversible CTA hierarchy change on a high-traffic conversion surface, measured against WhatsApp intent or a future direct-order completion event.

## Privacy and integrity rules
- No new fingerprinting.
- No IP-address storage introduced.
- No new third-party analytics SDK introduced.
- Keep anonymous session identity limited to the existing menu analytics mechanism.
- Never expose cross-tenant analytics to an owner.
- Never compute a conversion rate from an invented denominator.
- Do not label estimates as observed data.

## Product decision
The immediate growth lever is not adding another dashboard chart. It is making the existing event stream decision-ready: acquisition → engagement → intent, with a clear next action for the restaurant owner. This creates a foundation for future controlled experimentation without sacrificing trust or adding unnecessary infrastructure.
