import { o as __toESM } from "../_runtime.mjs";
import { l as slugify } from "./utils-DRrjZD06.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { V as require_jsx_runtime, b as useNavigate, v as Link, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { h as updateTenant, o as getMyStudio, p as seedStarterItems, t as createRestaurant } from "./owner-FHUt_4Qp.mjs";
import { n as Input, t as Field } from "./input-C3tB8iIa.mjs";
import { n as useCurrentUserState } from "./use-current-user-DG6UNzh9.mjs";
import { t as RedirectToSignIn } from "./gates-B9U5tCeZ.mjs";
import { a as LangToggle, f as Button, g as useLang, h as t, l as Flash, m as copy, u as LoadingState } from "./router-CGkHkz2N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/onboarding-D5ljNqnw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Onboarding() {
	const { lang } = useLang();
	const navigate = useNavigate();
	const { user, isPending } = useCurrentUserState();
	const [checking, setChecking] = (0, import_react.useState)(true);
	const [hasTenant, setHasTenant] = (0, import_react.useState)(false);
	const [step, setStep] = (0, import_react.useState)(0);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [ok, setOk] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		nameAr: "",
		nameEn: "",
		city: "الرياض",
		slug: "",
		whatsapp: "",
		branchNameAr: "الفرع الرئيسي",
		branchNameEn: "Main branch",
		addressAr: ""
	});
	const [items, setItems] = (0, import_react.useState)([
		{
			categoryAr: "القهوة",
			categoryEn: "Coffee",
			nameAr: "",
			nameEn: "",
			price: ""
		},
		{
			categoryAr: "المخبوزات",
			categoryEn: "Bakery",
			nameAr: "",
			nameEn: "",
			price: ""
		},
		{
			categoryAr: "المطبخ",
			categoryEn: "Kitchen",
			nameAr: "",
			nameEn: "",
			price: ""
		}
	]);
	(0, import_react.useEffect)(() => {
		if (!user) {
			setChecking(false);
			return;
		}
		getMyStudio().then((result) => {
			if (result.ok && "tenant" in result.data && result.data.tenant) setHasTenant(true);
			setChecking(false);
		});
	}, [user]);
	if (isPending || checking) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, {});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (hasTenant) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/studio" });
	function set(key, value) {
		setForm((prev) => ({
			...prev,
			[key]: value
		}));
	}
	async function finish(publish) {
		setBusy(true);
		setError("");
		setOk(false);
		try {
			const created = await createRestaurant({ data: {
				nameAr: form.nameAr.trim(),
				nameEn: form.nameEn.trim() || void 0,
				slug: form.slug.trim() || slugify(form.nameEn || form.nameAr) || void 0,
				city: form.city.trim() || void 0,
				branchNameAr: form.branchNameAr.trim(),
				branchNameEn: form.branchNameEn.trim() || void 0,
				addressAr: form.addressAr.trim() || void 0,
				whatsapp: form.whatsapp.trim() || void 0
			} });
			if (!created.ok) {
				setError(created.error);
				return;
			}
			const starter = items.filter((row) => row.nameAr.trim() && Number(row.price) >= 0 && row.price !== "").map((row) => ({
				categoryAr: row.categoryAr,
				categoryEn: row.categoryEn,
				nameAr: row.nameAr.trim(),
				nameEn: row.nameEn.trim(),
				price: Number(row.price)
			}));
			if (starter.length) {
				const seeded = await seedStarterItems({ data: { items: starter } });
				if (!seeded.ok) {
					setError(seeded.error);
					return;
				}
			}
			if (publish) {
				const published = await updateTenant({ data: { isPublished: true } });
				if (!published.ok) {
					setError(published.error);
					return;
				}
			}
			setOk(true);
			await navigate({ to: "/studio" });
		} catch (err) {
			setError(err instanceof Error ? err.message : t(copy.state.error, lang));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto grid min-h-dvh max-w-lg content-start gap-6 px-5 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "font-display text-xl font-semibold",
					children: t(copy.brand, lang)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LangToggle, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold",
				children: t(copy.onboarding.title, lang)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted",
				children: [
					step + 1,
					" / 3 · ",
					t([
						copy.onboarding.step1,
						copy.onboarding.step2,
						copy.onboarding.step3
					][step], lang)
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-3 gap-2",
				children: [
					0,
					1,
					2
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-1 rounded-full ${i <= step ? "bg-accent" : "bg-sand"}` }, i))
			}),
			step === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t(copy.onboarding.restaurantAr, lang),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.nameAr,
							onChange: (e) => set("nameAr", e.target.value),
							required: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t(copy.onboarding.restaurantEn, lang),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.nameEn,
							onChange: (e) => set("nameEn", e.target.value)
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
					})
				]
			}) : null,
			step === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t(copy.studio.nameAr, lang),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.branchNameAr,
							onChange: (e) => set("branchNameAr", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t(copy.studio.nameEn, lang),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.branchNameEn,
							onChange: (e) => set("branchNameEn", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t(copy.studio.address, lang),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.addressAr,
							onChange: (e) => set("addressAr", e.target.value)
						})
					})
				]
			}) : null,
			step === 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: lang === "ar" ? "أضف ثلاثة أصناف للبداية، أو اتركها فارغة." : "Add three starter items, or leave them blank."
				}), items.map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2 rounded-xl border border-line p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: t(copy.studio.nameAr, lang),
						value: row.nameAr,
						onChange: (e) => setItems((prev) => prev.map((r, idx) => idx === i ? {
							...r,
							nameAr: e.target.value
						} : r))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: t(copy.studio.price, lang),
							inputMode: "decimal",
							value: row.price,
							onChange: (e) => setItems((prev) => prev.map((r, idx) => idx === i ? {
								...r,
								price: e.target.value
							} : r))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: lang === "ar" ? "التصنيف" : "Category",
							value: row.categoryAr,
							onChange: (e) => setItems((prev) => prev.map((r, idx) => idx === i ? {
								...r,
								categoryAr: e.target.value
							} : r))
						})]
					})]
				}, i))]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flash, {
				error,
				ok
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [step > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					onClick: () => setStep(step - 1),
					children: t(copy.onboarding.back, lang)
				}) : null, step < 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					disabled: step === 0 && form.nameAr.trim().length < 2,
					onClick: () => setStep(step + 1),
					children: t(copy.onboarding.continue, lang)
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					disabled: busy,
					onClick: () => void finish(false),
					children: t(copy.onboarding.skipItems, lang)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					disabled: busy,
					onClick: () => void finish(true),
					children: busy ? t(copy.state.loading, lang) : t(copy.onboarding.finish, lang)
				})] })]
			})
		]
	});
}
//#endregion
export { Onboarding as component };
