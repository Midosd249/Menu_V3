import { createFileRoute } from "@tanstack/react-router";
import { buildRobotsTxt } from "@/lib/seo/crawl";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: ({ request }) =>
        new Response(buildRobotsTxt(new URL(request.url).origin), {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
          },
        }),
    },
  },
});
