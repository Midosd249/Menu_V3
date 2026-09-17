import { createFileRoute } from "@tanstack/react-router";
import { PlatformAdminPage } from "@/routes/admin";

export const Route = createFileRoute("/admin/activity")({
  component: () => <PlatformAdminPage initialTab="activity" />,
});
