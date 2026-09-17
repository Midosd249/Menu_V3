import { createFileRoute } from "@tanstack/react-router";
import { PlatformAdminPage } from "@/routes/admin";

export const Route = createFileRoute("/admin/analytics")({
  component: () => <PlatformAdminPage initialTab="analytics" />,
});
