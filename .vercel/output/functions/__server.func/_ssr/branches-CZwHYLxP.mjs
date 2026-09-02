import { o as __toESM } from "../_runtime.mjs";
import { u as weekdayLabel } from "./utils-DRrjZD06.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { V as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getBranchHours, n as deleteBranch, u as saveBranch } from "./owner-FHUt_4Qp.mjs";
import { n as Input, t as Field } from "./input-C3tB8iIa.mjs";
import { n as useStudio, r as useStudioFlash } from "./studio-Cc4LhrBg.mjs";
import { d as Sheet, f as Button, g as useLang, h as t, l as Flash, m as copy } from "./router-CGkHkz2N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/branches-CZwHYLxP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DEFAULT_HOURS = [
	{
		weekday: 0,
		opensAt: "07:00",
		closesAt: "00:00",
		isClosed: false
	},
	{
		weekday: 1,
		opensAt: "07:00",
		closesAt: "00:00",
		isClosed: false
	},
	{
		weekday: 2,
		opensAt: "07:00",
		closesAt: "00:00",
		isClosed: false
	},
	{
		weekday: 3,
		opensAt: "07:00",
		closesAt: "00:00",
		isClosed: false
	},
	{
		weekday: 4,
		opensAt: "07:00",
		closesAt: "00:00",
		isClosed: false
	},
	{
		weekday: 5,
		opensAt: "13:00",
		closesAt: "00:00",
		isClosed: false
	},
	{
		weekday: 6,
		opensAt: "07:00",
		closesAt: "00:00",
		isClosed: false
	}
];
function emptyDraft() {
	return {
		nameAr: "",
		nameEn: "",
		addressAr: "",
		addressEn: "",
		mapsUrl: "",
		phone: "",
		isActive: true,
		hours: DEFAULT_HOURS.map((h) => ({ ...h }))
	};
}
function BranchesPage() {
	const { lang } = useLang();
	const { snapshot } = useStudio();
	const flash = useStudioFlash();
	const [draft, setDraft] = (0, import_react.useState)(null);
	const [pendingId, setPendingId] = (0, import_react.useState)(null);
	async function openEdit(branch) {
		const hoursRes = await getBranchHours({ data: { branchId: branch.id } });
		setDraft({
			id: branch.id,
			nameAr: branch.nameAr,
			nameEn: branch.nameEn,
			addressAr: branch.addressAr,
			addressEn: branch.addressEn,
			mapsUrl: branch.mapsUrl,
			phone: branch.phone,
			isActive: branch.isActive,
			hours: hoursRes.ok && hoursRes.data.hours.length ? hoursRes.data.hours.map(({ branchId: _b, ...rest }) => rest) : DEFAULT_HOURS.map((h) => ({ ...h }))
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-3xl gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl font-semibold",
					children: t(copy.nav.branches, lang)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						snapshot.branches.length,
						" ",
						t(copy.studio.branches, lang)
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					onClick: () => setDraft(emptyDraft()),
					children: t(copy.studio.addBranch, lang)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flash, {
				error: flash.error,
				ok: flash.ok
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-3",
				children: snapshot.branches.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "grid gap-2 rounded-xl border border-line p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: lang === "ar" ? b.nameAr : b.nameEn || b.nameAr
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: b.addressAr || b.addressEn || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted",
								children: [
									"/",
									snapshot.tenant.slug,
									"/",
									b.slug
								]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `text-xs ${b.isActive ? "text-good" : "text-bad"}`,
							children: b.isActive ? lang === "ar" ? "نشط" : "Active" : lang === "ar" ? "متوقف" : "Inactive"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							size: "sm",
							variant: "outline",
							onClick: () => void openEdit(b),
							children: lang === "ar" ? "تعديل" : "Edit"
						}), snapshot.branches.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							size: "sm",
							variant: "ghost",
							onClick: () => setPendingId(b.id),
							children: t(copy.studio.delete, lang)
						}) : null]
					})]
				}, b.id))
			}),
			draft ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				title: draft.id ? lang === "ar" ? "تعديل فرع" : "Edit branch" : t(copy.studio.addBranch, lang),
				onClose: () => setDraft(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BranchForm, {
					draft,
					setDraft,
					busy: flash.busy,
					error: flash.error,
					ok: flash.ok,
					onSave: async () => {
						if (await flash.run(() => saveBranch({ data: {
							id: draft.id,
							nameAr: draft.nameAr.trim(),
							nameEn: draft.nameEn.trim(),
							addressAr: draft.addressAr.trim(),
							addressEn: draft.addressEn.trim(),
							mapsUrl: draft.mapsUrl.trim(),
							phone: draft.phone.trim(),
							isActive: draft.isActive,
							hours: draft.hours.map((h) => ({
								weekday: h.weekday,
								opensAt: h.opensAt,
								closesAt: h.closesAt,
								isClosed: h.isClosed
							}))
						} }))) setDraft(null);
					}
				})
			}) : null,
			pendingId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				title: t(copy.studio.confirmDelete, lang),
				onClose: () => setPendingId(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "danger",
						disabled: flash.busy,
						onClick: async () => {
							if (await flash.run(() => deleteBranch({ data: { id: pendingId } }))) setPendingId(null);
						},
						children: t(copy.studio.yesDelete, lang)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => setPendingId(null),
						children: t(copy.studio.cancel, lang)
					})]
				})
			}) : null
		]
	});
}
function BranchForm({ draft, setDraft, busy, error, ok, onSave }) {
	const { lang } = useLang();
	(0, import_react.useEffect)(() => {}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: t(copy.studio.nameAr, lang),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: draft.nameAr,
					onChange: (e) => setDraft({
						...draft,
						nameAr: e.target.value
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: t(copy.studio.nameEn, lang),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: draft.nameEn,
					onChange: (e) => setDraft({
						...draft,
						nameEn: e.target.value
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: t(copy.studio.address, lang),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: draft.addressAr,
					onChange: (e) => setDraft({
						...draft,
						addressAr: e.target.value
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: t(copy.studio.phone, lang),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: draft.phone,
					onChange: (e) => setDraft({
						...draft,
						phone: e.target.value
					}),
					inputMode: "tel"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: t(copy.studio.maps, lang),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: draft.mapsUrl,
					onChange: (e) => setDraft({
						...draft,
						mapsUrl: e.target.value
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex h-11 items-center gap-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: draft.isActive,
					onChange: (e) => setDraft({
						...draft,
						isActive: e.target.checked
					})
				}), lang === "ar" ? "فرع نشط" : "Active branch"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium",
				children: t(copy.studio.hours, lang)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2",
				children: draft.hours.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[1fr_auto_auto] items-center gap-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: !h.isClosed,
								onChange: (e) => setDraft({
									...draft,
									hours: draft.hours.map((x) => x.weekday === h.weekday ? {
										...x,
										isClosed: !e.target.checked
									} : x)
								})
							}), weekdayLabel(h.weekday, lang)]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "time",
							className: "h-10",
							disabled: h.isClosed,
							value: h.opensAt ?? "07:00",
							onChange: (e) => setDraft({
								...draft,
								hours: draft.hours.map((x) => x.weekday === h.weekday ? {
									...x,
									opensAt: e.target.value
								} : x)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "time",
							className: "h-10",
							disabled: h.isClosed,
							value: h.closesAt ?? "00:00",
							onChange: (e) => setDraft({
								...draft,
								hours: draft.hours.map((x) => x.weekday === h.weekday ? {
									...x,
									closesAt: e.target.value
								} : x)
							})
						})
					]
				}, h.weekday))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flash, {
				error,
				ok
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				disabled: busy || !draft.nameAr.trim(),
				onClick: onSave,
				children: busy ? t(copy.state.loading, lang) : t(copy.studio.save, lang)
			})
		]
	});
}
//#endregion
export { BranchesPage as component };
