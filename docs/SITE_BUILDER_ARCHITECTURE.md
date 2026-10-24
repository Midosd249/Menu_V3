# Menuun Sites — Architecture Decision and Delivery Plan

**Status:** Direction approved; implementation not started  
**Decision date:** 2026-10-11  
**Owner decision:** Build the website-design service as a separate application within the Menuun product family, with a narrow, versioned integration to Menu V3.  
**Scope of this record:** Architecture, boundaries, first release, and delivery safeguards. This document does not claim a new app, domain, database, or production deployment already exists.

## 1. Decision

Build **Menuun Sites** as an independent application and repository. Do not turn `Midosd249/Menu_V3` into a general-purpose website editor or make the existing menu product responsible for page composition, website publishing, theme management, or customer-domain routing.

Menu V3 remains the digital-menu product and source of truth for its existing restaurant/menu workflows. Menuun Sites owns public business websites, page composition, website-specific content, templates, previews, publishing, and domain mapping.

This is a product boundary, not a decision to duplicate every shared capability. Reuse account identity and commercial/customer relationships through explicit contracts when those contracts are proven safe. Do not share private database tables or depend on Menu V3's internal modules from the new runtime.

## 2. Why this boundary

The current Menu V3 repository already contains a production-oriented React/TanStack application, Better Auth, PostgreSQL-related migrations, tenant and branch permissions, Studio, public menus, templates, and CI/browser checks. Its self-serve business type currently accepts `restaurant`, `cafe`, `bakery`, `dessert`, `food_truck`, and `other`; it does not currently model a salon website as a first-class website product.

A full website builder introduces a different domain model and lifecycle: pages and sections, service catalogs, staff, galleries, SEO metadata, draft/preview/publish state, asset management, public-site routing, and custom domains. Adding these directly to the existing menu domain would increase coupling and release risk.

**Guardrail:** do not add a `salon` option to Menu V3 merely to make the website service possible. Any future business-type change in Menu V3 must have a separate, evidenced product need and migration/test plan.

## 3. Proposed product topology

These are target names, not verified DNS or deployment configuration:

| Surface | Proposed responsibility | State |
| --- | --- | --- |
| `menuun.com` | Main Menuun marketing site and product entry point | Existing public domain; preserve current behavior |
| Existing Menu V3 app | Digital menus, restaurant operations, current Studio and customer workflows | Existing product; do not destabilize |
| `sites.menuun.com` | Menuun Sites dashboard/editor, previews, publishing controls | Proposed; not created |
| `{slug}.menuun.com` | Published customer websites, subject to collision checks and wildcard routing | Proposed; not configured |
| Customer-owned domain | Optional mapping to a published site after MVP | Later phase; not configured |

Before wildcard routing is enabled, inventory existing DNS records, current Menu V3 public URL patterns, reserved subdomains, cookie scope, TLS behavior, and any existing customer links. A customer site must never shadow `www`, `app`, `sites`, `api`, `admin`, or other reserved platform hosts.

## 4. Service boundaries

### Menuun Sites owns
- Website workspaces and website-specific tenant authorization.
- Website profile and content: brand identity, services, staff, gallery, contact information, hours, location, and social links.
- Reusable page sections and template versions.
- Draft, preview, publish, unpublish, and rollback-to-previous-published-version behavior.
- Public website rendering, website SEO/social metadata, sitemap/robots behavior, and slug/domain resolution.
- Website media references and asset lifecycle.
- Website-specific audit events and publish history.

### Menu V3 continues to own
- Digital menus, menu items/categories, branches, ordering and menu-specific analytics.
- Existing customer/menu workflows and existing tenant/branch authorization rules.
- Existing product behavior and production release lifecycle.

### Shared capabilities must be explicit
- Identity/account mapping and sign-in handoff.
- Customer/account references and plan/entitlement checks.
- Cross-product navigation and optional links/embeds to a Menu V3 public menu.
- Auditing and support references where needed.

No direct cross-product database writes. Prefer versioned server APIs or a narrow signed-token/identity contract. Keep the integration read-only at first where possible. If identity is shared, use a documented SSO/OIDC flow or short-lived, audience-restricted, signed launch token validated server-side; do not assume that sharing a parent domain makes existing sessions safely interchangeable. Never copy passwords or trust client-supplied tenant IDs.

