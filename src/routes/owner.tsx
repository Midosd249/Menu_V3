import { createFileRoute, Navigate } from "@tanstack/react-router";

/**
 * Owner workspace entry point.
 * The current owner experience is the platform lead/order center at /admin.
 * Keep this route explicit so the product has a stable, discoverable Owner URL
 * without duplicating the dashboard implementation.
 */
export const Route = createFileRoute("/owner")({ component: OwnerEntry });

function OwnerEntry() {
  return <Navigate to="/admin" replace />;
}
