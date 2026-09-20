# Connected Tools Registry

Portable, repository-agnostic decision registry for connected AI tools.

## Operating rules

- Repository code/configuration is the source of truth.
- Inspect current branch/HEAD, history, relevant docs, tests, diffs, and existing implementation before meaningful work.
- Prove a capability does not already exist before adding or replacing it.
- Use the smallest number of relevant tools; never run tools merely because they exist.
- `VERIFIED` = directly confirmed. `INFERRED` = derived. `PROPOSED` = recommendation. `UNKNOWN` = insufficient evidence. `BLOCKED` = hard dependency. `EXCLUDED` = intentionally not used.
- Unknown pricing/capability is not treated as free.
- Free/quota-limited services are used economically.
- External side effects require explicit authorization.
- Never expose secrets, credentials, private customer data, or tokens.
- Mockups, generated images, HTTP 200 responses, source inspection, and static scans are not substitutes for browser/device verification.
- This registry never overrides repository architecture, security, RLS, tenant isolation, subscriptions, SEO, CI, or deployment policy.

## Engineering / repository

### GitHub — KEEP / CORE
Repository source of truth: files, search, Git history, branches, commits, PRs, reviews, issues, CI evidence. Prefer read/search first; write only when authorized.

### Build — KEEP / CORE
Scoped implementation workflow. Reuse existing patterns and make the smallest complete change.

### Debug — KEEP / CORE
Runtime/trace debugging. Sequence: reproduce → isolate → inspect evidence → minimal fix → rerun failing check → broader verification.

### Review — KEEP / CORE
Final code, architecture, UX, security, and regression review. Review the actual final diff.

### CodebaseDesign — OPTIONAL / VERIFY
Architecture, boundaries, interfaces, coupling, and deletion-test analysis. Never add abstractions without a concrete need.

### Codex Coordinator — OPTIONAL
Use only when independent specialist streams genuinely help. One atomic task remains the default.

### Codex Process Jobs — OPTIONAL / UNKNOWN
Use only for long-running/separable work after exact capability is verified.

## UI / UX / design

### WebMockup — OPTIONAL
Visual concepts before implementation: layout, hero, CTA, typography, responsive composition. Never treat mockup output as runtime proof.

### UIAudit — HIGH VALUE
Hierarchy, IA, cognitive load, mobile UX, responsive behavior, accessibility, RTL/LTR, typography, spacing, contrast, states, i18n, theming, interaction quality.

### UXCritique — OPTIONAL
Second UX lens when justified; avoid duplicate full audits.

### DesignSystem — HIGH VALUE
Tokens, typography, spacing, colors, component states, and theme consistency. Extend the existing system instead of creating a parallel one.

### Polish — OPTIONAL
Final visual/interaction refinement after correctness.

### Redesign — SCOPED ONLY
Use only when explicit authorization plus evidence shows local fixes are insufficient.

### ShapeUI — OPTIONAL / UNKNOWN
Component-shape exploration after checking existing components.

### Taste — OPTIONAL / UNKNOWN
Aesthetic review only; not a substitute for functional or accessibility QA.

### MotionDesign — OPTIONAL
Motion/transition refinement only when relevant; respect reduced motion.

### MobileMockup — OPTIONAL / UNKNOWN
Communication aid for mobile concepts, never device proof.

### Open Design — OPTIONAL / UNKNOWN
Design references only. Do not copy proprietary assets, code, branding, layouts, or text.

### StitchDesign — OPTIONAL / UNKNOWN
UI/prototype exploration; validate against repository constraints.

### Designly — OPTIONAL / UNKNOWN
Design exploration only when exact connected capability is available.

### Material Themes — OPTIONAL / VERIFY
Theme exploration only; never replace existing production theme architecture.

### Handoff — OPTIONAL / UNKNOWN
Transfer validated design specifications into implementation with states, constraints, acceptance criteria, and limitations.

### Modern Web Guidance — OPTIONAL / UNKNOWN
Browser/web-platform/accessibility/performance guidance. Repository constraints win.

## Visual utilities

### AI Color Picker — FREE / CORE SPECIALIST
Palette exploration and theme-token refinement with contrast awareness.

