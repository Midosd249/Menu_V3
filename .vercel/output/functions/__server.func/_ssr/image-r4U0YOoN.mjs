//#region node_modules/.nitro/vite/services/ssr/assets/image-r4U0YOoN.js
async function compressImageFile(file) {
	if (!file.type.startsWith("image/")) throw new Error("الملف ليس صورة");
	const bitmap = await createImageBitmap(file);
	const scale = Math.min(1, 1200 / Math.max(bitmap.width, 1));
	const width = Math.max(1, Math.round(bitmap.width * scale));
	const height = Math.max(1, Math.round(bitmap.height * scale));
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("تعذر معالجة الصورة");
	ctx.drawImage(bitmap, 0, 0, width, height);
	bitmap.close();
	let quality = .84;
	let url = canvas.toDataURL("image/jpeg", quality);
	while (url.length > 38e4 && quality > .42) {
		quality -= .12;
		url = canvas.toDataURL("image/jpeg", quality);
	}
	if (url.length > 52e4) throw new Error("الصورة كبيرة جداً بعد الضغط. استخدم رابطاً أو صورة أصغر.");
	return url;
}
//#endregion
export { compressImageFile as t };
