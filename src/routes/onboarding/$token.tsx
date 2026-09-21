import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/onboarding/$token")({ component: RetiredOnboardingLinkRoute });

function RetiredOnboardingLinkRoute() {
  return <Navigate to="/login" replace />;
}