### Color Designer — FREE SPECIALIST
Palette generation and controlled color exploration.

### Font Pairing — FREE SPECIALIST
Arabic/English typography pairing. Verify font availability and licensing before adoption.

### BrandKit — OPTIONAL
Existing brand colors, fonts, logos, and identity references in supported design tooling.

### QRCM — HIGH VALUE
QR type/field discovery and QR assets. Preserve canonical menu URLs.

### Visualize — OPTIONAL / UNKNOWN
Use only when visualization materially improves understanding.

## SEO / web visibility / API quality

### Agent Ready — HIGH VALUE
AI-agent/crawler readability checks for public sites. A scan is not browser QA.

### Grow My Website — HIGH VALUE
Public-site SEO fundamentals and growth audit.

### API Impact Mapper — HIGH VALUE
API changes, breaking-change risk, consumer/test/doc impact.

### API Documentation Checker — HIGH VALUE
API contract extraction and documentation coverage.

### WebMCP — OPTIONAL / UNKNOWN
Do not depend on it until exact implementation, permissions, security model, and need are verified.

### Wayfinder — UNKNOWN
Verify identity/capability/cost before use.

## Auth / prototypes / generators

### Auth0 — FREE TIER / ALTERNATIVE
Useful for new projects or approved migrations. Do not introduce casually where existing auth works.

### Prototype — ALTERNATIVE
Isolated proof-of-concepts only. Prototype architecture is not production truth.

### Replit / Base44 / WebsitePublisher / AppDeploy — PROTOTYPE / INDEPENDENT PRODUCT
Use for isolated prototypes or independent products; do not replace an established production repository automatically.

### Building React Native Apps — FUTURE / OPTIONAL
Only for explicitly React Native projects.

### Riqor — UNKNOWN
Verify exact capability and cost.

### AskMatt — UNKNOWN
Verify exact capability and cost.

## Automation / external services

### Zapier MCP — FREE / QUOTA-LIMITED
Use only when a required external automation has no better native connector. Never bypass auth, RLS, tenant isolation, validation, pricing, or entitlements.

### Automations — OPTIONAL
Explicitly requested reminders, recurring checks, or scheduled searches.

### Cloudinary — USE WHEN ADOPTED
Image/video asset management only when already part of the architecture or explicitly approved.

### Notion / Coda / Linear / Smartsheet — USE WHEN CONNECTED
Use only when their connected data is required.

### OpenAI Platform — USE FOR OPENAI TASKS
API keys/platform setup/current docs/code. Never expose credentials.

### Exa / Parallel Search — RESEARCH
External research when repository evidence is insufficient; prefer primary sources.

## Arabic creative

### 3aqel Arabic Creative — UNKNOWN / COST MUST BE VERIFIED
Use only after verifying the exact operation is free. Never spend credits without explicit owner approval.

## Excluded by free-first policy

- **Astria — EXCLUDED / COST**
- **Runway — EXCLUDED / COST**
- **Higgsfield — EXCLUDED / COST**
- **Picsart — EXCLUDED / COST**

Do not retry zero-credit or balance-dependent generation. Newly discovered tools with unknown/paid credit requirements are excluded from the free-first path.

## Menu V3 protected boundaries

Never automatically replace or weaken:

- Better Auth authentication/authorization.
- Supabase/PostgreSQL and RLS.
- Tenant/branch isolation.
- Subscription/entitlement boundaries.
- Public-menu routes and canonical URLs.
- Existing `ThemeRenderer` and the five-theme system.
- Ordering, cart, Quick Add, Item Notes.
- Analytics/event semantics.
- SEO/discovery architecture.
- CI quality gates.
- GitHub source-of-truth workflow.
- Release-only Vercel workflow.

Design tools may propose layout, typography, color, imagery, responsive behavior, hierarchy, and interactions. They may not silently change security, data boundaries, pricing, auth, RLS, tenant isolation, or deployment policy.

## Public-menu / theme QA checklist

Test realistic:

