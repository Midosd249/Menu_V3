# F5.1 — Actual Sales-to-Activation Journey

**Status:** COMPLETE WITH EXPLICIT LIMITATIONS — repository-evidence mapping only  
**Verified baseline:** `main` at `2c7f6fe6ff134466d43fe5c1fd166548c6aa9dd4`  
**Date:** 2026-11-03  
**Scope:** F5.1 only. No customer onboarding, production mutation, product implementation, migration, merge, or deployment was performed.

## 1. Purpose and evidence rules

Map the actual Menuun path from first commercial contact through a restaurant's first published, shareable menu, using only capabilities present in the current repository.

- `VERIFIED` means supported by current `main` source, migration, test, or current project documentation.
- `INFERRED` means a safe operational interpretation of verified capabilities, not a shipped workflow.
- `UNKNOWN` means the repository or evidence inspected does not establish the claim.
- Market examples and general SaaS onboarding research are process context only; they do not establish Menuun functionality.

This is not a customer-success playbook, sales script, CRM design, or implementation specification. Those are outside F5.1 and must not be silently treated as existing capabilities.

## 2. Executive conclusion

Menuun currently supports a **hybrid owner-assisted discovery / self-serve product activation** journey:

1. A prospect discovers Menuun through its public marketing/pricing/theme-preview surfaces or contacts the platform through the published email/WhatsApp channels.
2. The restaurant owner creates an account and completes the self-serve workspace setup.
3. The server provisions one tenant workspace for that account, including an owner membership and a main branch.
4. The restaurant owner configures its brand and branch details, builds/imports its real menu, reviews a private preview, and explicitly publishes it.
5. The owner generates and shares the branch QR/link; optional table-specific QR codes and team invitations are available.
6. Subscription administration and paid-plan requests remain owner-operated and manual. Online checkout, automatic collection, and payment confirmation are not implemented.

**Important distinction:** account registration, workspace provisioning, menu readiness, publication, QR sharing, and paid commercial activation are separate states. Completing one must not be described as completing all the others.

## 3. Verified journey map

| Stage | Verified current path / capability | Owner or prospect action | Status and boundary |
|---|---|---|---|
| Discovery and first contact | Public marketing site, pricing surface, theme preview, and footer contact links are present. Footer exposes `ahmed.mohamed@menuun.com` and a WhatsApp contact link. | Prospect explores public information or contacts Menuun outside the product. Owner handles the conversation manually. | `VERIFIED`. No in-product lead form, CRM pipeline, sales activity tracker, or booking scheduler is established by the current source inspected. |
| Product demonstration | Public theme preview route and marketing product surfaces exist. An authenticated restaurant can also use its own Studio preview. | Demonstrate only the behavior actually available. Use a controlled account/menu for a full tenant-specific walkthrough. | `VERIFIED` for preview surfaces. A dedicated demo tenant, demo booking workflow, or sales-demo environment is `UNKNOWN / NOT ESTABLISHED`. |
| Account registration | `/login?mode=signup` provides the signup surface. The email/password path includes email-verification handling; authentication remains Better Auth based. | Restaurant owner creates and verifies their own account, then signs in. | `VERIFIED`. Account creation alone does not create a tenant or menu. Do not create accounts on behalf of customers using shared credentials. |
| Workspace setup | `/onboarding` collects Arabic brand/restaurant name (required), English name (optional), business type, and short Arabic description (optional). Server-side provisioning requires a Saudi phone in `+9665XXXXXXXX` format. | Owner completes the required fields and submits the setup form. | `VERIFIED`. The server provisions one workspace per account. It does not create menu content, logo, or payment data in this step. No manual Platform Admin approval is part of the active self-serve path. |
| Initial tenant structure | The current provisioning migration creates the tenant, owner membership, active main branch, and default branch-hour rows atomically; it is designed to recover/reuse an existing owner workspace rather than create a second one. | Owner reviews the default branch and corrects real location/hours before publishing. | `VERIFIED` in repository migration source. Default hours are starter values, not confirmed restaurant opening hours. |
| Brand and branch configuration | `/studio/brand` edits brand names/taglines, city, WhatsApp, social links, logo, cover, and colors. `/studio/branches` manages branch identity, address, map link, phone, active state, and hours. | Owner supplies accurate brand assets and location/contact details; adds branches only when needed and allowed by plan limits. | `VERIFIED`. A single default branch already exists after provisioning. Branch creation and team/resource limits remain server/database enforced. |
| Menu creation and import | `/studio/menu` supports menu categories/items. `/studio/import` offers AI-assisted image/PDF menu extraction and CSV import with a reviewable draft; rows missing essential fields are skipped. | Owner provides the authoritative menu, confirms Arabic/English names, descriptions, categories, prices, options, availability, and image rights, then saves reviewed content. | `VERIFIED`. AI extraction is assistance, not an authoritative source. Do not publish unreviewed extracted prices, translations, allergens, or product claims. |
| Preview and owner review | `/studio/preview` loads the owner preview from the server-authorized menu source. | Owner checks the rendered guest experience on realistic mobile and desktop viewports and in Arabic/English before publication. | `VERIFIED`. No separate Menuun employee approval gate or customer acceptance workflow is established. |
| Publish | `/studio/settings#publishing` exposes the explicit publish/unpublish action. Draft menus are hidden from guests until published. | Owner confirms content and deliberately publishes. | `VERIFIED`. Publication is an owner action; preview is not publication. |
| QR and link handover | `/studio/qr` provides branch menu URL/QR copy, download, and print flows. It also supports optional table-specific QR management through `StudioTableQrManager`. | Owner downloads/prints and tests the correct branch QR before placing or sharing it. | `VERIFIED`. Branch QR and table-order QR are different use cases. Table QR tokens are sensitive: the raw token is shown once; rotation invalidates the previous code. |
| Staff access | `/studio/team` supports owner-created invitations for `admin` and `editor` roles. Invitation links are generated for manual sharing, expire after seven days, and acceptance requires a verified matching email. Branch assignment is supported for eligible members. | Owner invites each staff member's own email, selects the minimum role/branch access, and shares the generated invitation securely. | `VERIFIED`. Do not share the owner's login. Do not assume invitations are sent automatically by email; the UI generates a link for the owner to copy/share. |
| Support handoff | Marketing footer provides email and WhatsApp contact. Billing UI directs plan-upgrade requests to WhatsApp. | Owner gives the customer the published support contact and retains the agreed follow-up context outside the product. | `VERIFIED` for contact links. Ticketing, support inbox, SLA, automated case assignment, and customer-success handoff automation are `UNKNOWN / NOT ESTABLISHED`. |
| Paid conversion and invoicing | `/studio/billing` shows subscription/invoice information and opens a prefilled WhatsApp upgrade request. Platform Owner controls plan/status/trial and issues invoices through protected admin operations. | Customer requests a plan change through WhatsApp; Platform Owner reviews and applies any approved change and issues an invoice when appropriate. | `VERIFIED` as manual owner-operated behavior. No payment provider, checkout, automatic charge, webhook, or payment-success state is implemented. An issued invoice is not proof of payment. |

