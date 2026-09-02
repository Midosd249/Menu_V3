import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { V as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { h as updateTenant } from "./owner-FHUt_4Qp.mjs";
import { n as Input, r as Textarea, t as Field } from "./input-C3tB8iIa.mjs";
import { n as useStudio, r as useStudioFlash } from "./studio-Cc4LhrBg.mjs";
import { t as compressImageFile } from "./image-r4U0YOoN.mjs";
import { f as Button, g as useLang, h as t, l as Flash, m as copy } from "./router-CGkHkz2N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/brand-DoO1nScG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BrandPage() {
	const { lang } = useLang();
	const { snapshot } = useStudio();
	const flash = useStudioFlash();
	const tenant = snapshot.tenant;
	const [form, setForm] = (0, import_react.useState)({
		nameAr: tenant.nameAr,
		nameEn: tenant.nameEn,
		taglineAr: tenant.taglineAr,
		taglineEn: tenant.taglineEn,
		city: tenant.city,
		whatsapp: tenant.whatsapp,
		whatsappTemplate: tenant.whatsappTemplate,
		instagramUrl: tenant.instagramUrl,
		logoUrl: tenant.logoUrl,
		coverUrl: tenant.coverUrl,
		primaryColor: tenant.primaryColor,
		accentColor: tenant.accentColor
	});
	function set(key, value) {
		setForm((prev) => ({
			...prev,
			[key]: value
		}));
	}
	async function onFile(key, file) {
		if (!file) return;
		try {
			set(key, await compressImageFile(file));
		} catch (err) {
			flash.setError(err instanceof Error ? err.message : t(copy.state.error, lang));
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-2xl gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-2xl font-semibold",
			children: t(copy.nav.brand, lang)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: lang === "ar" ? "ما يراه الضيف في رأس المنيو." : "What guests see at the top of the menu."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "grid gap-3",
			onSubmit: (e) => {
				e.preventDefault();
				flash.run(() => updateTenant({ data: { ...form } }));
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: t(copy.studio.nameAr, lang),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.nameAr,
						onChange: (e) => set("nameAr", e.target.value),
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: t(copy.studio.nameEn, lang),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.nameEn,
						onChange: (e) => set("nameEn", e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: t(copy.studio.descAr, lang),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.taglineAr,
						onChange: (e) => set("taglineAr", e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: t(copy.studio.descEn, lang),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.taglineEn,
						onChange: (e) => set("taglineEn", e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: t(copy.studio.city, lang),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.city,
						onChange: (e) => set("city", e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: t(copy.studio.whatsapp, lang),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.whatsapp,
						onChange: (e) => set("whatsapp", e.target.value),
						inputMode: "tel",
						placeholder: "9665XXXXXXXX"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: t(copy.studio.whatsappTpl, lang),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: form.whatsappTemplate,
						onChange: (e) => set("whatsappTemplate", e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: t(copy.studio.instagram, lang),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.instagramUrl,
						onChange: (e) => set("instagramUrl", e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t(copy.studio.primaryColor, lang),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "color",
							value: form.primaryColor || "#171411",
							onChange: (e) => set("primaryColor", e.target.value)
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t(copy.studio.accentColor, lang),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "color",
							value: form.accentColor || "#8f4e32",
							onChange: (e) => set("accentColor", e.target.value)
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: t(copy.studio.logoUrl, lang),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.logoUrl.startsWith("data:") ? "" : form.logoUrl,
						onChange: (e) => set("logoUrl", e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "inline-flex h-11 cursor-pointer items-center justify-center rounded-md border border-line text-sm",
					children: [lang === "ar" ? "رفع شعار" : "Upload logo", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						accept: "image/*",
						className: "sr-only",
						onChange: (e) => void onFile("logoUrl", e.target.files?.[0] ?? null)
					})]
				}),
				form.logoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: form.logoUrl,
					alt: "",
					className: "size-20 rounded-md object-cover"
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: t(copy.studio.coverUrl, lang),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.coverUrl.startsWith("data:") ? "" : form.coverUrl,
						onChange: (e) => set("coverUrl", e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "inline-flex h-11 cursor-pointer items-center justify-center rounded-md border border-line text-sm",
					children: [lang === "ar" ? "رفع غلاف" : "Upload cover", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						accept: "image/*",
						className: "sr-only",
						onChange: (e) => void onFile("coverUrl", e.target.files?.[0] ?? null)
					})]
				}),
				form.coverUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: form.coverUrl,
					alt: "",
					className: "h-32 w-full rounded-md object-cover"
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flash, {
					error: flash.error,
					ok: flash.ok
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: flash.busy,
					children: flash.busy ? t(copy.state.loading, lang) : t(copy.studio.save, lang)
				})
			]
		})]
	});
}
//#endregion
export { BrandPage as component };
