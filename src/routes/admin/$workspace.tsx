import { createFileRoute, Navigate } from "@tanstack/react-router";
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
  component: PlatformAdminWorkspaceRoute,
});

function PlatformAdminWorkspaceRoute() {
  const { workspace } = Route.useParams();
  const initialTab = ADMIN_WORKSPACE_TABS[workspace];

  if (!initialTab) {
    return <Navigate to="/admin" replace />;
  }

  return <PlatformAdminPage key={workspace} initialTab={initialTab} />;
}
