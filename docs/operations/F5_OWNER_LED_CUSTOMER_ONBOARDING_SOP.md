# F5.2 — Owner-Led Customer Onboarding Operating Procedure

**Status:** IMPLEMENTED ON BRANCH — PENDING REVIEW AND CI  
**Baseline:** `main` at `1cdf33335a1be9e1a7885c405418b9d646e844df`  
**Date:** 2026-11-03  
**Owner model:** one human Platform Owner/operator; restaurant owner remains accountable for their business content and publication.  
**Scope:** a repeatable, manual operating procedure using only capabilities verified in F5.1. This document does not add product functionality.

## 1. Purpose and operating boundary

Provide one controlled procedure from first discovery through menu publication, QR handover, staff access, and support handoff. The procedure is designed for the current owner-operated business; it does not imply a staffed sales, implementation, or customer-success team.

**Critical commercial gate — F3:** F3 Backup, Restore & Disaster Recovery remains **DEFERRED BY OWNER — NOT DONE**. This SOP may be prepared and rehearsed with fictional/test data, but it MUST NOT be used to onboard the first real customer, accept real customer-owned data, or launch commercially until F3's required recovery gate is completed and explicitly closed. No customer onboarding occurred while preparing this SOP.

## 2. Evidence labels and capability limits

- **VERIFIED:** supported by the F5.1 source-backed journey at `docs/operations/F5_SALES_TO_ACTIVATION_JOURNEY.md`.
- **PROPOSED:** recommended operator practice in this SOP; not an automated Menuun feature or a contractual commitment.
- **UNKNOWN / NOT ESTABLISHED:** do not promise or simulate it as an existing capability.

Verified product path includes public marketing/pricing/theme preview, external email/WhatsApp contact, self-serve account signup and workspace provisioning, Studio brand/branch/menu/import/preview/publish, branch and optional table QR, owner-created team invitations, and manual plan requests/invoicing.

Not established: CRM/lead capture, appointment booking, dedicated demo tenant, automated concierge, automatic team-invitation email delivery, ticketing, support SLA, online checkout/payment collection, automatic payment reconciliation, or customer-success automation.

## 3. Roles and accountability

| Role | Responsibility | Boundary |
|---|---|---|
| Platform Owner / operator | Discovery, explain supported scope, guide setup, perform operator-side review, document open issues, provide support contact and administer manual commercial requests. | Never asks for or stores customer passwords; never claims an unsupported feature; never overrides tenant/branch authorization. |
| Restaurant Owner | Creates and controls their account, supplies authoritative business/menu information and authorized media, validates all guest-facing content, chooses staff access, and explicitly publishes. | Owns correctness and approval of restaurant prices, descriptions, operating details, and publication. |
| Restaurant Staff | Uses an individual invited account within assigned role/branch scope. | No shared owner credentials; no broader access than the job requires. |

## 4. Stage A — Discovery and fit

**Goal:** understand the restaurant's desired outcome and determine whether the current product can support it.

1. Record only the minimum business contact and follow-up information needed in an owner-controlled private record. Do not place passwords, authentication tokens, payment-card data, identity documents, or unnecessary personal data in notes.
2. Ask:
   - Restaurant name and business type.
   - Number of branches intended for the initial setup.
   - Primary launch goal and desired date.
   - Current menu source (editable file, PDF, photographs, or manual list).
   - Required guest languages (Arabic/English support is present; completeness depends on supplied content).
   - Who has authority to approve prices, menu wording, images, and publication.
   - Whether staff access is needed at launch.
3. Demonstrate only public marketing/pricing/theme-preview surfaces that exist. If showing an authenticated Studio flow, use an owner-controlled test account and clearly label it as a demonstration. A dedicated demo tenant or booking workflow is not established.
4. Explain constraints early: self-serve signup, explicit owner publication, manually shared invitation links, manual WhatsApp plan requests, and no online payment collection or support SLA.
5. Record one agreed next step and any out-of-scope request. Do not promise a delivery date until content readiness and scope are understood.

**Exit gate:** restaurant fit and decision-maker are clear; unsupported requirements are disclosed; F3 commercial gate is satisfied before any real-customer onboarding proceeds.

## 5. Stage B — Data and asset collection

**Goal:** obtain an authoritative, reviewable source before entering data.

Request only what is needed:
- Current menu with category and item names, prices, currency, variants/options, required choices, add-ons and availability.
- Arabic and English text supplied or approved by the restaurant.
- Descriptions and ingredient/allergen/dietary statements only when confirmed by the restaurant's responsible kitchen representative.
- Current logo, cover and item photographs the restaurant is authorized to use.
- Correct branch names, address/location link, contact channels and actual operating hours.
- Names/emails of staff who need access, intended role, and branch scope.

