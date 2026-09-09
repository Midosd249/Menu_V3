import type { PublicMenu } from "@/lib/menu/types";
import { PublicMenuView } from "@/components/public-menu";

/**
 * Gallery public template.
 *
 * PublicMenuView remains the single owner of live Gallery content and behavior.
 * Gallery-specific presentation is scoped here so Taste/Heritage and the
 * other themes remain untouched.
 */
export function BakeryDessertTemplate({ menu }: { menu: PublicMenu }) {
  return (
    <div
      className="gallery-public-frame gallery-canva-reference min-h-dvh bg-[#f7f0e4] text-[#17140f] overflow-x-clip"
      style={{ width: "100%", maxWidth: "100%", marginInline: 0 }}
    >
      <style>{`
        /* Gallery hero/header: Taste reference, normal document flow. */
        .gallery-canva-reference .menu-public-shell > header {
          position: relative !important;
          inset: auto !important;
          transform: none !important;
          background-attachment: scroll !important;
          overflow: hidden !important;
          min-height: 0 !important;
          background: var(--gallery-surface, #fffdf9) !important;
          color: var(--gallery-ink, #24201d) !important;
          border-bottom: 1px solid rgb(36 32 29 / .12) !important;
          box-shadow: 0 8px 24px rgb(36 32 29 / .055) !important;
          z-index: 1 !important;
        }
        .gallery-canva-reference .menu-public-shell > header > div:first-child {
          position: absolute !important;
          inset: 0 !important;
          opacity: .18 !important;
          z-index: 0 !important;
        }
        .gallery-canva-reference .menu-public-shell > header > div.relative {
          position: relative !important;
          z-index: 1 !important;
          display: grid !important;
          gap: .75rem !important;
          min-height: 0 !important;
          padding: .7rem clamp(1rem, 4vw, 1.5rem) .9rem !important;
        }
        /* Taste-style top rail: logo/identity + one compact control cluster. */
        .gallery-canva-reference .menu-public-shell > header > div.relative > div:first-child {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: .75rem !important;
          min-width: 0 !important;
          margin: 0 !important;
        }
        .gallery-canva-reference .menu-public-shell > header > div.relative > div:first-child > div:first-child {
          display: flex !important;
          align-items: center !important;
          gap: .65rem !important;
          min-width: 0 !important;
        }
        .gallery-canva-reference .menu-public-shell > header > div.relative > div:first-child > div:first-child img,
        .gallery-canva-reference .menu-public-shell > header > div.relative > div:first-child > div:first-child > div:first-child {
          width: 2.8rem !important;
          height: 2.8rem !important;
          flex: 0 0 2.8rem !important;
          border-radius: 999px !important;
          object-fit: cover !important;
          border: 1px solid rgb(36 32 29 / .14) !important;
          box-shadow: 0 4px 14px rgb(36 32 29 / .08) !important;
        }
        .gallery-canva-reference .menu-public-shell > header h1 {
          max-width: 15ch !important;
          margin: 0 !important;
          color: var(--gallery-ink, #24201d) !important;
          font-size: clamp(1.2rem, 5vw, 1.7rem) !important;
          line-height: 1.25 !important;
          font-weight: 800 !important;
          letter-spacing: -.02em !important;
          text-wrap: balance !important;
        }
        .gallery-canva-reference .menu-public-shell > header p {
          max-width: 34ch !important;
          color: var(--gallery-ink-soft, #514942) !important;
          line-height: 1.5 !important;
        }
        .gallery-canva-reference .menu-public-shell > header > div.relative > div:first-child > div:last-child {
          display: flex !important;
          align-items: center !important;
          justify-content: flex-end !important;
          flex-wrap: wrap !important;
          gap: .35rem !important;
          flex: 0 0 auto !important;
        }
        .gallery-canva-reference .menu-public-shell > header button {
          display: inline-grid !important;
          place-items: center !important;
          min-width: 2.55rem !important;
          min-height: 2.55rem !important;
          border: 1px solid rgb(36 32 29 / .13) !important;
          border-radius: 999px !important;
          background: rgb(255 253 249 / .94) !important;
          color: var(--gallery-ink, #24201d) !important;
          box-shadow: 0 3px 10px rgb(36 32 29 / .045) !important;
        }
        .gallery-canva-reference .menu-public-shell > header button:hover,
        .gallery-canva-reference .menu-public-shell > header button:focus-visible {
          background: #ebe5dc !important;
          transform: none !important;
        }
        /* Status/branch metadata sits below the rail, not as floating pills. */
        .gallery-canva-reference .menu-public-shell > header > div.relative > div:nth-child(2) {
          display: flex !important;
          align-items: center !important;
          justify-content: flex-start !important;
          flex-wrap: wrap !important;
          gap: .4rem !important;
          margin: 0 !important;
        }
        .gallery-canva-reference .menu-public-shell > header > div.relative > div:nth-child(2) span {
          min-height: 1.9rem !important;
          display: inline-flex !important;
          align-items: center !important;
          padding-inline: .65rem !important;
          border: 1px solid rgb(36 32 29 / .12) !important;
          border-radius: 999px !important;
          background: rgb(255 253 249 / .8) !important;
          color: var(--gallery-ink-soft, #514942) !important;
        }
        /* Valid customer actions stay grouped and aligned with the header. */
        .gallery-canva-reference .menu-public-shell > header > div.relative > div:last-child {
          display: flex !important;
          align-items: center !important;
          justify-content: flex-start !important;
          flex-wrap: wrap !important;
          gap: .35rem !important;
          margin: 0 !important;
        }
        .gallery-canva-reference .menu-public-shell > header > div.relative > div:last-child a {
          min-height: 2.5rem !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: .35rem !important;
          border: 1px solid rgb(36 32 29 / .12) !important;
          border-radius: 999px !important;
          background: rgb(255 253 249 / .94) !important;
          color: var(--gallery-ink, #24201d) !important;
          padding-inline: .75rem !important;
        }
        .gallery-canva-reference .menu-public-shell > header > div.relative > div:last-child a:first-child {
          background: var(--gallery-ink, #24201d) !important;
          border-color: var(--gallery-ink, #24201d) !important;
          color: var(--gallery-paper, #fffdf9) !important;
        }
        /* Taste-style floating dock: cart is primary, phone/map/WhatsApp remain secondary. */
        .gallery-canva-reference .menu-public-shell > .public-menu-bottom-bar {
          inset-inline: .75rem !important;
          inset-block-end: .75rem !important;
          width: min(calc(100% - 1.5rem), 32rem) !important;
          max-width: 32rem !important;
          display: flex !important;
          align-items: center !important;
          gap: .45rem !important;
          padding: .45rem !important;
          border: 1px solid rgb(255 253 249 / .18) !important;
          border-radius: 1.25rem !important;
          background: rgb(23 20 17 / .96) !important;
          box-shadow: 0 14px 36px rgb(0 0 0 / .2) !important;
          backdrop-filter: blur(16px) saturate(110%) !important;
        }
        .gallery-canva-reference .menu-public-shell > .public-menu-bottom-bar > button {
          order: 10 !important;
          flex: 1 1 auto !important;
          min-width: 0 !important;
          min-height: 3rem !important;
          border: 0 !important;
          border-radius: 1rem !important;
          background: var(--gallery-accent, #9a5a3a) !important;
          color: #fffdf9 !important;
          box-shadow: none !important;
          font-weight: 750 !important;
        }
        .gallery-canva-reference .menu-public-shell > .public-menu-bottom-bar > a {
          order: 1 !important;
          width: 2.85rem !important;
          height: 2.85rem !important;
          min-width: 2.85rem !important;
          min-height: 2.85rem !important;
          display: grid !important;
          place-items: center !important;
          flex: 0 0 2.85rem !important;
          border: 1px solid rgb(255 253 249 / .25) !important;
          border-radius: 999px !important;
          background: transparent !important;
          color: #fffdf9 !important;
          padding: 0 !important;
        }
        .gallery-canva-reference .menu-public-shell > .public-menu-bottom-bar > a:hover,
        .gallery-canva-reference .menu-public-shell > .public-menu-bottom-bar > a:focus-visible {
          background: rgb(255 253 249 / .1) !important;
          transform: none !important;
        }
        @media (max-width: 520px) {
          .gallery-canva-reference .menu-public-shell > header > div.relative {
            padding: .65rem .85rem .8rem !important;
          }
          .gallery-canva-reference .menu-public-shell > header > div.relative > div:first-child {
            gap: .45rem !important;
          }
          .gallery-canva-reference .menu-public-shell > header > div.relative > div:first-child > div:first-child img,
          .gallery-canva-reference .menu-public-shell > header > div.relative > div:first-child > div:first-child > div:first-child {
            width: 2.65rem !important;
            height: 2.65rem !important;
            flex-basis: 2.65rem !important;
          }
          .gallery-canva-reference .menu-public-shell > header h1 { font-size: 1.15rem !important; }
          .gallery-canva-reference .menu-public-shell > header button {
            min-width: 2.4rem !important;
            min-height: 2.4rem !important;
          }
          .gallery-canva-reference .menu-public-shell > .public-menu-bottom-bar {
            inset-inline: .6rem !important;
            inset-block-end: .6rem !important;
            width: calc(100% - 1.2rem) !important;
            padding: .4rem !important;
          }
          .gallery-canva-reference .menu-public-shell > .public-menu-bottom-bar > a {
            width: 2.65rem !important;
            height: 2.65rem !important;
            min-width: 2.65rem !important;
            min-height: 2.65rem !important;
            flex-basis: 2.65rem !important;
          }
          .gallery-canva-reference .menu-public-shell > .public-menu-bottom-bar > button {
            min-height: 2.8rem !important;
            border-radius: .9rem !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .gallery-canva-reference .menu-public-shell > header * {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
      <div
        id="menu"
        className="gallery-canva-menu mx-auto w-full max-w-7xl overflow-x-clip"
        style={{ width: "100%", maxWidth: "100%", marginInline: 0 }}
      >
        <PublicMenuView menu={menu} />
      </div>
    </div>
  );
}
