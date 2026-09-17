import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/onboarding")({ component: RetiredAdminOnboardingRoute });

function RetiredAdminOnboardingRoute() {
  return <Navigate to="/admin/clients" replace />;
}