Controls:
1. Identify one authoritative menu version and its date/owner. Resolve conflicts between printed menus, spreadsheets, PDFs, and verbal updates before import.
2. Do not infer prices, allergens, nutrition, ingredients, dietary claims, opening hours, or image rights. Leave uncertain information out and request confirmation.
3. Treat AI-assisted PDF/image extraction as a draft only. A human must compare every extracted item and price with the authoritative source.
4. Do not request customer passwords, OTPs, API keys, payment credentials, or unrelated personal data.
5. Transfer assets through an owner-approved channel; do not put private assets or personal data in public links or GitHub issues/PRs.
6. Record receipt and approval status, not unnecessary copies of personal data.

**Exit gate:** restaurant owner confirms the source menu, asset rights, prices, branch facts, language content, and the person authorized to approve publication.

## 6. Stage C — Account and workspace setup

1. The restaurant owner registers and verifies their own account through the current signup flow.
2. The owner signs in and completes `/onboarding`; the active path is self-serve. Do not route the owner into the superseded manual-approval lifecycle.
3. The owner supplies required onboarding fields, including the Saudi phone format enforced by the current flow.
4. Confirm the provisioned workspace and main branch in Studio. Default branch hours are starter values; the owner must replace them with actual hours.
5. The owner configures brand and branch details in the existing Studio surfaces. Add additional branches only when needed and allowed by server-enforced plan entitlements.
6. The operator guides but does not impersonate the restaurant owner or take ownership of the account.

**Exit gate:** owner can access their own Studio; tenant/branch context is correct; business identity, contacts, location, and hours have been reviewed.

## 7. Stage D — Menu configuration

1. Create or import categories/items using the existing menu and import surfaces.
2. Review all rows from imports before saving/publishing. Confirm:
   - Arabic and English names and descriptions.
   - Category and display order.
   - Price and currency.
   - Variants, required options, add-ons and their prices.
   - Availability.
   - Image-to-item matching and image rights.
   - Any dietary/allergen statement against explicit restaurant confirmation.
3. Remove or leave out stale, duplicate, or unconfirmed entries rather than guessing.
4. Verify the menu against the authoritative source, including a sample of every category and every price. For a small menu, check every item.
5. Record the menu version/date approved by the restaurant owner.

**Important:** menu import/AI extraction is not a source of truth. The restaurant owner is the final authority for business content.

**Exit gate:** restaurant owner confirms the complete intended initial menu and all guest-facing claims.

## 8. Stage E — Preview and acceptance review

The restaurant owner reviews the private preview before publication. The operator uses the following checklist:

- Arabic RTL and English LTR behavior.
- Mixed Arabic/English names, long names and descriptions.
- Mobile viewport first, then desktop.
- Correct category order, prices, currency and options.
- Available/unavailable items and missing-image behavior.
- Correct logo, cover, colors and branch identity.
- Guest-visible contact/action links are accurate and configured.
- No draft/private content is exposed through the public guest route.
- Branch identity and hours match the intended launch branch.

For material corrections, update the source content and repeat the review. Do not use a production deployment as a substitute for preview review.

**Acceptance record:** owner name/role, menu version/date, review date, accepted corrections, and explicit approval to publish. Store only necessary business records.

## 9. Stage F — Explicit publication

1. Publication is performed by the restaurant owner through the existing publish control in `/studio/settings#publishing`.
2. Preview is not publication. Do not tell guests that the menu is live until publication has been confirmed.
3. After publishing, open the public branch URL in a fresh guest session and verify that the correct restaurant/branch and intended menu are visible.
4. If critical content is wrong, stop handover. The owner may unpublish using the existing control while corrections are made; do not make an application rollback or deployment rollback an automatic response to a content error.
5. Record publication confirmation and the public URL; do not store QR secrets or invitation tokens in the record.

**Exit gate:** correct public menu is accessible and the owner confirms the published content.

## 10. Stage G — Branch QR and optional table QR handover

1. Generate the normal branch menu URL/QR from `/studio/qr`.
2. Scan the QR with a guest device/session and verify that it opens the correct public branch menu. Check printed dimensions and placement before distribution.
3. Explain that branch QR and table-specific ordering QR are different use cases.
4. Only configure table-specific QR when the restaurant explicitly wants the supported table-ordering flow and its tables are correctly identified.
5. Treat table QR tokens as sensitive: raw tokens are shown once; never copy them into support notes, screenshots, chat, or public issue trackers. Rotation invalidates the previous code and should be used only when replacement is intended or compromise is suspected.
6. Confirm that the restaurant understands where each code should be placed and who maintains printed copies.

**Exit gate:** owner has the correct branch QR/link; any optional table QR is mapped and tested; no secret token is retained in the handover record.

## 11. Stage H — Staff access

1. Restaurant owner identifies each staff member who genuinely needs Studio access.
2. Invite each person using their own email through `/studio/team`.
3. Select the minimum supported role (`admin` or `editor`) and branch assignment appropriate to the task.
4. Explain that invitation links are manually copied/shared, expire after seven days, and acceptance requires a verified matching email. Do not promise automatic invitation email delivery.
5. Share each invitation privately with its intended recipient. Never share the owner's login or reuse one staff account for multiple people.
6. If an invitation expires or is misdirected, the owner should create a fresh invitation through the supported flow; do not ask for the invitee's password or verification code.
7. The owner reviews access when staff leave or change responsibilities and removes access using the existing supported team controls.

