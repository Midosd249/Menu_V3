# Menu V3 — Premium Hospitality Design System

## Source of truth

- Canva visual direction: `DAHUCP6JFgY` — Menu V3: UI & Brand Direction
- Canva web prototype: `DAHUCU94nVc` — Menu V3 — Premium Hospitality Web Prototype
- Product direction: Arabic-first, RTL-native, mobile-first, premium Saudi hospitality.

## Visual language

Menu V3 should feel like a high-end printed menu translated into a fast digital product: warm paper, deep ink, restrained terracotta, generous whitespace, strong Arabic hierarchy, tactile cards, and photography that sells the food without becoming visual noise.

### Tokens

- Paper: `#f3eee6`
- Sand: `#e8dfd2`
- Ink: `#171411`
- Ink soft: `#3d372f`
- Muted: `#7a7268`
- Line: `#d9cfc0`
- Accent terracotta: `#8f4e32`
- Good: `#2f6b4f`
- Warning: `#9a6b2f`
- Bad: `#9a3b32`

## Typography

Primary Arabic/Latin family: IBM Plex Sans Arabic. Use strong weight and size hierarchy rather than decorative fonts. Product names and prices are the visual anchors; descriptions stay quiet.

## Public menu rules

1. Hero imagery is atmospheric and restrained; never cover important text.
2. Product imagery uses consistent aspect ratios and rounded corners.
3. Category navigation remains horizontally scrollable on small screens.
4. Search is sticky and visually quiet.
5. Product cards must feel tappable and have a clear price hierarchy.
6. WhatsApp, location, phone and Instagram are secondary actions, not competing with the menu.
7. Arabic is the primary information architecture; English is a complete secondary language.
8. Motion is subtle and respects `prefers-reduced-motion`.

## Owner studio rules

The owner dashboard is operational, not marketing-led. Prioritize status, actions, editing, publishing, QR and analytics. Use the same palette but reduce decorative imagery.

## Platform admin rules

Platform admin is a private operations console. Keep it dense, fast and legible. Never expose platform leads to tenant owners/admins/editors.

## Demo restaurant

The fictional demo restaurant is **نَفَس / Nafas**, Al Olaya, Riyadh. It is demo content only. Generated food imagery is stored as external CDN URLs in migration `0004_demo_visuals.sql` and has also been imported into Canva as reusable assets.

## Do not

- Reintroduce bright generic SaaS gradients.
- Use glassmorphism as the primary visual language.
- Turn the dashboard into a marketing page.
- Use tiny low-contrast Arabic text.
- Add decorative animation that delays content or harms mobile performance.
