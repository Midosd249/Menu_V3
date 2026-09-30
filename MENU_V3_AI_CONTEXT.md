
# MENU V3 — AI SHARED CONTEXT
Version: 1.0
Generated: 2026-09-30
Canonical repository: Midosd249/Menu_V3
Canonical branch: main
Current verified main HEAD: 665b3eac32a163245987a3bcfcc31cf1984b95bc
Current HEAD commit: feat: make guest AI aware of active offers

## PURPOSE

This file is an AI orientation and continuity document for agents working on Menu V3.

It exists so multiple AI systems can collaborate without repeatedly ingesting the entire repository.

IMPORTANT:
- This file is NOT the ultimate source of truth.
- Live repository code, current main commit, tests, migrations, Git history, CI evidence, and direct deployment/platform evidence override this document.
- When this file conflicts with newer direct evidence, trust the newer evidence and update this file.
- Historical PROJECT_STATE.md, PLAN.md, TASKS.md and archived reports may lag current main. Always check dates and reconcile them against current code.

COLLABORATION MODEL
- Human owner/developer: أحمد / Midosd249
- AI collaborator A: ChatGPT — architecture, analysis, planning, review, verification, prompt orchestration and technical decision support.
- AI collaborator B: Perplexity or another coding/research agent — repository exploration, implementation, research and execution when available.
- GitHub/main: canonical source of code and history.

The AI systems are not human teammates. The human owner remains the sole authority for product, architecture, security, release and deployment decisions.

## PRODUCT

Menu V3 is an Arabic-first, bilingual, mobile-first, multi-tenant digital-menu SaaS for restaurants and cafes.

Market direction:
- Saudi Arabia first
- GCC expansion compatible

Core surfaces:
- Public customer menu
- Studio workspace
- Owner workspace
- Platform/Admin compatibility surface
- Authentication/onboarding
- Branch management
- Menu/category/product management
- Variants/modifiers/options
- Themes/design system
- QR/menu sharing
- Ordering/cart
- Customer actions
- AI-assisted menu capabilities
- Offers/promotions
- Analytics/SEO
- Menuun platform identity

Canonical public route: /m/:slug

Studio owns menu/product/design/branch editing and related restaurant configuration.

Owner owns orders and customer prospects/leads. Do not turn Owner into a duplicate product editor.

Admin remains a legacy/platform administration and compatibility surface. Do not remove it blindly.

## STACK

Verified stack:
- React 19
- TypeScript
- TanStack Start
- TanStack Router
- Vite
- Tailwind CSS
- Better Auth
- PostgreSQL
- PGLite-ready data layer
- Supabase production integration
- Vercel/Nitro
- Node 24 in CI

Primary evidence:
- package.json
- package-lock.json
- vite.config.ts
- vercel.json
- server/
- migrations/
- .github/workflows/

Reuse existing architecture and dependencies when possible.

## REPOSITORY MAP

src/ — application routes, UI, domain logic, auth, menu logic, SEO, themes and shared types.
src/routes/ — TanStack Start routes including public menu, onboarding, Studio, Owner, Admin and auth surfaces.
src/lib/auth/ — authentication, authorization, identity and permissions.
src/lib/menu/ — menu domain logic, public data, ordering, offers, subscriptions, growth, SEO, analytics and AI capabilities.
src/components/ — shared UI and public-menu components.
src/components/templates/ — public menu/template/theme presentation. Treat theme boundaries as protected.
src/lib/theme/ — theme registry, tokens and capabilities.
migrations/ — durable production database history. Never delete/reorder/rewrite casually.
server/ — Vercel/Nitro runtime integrations.
scripts/ — build, migration, preview, QA, performance, auth and repository utilities.
tests/ — cross-cutting regression and browser-contract tests.
docs/ — maintained architecture, research, audits, deployment, design and historical documentation.
.github/workflows/ — CI quality gates.
.grok/ — existing repository-local agent/tooling workspace. Do not remove without evidence.
public/ — public runtime assets.
assets/ — brand/assets including Menuun material.
fixtures/performance/ — performance fixtures.
screenshots/ — visual evidence.
attachments/ — repository evidence/attachments.

## CANONICAL OPERATING CONTRACT

