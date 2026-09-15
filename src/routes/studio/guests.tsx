import { createFileRoute } from "@tanstack/react-router";
import { StudioCustomersWorkspace } from "@/components/studio-customers-workspace";

// R9 guest relationships remain the verified data source for the Customers Workspace.
export const Route = createFileRoute("/studio/guests")({ component: StudioCustomersWorkspace });
