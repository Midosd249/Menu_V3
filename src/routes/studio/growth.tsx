import { createFileRoute } from "@tanstack/react-router";
import { StudioGrowthWorkspace } from "@/components/studio-growth-workspace";

export const Route = createFileRoute("/studio/growth")({ component: GrowthPage });

function GrowthPage() {
  return <StudioGrowthWorkspace />;
}
