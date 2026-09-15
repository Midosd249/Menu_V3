# W8 Internal Visual System

Status: IMPLEMENTATION_IN_PROGRESS — selected Direction B
Scope: Studio, Studio Home/Menu/Growth/Customers/Orders/Settings, Platform Admin, and shared internal visual surfaces only.

## Before

The W7 internal system already had shared primitives and semantic public color infrastructure, but internal surfaces still inherited the broad neutral/paper utility palette directly. The visual hierarchy therefore depended heavily on per-page composition, and the same warm/olive personality could visually blur the distinction between operational workspace, contextual actions, and status meaning.

W8 does not replace W7 architecture. It adds an internal-only semantic layer that reuses the existing component and route structure.

## After — Midnight Ink & Sand

### Semantic role model

| Role | Implemented value | Use |
|---|---|---|
| App background | `#F2EDE3` | Internal work canvas |
| Surface | `#FBF8F2` | Main panels and shell surfaces |
| Elevated surface | `#FFFFFF` | Inputs, focused content, elevated panels |
| Subtle surface | `#E7DED0` | Grouping, table headers, selected-neutral surfaces |
| Primary | `#1F2522` | Primary actions and strong navigation |
| Primary hover | `#161B19` | Primary interaction hover |
| Primary muted | `#DDE4DF` | Soft primary tint |
| On primary | `#FFFFFF` | Foreground on primary |
| Secondary | `#8B642E` | Controlled brass signal |
| Accent | `#8B642E` | Focus/action signal, not body copy |
| Accent muted | `#E8DCC8` | Soft accent background |
| Ink | `#1D2421` | Main text |
| Muted foreground | `#5E655F` | Supporting text; verified 5.66:1 on surface |
| Border | `#D3CBC0` | Default rules |
| Strong border | `#B6ADA1` | Dense/important boundaries |
| Focus ring | `#8B642E` | Keyboard focus and UI indication |
| Success | `#246044` | Positive state |
| Warning | `#7A5218` | Attention state |
| Danger | `#9A3B32` | Failure/destructive state |
| Info | `#2D5C76` | Informational state |
| Disabled | `#6F746F` | Disabled foreground |
| Disabled surface | `#E2DDD4` | Disabled background |
| Disabled border | `#C9C2B8` | Disabled boundary |
| Overlay | `rgb(31 37 34 / 0.72)` | Internal overlays |

### Foreground pairing

- `on-primary`: `#FFFFFF`
- `on-surface`: `#1D2421`
- `on-muted`: `#5E655F`
- `on-success`, `on-warning`, `on-danger`, `on-info`: `#FFFFFF`

Status colors remain semantically independent from the brass/ink identity.

## Typography

- Family remains the existing `IBM Plex Sans Arabic` stack to avoid font/dependency risk.
- Page titles: 24–32px, 700.
- Section titles: 17–20px, 700.
- Body: 14–16px, 400–500.
- Supporting metadata: 12–13px.
- Numeric values continue using tabular numerals where the existing system provides them.
- Arabic is the primary reading hierarchy; English remains supporting terminology.

## Spacing and shape

- Existing route/component spacing is preserved where it encodes W7 responsive behavior.
- Internal radii are consolidated to `8px / 10px / 14px / 18px` through scoped aliases.
- Dense controls retain at least 44px-class touch height where the existing components already provide it.
- Visual hierarchy is created with surface, border, spacing, and weight rather than additional cards.

## Navigation

- Studio and Platform Admin use a dark operational navigation spine while keeping the work surface light.
- Active navigation is an explicit filled state with a brass signal and remains readable in RTL.
- Hover and focus states are visible without relying on color alone.
- Existing mobile bottom navigation remains the interaction model; its selected item becomes a high-contrast ink state.

## Tables, filters, and forms

- Table headers receive a subtle surface distinction.
- Row hover is restrained and does not create artificial emphasis.
- Filters remain a single grouped composition rather than multiple decorative cards.
- Inputs use elevated white surfaces, stronger borders, visible focus, and preserved labels.
- Horizontal overflow remains the safe strategy for dense tables.

## States

Loading, empty, error, permission-denied, unavailable, and success states keep their existing business semantics. W8 changes visual grouping only. No new metrics, status claims, actions, or data are introduced.

## RTL/LTR

The implementation uses existing logical-property/component conventions and does not change route behavior. Numeric, date, URL, ID, phone, and SAR content remains governed by existing bidi-safe markup. Supported English LTR mode remains unchanged in behavior.

## Internal-only isolation

The visual layer is scoped through existing internal landmarks:

- Studio: existing `role="banner"` Studio Shell landmark.
- Platform Admin: existing `aside[aria-label="تنقل إدارة المنصة"]` landmark.

The layer does not target `.menu-public-shell` and introduces no `html[data-menu-theme=...]` selectors. The five Public Menu themes therefore retain their existing color adapters and visual CSS.

## Implementation boundary

Changed:
- internal semantic visual variables;
- internal navigation, header, table, form, state, focus, disabled, radius, and mobile visual presentation;
- visual contract tests;
- documentation.

Not changed:
- route architecture;
- data fetching or business logic;
- auth/authorization/permissions;
- subscriptions;
- AI behavior;
- orders behavior;
- database/Supabase/RLS;
- dependencies;
- Vercel/deployment;
- Public Menu themes.
