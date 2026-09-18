# A.4 — International Boundary Audit

## Status
- Status: CLOSED / AUDIT COMPLETE / NOT DEPLOYED.
- Task: A.4 International Boundary Audit.
- Repository: `Midosd249/Menu_V3`.
- Canonical source of truth reviewed: `main`.
- Audit branch: `audit/a4-international-boundary-2026-09-18`.
- Audit baseline: `39793ecaa51d64dfa34df7a632fd0c956f4c7268`.
- Runtime/schema changes: NONE.
- Production deployment: NONE.

## Objective

Determine whether Saudi Arabia is implemented as a **market configuration/default** or as an **architectural boundary**, while preserving the current Saudi-first product strategy.

The target transition is:

`Saudi-specific defaults and commercial assumptions → configurable market behavior with Saudi as the default`

This audit does **not** authorize a global launch, new locales, payment infrastructure, tax behavior, country-specific compliance claims, or a database redesign.

## Evidence hierarchy

1. Repository code/configuration.
2. Git history and existing tests/docs.
3. Authoritative external internationalization guidance.

## External research

### VERIFIED — W3C Internationalization
W3C defines internationalization as designing/developing so software can adapt to users from different cultures, regions, and languages, including dates, numbers, names, directionality, and other cultural conventions. This supports treating market configuration as a first-class boundary rather than embedding one region into every formatting path. Sources: W3C Internationalization — https://www.w3.org/mission/internationalization/ and https://www.w3.org/International/i18n-drafts/nav/about

### VERIFIED — Unicode CLDR
CLDR provides locale data for numbers, currencies, dates, times, time zones, and related regional conventions. Currency formatting must be driven by the currency/locale context rather than manually concatenating a single market's currency representation. CLDR also documents bidi considerations for currency/number formatting. Sources: Unicode CLDR — https://cldr.unicode.org/translation/number-currency-formats/number-symbols, https://cldr.unicode.org/translation/number-currency-formats/number-and-currency-patterns, and https://www.unicode.org/reports/tr35/dev/tr35-numbers.html

### VERIFIED — JavaScript Intl
`Intl.NumberFormat` supports ISO 4217 currency codes and locale-sensitive currency display. `Intl.DateTimeFormat` supports explicit locale and IANA time-zone selection; when a time zone is omitted, the runtime's time zone is used. citeturn0search10turn1search0turn1search1

## Audit matrix

| Boundary | Evidence | Status | Finding |
|---|---|---|---|
| Tenant country | `src/lib/menu/map.ts` maps tenant country and defaults missing country to `SA` | VERIFIED | Saudi is a configurable field, but the mapper currently embeds `SA` as the fallback. |
| Tenant currency | `src/lib/menu/map.ts` maps tenant currency and defaults missing currency to `SAR` | VERIFIED | Currency is represented as tenant data, but the fallback is Saudi-specific. |
| Public price formatting | `src/lib/utils.ts` exposes `formatSar()` and hardcodes `ar-SA`/`en-SA` plus SAR presentation | VERIFIED | This is the clearest reusable formatting boundary that is Saudi-specific rather than market-configurable. |
| Public SEO country | `src/lib/menu/seo.ts` checks `tenant.country === SA` before emitting the verified location block | VERIFIED | Safe for Saudi local SEO; the logic is intentionally Saudi-specific but is isolated behind a named eligibility function. |
| Public SEO locale | `src/lib/menu/seo.ts` supports `ar`/ `en` and emits `ar_SA` / `en_US` for OG locale | VERIFIED | Language support exists, but region metadata is not derived from tenant market configuration. |
| Public URL locale | `src/routes/m.$slug.tsx` and branch route use `lang=ar|en` | VERIFIED | Language is a route-level state. It is not yet a general BCP 47 locale model. |
| English availability | Public SEO requires real English tenant + branch names | VERIFIED | Correctly avoids fabricated English content. |
| RTL/LTR | Root document derives `lang` and `dir`; existing docs/tests cover mixed bidi content | VERIFIED | Locale presentation is structurally handled and should not be replaced by market logic. |
| Time zone | `Asia/Riyadh` is explicit only in billing-related formatting; other date/time formatters omit `timeZone` | VERIFIED | Date/time presentation is not consistently tied to a tenant/branch time-zone contract. Browser/runtime time zone can therefore affect some displays. |
| Phone normalization | Public action helpers preserve explicit international numbers, but Saudi local normalization exists; onboarding/login explicitly require Saudi phone | VERIFIED | Customer onboarding is currently Saudi-market constrained. This is a commercial lifecycle boundary, not merely a formatting default. |
| Address/locality | Tenant/branch expose country/city/address data; SEO only emits Saudi address structured data when its Saudi verification contract is complete | VERIFIED | Data model has geographic concepts, but international address semantics are not yet generalized. |
| Calendar/numbering system | Formatting uses `ar-SA`/`en-SA`; no tenant-level calendar/numbering preference | VERIFIED | Saudi defaults are embedded in several presentation paths. No broader calendar policy is defined. |
| Marketing positioning | Existing product copy and strategy explicitly target Saudi restaurants / Saudi-first hospitality | VERIFIED | This is intentional market positioning, not evidence that every product subsystem must be Saudi-only. |
| Tenant/branch isolation | Existing multi-tenant/branch model remains independent of country/currency | VERIFIED | No evidence that tenant identity or authorization is structurally coupled to Saudi country data. |
| Subscription/order architecture | Existing tenant/order/subscription relationships use tenant IDs and typed business data rather than country-specific keys | VERIFIED | No architectural dependency on Saudi country codes was found in the audited boundary. |

