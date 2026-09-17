import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/onboarding")({ component: RetiredAdminOnboardingRoute });

function RetiredAdminOnboardingRoute() {
  return <Navigate to="/admin/$workspace" params={{ workspace: "clients" }} replace />;
}
