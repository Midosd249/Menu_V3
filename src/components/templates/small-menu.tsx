import { PublicMenuView } from "@/components/public-menu";
import type { PublicMenu } from "@/lib/menu/types";

/**
 * Essential / small-menu owns only the template family boundary.
 * The shared public renderer owns the customer-facing shell so the public
 * menu has one header, one hero, one navigation system, and one action layer.
 */
export function SmallMenuTemplate({ menu, preview = false }: { menu: PublicMenu; preview?: boolean }) {
  return <PublicMenuView menu={menu} preview={preview} />;
}