## Detailed findings

### A4-F1 — Tenant market fields already provide a useful configuration boundary
**VERIFIED**

The public menu model carries tenant `country`, tenant `currency`, city, branch identity, and related location data. This is the correct architectural direction: market information is represented as tenant data rather than encoded into tenant identity or routing.

**Implication:** Do not introduce a second market/region abstraction unless a concrete requirement proves the existing tenant fields insufficient.

### A4-F2 — Saudi defaults are present in mapping and formatting
**VERIFIED**

The mapper defaults missing tenant country to `SA` and missing currency to `SAR`. The shared `formatSar()` helper is explicitly Saudi-specific, and several Studio/Admin/Orders paths use `ar-SA` / `en-SA`.

**Assessment:** These are not evidence of a Saudi-only architecture by themselves, but they are future internationalization seams. A future market-config task should centralize locale/currency/time-zone defaults rather than duplicate Saudi constants.

### A4-F3 — Currency formatting should become currency-driven, not SAR-driven
**VERIFIED**

The repository already stores currency on the tenant/product/order model in the relevant paths, while `formatSar()` still assumes SAR. `Intl.NumberFormat` supports an ISO 4217 currency input and localized display. citeturn0search10turn0search1

**Required future direction:** introduce a generic formatter such as `formatCurrency(amount, currency, locale)`, preserve SAR as the default market configuration, and migrate callers only where evidence shows the generic boundary is required.

**Not part of A.4:** implementing that formatter.

### A4-F4 — Time-zone behavior is the largest correctness gap
**VERIFIED**

Only selected billing paths explicitly use `Asia/Riyadh`. Other date/time formatting paths use `Intl.DateTimeFormat` without a `timeZone` option. MDN documents that the default time zone is the runtime time zone. citeturn1search0turn1search1

**Risk:** an owner or guest in another time zone can see dates/times converted to their device/runtime zone instead of the restaurant/branch's operational zone.

**Required future direction:** establish a tenant/branch time-zone contract, defaulting Saudi tenants to `Asia/Riyadh`, then pass that zone to relevant formatters.

**Not part of A.4:** schema migration or runtime behavior change.

### A4-F5 — Phone onboarding is intentionally Saudi-only today
**VERIFIED**

The customer lifecycle contains explicit Saudi-phone validation and messaging, while public contact helpers can preserve explicit international numbers.

**Assessment:** This is a deliberate current commercial/onboarding boundary. It should not be “fixed” as part of an internationalization cleanup because broadening self-serve phone onboarding changes identity, fraud, verification, and operational policy.

**Required future direction:** if international self-serve is approved later, define supported markets and phone verification policy first, then implement as a separate Auth/Security/Product task.

### A4-F6 — Public SEO has a safe Saudi-specific eligibility guard
**VERIFIED**

Structured address data is emitted only when the tenant country is `SA` and the required location fields are present. This avoids inventing international location facts.

**Assessment:** Keep the safety boundary. Generalize it only when there is a verified international address contract and corresponding schema/test evidence.

### A4-F7 — Locale architecture is bilingual, not yet market-general
**VERIFIED**

