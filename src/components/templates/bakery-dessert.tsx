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
    <div className="gallery-public-frame gallery-canva-reference min-h-dvh bg-[#f7f0e4] text-[#17140f] overflow-x-clip">
      <div id="menu" className="gallery-canva-menu mx-auto w-full max-w-7xl">
        <PublicMenuView menu={menu} />
      </div>
    </div>
  );
}