Before meaningful implementation work read:
1. AGENTS.md
2. PROJECT_STATE.md
3. PLAN.md
4. TASKS.md
5. SESSION_PROTOCOL.md
6. relevant README/docs
7. relevant source
8. relevant tests
9. relevant migrations/configuration
10. current Git/CI/deployment evidence

Operating cycle:
DISCOVER → AUDIT → SEGMENT → RESEARCH → DESIGN BRIEF → PLAN → IMPLEMENT → REAL-DATA TEST → VISUAL REVIEW → FUNCTIONAL REVIEW → VERIFY → DOCUMENT → STOP

Only one atomic task should be IN_PROGRESS in a session. Do not silently expand scope.

## EVIDENCE LABELS

VERIFIED = directly confirmed by current code, tests, Git, tool, browser, database or platform evidence.
INFERRED = derived from verified evidence but not directly observed.
PROPOSED = recommended but not yet proven.
UNKNOWN = insufficient evidence.
BLOCKED = cannot proceed because of a real technical, permission, environment, dependency or platform constraint.
TODO = planned but not started.
IN_PROGRESS = current atomic execution task.
DONE = completed with explicit evidence.
CLOSED = milestone completed and release criteria verified.

Never claim deployment because CI passed.
Never claim browser/device success from source inspection alone.
Never claim database/security state is fixed without current platform evidence.

## SECURITY AND DATA BOUNDARIES

Non-negotiable:
- Authentication is server-side.
- Authorization is server-side.
- Never trust client-supplied tenant identity.
- Never trust client-supplied branch scope.
- Never trust client-displayed prices.
- Tenant and branch isolation are security boundaries.
- Validate external/user-controlled input.
- Never weaken auth, authorization, RLS, validation or privacy to make tests pass.
- Never commit credentials, tokens, private keys or .env files.
- Do not invent database fields or environment variables.
- Migrations are production history.

Published state must not use localStorage as its source of truth.
Preview and Published remain separate concepts.

## DEPLOYMENT POLICY

Vercel is a release platform, not the normal development/design iteration environment.

Normal sequence:
LOCAL DEVELOPMENT → LOCAL QA → LOCAL BROWSER / VISUAL QA → TESTS → GITHUB ACTIONS QUALITY GATES → DIFF REVIEW → ONE COHERENT RELEASE BATCH → MERGE TO MAIN → ONE VERCEL PRODUCTION DEPLOYMENT → REAL-DEVICE PRODUCTION QA → RECORD RESULT

If Vercel is quota/rate limited:
- mark DEPLOYMENT_BLOCKED
- do not claim Production equals main
- do not randomly retry
- preserve verified implementation status
- record exact blocker/evidence

DEPLOYED requires direct Vercel evidence showing intended production deployment and commit. CI success is not deployment evidence.

## VERIFICATION COMMANDS

npm install --no-audit --no-fund
npm run typecheck
npm test
npm run test:platform
npm run lint
npm run build
npm run check:auth
npm run db:migrate
npm run qa:template
npm run performance:audit

Important:
- npm run build also runs the migration runner.
- Do not run production migrations against an unintended database.
- If a check cannot run, record exact command, reason, alternative evidence and remaining risk.

## PUBLIC MENU

Canonical route: /m/:slug

Supports:
- tenant identity
- branch context
- categories/products
- product details
- variants/modifiers/options
- search/category navigation
- featured products
- Arabic/English
- RTL/LTR
- customer actions
- cart/order
- themes
- offers/promotions
- QR/source context
- analytics/event semantics

Key files:
- src/lib/menu/public.ts
- src/lib/menu/order-public.ts
- src/lib/menu/types.ts
- src/components/public-menu.tsx
- src/components/templates/
- src/lib/theme/

The public renderer consumes server-validated data. Customer-facing UI must not invent unsupported capabilities.

## ORDERING

Canonical order submission path: submitPublicOrder
Implementation: src/lib/menu/order-public.ts

Principles:
- server recalculates authoritative pricing
- client prices are display-only
- product/variant/modifier/quantity consistency is server validated
- tenant/branch/product consistency is validated
- order lines contain immutable snapshots where required
- receipts use persisted order values