The public route supports Arabic and English via `lang=ar|en`, and the root document follows that state. The repository deliberately falls back to Arabic when English tenant/branch identity is unavailable.

**Assessment:** This is a healthy current bilingual contract. Do not replace it with a full locale negotiation system merely because A.4 identifies an international boundary.

### A4-F8 — Saudi-first marketing is not an architectural defect
**VERIFIED**

The product strategy and public copy intentionally position Menu V3 around Saudi restaurants and Arabic-first hospitality.

**Assessment:** No rewrite is required. The product can remain Saudi-first while its underlying market data and formatting boundaries become configurable.

## What is already international-ready

- Tenant/branch identity is ID-based, not country-code-based.
- Tenant currency is represented as data.
- Explicit international phone numbers are preserved by public contact helpers.
- Arabic/English locale state is route-aware and SSR-aware.
- Mixed-direction content has existing bidi handling and tests.
- Public SEO has a separated local-eligibility guard.
- Public paths are slug/branch based rather than country based.
- Theme architecture is independent of country.

## What remains Saudi-bound

1. Saudi fallback values in tenant mapping: `SA` and `SAR`.
2. Shared `formatSar()` helper.
3. Multiple `ar-SA` / `en-SA` formatting calls.
4. Inconsistent explicit time-zone handling.
5. Saudi-only self-serve phone onboarding.
6. Saudi-specific local SEO eligibility.
7. Saudi-oriented product/marketing copy.

Items 1–3 are **technical configuration seams**.
Items 4–5 are **correctness/security/commercial policy seams**.
Items 6–7 are **intentional Saudi-first product behavior**, not defects.

## Architectural conclusion

**VERIFIED:** Menu V3 is **Saudi-first, but not fundamentally Saudi-architected**.

The repository already has the correct high-level ingredients for a market-configurable product: tenant country/currency fields, tenant/branch boundaries, bilingual locale state, and isolated SEO/location logic.

However, the product is **not yet international-market ready**. Several formatting and lifecycle paths still encode Saudi assumptions directly, and time-zone behavior is not consistently anchored to restaurant/branch configuration.

The safe target is therefore:

`Saudi-first product + centralized market defaults + explicit tenant/branch locale/currency/time-zone configuration`

—not:

`Saudi product → immediate global product rewrite`.

## Recommended future work

### Priority A — Configuration foundation
Create a single market/locale formatting contract covering:
- default country;
- default currency;
- default UI locales;
- default time zone;
- number/currency formatting;
- date/time formatting;
- phone display/normalization policy.

Preserve `SA / SAR / Asia/Riyadh / ar` as the current defaults.

### Priority B — Time-zone correctness
Add or confirm a tenant/branch time-zone field and migrate operational date/time presentation to use it explicitly.

### Priority C — Currency generalization
Replace Saudi-only reusable money formatting with a currency-aware formatter using the stored ISO currency code.

### Priority D — Phone policy separation
Keep Saudi self-serve onboarding unchanged until a separate product/security decision approves international phone verification.

### Priority E — SEO localization
Generalize regional SEO only when the product has verified address/country data for additional markets. Preserve the current Saudi eligibility guard until then.

## Explicit non-goals

A.4 does not:
- add countries;
- add currencies;
- add languages;
- change onboarding;
- change authentication;
- change phone verification;
- change tax/payment behavior;
- add regulatory claims;
- alter public themes;
- change tenant/branch authorization;
- introduce a new market database;
- deploy to production.

## Acceptance criteria

- [x] Current `main` verified before audit.
- [x] Continuity and relevant specialist/research documentation inspected.
- [x] Relevant locale/currency/time-zone/phone/SEO seams searched in repository.
- [x] Saudi defaults distinguished from architectural coupling.
- [x] Auth/onboarding Saudi restriction identified as a separate policy boundary.
- [x] Time-zone correctness gap identified.
- [x] No runtime/schema/deployment changes introduced.
- [x] Exactly one next task recorded: A.5 Public Shareability / Deep-Link Audit.

## Verification limitations

- Repository/code/GitHub evidence was available.
- External i18n standards research was performed.
- Local runtime/browser/device verification was not performed through the GitHub-only execution surface.
- Therefore visual/runtime behavior not directly exercised here remains **UNKNOWN**.

## Next task

**A.5 — Public Shareability / Deep-Link Audit.**
