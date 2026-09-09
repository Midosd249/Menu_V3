import type { PublicMenu } from "@/lib/menu/types";
import { PublicMenuView } from "@/components/public-menu";

/**
 * Gallery public template.
 *
 * PublicMenuView is the single owner of the live Gallery composition and all
 * public-menu behavior. Keeping one renderer here prevents a second static
 * hero/header from becoming pinned above the real menu on mobile and in QR
 * previews.
 */
export function BakeryDessertTemplate({ menu }: { menu: PublicMenu }) {
  return (
    <div
      className="gallery-public-frame gallery-canva-reference min-h-dvh bg-[#f7f0e4] text-[#17140f] overflow-x-clip"
      style={{ width: "100%", maxWidth: "100%", marginInline: 0 }}
    >
      <style>{`
        .gallery-canva-reference .menu-public-shell > header {
          position: relative !important;
          inset: auto !important;
          top: auto !important;
          right: auto !important;
          bottom: auto !important;
          left: auto !important;
          transform: none !important;
          background-attachment: scroll !important;
          z-index: auto !important;
        }
        .gallery-canva-reference .menu-public-shell > header > div:first-child {
          position: absolute !important;
          inset: 0 !important;
          z-index: 0 !important;
        }
        .gallery-canva-reference .menu-public-shell > header > div.relative {
          position: relative !important;
          z-index: 1 !important;
          min-height: clamp(18rem, 54svh, 28rem);
        }
        .gallery-canva-reference .menu-public-shell > header img {
          max-height: none;
        }
        .gallery-canva-reference .menu-public-shell > header > div.relative > div:last-child {
          flex-wrap: wrap;
        }
        .gallery-canva-reference .menu-public-shell > header a,
        .gallery-canva-reference .menu-public-shell > header button {
          -webkit-tap-highlight-color: transparent;
        }
        @media (max-width: 520px) {
          .gallery-canva-reference .menu-public-shell > header > div.relative {
            min-height: clamp(17rem, 48svh, 23rem);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .gallery-canva-reference .menu-public-shell > header * {
            scroll-behavior: auto !important;
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
