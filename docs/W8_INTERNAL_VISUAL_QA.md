# W8 Internal Visual QA

Status: VERIFICATION_PENDING — CI/browser evidence required on PR #147

## Verification contract

W8 is visual-only and must not change business or security behavior. The following must remain true:

- route generation succeeds and `src/routeTree.gen.ts` remains fresh;
- typecheck, repository tests, lint, and production build remain green;
- existing W7 Studio/Admin/public browser suites remain green;
- Public Menu themes Essential, Editorial, Noir, Heritage/Taste, and Gallery remain unchanged;
- Studio and Platform Admin remain Arabic-first, RTL-safe, and keyboard accessible;
- changed foreground/background pairs meet the documented contrast thresholds;
- mobile widths 320×800 through 1440×900 do not introduce horizontal overflow in existing W7 browser coverage;
- focus, `aria-current`, accessible names, and touch-safe controls remain intact;
- no new fake data, metrics, statuses, charts, recommendations, or business behavior are introduced.

## Required viewport matrix

`320×800`, `360×800`, `390×844`, `430×932`, `768×1024`, `1024×768`, `1280×800`, `1440×900`.

## Required content modes

- Arabic RTL;
- supported English LTR;
- mixed Arabic/English labels;
- numbers, dates, URLs, IDs, phone numbers, and SAR values;
- real populated, empty, loading, error, permission-denied, and unavailable states where existing fixtures support them.

## Required route coverage

### Studio

Existing W7 browser suites cover Studio Shell, Home, Menu, Growth, Customers, and responsive behavior. Orders and Settings remain covered by the shared shell/route navigation and must be spot-checked where the CI fixture exposes them.

### Platform Admin

Existing W7 browser suites cover `/admin` and the real child routes including Restaurants, Clients, Branches, Orders, Subscriptions, Service Requests, Leads, Projects, Analytics, Activity, and System.

### Public Menu

Existing all-theme browser QA remains the regression authority. W8 introduces no Public Menu selectors.

## Contrast evidence

The W8 contract test calculates WCAG-style relative luminance contrast for the implemented hex pairs. Current candidate results:

- primary text `#1D2421` on `#FBF8F2`: 14.93:1;
- secondary text `#36403B` on `#FBF8F2`: above 4.5:1;
- muted text `#5E655F` on `#FBF8F2`: 5.66:1;
- success `#246044` on `#FBF8F2`: 5.94:1;
- warning `#7A5218` on `#FBF8F2`: 6.50:1;
- danger `#9A3B32` on `#FBF8F2`: 6.18:1;
- info `#2D5C76` on `#FBF8F2`: 6.50:1;
- white on primary `#1F2522`: 15.60:1;
- brass accent `#8B642E` on `#FBF8F2`: 3.60:1, therefore restricted to UI/focus/large-use contexts rather than normal body copy.

These are concrete palette checks, not a WCAG certification claim.

## Browser/CI result ledger

| Check | Status | Evidence |
|---|---|---|
| Current `main` HEAD | VERIFIED | `2023e1b0875edc78518e5968006be471df5c32a9` |
| W8 branch | VERIFIED | `w8-internal-visual-system` |
| W8 semantic contract | PENDING | PR CI |
| Route generation | PENDING | PR CI |
| Generated route freshness | PENDING | PR CI |
| Typecheck | PENDING | PR CI |
| Full repository tests | PENDING | PR CI |
| W7 regression contracts | PENDING | PR CI |
| Lint | PENDING | PR CI |
| Production build | PENDING | PR CI |
| Public all-theme browser QA | PENDING | PR CI |
| Studio browser QA | PENDING | PR CI |
| Platform Admin browser QA | PENDING | PR CI |
| RTL/LTR browser checks | PENDING | PR CI |
| Responsive matrix | PENDING | PR CI |
| Keyboard/focus/accessibility browser checks | PENDING | PR CI |
| Real-device QA | PENDING_RELEASE_STAGE | Physical device evidence is intentionally outside repository CI |

## Known limitation

The current GitHub connector can create the branch/PR and repository changes but does not provide a local interactive browser session. CI is therefore the authoritative executable evidence for automated browser verification; no browser pass is claimed until the PR quality workflow reports it.