## 5. Initial technical direction

The final stack must be confirmed after inspecting repository/tooling, deployment limits, and the actual reference assets. The initial preference is a small React application with server rendering and a TypeScript-first routing model, using technologies the Menuun team can maintain. Reusing familiar concepts is acceptable; importing Menu V3's private runtime modules or coupling deployments is not.

Required isolation:
- Separate Git repository and deployment project.
- Separate database or independently permissioned database boundary owned by Menuun Sites; no new tables in Menu V3's production schema for website-builder internals.
- Explicit tenant ownership on every read/write and public-site lookup.
- Separate storage namespace/bucket and upload policy for site assets.
- Environment-specific secrets; no production secrets in source or preview logs.
- A documented, minimal integration API with contract tests.

Do not choose a rich free-form drag-and-drop canvas for the first release. Start with a section-based editor backed by validated content schemas and a small number of high-quality templates. This reduces publishing, accessibility, responsive-layout, and data-migration risk while still allowing strong visual outcomes.

## 6. Salon MVP — first customer outcome

The first vertical is salons and beauty centers. A customer should be able to publish a polished bilingual site without developer assistance.

### MVP capabilities
1. Create a site workspace and reserve a unique slug.
2. Select one of a small number of reviewed salon templates.
3. Edit brand name, logo, colors, hero, introduction, services/prices/durations, staff, gallery, contact details, location, hours, and social links.
4. Publish Arabic RTL, English LTR, or both; language direction must be explicit per rendered page and not rely on global CSS hacks.
5. Preview draft content before publishing; unpublished drafts must not leak through public routes, caches, sitemaps, or social metadata.
6. Render responsive public pages with real keyboard-operable navigation, accessible forms/links, sensible reduced-motion behavior, and no unintended horizontal overflow.
7. Provide per-page title/description, canonical URL, Open Graph metadata, sitemap, robots behavior, and appropriate structured data only when values are known.
8. Offer WhatsApp/contact actions and optional external booking links. A native appointments engine is out of MVP scope unless separately approved.
9. Publish, unpublish, and restore the previous published version safely.
10. Log who published what and when.

### MVP exclusions
- Full free-form visual canvas and arbitrary custom CSS/JavaScript.
- Native booking calendar, payments, POS, or salon CRM.
- Automatic migration of Menu V3 tenant/menu data into the website data model.
- Customer-owned custom domains until wildcard subdomains, ownership verification, TLS, and routing are proven.
- Copying the Ritunio implementation or assets without an explicit license/permission review.

## 7. Data model outline (not a migration)

Likely first-domain entities:
- `site_workspaces`: owner/account mapping, slug, status, locale defaults, timestamps.
- `site_memberships`: user-to-site membership and role.
- `site_content_versions`: validated JSON document, schema version, draft/published state, author, and immutable publish history.
- `site_domains`: hostname, verification state, TLS/routing state (deferred until custom domains).
- `site_assets`: storage key, media metadata, ownership, and usage references.
- `site_publish_events`: publish/unpublish/restore audit trail.

Names are illustrative only. Define constraints, retention, access policies, slug uniqueness, schema-version upgrades, backups, and rollback behavior before implementation. Do not create these tables in Menu V3 as a shortcut.

## 8. Integration sequence

1. **Account entry:** from Menuun, route the customer to Menuun Sites through a documented identity handoff. Until that contract is ready, use a separate, secure sign-in flow rather than silently sharing cookies.
2. **Customer mapping:** store a stable external account identifier and verify it server-side; avoid duplicated credentials and implicit tenant trust.
3. **Commercial access:** query a versioned entitlement/account contract or use an explicitly owned billing integration. Do not infer paid access from client UI.
4. **Menu connection:** later allow an owner to link a Menu V3 public menu to a website. Consume only a supported public/read API; never query Menu V3 tables directly.
5. **Support/analytics:** add cross-product correlation IDs and audit references without blending unrelated private data.

## 9. Delivery phases and gates

### Phase 0 — Foundation (next)
- Confirm current repository state and avoid changing the live Menu V3 application.
- Create the independent Menuun Sites repository and deployment project when repository-creation permissions are available.
- Inspect the downloaded Ritunio reference and asset/license status; extract product patterns, not copied code.
- Confirm auth handoff, hosting, storage, database ownership, and domain availability.
- Write the threat model and first data-contract draft.

