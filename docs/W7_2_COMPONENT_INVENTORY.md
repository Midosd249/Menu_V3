# W7.2 — Component Inventory

## Route Generation
- Status: `PENDING_LOCAL_VERIFICATION`.
- Required command: `npx vite build --mode development`.
- Reason pending: the current execution environment cannot run the repository because GitHub DNS/network access failed during the local clone attempt.
- No generated route file was edited.
- No navigation behavior was changed.
- No pages were migrated.

## Created

| Component | Location | Purpose | Integration status |
|---|---|---|---|
| `InternalShell` | `src/components/internal-design-system.tsx` | Non-integrated workspace layout structure | Standalone only |
| `WorkspaceNavigation` | `src/components/internal-design-system.tsx` | Data-driven desktop/navigation primitive | Standalone only |
| `WorkspaceHeader` | `src/components/internal-design-system.tsx` | Workspace context/header primitive | Standalone only |
| `PageHeader` | `src/components/internal-design-system.tsx` | Page title, description and action hierarchy | Standalone only |
| `MobileBottomNav` | `src/components/internal-design-system.tsx` | Data-driven mobile navigation primitive | Standalone only |
| `SectionHeader` | `src/components/internal-design-system.tsx` | Section title/description/action hierarchy | Standalone only |
| `StatusBadge` | `src/components/internal-design-system.tsx` | Restrained semantic status indicator | Standalone only |
| `EmptyState` | `src/components/internal-design-system.tsx` | Empty-data presentation | Standalone only |
| `LoadingState` | `src/components/internal-design-system.tsx` | Accessible loading presentation | Standalone only |
| `ErrorState` | `src/components/internal-design-system.tsx` | Accessible failure presentation | Standalone only |
| `PermissionDeniedState` | `src/components/internal-design-system.tsx` | Access-denied presentation | Standalone only |
| `SearchField` | `src/components/internal-design-system.tsx` | Search input with accessible label/icon | Standalone only |
| `FilterBar` | `src/components/internal-design-system.tsx` | Responsive filter/action grouping | Standalone only |
| `DataTable` | `src/components/internal-design-system.tsx` | Operational table shell with mobile overflow | Standalone only |
| `MetricRow` | `src/components/internal-design-system.tsx` | Dense label/value operational metric | Standalone only |
| `InsightCard` | `src/components/internal-design-system.tsx` | Evidence/insight grouping | Standalone only |
| `ActionCard` | `src/components/internal-design-system.tsx` | Clear next-action grouping | Standalone only |

## Existing Reuse

- `src/components/ui/input.tsx` — reused by `SearchField`.
- `src/components/ui/button.tsx` — remains the project button primitive for future consumers; no duplicate button system was created.
- `src/lib/utils.ts` — reused for class composition.
- `src/components/state-panel.tsx` — inspected for existing loading/empty/error conventions; not deleted or replaced.
- Existing Tailwind tokens from `src/styles.css` — reused rather than introducing a parallel color system.

## Not Created

- `DetailPanel`: intentionally deferred because no existing reusable Radix dialog/drawer pattern was found that meets the W7.2 reuse constraint without creating a parallel modal system.
- `ConfirmDialog`: intentionally deferred for the same reason; the installed Radix Alert Dialog dependency exists, but W7.2 did not establish an existing project dialog pattern to reuse safely.

## Quality Contract

All created primitives are route-independent and designed to accept Arabic-first content from their consumers. Directional styling uses logical properties where applicable. Interactive controls expose labels, keyboard focus, and touch-friendly targets. `DataTable` preserves readable operational density through horizontal overflow rather than collapsing critical columns.

W7.3 may use these primitives after route generation is successfully verified. Growth and Guests cannot be added to primary navigation until that verification succeeds.