**Exit gate:** only intended people have access, role/branch assignments are confirmed, and invitations are accepted or explicitly left pending.

## 12. Stage I — Support and commercial handoff

Provide the published Menuun support email/WhatsApp contact and explain how to report an issue. The current product does not establish ticketing, case numbers, guaranteed response times, or an SLA; do not promise them.

For each issue, the operator should record:
- Date/time and restaurant/branch reference (avoid personal details where possible).
- A concise description and reproducible steps.
- Expected versus observed behavior.
- Severity/impact and safe workaround.
- Whether the issue affects guest access, published prices/content, staff access, or ordering.
- Owner and next follow-up action.

Never request passwords, OTPs, full payment credentials, raw QR tokens, or secrets as troubleshooting evidence. Use redacted screenshots/log excerpts.

Commercial boundary:
- Plan-upgrade requests are initiated through the existing WhatsApp flow and handled manually by the Platform Owner.
- The owner must verify the requested plan/status/duration and applicable entitlement before applying an administrative change.
- An invoice is not proof of payment. No online checkout, automatic charge, payment webhook, or payment-success state is established.
- Do not promise a paid feature or entitlement until the authorized owner-side change is confirmed.

## 13. Controlled launch checklist

A launch is ready only when all applicable items are true:

- [ ] F3 pre-commercial gate is completed and documented.
- [ ] Restaurant owner and publication authority are identified.
- [ ] Authoritative menu and approved assets are recorded.
- [ ] Prices, options, availability, translations and claims are owner-verified.
- [ ] Branch identity, address, contacts and hours are correct.
- [ ] Private preview is reviewed and accepted.
- [ ] Owner explicitly publishes.
- [ ] Public URL is checked in a fresh guest session.
- [ ] Branch QR is scanned and points to the correct branch.
- [ ] Optional table QR is tested separately and tokens are handled securely.
- [ ] Staff invitations use individual accounts and least-privilege roles.
- [ ] Support contact and issue-reporting expectations are explained.
- [ ] Manual billing/payment limitations are understood.
- [ ] Open issues have an owner and next action; critical issues block handover.

## 14. Stop / escalation rules

Stop publication or handover when:
- Menu prices, currency, allergen/dietary statements, branch identity, or owner approval are uncertain.
- A QR points to the wrong tenant/branch or a table token may be exposed.
- An unauthorized person has access or tenant/branch context appears incorrect.
- The published guest menu is materially different from the approved preview.
- A critical guest-facing path is broken and no safe workaround exists.
- The F3 pre-commercial gate is incomplete.

Do not resolve these by bypassing authorization, sharing credentials, editing production data outside supported Studio controls, running migrations, or deploying an unverified fix. Escalate to the Platform Owner and use the relevant incident/security procedure when appropriate.

## 15. Minimal owner operating record

**PROPOSED** private record fields:
- Restaurant/business reference and owner contact channel.
- Discovery date, desired outcome, branch count, and agreed next step.
- Authoritative menu/asset version and owner approval date.
- Setup/preview/publication/QR/staff-access completion dates.
- Open issues, impact, owner and next follow-up.
- Commercial request status using explicit states such as requested / reviewed / approved / invoiced; never infer paid from invoiced.

Keep this record access-restricted and collect only information necessary for the operating purpose. Define a retention/deletion practice before storing personal data at scale. Do not use GitHub as a customer CRM or store customer-specific personal data in repository documentation.

## 16. F5.2 acceptance criteria

F5.2 is complete only when:
1. The procedure follows the verified F5.1 product journey and does not rely on the superseded manual-approval flow.
2. Every stage has an accountable owner, inputs, actions, exit gate, and stop conditions.
3. Supported features are separated from proposed operating practices and unsupported capabilities.
4. Menu accuracy, content approval, image rights, and non-inference of allergens/nutrition are explicit.
5. Account ownership, tenant/branch boundaries, QR-token handling, and least-privilege staff access are protected.
6. Preview, explicit publish, public URL and QR verification are distinct steps.
7. Manual billing and support limitations are accurately described.
8. F3's owner deferral remains unchanged and blocks real-customer onboarding/commercial launch.
9. No real customer, customer-owned data, production mutation, migration, or deployment is used to validate this procedure.
10. Continuity documents are reconciled, final diff reviewed, and applicable CI passes on the exact PR head.

## 17. Research references

External material informs process controls only; it does not establish Menuun capabilities:
- ICO, data protection by design/default: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/guide-to-accountability-and-governance/data-protection-by-design-and-by-default/
- ICO, data minimisation: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-protection-principles/a-guide-to-the-data-protection-principles/data-minimisation
- FTC, Protecting Personal Information: A Guide for Business: https://www.ftc.gov/business-guidance/resources/protecting-personal-information-guide-business
- Restaurant QR menu preparation/verification examples were treated as non-authoritative vendor process examples, not as claims about Menuun.

**F5.2 execution boundary:** documentation and process design only. No customer was onboarded and no customer data was collected.
