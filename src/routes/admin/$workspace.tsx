import { lazy, Suspense } from "react";
import { createFileRoute, Navigate, notFound, redirect } from "@tanstack/react-router";

type AdminTab =
  | "tenants"
  | "orders"
  | "clients"
  | "branches"
  | "projects"
  | "subscriptions"
  | "analytics"
  | "activity"
  | "system";

const PlatformAdminPage = lazy(() =>
  import("@/routes/admin").then(({ PlatformAdminPage }) => ({ default: PlatformAdminPage })),
);

const ADMIN_WORKSPACE_TABS: Record<string, AdminTab> = {
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
    if (params.workspace === "leads" || params.workspace === "service-requests") {
      throw notFound();
    }
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
    return <Navigate to="/admin" replace />;
  }
  return (
    <Suspense fallback={null}>
      <PlatformAdminPage key={workspace} initialTab={initialTab} />
    </Suspense>
  );
}
