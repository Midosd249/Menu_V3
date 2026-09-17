import { createFileRoute, notFound } from "@tanstack/react-router";
import { PlatformAdminPage, type Tab } from "@/routes/admin";

const ADMIN_WORKSPACE_TABS: Record<string, Tab> = {
  restaurants: "tenants",
  orders: "orders",
  clients: "clients",
  branches: "branches",
  projects: "projects",
  subscriptions: "subscriptions",
  analytics: "analytics",
  activity: "activity",
  system: "system",
};

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
  return <PlatformAdminWorkspaceView key={workspace} initialTab={initialTab} />;
}

function PlatformAdminWorkspaceView({ initialTab }: { initialTab: Tab }) {
  return <PlatformAdminPage initialTab={initialTab} />;
}