Do not casually redesign the existing receipt system.

## OFFERS / PROMOTIONS — CURRENT REAL STATE

IMPORTANT CORRECTION TO OLDER CONTINUITY FILES:

Offers are NOT merely a plan item. Current main contains the Offers implementation.

Observed current evidence:
- migrations/20260930020000_product_offers.sql
- migrations/20260930022000_product_offer_revision_trigger.sql
- migrations/20260930023000_menu_ordering_offers_rls.sql
- src/lib/menu/offers-api.ts
- src/lib/menu/public.ts
- src/lib/menu/order-public.ts
- src/lib/menu/guest-assistant.ts
- public renderer/template changes
- offer regression contracts
- session/audit documentation

Current model:
- tenant-owned product_offers
- types: percentage, fixed, sale_price, bogo
- one active offer maximum per product
- no stacking by default
- active-window evaluation uses Riyadh/Asia-Riyadh semantics
- tenant ownership enforced
- relevant RLS hardening exists
- checkout pricing remains server authoritative
- order-line pricing snapshots include original price, discount and offer identity
- offers do not consume product subscription limits

Current public behavior:
- active offers render in featured cards
- active offers render in category product cards
- active offers render in product details
- bilingual labels supported
- old/new pricing supported
- BOGO bilingual fallback label supported
- simple-product quick add seeds displayed active offer price
- checkout recalculates on the server

Current AI behavior:
- guest assistant can load active offers for relevant products
- current HEAD specifically contains work making guest AI aware of active offers and adding an offer quick question

Do NOT use the stale top section of PLAN.md to conclude Offers are unimplemented. Verify current source first.

## MENU ORDERING

Current repository includes:
- branch-effective category ordering
- branch-effective product ordering
- fallback to existing sort_order
- Studio Up/Down controls
- server-side tenant/branch authorization
- public rendering consumes saved order
- variants/modifier groups/modifier options preserve/use saved ordering

Relevant tables:
- branch_category_order
- branch_product_order

RLS hardening includes:
- branch_category_order
- branch_product_order
- product_offers

Do not create a parallel ordering implementation.

## THEMES

Five public visual systems:
1. essential — Free baseline
2. editorial — Premium editorial/magazine rhythm
3. noir — Premium cinematic dark dining
4. heritage — Premium contemporary Arabic/Saudi hospitality
5. gallery — Premium image-first catalogue

A theme is a complete visual system, not a color skin.

Theme documentation:
docs/product/DESIGN_SYSTEM.md

Theme infrastructure:
src/lib/theme/registry.ts
src/components/menu-theme-controller.tsx
src/styles.css

Do not casually rewrite themes or create a sixth theme.

Premium effects must not compromise readability, scanability, contrast, performance, mobile interaction, Arabic/RTL quality or accessibility.

Respect prefers-reduced-motion.

## ARABIC / BILINGUAL / RTL

Arabic is first-class:
- Arabic-first composition
- RTL-native behavior
- English LTR support
- mixed-direction testing
- long Arabic/English names
- realistic SAR price lengths
- no clipping caused by direction switching

Use existing text(lang, ...) conventions and shared language helpers.

## STUDIO / OWNER / ADMIN

Studio:
menu editing, products, categories, variants/modifiers/options, branding, themes/design, branches, QR, analytics, imports, settings, offers.

Owner:
orders, order details/status operations, customer prospects/leads.

Admin:
legacy/platform administration and compatibility.

## MENUUN PLATFORM IDENTITY

Menuun is the platform identity. Tenant restaurant branding is separate.

Platform attribution has already been implemented in prior work.

Do not replace tenant logoUrl or restaurant identity with Menuun branding.
Do not create duplicate platform identity components if an existing shared component exists.

## AI SUBSYSTEM

Menu V3 contains an evolving AI foundation/provider architecture.

Prior AI work includes:
- provider registry/capability foundation
- credential contracts/key pools
- structured/multimodal routing
- Smart Menu Import
- guest assistant
- AI menu onboarding
- AI intelligence/data-quality features
- provider-specific adapters