**Exit gate:** a reviewed technical plan with an identified repository, runtime, database boundary, auth strategy, and release owner.

### Phase 1 — Public-site vertical slice
- Build one production-quality salon template with fixture data.
- Validate Arabic RTL and English LTR, mobile/tablet/desktop, SEO, accessibility, performance, and no horizontal overflow.
- Add automated tests for published/draft separation, slug resolution, missing assets, invalid content, and not-found states.

**Exit gate:** template is verified without customer data and without Menu V3 runtime coupling.

### Phase 2 — Authenticated editor and publishing
- Add workspace provisioning, authorization, validated section editor, preview, publish/unpublish, version history, and audit logs.
- Add tenant-isolation and authorization regression tests before any customer onboarding.

**Exit gate:** a test user cannot read or modify another tenant's draft, assets, domain, or publish state.

### Phase 3 — Platform integration and launch
- Add the approved identity/account handoff and minimal Menu V3 linking contract.
- Add slug/subdomain routing and observability.
- Add custom domains only after ownership verification and TLS/routing tests.
- Run end-to-end Playwright coverage across Arabic/English and small/large viewports.
- Verify production deployment and real-device behavior separately from CI and preview status.

**Exit gate:** all required checks pass on the exact merge head, release diff is reviewed, production points to the intended commit, and smoke tests pass.

## 10. Change and release discipline — prevent lost updates

The recent homepage recovery reinforced that several overlapping PRs/commits can make it unclear which exact changes are present in `main`. Use the following rules for both products:

1. `main` is the source of truth. Before a task, record its exact starting SHA and inspect recent commits, open PRs, and current CI.
2. One coherent objective per branch/PR. Do not maintain multiple competing PRs for the same files/features unless the dependency is explicit.
3. Before merge, review the complete diff against current `main`, not just the PR title or the most recent commit.
4. Run required checks on the exact latest head. Any new commit invalidates earlier-head verification until the checks rerun.
5. Merge only after required checks are green and the overlapping-PR audit is complete. Do not merge a stale PR just because an earlier commit passed.
6. After merge, verify the merge SHA, changed-file inventory, relevant workflow results, and whether production actually serves that SHA. CI success, Vercel preview readiness, and production deployment are distinct facts.
7. Record a single current continuity anchor and one explicit next task in project tracking. Mark evidence `VERIFIED`, `INFERRED`, `UNKNOWN`, or `BLOCKED`; never copy stale “next action” notes forward without reconciling them.
8. Never “fix” uncertainty by rebuilding unrelated features or force-pushing over shared work. Compare exact commits and preserve known-good behavior.
9. Do not close or merge older PRs solely because a newer PR looks similar; compare the actual changed files and commit ancestry first.

## 11. Current verified state and limitations

- **VERIFIED:** the current Menu V3 repository is `Midosd249/Menu_V3`, and its latest main commit observed during this planning pass is `b71b88954988303a258054236b56fff08a29f65b` (homepage recovery PR #398).
- **VERIFIED:** the repository has an existing React/TanStack application, TypeScript, PostgreSQL-oriented migrations, auth/tenant boundaries, and extensive CI/browser test infrastructure.
- **VERIFIED:** the current self-serve business type schema does not include `salon`; this is not a reason to change it for the website service.
- **OWNER-REPORTED:** Menuun's live site currently contains the recovered updates and is working as expected. This record accepts that as the operator's report; it does not independently assert a new production deployment or verify the production-serving SHA.
- **NOT DONE:** no Menuun Sites repository, database, app, DNS entry, wildcard routing, or production deployment has been created by this change.
- **NEXT ACTION:** create/authorize the separate repository and then implement the smallest tested public salon-site vertical slice. Do not add website-builder runtime code to Menu V3.

## 12. References

- Current product repository: https://github.com/Midosd249/Menu_V3
- Shared agent-foundation repository (separate purpose; not the website-builder runtime by default): https://github.com/Midosd249/ai-agent-foundation
- Inspiration reference: https://gulf.ritunio.com — use for product/UX analysis only; confirm licensing before reusing source, copy, or assets.
