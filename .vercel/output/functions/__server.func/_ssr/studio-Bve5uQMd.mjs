import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { V as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as TriangleAlert } from "../_libs/lucide-react.mjs";
import { s as getOwnerAnalytics } from "./owner-FHUt_4Qp.mjs";
import { n as useStudio } from "./studio-Cc4LhrBg.mjs";
import { c as ErrorState, f as Button, g as useLang, h as t, m as copy } from "./router-CGkHkz2N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/studio-Bve5uQMd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Overview() {
	const { lang } = useLang();
	const { snapshot } = useStudio();
	const { tenant, products, categories, branches, health } = snapshot;
	const [analytics, setAnalytics] = (0, import_react.useState)({ status: "loading" });
	(0, import_react.useEffect)(() => {
		getOwnerAnalytics({ data: { days: 7 } }).then((result) => {
			if (!result.ok) setAnalytics({
				status: "error",
				message: result.error
			});
			else setAnalytics({
				status: "ok",
				data: result.data
			});
		}).catch((err) => setAnalytics({
			status: "error",
			message: err instanceof Error ? err.message : "تعذر التحميل"
		}));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-4xl gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold",
				children: t(copy.studio.greeting, lang)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: lang === "ar" ? tenant.nameAr : tenant.nameEn || tenant.nameAr
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: t(copy.studio.health, lang),
						value: `${health.score}`,
						suffix: "%"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: t(copy.analytics.visits, lang),
						value: analytics.status === "ok" ? String(analytics.data.visits) : analytics.status === "error" ? "—" : "…"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: t(copy.studio.products, lang),
						value: String(products.length)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: t(copy.studio.branches, lang),
						value: String(branches.length)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 rounded-xl border border-line p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-medium",
					children: t(copy.studio.needsAttention, lang)
				}), health.attention.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-good",
					children: t(copy.studio.allClear, lang)
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid gap-2",
					children: health.attention.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.href,
						className: "flex items-start gap-3 rounded-md bg-sand/60 px-3 py-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 size-4 shrink-0 text-warn" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "ar" ? item.titleAr : item.titleEn })]
					}) }, item.key))
				})]
			}),
			analytics.status === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, { message: analytics.message }) : analytics.status === "ok" && analytics.data.visits === 0 && analytics.data.productViews === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-xl border border-line px-4 py-6 text-sm text-muted",
				children: t(copy.state.noDataYet, lang)
			}) : analytics.status === "ok" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-2 rounded-xl border border-line p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-medium",
					children: t(copy.analytics.title, lang)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						analytics.data.uniqueSessions,
						" ",
						t(copy.analytics.sessions, lang),
						" · ",
						analytics.data.productViews,
						" ",
						t(copy.analytics.views, lang)
					]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/studio/menu",
						children: t(copy.studio.addProduct, lang)
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: `/m/${tenant.slug}`,
						children: t(copy.studio.openMenu, lang)
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted",
				children: [
					categories.length,
					" ",
					t(copy.studio.categories, lang)
				]
			})
		]
	});
}
function Stat({ label, value, suffix }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-line p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-1 font-display text-2xl tabular",
			children: [value, suffix ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-base",
				children: suffix
			}) : null]
		})]
	});
}
//#endregion
export { Overview as component };