Rules:
- Do not activate a provider merely because an adapter exists.
- Runtime eligibility must be proven.
- Authenticated live smoke evidence may be required before activation.
- Keep provider routing bounded and capability-aware.
- Never expose provider secrets client-side.

Current guest assistant file:
src/lib/menu/guest-assistant.ts

Current HEAD includes active-offer awareness in the guest assistant.

## KNOWN RISK AREAS

Not automatically current blockers; re-check:
- physical Android/iOS device QA may remain incomplete for recent changes
- Vercel quota/rate-limit history has affected some release stages
- Supabase Security Advisor may contain remaining unrelated findings
- historical authenticated/cache/editor E2E caveats may need re-verification
- public order abuse/rate-limit/idempotency has previously been identified as a risk surface
- continuity documentation may lag current main
- production state must be verified separately from repository state

Never turn historical risk into a current bug without current evidence.

## DOCUMENTATION HIERARCHY

Priority:
1. Current code on current main
2. Current migration/schema evidence
3. Current tests and CI evidence
4. Current Git history/diff
5. Current deployment/database/platform evidence
6. Current task/session documentation
7. Older master context and archived reports
8. Chat memory or assumptions

## CURRENT RELEASE / PR STATE

PR #327 is NOT open. It was merged into main.

PR #327 title:
feat: fix public ordering, add option ordering and offers

PR #327 merge commit:
4a2e48677e3c410e59722445fc860e50d8e73628

Current main subsequently advanced to:
665b3eac32a163245987a3bcfcc31cf1984b95bc

Therefore:
- do not say PR #327 awaits review
- do not say Offers are plan-only
- do not use the old opening entries of PROJECT_STATE.md or TASKS.md as current release state

Current HEAD includes later guest-AI active-offer work.

## DOCUMENTATION RECONCILIATION ISSUE

At context generation time, PROJECT_STATE.md, PLAN.md and TASKS.md contain older entries describing PR #327 as open/awaiting review and Offers as plan-only.

Direct GitHub evidence proves:
- PR #327 was merged
- main advanced afterward
- Offers implementation exists in current main
- current HEAD is 665b3eac32a163245987a3bcfcc31cf1984b95bc

This is a documentation-reconciliation issue.

Do not silently rewrite historical entries during feature work.

When authorized for continuity maintenance, add a new dated current-state entry and reconcile PROJECT_STATE.md, PLAN.md and TASKS.md. Change SESSION_PROTOCOL.md only if workflow rules changed.

## THREE-PARTY WORKING AGREEMENT

HUMAN OWNER:
Decides product priorities, material architecture tradeoffs, security/release/deployment authorization, merge/deploy decisions and business rules.

CHATGPT:
Repository analysis, principal-engineering review, task decomposition, architecture guardrails, security/data review, QA/evidence review, prompt/orchestration and second opinions.

PERPLEXITY / EXECUTION AGENT:
Repository exploration, coding, research and implementation when repository access is available.

GITHUB:
Shared memory and canonical code state.

## STANDARD TASK PROTOCOL

1. Confirm current main SHA.
2. Read AGENTS.md.
3. Read PROJECT_STATE.md.
4. Read PLAN.md.
5. Read TASKS.md.
6. Read SESSION_PROTOCOL.md.
7. Inspect relevant source/tests/migrations/history.
8. Define one atomic task.
9. Plan affected files, acceptance criteria, risks, rollback and verification.
10. Implement smallest complete reversible change.
11. Run relevant tests.
12. Review security, tenant/branch isolation, auth/authz, RTL/LTR, mobile, accessibility, performance and regressions.
13. Inspect final diff.
14. Update continuity only when authorized.
15. Stop.

## STANDARD PERPLEXITY HANDOFF

TASK:
<one sentence>

BASE:
<commit SHA>

CHANGED:
<files>

IMPLEMENTATION:
<what changed>

TESTS:
<exact commands>

RESULTS:
<pass/fail and evidence>

SECURITY:
<tenant/branch/auth implications>

VISUAL:
<what was and was not visually verified>

DEPLOYMENT:
<not attempted / blocked / preview / production with evidence>

UNKNOWN:
<remaining unknowns>

BLOCKED:
<real blockers only>

NEXT:
<exactly one next action>

