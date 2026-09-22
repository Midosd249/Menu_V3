export const MAX_IMAGE_DATA_URL_LENGTH = 450_000;

export async function compressImageFile(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("الملف ليس صورة");
  const bitmap = await createImageBitmap(file);
  try {
    let maxDimension = 1400;
    let quality = 0.82;
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height, 1));
      const width = Math.max(1, Math.round(bitmap.width * scale));
      const height = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("تعذر معالجة الصورة");
      ctx.drawImage(bitmap, 0, 0, width, height);
      const webp = canvas.toDataURL("image/webp", quality);
      if (webp.length <= MAX_IMAGE_DATA_URL_LENGTH) return webp;
      if (quality > 0.5) quality = Math.max(0.5, quality - 0.08);
      else maxDimension = Math.max(640, Math.round(maxDimension * 0.82));
    }
  } finally { bitmap.close(); }
  throw new Error("تعذر ضغط الصورة بالحجم المسموح. جرّب صورة أصغر أو أقل دقة.");
}

export type ImageTransformOptions = {
  width?: number;
  quality?: number;
  fit?: "crop" | "max";
};

const UNSPLASH_HOSTNAMES = new Set(["images.unsplash.com"]);

export function getOptimizedImageUrl(src: string | undefined, options: ImageTransformOptions = {}): string | undefined {
  if (!src || src.startsWith("data:") || src.startsWith("blob:")) return src;

  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return src;
  }

  if (!UNSPLASH_HOSTNAMES.has(url.hostname)) return src;

  const width = options.width;
  const quality = options.quality;
  const fit = options.fit;

  if (width && Number.isFinite(width)) {
    url.searchParams.set("w", String(Math.max(64, Math.min(2400, Math.round(width)))));
  }
  if (quality && Number.isFinite(quality)) {
    url.searchParams.set("q", String(Math.max(40, Math.min(90, Math.round(quality)))));
  }
  if (fit) url.searchParams.set("fit", fit);
  url.searchParams.set("auto", "format");

  return url.toString();
}
\n