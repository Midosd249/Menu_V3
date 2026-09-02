export async function compressImageFile(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("الملف ليس صورة");
  }
  const bitmap = await createImageBitmap(file);
  const maxW = 1200;
  const scale = Math.min(1, maxW / Math.max(bitmap.width, 1));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("تعذر معالجة الصورة");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  let quality = 0.84;
  let url = canvas.toDataURL("image/jpeg", quality);
  while (url.length > 380_000 && quality > 0.42) {
    quality -= 0.12;
    url = canvas.toDataURL("image/jpeg", quality);
  }
  if (url.length > 520_000) {
    throw new Error("الصورة كبيرة جداً بعد الضغط. استخدم رابطاً أو صورة أصغر.");
  }
  return url;
}
