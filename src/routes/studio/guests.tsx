import { createFileRoute } from "@tanstack/react-router";
import { StudioCustomersWorkspace } from "@/components/studio-customers-workspace";

// R9 Guest CRM relationships remain the verified data source for the Customers Workspace.
export const Route = createFileRoute("/studio/guests")({ component: StudioCustomersWorkspace });
