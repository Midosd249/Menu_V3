# Session — 2026-09-21 Focused Public UX, WhatsApp Ordering, and Marketing Footer

## Scope
Focused production-quality pass covering only homepage demo data/media, Essential/Noir Featured-card geometry, WhatsApp customer-order flow/commercial packaging review, and shared marketing/account footer.

## Current verified baseline
- VERIFIED: based on current main 91b7e8e6d6b3e5e9be2070a203c501b77bde7feb.
- VERIFIED: homepage demo source is src/lib/menu/demo.ts; it contains distinct espresso and latte images and bilingual tenant names.
- VERIFIED: fast-casual is a legacy alias to essential in src/lib/theme/registry.ts; no new theme is introduced.
- VERIFIED: shared public renderer owns Featured, WhatsApp, cart/order, and customer actions in src/components/public-menu.tsx.
- VERIFIED: real marketing/account routes are /, /pricing, /themes/preview, and /login. No verified /about, /contact, /help, /privacy, or /terms route/content exists.

## Implemented
- Homepage preview consumes canonical DEMO_MENU tenant/product data rather than duplicated restaurant/product copy.
- Homepage demo media uses distinct source images and a fixed 4/3 image box with object-fit: cover.
- Homepage preview restaurant name switches between the canonical Arabic and English demo names.
- Featured cards now have an explicit shared shell class and scoped Essential/Noir geometry so surface, border, radius, media crop, and quick-add stretch as one card.
- Added structured WhatsApp cart-order links containing restaurant, branch, item names, quantities, selected variant/options, line totals, grand total, optional notes, and current UI language.
- Existing WhatsApp contact actions now use the centralized URL builder and record the existing whatsapp analytics event.
- Added regression coverage for WhatsApp order-message construction, homepage demo data/media, Essential/Noir Featured geometry, and footer destinations.
- Added reusable bilingual MarketingFooter to homepage, pricing, theme preview, and login. It uses only verified routes/anchors and safe-area spacing.
- No public-menu customer footer was added to /m/* menu pages.

## WhatsApp commercial review
- VERIFIED: commercial catalog is still operational-limit based and does not expose a server-authoritative WhatsApp entitlement key to the public-menu renderer.
- IMPLEMENTED: structured customer-side WhatsApp order messaging and click tracking are real capabilities.
- BLOCKED: plan-specific gating/differentiation for structured WhatsApp ordering, per-plan WhatsApp number/configuration, and owner-facing entitlement status require a new server-authoritative entitlement contract. Do not advertise a plan-specific WhatsApp gate until that contract exists and is enforced server-side.
- Research: WhatsApp officially supports wa.me links with URL-encoded pre-filled messages. Saudi-oriented digital-menu competitors commonly position WhatsApp ordering as a direct-ordering channel; this pass therefore prioritizes a frictionless customer flow without inventing a new commercial entitlement.

## Verification status
- VERIFIED: targeted source-level regression contracts were added.
- UNKNOWN: local npm test, typecheck, lint, and build have not been executed in this session because no repository working tree/runtime is available through the GitHub connector.
- UNKNOWN: physical Android/iOS visual screenshots are not available in this session.
- CI/browser verification must be completed from the GitHub PR before merge/release.

## Exact Next Task
Run repository Quality/test/typecheck/lint/build and browser visual verification for this branch, including 320/375/430px Arabic RTL and English LTR, Essential/Noir Featured states, homepage demo language/media, cart WhatsApp message flow, and marketing/account footer. Review the final PR diff and resolve only task-scoped failures.
