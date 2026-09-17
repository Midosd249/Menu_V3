import { createFileRoute } from "@tanstack/react-router";
import { PlatformAdminPage } from "@/routes/admin";

export const Route = createFileRoute("/admin/branches")({
  component: () => <PlatformAdminPage initialTab="branches" />,
});
