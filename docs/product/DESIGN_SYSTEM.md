# Menu V3 — Premium Hospitality Design System

## Source of truth

- Product direction: Arabic-first, RTL-native, mobile-first, premium Saudi hospitality.
- Visual research: Menu Author, MENU TIGER, Popmenu, contemporary restaurant/cafe web showcases, and maintained open-source UI/motion references.
- Repository implementation: `src/lib/theme`, `src/components/menu-theme-controller.tsx`, `src/styles.css`.

## Theme catalog

Menu V3 intentionally has **five** visual systems: one Free baseline and four Premium experiences. A theme is a complete visual system, not a color skin.

| Key | Tier | Personality | Core visual idea |
| --- | --- | --- | --- |
| `essential` | Free | Essential | Quiet, fast, highly legible baseline |
| `editorial` | Premium | Editorial | Magazine rhythm, asymmetric emphasis, strong typography |
| `noir` | Premium | Noir | Cinematic dark dining, warm glow, immersive entry |
| `heritage` | Premium | Heritage | Contemporary Arabic/Saudi hospitality, material and geometric cues |
| `gallery` | Premium | Gallery | Image-first catalogue, large media, art-directed crops |

Legacy keys are migrated by `migrations/20260904001000_five_theme_system.sql` and normalized in `src/lib/theme/registry.ts`. This prevents old tenant records from becoming invalid while keeping the public catalog at five themes.

## What a theme controls

Each theme coordinates:

- Header and opening composition
- Hero/image treatment
- Category navigation rhythm
- Product grid and card presentation
- Image ratios and cropping behavior
- Typography hierarchy and density
- Price prominence
- Featured-product composition
- Surfaces, borders, radius and shadows
- Background texture/pattern treatment
- CTA and interaction styling
- Motion personality
- Mobile-specific composition
- RTL/LTR visual rhythm

The theme registry exposes these as tokens and capabilities; the runtime writes the tokens to `data-menu-theme` CSS custom properties through `MenuThemeController`.

## Motion principles

Premium themes use restrained CSS motion, including staged entry, image scale, hover depth, and progressive scroll-linked enhancement where supported. The static visual state is always usable without the enhancement. `prefers-reduced-motion: reduce` disables the motion layer.

Scroll-driven declarations are guarded with `@supports` so unsupported browsers retain the final usable layout. This follows the progressive-enhancement model documented by Chrome/WebKit and the WAI reduced-motion guidance.

## Product principles

1. The menu must feel designed, not skinned.
2. Food photography should sell the dish without obscuring essential information.
3. Product name and price are the primary anchors; descriptions stay quieter.
4. Navigation remains thumb-friendly and predictable on small screens.
5. Arabic is a first-class composition, not a translated afterthought.
6. Premium effects must not delay content or create interaction ambiguity.
7. Accessibility and performance are part of the visual quality bar.
8. The same menu data must be able to produce visibly different brand experiences.

## Premium entitlement

Premium themes can be previewed without payment, but publishing a Premium theme is server-authorized. The current entitlement model treats `free` as the baseline and any active/trialing non-free subscription as eligible. Payment-provider integration remains outside this design task.

## Do not

- Reintroduce generic SaaS gradients.
- Use glassmorphism as the primary visual language.
- Treat theme changes as color-only variations.
- Hide important Arabic content behind decorative effects.
- Add animation that blocks or delays menu interaction.
- Copy competitor layouts or proprietary assets verbatim.
