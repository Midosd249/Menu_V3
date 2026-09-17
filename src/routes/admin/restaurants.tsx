import { createFileRoute } from "@tanstack/react-router";
import { PlatformAdminPage } from "@/routes/admin";

export const Route = createFileRoute("/admin/restaurants")({
  component: () => <PlatformAdminPage initialTab="tenants" />,
});
