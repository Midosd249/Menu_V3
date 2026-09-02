import { o as __toESM } from "../_runtime.mjs";
import { n as cn } from "./utils-DRrjZD06.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { V as require_jsx_runtime, d as useRouterState, m as Outlet, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as Building2, _ as ExternalLink, f as Palette, h as LayoutDashboard, l as QrCode, n as UtensilsCrossed, o as Settings, r as Upload, v as Ellipsis, x as ChartColumn } from "../_libs/lucide-react.mjs";
import { i as UserButton } from "./gates-B9U5tCeZ.mjs";
import { n as useStudio, t as StudioGate } from "./studio-Cc4LhrBg.mjs";
import { a as LangToggle, g as useLang, h as t, m as copy } from "./router-CGkHkz2N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/studio-Dbj_cMA-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NAV = [
	{
		to: "/studio",
		icon: LayoutDashboard,
		label: copy.nav.overview,
		exact: true
	},
	{
		to: "/studio/menu",
		icon: UtensilsCrossed,
		label: copy.nav.menu
	},
	{
		to: "/studio/branches",
		icon: Building2,
		label: copy.nav.branches
	},
	{
		to: "/studio/brand",
		icon: Palette,
		label: copy.nav.brand
	},
	{
		to: "/studio/qr",
		icon: QrCode,
		label: copy.nav.qr
	},
	{
		to: "/studio/analytics",
		icon: ChartColumn,
		label: copy.nav.analytics
	},
	{
		to: "/studio/import",
		icon: Upload,
		label: copy.nav.import
	},
	{
		to: "/studio/settings",
		icon: Settings,
		label: copy.nav.settings
	}
];
var MOBILE_PRIMARY = [
	"/studio",
	"/studio/menu",
	"/studio/qr"
];
function StudioShell() {
	const { lang } = useLang();
	const { snapshot } = useStudio();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const tenant = snapshot.tenant;
	const [moreOpen, setMoreOpen] = (0, import_react.useState)(false);
	const publicHref = `/m/${tenant.slug}${snapshot.branches[0] ? `/${snapshot.branches[0].slug}` : ""}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-paper lg:grid lg:grid-cols-[240px_1fr]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "hidden border-e border-line lg:flex lg:flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1 px-5 py-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg font-semibold",
							children: t(copy.brand, lang)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm text-muted",
							children: lang === "ar" ? tenant.nameAr : tenant.nameEn || tenant.nameAr
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "grid gap-1 px-3 pb-6",
						children: NAV.map((item) => {
							const active = "exact" in item && item.exact ? pathname === item.to : pathname.startsWith(item.to);
							const Icon = item.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								className: cn("flex h-11 items-center gap-2 rounded-md px-3 text-sm", active ? "bg-ink text-paper" : "text-ink-soft hover:bg-sand"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), t(item.label, lang)]
							}, item.to);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-auto grid gap-3 border-t border-line p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/studio/preview",
								className: "inline-flex items-center gap-2 text-sm text-ink-soft",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-4" }), t(copy.nav.preview, lang)]
							}),
							tenant.isPublished ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: publicHref,
								className: "inline-flex items-center gap-2 text-sm text-ink-soft",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-4" }), t(copy.studio.openMenu, lang)]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "flex items-center justify-between gap-3 border-b border-line px-4 py-3 lg:px-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-medium",
								children: lang === "ar" ? tenant.nameAr : tenant.nameEn || tenant.nameAr
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: tenant.isPublished ? t(copy.state.published, lang) : t(copy.state.draft, lang)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LangToggle, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "lg:hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1 px-4 py-6 pb-28 lg:px-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 gap-1 border-t border-line bg-paper px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden",
						children: [NAV.filter((item) => MOBILE_PRIMARY.includes(item.to)).map((item) => {
							const active = "exact" in item && item.exact ? pathname === item.to : pathname.startsWith(item.to);
							const Icon = item.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								className: cn("grid h-12 place-items-center rounded-md text-xs", active ? "bg-ink text-paper" : "text-muted"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), t(item.label, lang)]
							}, item.to);
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setMoreOpen(true),
							className: cn("grid h-12 place-items-center rounded-md text-xs", moreOpen || NAV.some((item) => !MOBILE_PRIMARY.includes(item.to) && ("exact" in item && item.exact ? pathname === item.to : pathname.startsWith(item.to))) ? "bg-ink text-paper" : "text-muted"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-4" }), t(copy.nav.more, lang)]
						})]
					})
				]
			}),
			moreOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-40 lg:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "absolute inset-0 bg-ink/40",
					"aria-label": t(copy.studio.cancel, lang),
					onClick: () => setMoreOpen(false)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-x-0 bottom-0 rounded-t-xl bg-paper p-4 pb-[max(1rem,env(safe-area-inset-bottom))]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 text-sm font-medium",
						children: t(copy.nav.more, lang)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-3 gap-2",
						children: [NAV.filter((item) => !MOBILE_PRIMARY.includes(item.to)).map((item) => {
							const Icon = item.icon;
							const active = pathname.startsWith(item.to);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								onClick: () => setMoreOpen(false),
								className: cn("grid h-20 place-items-center gap-1 rounded-lg border border-line text-xs", active ? "bg-ink text-paper" : "bg-paper text-ink-soft"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), t(item.label, lang)]
							}, item.to);
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/studio/preview",
							onClick: () => setMoreOpen(false),
							className: "grid h-20 place-items-center gap-1 rounded-lg border border-line text-xs text-ink-soft",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-4" }), t(copy.nav.preview, lang)]
						})]
					})]
				})]
			}) : null
		]
	});
}
function StudioLayout() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioShell, {}) });
}
//#endregion
export { StudioLayout as component };
