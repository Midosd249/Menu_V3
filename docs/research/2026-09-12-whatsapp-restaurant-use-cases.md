# WhatsApp for Restaurant SaaS — R2.7 Research

Date: 2026-09-12

## Research conclusion

For Menu V3, WhatsApp should remain a **customer communication and sharing channel**, not become the database, POS, payment system, or autonomous ordering authority.

The highest-value progression is:

1. Owner-reviewed report sharing — current R2.7.
2. Menu deep links and prefilled customer messages.
3. Reusable owner response templates and operating shortcuts.
4. Opt-in customer re-engagement workflows where platform/policy requirements are satisfied.
5. Later, optional WhatsApp Business Platform / Cloud API integration for approved transactional messaging and guided experiences.
6. Only after the above is proven, evaluate Flows for structured customer journeys such as contact/support or other guided restaurant tasks.

## Current R2.7 decision

Use WhatsApp click-to-chat with a generated, reviewable message. Do not silently send messages, select recipients, or require a WhatsApp API account.

This is intentionally lightweight and works with the restaurant's existing WhatsApp contact configuration.

## What the current product should use

### Owner reports
- Generate a concise report message from verified analytics.
- Show the generated message before/while sharing.
- Copy the message as a fallback.
- Open WhatsApp with the message prefilled.
- Let the owner choose the recipient.
- Never invent a phone number or recipient.

### Customer menu links
A future extension can generate links to a specific public menu, category, or product and prefill a customer message. This should use existing public routes and verified tenant/branch context.

### Owner operations
WhatsApp Business supports operational features such as quick replies, labels, away messages, and business broadcasts. These are useful patterns for a restaurant SaaS, but Menu V3 should not pretend to control those features until an actual authorized Business Platform integration exists.

## What requires a real platform integration

The WhatsApp Business Platform / Cloud API requires Meta business assets and a business phone number. Programmatic sending, webhooks, templates, and structured Flows therefore belong to a later integration milestone, not the lightweight R2.7 share action.

Potential future architecture:

`Menu V3 verified event/data`
`↓`
`server-side policy + tenant authorization`
`↓`
`WhatsApp Business Platform`
`↓`
`template / approved message / Flow`
`↓`
`customer`

Secrets and tokens must remain server-side. The browser must never receive a long-lived access token.

## Guardrails

- No unsolicited messaging.
- No hidden automation.
- No client-supplied tenant or recipient authority.
- No message sending without explicit product/user intent and required platform authorization.
- No copying Meta/WhatsApp branding or proprietary UI.
- No WhatsApp data treated as Menu V3 database truth.
- No automatic price, availability, allergen, or order-state decisions through WhatsApp.

## Product opportunities ranked

| Opportunity | Value | Complexity | Recommendation |
|---|---:|---:|---|
| Owner report sharing | High | Low | Ship in R2.7 |
| Copy + review fallback | High | Low | Ship in R2.7 |
| Menu/product deep-link sharing | High | Low | Next small enhancement |
| Owner quick-message templates | Medium | Low | Later |
| WhatsApp Business API outbound | High | High | Evaluate after R2 |
| Webhook-based customer conversations | High | High | Later |
| WhatsApp Flows | High | High | Later, only for a proven journey |
| Autonomous WhatsApp ordering | High risk | Very high | Do not build now |

## Sources reviewed

- Meta WhatsApp Business Platform Developer Hub: documentation, API reference, webhooks, policies, opt-in, rate limits, pricing, and developer resources.
- Meta WhatsApp Business app feature documentation: Business Broadcasts, Away Messages, Quick Replies, and Labels.
- Meta-maintained WhatsApp Cloud API examples and WhatsApp Flows tools.

These sources confirm that WhatsApp can support business messaging at scale and structured experiences, while the product must handle platform requirements such as business assets, phone registration, webhooks, templates, and policy constraints.
