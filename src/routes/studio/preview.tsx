import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PublicMenuView } from "@/components/public-menu";
import { ErrorState, LoadingState } from "@/components/state-panel";
import { getOwnerPreviewMenu } from "@/lib/menu/owner";
import type { PublicMenu } from "@/lib/menu/types";

export const Route = createFileRoute("/studio/preview")({ component: PreviewPage });

function PreviewPage() {
  const [state, setState] = useState<
    { status: "loading" } | { status: "error"; message: string } | { status: "ok"; menu: PublicMenu }
  >({ status: "loading" });

  useEffect(() => {
    getOwnerPreviewMenu({ data: {} })
      .then((result) => {
        if (!result.ok) setState({ status: "error", message: result.error });
        else setState({ status: "ok", menu: result.data });
      })
      .catch((err: unknown) =>
        setState({ status: "error", message: err instanceof Error ? err.message : "تعذر تحميل المعاينة" }),
      );
  }, []);

  if (state.status === "loading") return <LoadingState />;
  if (state.status === "error") return <ErrorState message={state.message} />;
  return (
    <div className="-mx-4 -my-6 lg:-mx-8">
      <PublicMenuView menu={state.menu} preview />
    </div>
  );
}
