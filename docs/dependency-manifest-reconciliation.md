# Dependency Manifest Reconciliation

## Status

**BLOCKED** pending repository-shell execution.

## Finding

`package-lock.json` currently contains a broader root dependency set than `package.json`. The repository audit identified examples including `@radix-ui/react-avatar`, `@radix-ui/react-dropdown-menu`, `@tanstack/react-table`, `kysely`, `recharts`, and `zod` in the lockfile root while they are not declared in the current `package.json`.

## Required verification

Use the repository package manager to determine whether the lockfile should be regenerated from the current manifest. Do not hand-edit the lockfile and do not change dependency versions speculatively.

Recommended sequence when a repository shell is available:

```text
npm install --package-lock-only --no-audit --no-fund
npm ci
npm run typecheck
npm test
npm run test:platform
npm run lint
npm run build
```

Then inspect the resulting `package-lock.json` diff and retain only changes caused by manifest reconciliation.

## Security / compatibility guardrails

- Do not commit secrets or environment values.
- Do not upgrade unrelated packages.
- Preserve existing application behavior and Vercel build compatibility.
- If regeneration produces unexpected dependency churn, revert the lockfile-only change and investigate before committing.
