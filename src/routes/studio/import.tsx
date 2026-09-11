import { createFileRoute } from "@tanstack/react-router";
import { MenuImportPanel } from "@/components/studio/menu-import-panel";

export const Route = createFileRoute("/studio/import")({ component: ImportPage });

function ImportPage() {
  return <div className="mx-auto max-w-4xl"><MenuImportPanel embedded /></div>;
}
