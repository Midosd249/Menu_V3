import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { V as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useStudio } from "./studio-Cc4LhrBg.mjs";
import { f as Button, g as useLang, h as t, m as copy } from "./router-CGkHkz2N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/qr-D7y-rWkh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function menuUrl(origin, slug, branchSlug) {
	return `${origin}/m/${slug}/${branchSlug}?src=qr`;
}
function QrPage() {
	const { lang } = useLang();
	const { snapshot } = useStudio();
	const [origin, setOrigin] = (0, import_react.useState)("");
	const [copied, setCopied] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setOrigin(window.location.origin);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-3xl gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-2xl font-semibold",
			children: t(copy.qr.title, lang)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: t(copy.qr.hint, lang)
		})] }), snapshot.branches.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "rounded-xl border border-line px-4 py-6 text-sm text-muted",
			children: lang === "ar" ? "أضف فرعاً أولاً حتى يتولد رمز QR." : "Add a branch first so a QR destination exists."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "grid gap-6 sm:grid-cols-2",
			children: snapshot.branches.map((b) => {
				const url = origin ? menuUrl(origin, snapshot.tenant.slug, b.slug) : "";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "grid gap-3 rounded-xl border border-line p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: lang === "ar" ? b.nameAr : b.nameEn || b.nameAr
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "break-all text-xs text-muted",
							children: url || "…"
						}),
						url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrImage, { url }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "aspect-square rounded-md bg-sand" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									size: "sm",
									variant: "outline",
									onClick: async () => {
										await navigator.clipboard.writeText(url);
										setCopied(b.id);
									},
									children: copied === b.id ? t(copy.qr.copied, lang) : t(copy.qr.copy, lang)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									size: "sm",
									variant: "outline",
									onClick: () => downloadQr(url, `${snapshot.tenant.slug}-${b.slug}`),
									children: t(copy.qr.download, lang)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									size: "sm",
									onClick: () => printQr(url, lang === "ar" ? snapshot.tenant.nameAr : snapshot.tenant.nameEn || snapshot.tenant.nameAr, lang === "ar" ? b.nameAr : b.nameEn || b.nameAr),
									children: t(copy.qr.print, lang)
								})
							]
						})
					]
				}, b.id);
			})
		})]
	});
}
function QrImage({ url }) {
	const [src, setSrc] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		import("../_libs/qrcode.mjs").then((n) => /* @__PURE__ */ __toESM(n.t())).then((QR) => QR.toDataURL(url, {
			width: 480,
			margin: 2,
			color: {
				dark: "#171411",
				light: "#f3eee6"
			}
		}).then((data) => {
			if (!cancelled) setSrc(data);
		}));
		return () => {
			cancelled = true;
		};
	}, [url]);
	if (!src) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "aspect-square rounded-md bg-sand" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src,
		alt: "",
		className: "aspect-square w-full rounded-md bg-paper"
	});
}
async function downloadQr(url, name) {
	const data = await (await import("../_libs/qrcode.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()))).toDataURL(url, {
		width: 1024,
		margin: 2,
		color: {
			dark: "#171411",
			light: "#ffffff"
		}
	});
	const a = document.createElement("a");
	a.href = data;
	a.download = `qr-${name}.png`;
	a.click();
}
async function printQr(url, restaurant, branch) {
	const data = await (await import("../_libs/qrcode.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()))).toDataURL(url, {
		width: 720,
		margin: 2,
		color: {
			dark: "#171411",
			light: "#ffffff"
		}
	});
	const w = window.open("", "_blank", "noopener,noreferrer");
	if (!w) return;
	w.document.write(`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>${restaurant}</title>
    <style>body{font-family:system-ui,sans-serif;text-align:center;padding:32px;color:#171411} img{width:280px;height:280px} p{margin:8px 0}</style>
    </head><body><p style="font-size:22px;font-weight:600">${restaurant}</p><p>${branch}</p>
    <img src="${data}" alt="QR"><p style="font-size:12px;color:#7a7268">امسح لفتح المنيو</p></body></html>`);
	w.document.close();
	w.focus();
	w.print();
}
//#endregion
export { QrPage as component };
