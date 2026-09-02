import { createFileRoute } from "@tanstack/react-router";
import { StudioShell } from "@/components/studio-shell";
import { StudioGate } from "@/lib/menu/studio";

export const Route = createFileRoute("/studio")({
  component: StudioLayout,
});

function StudioLayout() {
  return (
    <StudioGate>
      <StudioShell />
    </StudioGate>
  );
}
