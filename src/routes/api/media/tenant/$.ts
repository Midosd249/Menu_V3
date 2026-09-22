import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";

const MEDIA_KINDS = {
  logo: "logo_url",
  cover: "cover_url",
} as const;

const MAX_DATA_URL_LENGTH = 450_000;

function decodeImageDataUrl(value: string): { mime: string; bytes: Uint8Array } | null {
  if (!value.startsWith("data:image/")) return null;
  const comma = value.indexOf(",");
  if (comma < 0 || comma > MAX_DATA_URL_LENGTH) return null;

  const header = value.slice(5, comma).toLowerCase();
  const payload = value.slice(comma + 1);
  const mime = header.split(";")[0];
  if (!["image/webp", "image/png", "image/jpeg", "image/gif", "image/svg+xml"].includes(mime)) return null;
  if (!/;base64$/i.test(header)) return null;

  try {
    const binary = atob(payload);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    return { mime, bytes };
  } catch {
    return null;
  }
}

export const Route = createFileRoute("/api/media/tenant/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const parts = params._splat?.split("/").filter(Boolean) ?? [];
        const tenantId = parts[0];
        const kind = parts[1] as keyof typeof MEDIA_KINDS | undefined;

        if (!tenantId || !kind || !(kind in MEDIA_KINDS) || parts.length !== 2) {
          return new Response("Not found", { status: 404 });
        }

        try {
          const sql = await getSql();
          const column = MEDIA_KINDS[kind];
          const rows = await sql`
            select ${sql.unsafe(column)} as image_url
            from tenants
            where id = ${tenantId}
              and is_active = true
              and is_published = true
            limit 1
          `;
          const image = String(rows[0]?.image_url ?? "");
          const decoded = decodeImageDataUrl(image);
          if (!decoded) return new Response("Not found", { status: 404 });

          return new Response(decoded.bytes, {
            status: 200,
            headers: {
              "Content-Type": decoded.mime,
              "Cache-Control": "public, max-age=31536000, immutable",
              "X-Content-Type-Options": "nosniff",
            },
          });
        } catch (error) {
          console.error("tenant media route failed", error);
          return new Response("Not found", { status: 404 });
        }
      },
    },
  },
});