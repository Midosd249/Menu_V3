# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Source of truth: `main`.
- Premium Theme System is DONE / VERIFIED / MERGED.
- Essential premium refinement is DEPLOYED / VERIFIED; manual real-device/Opera evidence remains UNKNOWN.
- Editorial premium refinement, contact/location actions, language switching, and temporary public theme testing access are IMPLEMENTED / VERIFIED / MERGED.
- Noir implementation refinement is complete; final browser/device closure remains separately blocked and Noir is not being reopened.
- **Heritage + Gallery audit is COMPLETE / VERIFIED.**
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
- Keep implementation and deployment status separate.
- Before any future deployment-related decision, inspect the actual Vercel Usage/Billing page.
- Exact rule: visual CSS/theme iteration must not require Vercel deployment.

## Existing Release Policy Constraints
- The authenticated browser/device verification gate remains pending for the five preview variants and is saved for later closure.
- The temporary theme testing override must be reviewed and disabled before commercial production launch.
- Implementation status and deployment status remain separate.

## Heritage + Gallery Audit — CLOSED / VERIFIED
- **VERIFIED:** theme registry, relevant template families, shared renderer, permanent quality checklist, visual audit contract, project memory, and continuity files were inspected.
- **VERIFIED:** Heritage currently maps to `contemporary-restaurant`; Gallery currently maps to `bakery-dessert`.
- **VERIFIED:** neither theme currently has a dedicated theme stylesheet.
- **VERIFIED:** material research was completed using W3C Arabic/i18n guidance, digital-menu guidance, and Saudi/MENA public examples.
- **VERIFIED:** findings and design decisions are recorded in `docs/theme-audit-heritage-gallery.md`.
- **HIGH:** Heritage requires a distinct scoped presentation layer focused on restrained Arabic/Saudi material identity without ornament overload.
- **HIGH:** Gallery requires a distinct scoped presentation layer focused on an image-led catalogue with stable media and mobile scanability.
- **UNKNOWN:** actual browser/device visual behavior, mixed-direction rendering, safe-area geometry, and post-hydration console behavior remain pending.

## Exact Current Task
**Heritage Theme Implementation — scoped presentation layer only.**

### Objective
Implement Heritage as a finished, differentiated Arabic/Saudi hospitality theme using the existing `contemporary-restaurant` family and shared public-menu behavior. Do not create a new template architecture.

### Likely files
- `src/theme-heritage.css` (new)
- existing application stylesheet/theme import location as required by current architecture
- `docs/theme-audit-heritage-gallery.md` only if implementation findings require an audit update
- continuity files after verification

### Acceptance Criteria
- Heritage retains its existing `ThemeKey`, family, route, customer actions, ordering semantics, and data model.
- Visual identity is materially distinct from Editorial/Noir without copying external products.
- Arabic RTL and English LTR remain coherent; mixed-direction text and SAR prices remain stable.
- Hero, categories, horizontal product cards, featured content, images, missing images, long names, sparse/dense menus, sold-out state, and supported customer actions remain usable.
- Scoped selectors do not leak into other themes.
- No duplicate public-menu shell or unnecessary stacking context is introduced.
- Fixed/sticky controls preserve content clearance and safe-area behavior.
- Reduced-motion behavior remains respected.
- Typecheck, tests, platform tests, lint, build, and applicable template QA pass before completion.
- Final diff contains only Heritage task changes plus required continuity documentation.

### Risks
- Broad selectors could regress Editorial/Noir or shared rendering.
- Decorative layers could recreate the previous overlay/stacking incident.
- Arabic typography or mixed bidi content could expose layout defects.
- Gallery must not be touched in this task.

### Verification Commands
- `npm run typecheck`
- `npm test`
- `npm run test:platform`
- `npm run lint`
- `npm run build`
- `npm run check:auth`
- `npm run qa:template`
- `npm run performance:audit` when applicable to the rendered theme

## Exact Next Task After Heritage
Gallery Theme Implementation — scoped presentation layer only, using the existing `bakery-dessert` family and the completed audit.
