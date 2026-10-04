import { createFileRoute, Outlet, redirect, useLocation } from "@tanstack/react-router";
import { PlatformAdminPage } from "@/components/admin/platform-admin-page";
import { ADMIN_ROUTES, ADMIN_WORKSPACE_TABS, type AdminRoutePath } from "@/lib/admin/routes";

const LEGACY_TAB_ROUTES: Record<string, AdminRoutePath> = { ...ADMIN_ROUTES };

export const Route = createFileRoute("/admin")({
  beforeLoad: ({ location }) => {
    if (location.pathname !== "/admin") return;
    const params = new URLSearchParams(location.searchStr);
    const legacyTab = params.get("tab");
    if (!legacyTab) return;
    const target = LEGACY_TAB_ROUTES[legacyTab];
    params.delete("tab");
    const search = Object.fromEntries(params.entries());
    if (!target) throw redirect({ to: "/admin", search: search as never, replace: true });
    if (target === "/admin") throw redirect({ to: "/admin", search: search as never, replace: true });
    const workspace = Object.entries(ADMIN_WORKSPACE_TABS).find(([, tab]) => tab === legacyTab)?.[0];
    if (!workspace) throw redirect({ to: "/admin", search: search as never, replace: true });
    throw redirect({ to: "/admin/$workspace", params: { workspace }, search: search as never, replace: true });
  },
  component: AdminRouteShell,
});

function AdminRouteShell() {
  const location = useLocation();
  if (location.pathname === "/admin" || location.pathname === "/admin/") {
    return <PlatformAdminPage initialTab="overview" />;
  }
  return <Outlet />;
}
