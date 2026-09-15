import { createFileRoute } from "@tanstack/react-router";
import { StudioCustomersWorkspace } from "@/components/studio-customers-workspace";

// R9 Guest CRM, Loyalty, Campaigns, Feedback, and Retention remain the verified data sources for the Customers Workspace.
export const Route = createFileRoute("/studio/guests")({ component: StudioCustomersWorkspace });
