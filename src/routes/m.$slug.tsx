import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PublicMenuView } from "@/components/public-menu";
import { ErrorState, LoadingState } from "@/components/state-panel";
import { getPublicMenu } from "@/lib/menu/public";
import type { PublicMenu } from "@/lib/menu/types";

export const Route = createFileRoute("/m/$slug")({ component: PublicMenuPage });

function PublicMenuPage() {
  const { slug } = Route.useParams();
  const search = Route.useSearch() as { branch?: string };
  return <MenuLoader slug={slug} branch={search.branch} />;
}

export function MenuLoader({ slug, branch }: { slug: string; branch?: string }) {
  const [state, setState] = useState<
    { status: "loading" } | { status: "error"; message: string; retry: () => void } | { status: "ok"; menu: PublicMenu }
  >({ status: "loading" });

  function load() {
    setState({ status: "loading" });
    getPublicMenu({ data: { slug, branch } })
      .then((result) => {
        if (!result.ok) {
          setState({ status: "error", message: result.error, retry: load });
          return;
        }
        setState({ status: "ok", menu: result.data });
      })
      .catch((err: unknown) => {
        setState({
          status: "error",
          message: err instanceof Error ? err.message : "تعذر تحميل المنيو",
          retry: load,
        });
      });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, branch]);

  if (state.status === "loading") return <LoadingState />;
  if (state.status === "error") return <ErrorState message={state.message} onRetry={state.retry} />;
  return <PublicMenuView menu={state.menu} />;
}
