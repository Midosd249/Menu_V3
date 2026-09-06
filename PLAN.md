# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Premium Theme System is DONE / VERIFIED / MERGED.
- Essential premium refinement is DEPLOYED / VERIFIED; manual real-device/Opera evidence remains UNKNOWN.
- Editorial premium refinement, contact/location actions, language switching, and temporary public theme testing access are IMPLEMENTED / VERIFIED / MERGED.
- Noir implementation refinement is COMPLETE; final browser/device closure remains separately blocked and Noir is not being reopened.
- **Heritage implementation is COMPLETE / VERIFIED by repository and GitHub Actions quality gates; browser/device closure remains separately blocked.**
- **Gallery implementation is COMPLETE / VERIFIED by repository and GitHub Actions quality gates; browser/device closure remains separately blocked.**
- Permanent visual/functional/research quality workflow is DONE / VERIFIED and mandatory.
- External theme preview QR mode is DONE / VERIFIED.

## Permanent Release-Only Vercel Strategy
Vercel is a release platform, not the normal development or design-iteration environment.

**LOCAL DEVELOPMENT → LOCAL QA → LOCAL BROWSER / VISUAL QA → TESTS → GITHUB ACTIONS QUALITY GATES → DIFF REVIEW → ONE COHERENT RELEASE BATCH → MERGE TO MAIN → ONE VERCEL PRODUCTION DEPLOYMENT → REAL-DEVICE PRODUCTION QA → RECORD RESULT**

- `main` must remain stable and deployable.
- Do not push each small implementation change merely to obtain visual feedback.
- Preview deployments are exceptions only when local verification cannot prove deployment-specific behavior.
- Production deployment happens only after a complete verified release batch.
- Do not randomly retry Redeploy or failed builds.
- Keep implementation status separate from deployment status.
- Before any future deployment-related decision, inspect the actual Vercel Usage/Billing page.
- Visual CSS/theme iteration must not require Vercel deployment.

## Existing Release Policy Constraints
- The authenticated browser/device verification gate remains pending for the five preview variants and is saved for later closure.
- The temporary theme testing override must be reviewed and disabled before commercial production launch.
- Implementation status and deployment status remain separate.

## Heritage + Gallery Audit — CLOSED / VERIFIED
- **VERIFIED:** theme registry, relevant template families, shared renderer, permanent quality checklist, visual audit contract, project memory, and continuity files were inspected.
- **VERIFIED:** Heritage maps to `contemporary-restaurant`; Gallery maps to `bakery-dessert`.
- **VERIFIED:** material research was completed using W3C Arabic/i18n guidance, digital-menu guidance, and Saudi/MENA public examples.
- **VERIFIED:** findings and design decisions are recorded in `docs/theme-audit-heritage-gallery.md`.
- **VERIFIED:** Heritage received its own scoped presentation layer.
- **VERIFIED:** Gallery received its own scoped presentation layer.
- **UNKNOWN:** actual authenticated browser/device visual behavior, mixed-direction rendering, safe-area geometry, and post-hydration console behavior remain pending.

## Heritage Implementation — CLOSED / VERIFIED
- **VERIFIED:** implemented using the existing `contemporary-restaurant` family and shared public-menu behavior.
- **VERIFIED:** `src/theme-heritage.css` is loaded by `src/routes/__root.tsx`.
- **VERIFIED:** GitHub Actions quality run `34000474005` completed successfully.
- **UNKNOWN / BLOCKED:** direct authenticated browser/device evidence remains pending.

## Gallery Implementation — CLOSED / VERIFIED
### Objective
Implement Gallery as a differentiated image-led premium catalogue using the existing `bakery-dessert` family and shared public-menu behavior.

### Result
- **VERIFIED:** `src/theme-gallery.css` was added as the Gallery presentation layer.
- **VERIFIED:** `src/routes/__root.tsx` loads the Gallery stylesheet.
- **VERIFIED:** selectors are scoped to `html[data-menu-theme="gallery"]`.
- **VERIFIED:** image-led portrait media, product hierarchy, category/search treatment, fallback styling, focus states, safe-area clearance, responsive layout, and reduced-motion handling were implemented without creating a new template architecture.
- **VERIFIED:** shared public-menu/customer-action semantics were preserved.
- **VERIFIED:** GitHub Actions quality run `34001361889` for commit `924feda71869a45fb161e2524c6bcc59dcf9dd6d` completed successfully.
- **VERIFIED:** quality run completed install, route generation, typecheck, tests, lint, production build, Playwright Chromium installation, browser template QA for all themes, performance baseline upload, cleanup, and completion.
- **VERIFIED:** performance baseline artifact `g6-performance-baseline` was produced.
- **VERIFIED:** no schema, auth, customer-action, dependency, CI/CD, or Vercel configuration change was introduced.
- **UNKNOWN / BLOCKED:** direct authenticated browser/device visual closure, Opera-specific behavior, and post-hydration console inspection remain unavailable.

## Verification Commands / Evidence
The authoritative CI run for Gallery is `34001361889`. Its quality job passed all repository-defined automated stages, including:
- typecheck
- tests
- platform quality via the workflow
- lint
- production build
- auth/security checks included by the workflow
- browser template QA for all themes
- performance baseline generation

## Exact Next Task
**Authenticated Browser/Device QA Closure — all five preview variants.**

### Objective
Use an interactive browser/device surface, when available, to verify Arabic RTL, English LTR, mixed-direction content, responsive geometry, fixed/sticky controls, empty/populated states, customer interactions, and post-hydration console behavior across Essential, Editorial, Noir, Heritage, and Gallery.

### Constraints
- Do not redesign or reopen completed themes unless direct QA evidence identifies a concrete regression.
- Do not deploy to Vercel for ordinary visual iteration.
- If a deployment-specific check is required, inspect Vercel Usage/Billing first and follow the release-only policy.
