import { createFileRoute } from "@tanstack/react-router";
import { StudioMenuWorkspacePage } from "@/components/studio-menu-workspace-page";

export const Route = createFileRoute("/studio/menu")({ component: StudioMenuWorkspacePage });
