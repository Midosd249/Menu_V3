import { createFileRoute } from "@tanstack/react-router";
import { StudioCustomersWorkspace } from "@/components/studio-customers-workspace";

export const Route = createFileRoute("/studio/guests")({ component: StudioCustomersWorkspace });
