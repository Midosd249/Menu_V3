import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { V as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as getOwnerAnalytics } from "./owner-FHUt_4Qp.mjs";
import { c as ErrorState, f as Button, g as useLang, h as t, m as copy, u as LoadingState } from "./router-CGkHkz2N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analytics-BpsHHD4S.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AnalyticsPage() {
	const { lang } = useLang();
	const [days, setDays] = (0, import_react.useState)(7);
	const [state, setState] = (0, import_react.useState)({ status: "loading" });
	(0, import_react.useEffect)(() => {
		setState({ status: "loading" });
		getOwnerAnalytics({ data: { days } }).then((result) => {
			if (!result.ok) setState({
				status: "error",
				message: result.error
			});
			else setState({
				status: "ok",
				data: result.data
			});
		}).catch((err) => setState({
			status: "error",
			message: err instanceof Error ? err.message : t(copy.state.error, lang)
		}));
	}, [days, lang]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-4xl gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl font-semibold",
					children: t(copy.analytics.title, lang)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						size: "sm",
						variant: days === 7 ? "solid" : "outline",
						onClick: () => setDays(7),
						children: t(copy.analytics.days7, lang)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						size: "sm",
						variant: days === 30 ? "solid" : "outline",
						onClick: () => setDays(30),
						children: t(copy.analytics.days30, lang)
					})]
				})]
			}),
			state.status === "loading" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, {}) : null,
			state.status === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, { message: state.message }) : null,
			state.status === "ok" && state.data.visits === 0 && state.data.productViews === 0 && state.data.qrScans === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-xl border border-line px-4 py-10 text-center text-sm text-muted",
				children: t(copy.state.noDataYet, lang)
			}) : null,
			state.status === "ok" && (state.data.visits > 0 || state.data.productViews > 0 || state.data.qrScans > 0) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: t(copy.analytics.visits, lang),
							value: state.data.visits
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: t(copy.analytics.sessions, lang),
							value: state.data.uniqueSessions
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: t(copy.analytics.views, lang),
							value: state.data.productViews
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: t(copy.analytics.qr, lang),
							value: state.data.qrScans
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "grid gap-3 rounded-xl border border-line p-5 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: t(copy.analytics.wa, lang),
						value: state.data.whatsappClicks
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: t(copy.analytics.language, lang)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm",
						children: [
							"عربي ",
							state.data.langAr,
							" · EN ",
							state.data.langEn
						]
					})] })]
				}),
				state.data.series.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl border border-line p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-3 font-medium",
						children: t(copy.analytics.visits, lang)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleBars, { points: state.data.series.map((p) => ({
						label: p.day.slice(5),
						value: p.visits + p.views
					})) })]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rank, {
					title: t(copy.analytics.topItems, lang),
					rows: state.data.topProducts,
					lang
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rank, {
					title: t(copy.analytics.byCategory, lang),
					rows: state.data.byCategory,
					lang
				})
			] }) : null
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-line p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 font-display text-2xl tabular",
			children: value
		})]
	});
}
function Rank({ title, rows, lang }) {
	if (!rows.length) return null;
	const max = Math.max(...rows.map((r) => r.count), 1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "grid gap-3 rounded-xl border border-line p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-medium",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "grid gap-2",
			children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "grid gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "ar" ? r.nameAr : r.nameEn || r.nameAr }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular text-muted",
						children: r.count
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-1.5 overflow-hidden rounded-full bg-sand",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full bg-accent",
						style: { width: `${r.count / max * 100}%` }
					})
				})]
			}, r.id))
		})]
	});
}
function SimpleBars({ points }) {
	const max = Math.max(...points.map((p) => p.value), 1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-32 items-end gap-1",
		children: points.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid min-w-0 flex-1 justify-items-center gap-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-full rounded-t-sm bg-accent",
				style: { height: `${p.value / max * 100}%` }
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-muted",
				children: p.label
			})]
		}, p.label))
	});
}
//#endregion
export { AnalyticsPage as component };
