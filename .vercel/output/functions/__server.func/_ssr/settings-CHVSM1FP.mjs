import { V as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { h as updateTenant } from "./owner-FHUt_4Qp.mjs";
import { n as Input, t as Field } from "./input-C3tB8iIa.mjs";
import { n as useStudio, r as useStudioFlash } from "./studio-Cc4LhrBg.mjs";
import { f as Button, g as useLang, h as t, l as Flash, m as copy } from "./router-CGkHkz2N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-CHVSM1FP.js
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const { lang } = useLang();
	const { snapshot } = useStudio();
	const flash = useStudioFlash();
	const tenant = snapshot.tenant;
	const publicHref = `/m/${tenant.slug}${snapshot.branches[0] ? `/${snapshot.branches[0].slug}` : ""}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-2xl gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold",
				children: t(copy.nav.settings, lang)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: tenant.isPublished ? t(copy.state.published, lang) : t(copy.state.draft, lang)
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 rounded-xl border border-line p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-medium",
						children: lang === "ar" ? "النشر" : "Publishing"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-ink-soft",
						children: tenant.isPublished ? lang === "ar" ? "المنيو ظاهر للضيوف عبر الرابط ورمز QR." : "Guests can open this menu from the link and QR." : lang === "ar" ? "المسودة غير مرئية للضيوف. انشر عندما تكون جاهزاً." : "Drafts are hidden from guests. Publish when you are ready."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flash, {
						error: flash.error,
						ok: flash.ok
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								disabled: flash.busy,
								onClick: () => void flash.run(() => updateTenant({ data: { isPublished: !tenant.isPublished } })),
								children: tenant.isPublished ? t(copy.studio.unpublish, lang) : t(copy.studio.publish, lang)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/studio/preview",
									children: t(copy.studio.previewDraft, lang)
								})
							}),
							tenant.isPublished ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: publicHref,
									children: t(copy.studio.openMenu, lang)
								})
							}) : null
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 rounded-xl border border-line p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-medium",
						children: t(copy.studio.slug, lang)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: lang === "ar" ? "الرابط العام" : "Public URL",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							readOnly: true,
							value: typeof window !== "undefined" ? `${window.location.origin}${publicHref}` : publicHref
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: lang === "ar" ? "تغيير الرابط غير متاح بعد النشر لتفادي كسر رموز QR المطبوعة." : "The slug stays stable so printed QR codes keep working."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-2 rounded-xl border border-line p-5 text-sm text-ink-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					lang === "ar" ? "صلاحيتك:" : "Your role:",
					" ",
					snapshot.role
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					snapshot.members.length,
					" ",
					lang === "ar" ? "أعضاء" : "members"
				] })]
			})
		]
	});
}
//#endregion
export { SettingsPage as component };
