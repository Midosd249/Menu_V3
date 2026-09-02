import { createFileRoute } from "@tanstack/react-router";
import { MenuLoader } from "./m.$slug";

export const Route = createFileRoute("/m/$slug/$branch")({ component: BranchMenuPage });

function BranchMenuPage() {
  const { slug, branch } = Route.useParams();
  return <MenuLoader slug={slug} branch={branch} />;
}
