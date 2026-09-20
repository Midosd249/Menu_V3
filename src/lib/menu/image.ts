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