- Arabic RTL, English LTR, and mixed-direction text.
- Long/short names and categories.
- Long descriptions.
- Different price lengths and currencies.
- Missing and varied images.
- Available/unavailable states.
- Product details/options.
- Cart/order behavior.
- Fixed/sticky controls and safe-area spacing.
- Keyboard/focus/accessibility.
- Mobile/tablet/desktop geometry.
- Image loading/performance.
- SEO/discovery when relevant.

## Routing matrix

| Task | Primary | Secondary | Avoid |
|---|---|---|---|
| Repository discovery | GitHub | Research | Prototype |
| Existing implementation | Build + Debug | Review | Unscoped redesign |
| Architecture | CodebaseDesign + Review | Research | Prototype-as-production |
| UX audit | UIAudit | UXCritique/Taste | Duplicate audits |
| Visual concept | WebMockup | Color/Font | Direct production edits |
| Theme refinement | DesignSystem + UIAudit | Color + Font | Parallel design system |
| Mobile UX | UIAudit | MobileMockup | Mockup as device proof |
| Motion | MotionDesign | Review | Unneeded animation |
| Arabic/RTL typography | UIAudit + Font Pairing | DesignSystem | English-only QA |
| QR | QRCM | Repository checks | Fake/retired URLs |
| SEO | Grow My Website | Agent Ready | Unrelated redesign |
| API change | API Impact Mapper | API Documentation Checker | Unreviewed breaking change |
| Debugging | Debug | GitHub/Vercel/Supabase evidence | Random retries |
| Final QA | Review + repository QA | UIAudit | Evidence-free claims |

## Cost-control decision tree

1. Is the tool needed?
2. Is a native repository/connector capability already available?
3. Is the exact tool identity verified?
4. Is the required operation free for the current account?
5. Is there a quota?
6. Is there an external side effect?
7. Could it affect architecture, data, auth, security, or deployment?

Unknown → `UNKNOWN`; do not assume free.

## Anti-patterns

Never:
- run every available tool;
- create competing designs without a decision reason;
- replace working production code with prototype output;
- add another auth/database architecture casually;
- use a creative generator when repository-owned assets are sufficient;
- retry zero-credit services;
- treat unknown pricing as free;
- treat mockups/static scans as runtime/device evidence;
- expose secrets;
- trigger deployment merely to inspect a visual change when local evidence can prove it;
- widen an atomic task into unrelated cleanup;
- claim a tool was used when it was only considered.

## Session usage record

```text
Task:
Classification:
Research level:

Tools discovered:
- ...

Tools actually used:
- Tool:
  Purpose:
  Evidence:
  Cost status:
  Result:

Tools intentionally not used:
- Tool:
  Reason:

External side effects:
- None / describe

Unknowns:
- ...

Blockers:
- ...
```

## Portability / maintenance

When moving this file to another repository:
1. Keep universal rules and cost exclusions.
2. Re-verify connected tools in the new environment.
3. Add repository-specific tools separately.
4. Never assume permissions, credits, connectors, or architecture are identical.
5. Preserve the repository's source of truth and deployment policy.

Update this registry when a tool is added/removed, capability/pricing changes, adoption changes, or a security/deployment boundary changes.

## Free-first baseline

**Default:** GitHub; Build/Debug/Review; research/search; UIAudit; Color/Font/DesignSystem; QRCM; Agent Ready; Grow My Website; API Impact Mapper; API Documentation Checker; Zapier MCP only when genuinely justified.

**Optional:** WebMockup, CodebaseDesign, Codex Coordinator, UXCritique, MotionDesign, Designly, Open Design, StitchDesign, ShapeUI, HardenUI, Taste, MobileMockup, Polish, Material Themes, Visualize, Handoff, Modern Web Guidance, Codex Process Jobs, Prototype.

**Verify before depending:** Data, WebMCP, Riqor, AskMatt, Wayfinder, 3aqel Arabic Creative, or newly discovered tools with unknown free pricing.

**Excluded:** Runway, Higgsfield, Picsart, Astria, and newly discovered credit/balance-dependent tools unless the exact required operation is verified free.

## Final rule

Use the repository to decide **what** must be done. Use this registry only to decide **which available tool** can help do it safely and economically.