Never use vague claims such as "looks good", "fully verified" or "production ready" without evidence.

## PERPLEXITY PROJECT INITIALIZATION PROMPT

You are an implementation/research agent for the Menu V3 repository.

First read MENU_V3_AI_CONTEXT.md, then read AGENTS.md, PROJECT_STATE.md, PLAN.md, TASKS.md and SESSION_PROTOCOL.md.

Important:
- Current repository is the source of truth.
- Do not trust stale continuity entries over current code/Git evidence.
- Check current main SHA before every meaningful task.
- This context file is orientation, not a substitute for source inspection.
- Never invent files, APIs, environment variables, routes, database fields, tests, deployments or capabilities.
- Preserve existing architecture and completed functionality.
- Make only the requested atomic change.
- Keep tenant and branch isolation server-side.
- Never trust client-supplied pricing or identity.
- Do not weaken security to pass tests.
- Do not claim deployment from CI alone.
- Do not claim visual/device verification without visual/device evidence.

For every task:
1. confirm current main SHA
2. inspect relevant code
3. identify smallest implementation surface
4. state plan
5. implement only scoped change
6. run relevant verification
7. inspect final diff
8. report exact evidence and remaining unknowns
9. update continuity only when authorized
10. stop

If this file conflicts with current repository code, current code wins.
If continuity documentation conflicts with current code/Git evidence, report the discrepancy rather than guessing.

## CHATGPT REVIEW HANDOFF PROMPT

Repository:
Midosd249/Menu_V3

Current main SHA:
<sha>

Task:
<task>

Perplexity changed:
<files>

Perplexity claims:
<summary>

Tests:
<exact results>

PR/commit:
<link or sha>

Deployment:
<status/evidence>

Please independently inspect the current repository state and review:
1. correctness
2. scope
3. regressions
4. security/tenant/branch isolation
5. tests
6. mobile/RTL implications
7. stale documentation
8. deployment claims
9. remaining unknowns

Do not assume Perplexity claims are verified.

## ANTI-PATTERNS

Never:
- rebuild Menu V3 from scratch
- replace working architecture for convenience
- create parallel implementations of existing features
- use localStorage as published-state truth
- trust client tenant/branch identity
- trust client prices
- delete/reorder migrations casually
- use Vercel as the normal CSS iteration loop
- call preview deployment production
- declare browser/device success from HTTP 200
- declare a feature complete from source inspection alone
- add unsupported customer actions
- copy competitor proprietary UI/assets/text
- introduce generic SaaS visual language that conflicts with the hospitality design system
- activate AI/provider functionality without capability/runtime verification
- start multiple atomic tasks simultaneously
- rewrite historical continuity just to make current state look cleaner

## DESIGN QUALITY BASELINE

For public menu/template/theme work review:
- first-screen clarity
- restaurant identity
- hero/header
- typography
- hierarchy
- spacing
- alignment
- wrapping/clipping/overlap
- contrast
- cards
- categories
- search
- price/currency
- image crop/fallback
- sticky/fixed controls
- safe areas
- dialogs/bottom sheets
- scroll behavior
- RTL/LTR
- mobile usability
- accessibility
- performance
- theme/restaurant fit

Realistic states:
- long Arabic names
- long English names
- mixed-direction text
- long categories
- long restaurant names
- SAR price variations
- missing/poor images
- varied image ratios
- missing descriptions
- sold-out/available items
- modifiers/discounts where supported
- sparse/dense categories
- one/multiple branches
- loading/empty/error/unavailable states

No theme is premium if decoration harms readability, scanability, contrast or interaction clarity.

## FINAL OPERATING PRINCIPLE

Menu V3 is a living repository with a long history.

The goal is not for an AI to memorize every line of code.

The goal is to maintain a reliable shared model:

CURRENT CODE + CURRENT GIT + CURRENT TESTS + CURRENT PLATFORM EVIDENCE + CONCISE CONTEXT

When detailed implementation is required, fetch exact source files.

When a feature changes, update context/continuity deliberately.

When agents disagree, return to current repository evidence.

When evidence is missing, say UNKNOWN.
When blocked, say BLOCKED.
When a task is complete, prove it and stop.

The human owner remains in control.