## 4. Subscription and commercial boundary

- The repository's `migrations/20260927070000_self_serve_trial.sql` defines a 14-day Pro trial for newly provisioned tenants through the default subscription trigger.
- The commercial catalog in `docs/commercial-w14-pricing.md` defines Free, Growth/Starter, and Pro plan limits/prices; Free has no trial, and paid plans have a 14-day trial contract.
- The current repository also defines server/database entitlement enforcement for branch, product, and team-member limits. The UI is not the authority for entitlements.
- Production application of the latest migration and the live subscription state of any particular tenant were **not queried for this F5.1 task**. Treat the above as repository-defined behavior, not fresh production evidence.
- There is no online payment collection. Do not describe WhatsApp upgrade requests, invoices, or a trial as a completed payment or paid customer activation.

## 5. What is deliberately not claimed

The following are not established as current Menuun capabilities by the evidence inspected:

- In-product lead capture, CRM, sales pipeline, prospect scoring, or automated follow-up.
- Appointment/demo booking, dedicated demo accounts, or automated demo provisioning.
- A human sales approval gate for new self-serve accounts.
- Automated onboarding concierge, implementation project tracker, or automated sales-to-support handoff.
- SMS OTP, automated WhatsApp messaging, or email delivery of team invitations.
- Online checkout, payment provider integration, automatic billing/collection, or payment reconciliation.
- Support ticketing, guaranteed response times, SLA, or a customer-success portal.
- Verified real-customer activation outcomes, conversion rates, time-to-value, or retention metrics.

These are not F5.1 implementation requests. Any future addition requires a separate scoped task and evidence.

## 6. Owner operating principles derived from the verified journey

These are safe operating recommendations (`PROPOSED`), not new product features:

1. Keep a minimal owner-controlled record of prospect intent and agreed next step outside Menuun until a supported CRM exists; do not put credentials or unnecessary personal data in that record.
2. At discovery, clarify the restaurant's immediate goal, number of branches, menu source/format, languages, launch target, and who will own menu accuracy.
3. Ask the restaurant owner to create and control their account. Never collect or share their password.
4. Collect only information needed for setup. Confirm that the owner has authority to publish the restaurant's brand, menu, prices, images, and contact details.
5. Use the first branch and a small reviewed menu as the initial activation milestone; do not imply the entire catalog must be complete before a controlled review.
6. Make publication an explicit owner decision after preview. Verify the public URL and QR destination before printing or distributing.
7. Invite staff only after the owner confirms roles and branch access. Each person uses their own verified account.
8. Explain the manual commercial boundary clearly: plan requests are reviewed by the Platform Owner; invoices are records, not payment collection.
9. Record unresolved issues and follow-up through the published support channel without promising an SLA that the product does not provide.

