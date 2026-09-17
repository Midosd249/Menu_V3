import { createFileRoute, redirect } from "@tanstack/react-router";
import { ADMIN_WORKSPACE_TABS as ADMIN_WORKSPACE_TAB_MAP, PlatformAdminPage, type Tab } from "@/routes/admin";

const ADMIN_WORKSPACE_TABS: Record<string, Tab> = ADMIN_WORKSPACE_TAB_MAP;

export const Route = createFileRoute("/admin/$workspace")({
  beforeLoad: ({ params }) => {
    if (!ADMIN_WORKSPACE_TABS[params.workspace]) {
      throw redirect({ to: "/admin", replace: true });
    }
  },
  component: PlatformAdminWorkspaceRoute,
});

function PlatformAdminWorkspaceRoute() {
  const { workspace } = Route.useParams();
  const initialTab = ADMIN_WORKSPACE_TABS[workspace];
  if (!initialTab) {
    throw redirect({ to: "/admin", replace: true });
  }
  return <PlatformAdminPage initialTab={initialTab} />;
}
