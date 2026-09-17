import { createFileRoute, notFound } from "@tanstack/react-router";
import { ADMIN_WORKSPACE_TABS, PlatformAdminPage, type Tab } from "@/routes/admin";

export const Route = createFileRoute("/admin/$workspace")({
  beforeLoad: ({ params }) => {
    if (!ADMIN_WORKSPACE_TABS[params.workspace]) {
      throw notFound();
    }
  },
  component: PlatformAdminWorkspaceRoute,
});

function PlatformAdminWorkspaceRoute() {
  const { workspace } = Route.useParams();
  const initialTab = ADMIN_WORKSPACE_TABS[workspace] as Tab;
  return <PlatformAdminPage key={workspace} initialTab={initialTab} />;
}