## 7. Critical lifecycle and security invariants

- Signup does not authorize arbitrary tenant creation. Workspace provisioning is server-side and one-workspace-per-account.
- The active self-serve path is not the retired approval/request/registration-link workflow. The historical `docs/CUSTOMER_LIFECYCLE_ACCESS_POLICY.md` describes an earlier 2026-09-16 state and must be read as historical, not as the current path.
- Tenant, membership, branch, role, subscription, and entitlement authority remain server/database controlled. Never trust client-supplied identity, tenant, branch, role, privilege, or price.
- Public menu access depends on publication state. A private preview is not a public menu.
- QR tokens are not staff credentials. A table QR is not a tenant/branch authorization mechanism.
- F3 remains **DEFERRED BY OWNER — NOT DONE**. No real customer-owned data or commercial launch is authorized by this documentation task; F3's pre-commercial gate remains mandatory.

## 8. Evidence inspected

Repository evidence at baseline `2c7f6fe6ff134466d43fe5c1fd166548c6aa9dd4`:

- `src/routes/login.tsx`, `src/routes/onboarding.tsx`
- `src/lib/menu/self-serve-provisioning.ts`
- `migrations/20260917100000_self_serve_workspace_provisioning.sql`
- `migrations/20260927070000_self_serve_trial.sql`
- `src/routes/studio/brand.tsx`, `src/routes/studio/branches.tsx`
- `src/routes/studio/menu.tsx`, `src/routes/studio/import.tsx`, `src/components/studio/menu-import-panel.tsx`
- `src/routes/studio/preview.tsx`, `src/routes/studio/settings.tsx`
- `src/routes/studio/qr.tsx`, `src/components/studio-table-qr-manager.tsx`
- `src/routes/studio/team.tsx`, `src/lib/menu/team-invitations.ts`
- `src/routes/studio/billing.tsx`, `src/routes/admin/users.tsx`
- `src/lib/menu/platform-users.ts`, `src/lib/menu/platform-billing.ts`
- `src/components/marketing-footer.tsx`, `docs/commercial-w14-pricing.md`
- `docs/PH_SELF_SERVE_CUSTOMER_LIFECYCLE_PLAN.md`, `docs/architecture/TENANT_AND_BRANCH_ISOLATION.md`

Repository continuity findings:

- F5.1 is explicitly defined in `docs/FINALIZATION_ROADMAP.md`.
- The roadmap defines no F4.4 work package. F4.3 is the last defined F4 package.
- `docs/agents/agent-registry.md` and `docs/master-execution-plan.md` are referenced by project instructions but do not exist at this baseline; `AGENTS.md` and `docs/automatic-specialist-routing.md` are present and were used.
- `docs/CUSTOMER_LIFECYCLE_ACCESS_POLICY.md` conflicts with the later retirement record and current self-serve code. This task marks it as historical rather than deleting its history.

## 9. Research context

Focused Exa research reviewed general SaaS onboarding/handoff practices and public restaurant-menu onboarding documentation. The useful process pattern is to preserve discovery context, align the desired outcome, clarify the customer-side owner, collect setup inputs, review implementation, and make the next step explicit. These sources are contextual only and do not prove Menuun features:

- HubSpot, customer onboarding checklist: https://blog.hubspot.com/service/customer-onboarding
- Rocketlane, onboarding people/process/tools: https://www.rocketlane.com/blogs/how-rocketlane-does-onboarding-people-process-tools
- Vino Smart, menu setup wizard example: https://vino-smart.com/en/help/getting-started/setup-wizard/
- Toast, digital menus and QR setup: https://support.toasttab.com/en/article/Setting-up-mobile-payments-and-digital-menus

## 10. F5.1 acceptance and next step

- [x] Actual current discovery/contact surfaces mapped.
- [x] Signup and workspace provisioning distinguished.
- [x] Brand, branch, menu, preview, publish, QR, staff, support, and billing capabilities mapped to current code.
- [x] Legacy manual-approval documentation conflict identified and corrected as historical.
- [x] Unsupported CRM, payment, support, and automation claims explicitly excluded.
- [x] F3 deferral and tenant/security boundaries preserved.
- [x] No production/customer action or application behavior changed.

**F5.1 STATUS: COMPLETE WITH EXPLICIT LIMITATIONS.**

**EXACT NEXT TASK: F5.2 — Define the owner-led operating procedure for discovery/demo, restaurant data collection, menu setup, preview/review, publish, QR handover, staff access, and support handoff.** F5.2 must operationalize this verified map without adding features or onboarding a real customer.