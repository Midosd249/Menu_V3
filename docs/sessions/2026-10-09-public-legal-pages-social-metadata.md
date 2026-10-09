# Public Legal Pages and Social Metadata — 2026-10-09

## Scope

Single atomic task: add bilingual public Terms and Privacy routes, expose them from the shared marketing footer, and provide language-appropriate homepage Open Graph/Twitter metadata. No merge or deployment is authorized before owner review.

## Repository evidence

- `src/routes/index.tsx` is the homepage route.
- `src/components/marketing-footer.tsx` is shared across marketing surfaces and already uses `useLang` and `LangToggle`.
- `src/routes/login.tsx` confirms signup collects full name, email, phone, and password; restaurant setup follows registration.
- `src/routes/pricing.tsx` explicitly states online payment is not enabled and upgrades are handled by direct request.
- `src/lib/lang.tsx` stores the language preference in browser local storage.
- `public/og.jpg` is a JPEG measuring 1200 × 630 pixels (blob SHA `9efe69d064762539c2d16a0da46261412a0665d8`).
- Supabase is documented in `README.md` as the production integration and the user explicitly asked that the current storage role be described plainly.

## Implementation

- Added `src/routes/terms.tsx` and `src/routes/privacy.tsx` with Arabic/English content and page metadata.
- Added Terms of Service and Privacy Policy links to the shared marketing footer.
- Added language-aware homepage title, description, Open Graph tags, and Twitter Card tags; the share image points to `https://www.menuun.com/og.jpg` and declares 1200 × 630 dimensions.
- Added contract tests in `tests/public-pages-themes-contract.test.mjs`.

## Legal wording / limitations

- The terms describe account responsibility, customer-provided menu content, current manual/WhatsApp upgrade handling, acceptable use, service availability limitations, and contact for data requests.
- The privacy policy describes signup data (full name, email, phone), restaurant/menu content, Supabase storage infrastructure, login session cookies, local-storage language preference, lack of direct platform payment processing, and a contact route for access/correction/deletion requests.
- It mentions Saudi PDPL and implementing regulations as a relevant framework, without asserting certification or a completed compliance audit.
- It deliberately avoids claims about a specific storage country, a complete list of infrastructure providers, or the absence of all third-party processing.
- These are plain-language draft terms and should receive the owner's legal wording review before merge/publication.

## Research

- Official SDAIA / National Data Governance Platform guide: https://dgp.sdaia.gov.sa/wps/portal/pdp/knowledgecenter/details/PDPLCP
- Official implementing regulation: https://dgp.sdaia.gov.sa/wps/portal/pdp/knowledgecenter/details/PDPL2/
- Research supports mentioning the PDPL as the relevant framework; it does not establish that Menuun has completed a compliance assessment.

## Verification state

- VERIFIED: repository route/footer/signup/pricing/language-source inspection.
- VERIFIED: og.jpg format and 1200 × 630 pixel dimensions.
- IMPLEMENTATION_IN_PROGRESS: changes are committed to `feat/public-legal-pages-social-metadata`.
- UNKNOWN: typecheck, tests, lint, and build until GitHub Actions reports actual results.
- UNKNOWN: visual/social-platform rendering of the image.
- DEPLOYMENT: not performed; must remain not performed.
- STOP: no merge or deployment before owner reviews wording.
