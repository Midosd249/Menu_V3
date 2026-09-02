import { o as __toESM } from "../_runtime.mjs";
import { i as formatSar, n as cn } from "./utils-DRrjZD06.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { V as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Star, u as Plus } from "../_libs/lucide-react.mjs";
import { d as saveCategory, f as saveProduct, i as deleteProduct, m as toggleProduct, r as deleteCategory } from "./owner-FHUt_4Qp.mjs";
import { n as Input, r as Textarea, t as Field } from "./input-C3tB8iIa.mjs";
import { n as useStudio, r as useStudioFlash } from "./studio-Cc4LhrBg.mjs";
import { t as compressImageFile } from "./image-r4U0YOoN.mjs";
import { d as Sheet, f as Button, g as useLang, h as t, l as Flash, m as copy } from "./router-CGkHkz2N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/menu-x1W7rsgl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function emptyDraft(categoryId) {
	return {
		categoryId,
		nameAr: "",
		nameEn: "",
		descriptionAr: "",
		descriptionEn: "",
		price: "",
		imageUrl: "",
		calories: "",
		allergens: "",
		isAvailable: true,
		isFeatured: false
	};
}
function fromProduct(p) {
	return {
		id: p.id,
		categoryId: p.categoryId,
		nameAr: p.nameAr,
		nameEn: p.nameEn,
		descriptionAr: p.descriptionAr,
		descriptionEn: p.descriptionEn,
		price: String(p.price),
		imageUrl: p.imageUrl,
		calories: p.calories == null ? "" : String(p.calories),
		allergens: p.allergens,
		isAvailable: p.isAvailable,
		isFeatured: p.isFeatured
	};
}
function MenuStudio() {
	const { lang } = useLang();
	const { snapshot } = useStudio();
	const flash = useStudioFlash();
	const [query, setQuery] = (0, import_react.useState)("");
	const [catFilter, setCatFilter] = (0, import_react.useState)("all");
	const [draft, setDraft] = (0, import_react.useState)(null);
	const [catDraft, setCatDraft] = (0, import_react.useState)(null);
	const [pendingDelete, setPendingDelete] = (0, import_react.useState)(null);
	const [imageBusy, setImageBusy] = (0, import_react.useState)(false);
	const products = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return snapshot.products.filter((p) => {
			if (catFilter !== "all" && p.categoryId !== catFilter) return false;
			if (!q) return true;
			return [
				p.nameAr,
				p.nameEn,
				p.descriptionAr
			].some((v) => v.toLowerCase().includes(q));
		});
	}, [
		snapshot.products,
		catFilter,
		query
	]);
	async function saveItem() {
		if (!draft) return;
		const price = Number(draft.price);
		const calories = draft.calories === "" ? null : Number(draft.calories);
		if (!draft.nameAr.trim() || !Number.isFinite(price) || price < 0) {
			flash.setError(lang === "ar" ? "الاسم والسعر مطلوبان" : "Name and price are required");
			return;
		}
		if (calories != null && !Number.isFinite(calories)) {
			flash.setError(lang === "ar" ? "السعرات غير صالحة" : "Calories must be a number");
			return;
		}
		if (await flash.run(() => saveProduct({ data: {
			id: draft.id,
			categoryId: draft.categoryId,
			nameAr: draft.nameAr.trim(),
			nameEn: draft.nameEn.trim(),
			descriptionAr: draft.descriptionAr.trim(),
			descriptionEn: draft.descriptionEn.trim(),
			price,
			imageUrl: draft.imageUrl.trim(),
			calories,
			allergens: draft.allergens.trim(),
			isAvailable: draft.isAvailable,
			isFeatured: draft.isFeatured
		} }))) setDraft(null);
	}
	async function onImage(file) {
		if (!file || !draft) return;
		setImageBusy(true);
		flash.setError("");
		try {
			const url = await compressImageFile(file);
			setDraft({
				...draft,
				imageUrl: url
			});
		} catch (err) {
			flash.setError(err instanceof Error ? err.message : t(copy.state.error, lang));
		} finally {
			setImageBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-4xl gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl font-semibold",
					children: t(copy.nav.menu, lang)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						snapshot.products.length,
						" ",
						t(copy.studio.products, lang),
						" · ",
						snapshot.categories.length,
						" ",
						t(copy.studio.categories, lang)
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => setCatDraft({
							nameAr: "",
							nameEn: ""
						}),
						children: t(copy.studio.addCategory, lang)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						onClick: () => setDraft(emptyDraft(catFilter === "all" ? snapshot.categories[0]?.id ?? null : catFilter)),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), t(copy.studio.addProduct, lang)]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flash, {
				error: flash.error,
				ok: flash.ok
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2 overflow-x-auto no-scrollbar",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setCatFilter("all"),
					className: cn("h-10 shrink-0 rounded-full px-3 text-sm", catFilter === "all" ? "bg-ink text-paper" : "bg-sand"),
					children: t(copy.menu.all, lang)
				}), snapshot.categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setCatFilter(c.id),
					className: cn("h-10 shrink-0 rounded-full px-3 text-sm", catFilter === c.id ? "bg-ink text-paper" : "bg-sand"),
					children: lang === "ar" ? c.nameAr : c.nameEn || c.nameAr
				}, c.id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: query,
				onChange: (e) => setQuery(e.target.value),
				placeholder: t(copy.studio.searchItems, lang)
			}),
			snapshot.categories.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: lang === "ar" ? "أضف تصنيفاً أولاً، ثم الأصناف." : "Add a category first, then items."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-2",
				children: products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-3 rounded-xl border border-line p-2",
					children: [
						p.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: p.imageUrl,
							alt: "",
							className: "size-16 shrink-0 rounded-md object-cover"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid size-16 shrink-0 place-items-center rounded-md bg-sand text-xs text-muted",
							children: t(copy.studio.noImage, lang)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex items-center gap-1 font-medium",
									children: [lang === "ar" ? p.nameAr : p.nameEn || p.nameAr, p.isFeatured ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3 text-accent" }) : null]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-accent",
									children: formatSar(p.price, lang)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: cn("text-xs", p.isAvailable ? "text-good" : "text-bad"),
									children: p.isAvailable ? t(copy.studio.available, lang) : t(copy.studio.unavailable, lang)
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid shrink-0 gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "sm",
								variant: "outline",
								onClick: () => setDraft(fromProduct(p)),
								children: lang === "ar" ? "تعديل" : "Edit"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "sm",
								variant: "ghost",
								disabled: flash.busy,
								onClick: () => void flash.run(() => toggleProduct({ data: {
									id: p.id,
									field: "isAvailable",
									value: !p.isAvailable
								} })),
								children: p.isAvailable ? t(copy.studio.unavailable, lang) : t(copy.studio.available, lang)
							})]
						})
					]
				}, p.id))
			}),
			catFilter !== "all" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					size: "sm",
					onClick: () => {
						const c = snapshot.categories.find((x) => x.id === catFilter);
						if (c) setCatDraft({
							id: c.id,
							nameAr: c.nameAr,
							nameEn: c.nameEn
						});
					},
					children: lang === "ar" ? "تعديل التصنيف" : "Edit category"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					size: "sm",
					onClick: () => setPendingDelete({
						type: "category",
						id: catFilter
					}),
					children: t(copy.studio.delete, lang)
				})]
			}) : null,
			draft ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				title: draft.id ? lang === "ar" ? "تعديل صنف" : "Edit item" : t(copy.studio.addProduct, lang),
				onClose: () => setDraft(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
							label: t(copy.studio.categories, lang),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: "h-11 w-full rounded-md border border-line bg-paper px-3 text-sm",
								value: draft.categoryId ?? "",
								onChange: (e) => setDraft({
									...draft,
									categoryId: e.target.value || null
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: lang === "ar" ? "بدون تصنيف" : "No category"
								}), snapshot.categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: c.id,
									children: lang === "ar" ? c.nameAr : c.nameEn || c.nameAr
								}, c.id))]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: t(copy.studio.price, lang),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									inputMode: "decimal",
									value: draft.price,
									onChange: (e) => setDraft({
										...draft,
										price: e.target.value
									})
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: t(copy.studio.calories, lang),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									inputMode: "numeric",
									value: draft.calories,
									onChange: (e) => setDraft({
										...draft,
										calories: e.target.value
									})
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: t(copy.studio.descAr, lang),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: draft.descriptionAr,
								onChange: (e) => setDraft({
									...draft,
									descriptionAr: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: t(copy.studio.descEn, lang),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: draft.descriptionEn,
								onChange: (e) => setDraft({
									...draft,
									descriptionEn: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: t(copy.studio.allergens, lang),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.allergens,
								onChange: (e) => setDraft({
									...draft,
									allergens: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: t(copy.studio.imageUrl, lang),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.imageUrl.startsWith("data:") ? "" : draft.imageUrl,
								placeholder: "https://...",
								onChange: (e) => setDraft({
									...draft,
									imageUrl: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "inline-flex h-11 cursor-pointer items-center justify-center rounded-md border border-line text-sm",
							children: [imageBusy ? t(copy.state.loading, lang) : t(copy.studio.uploadImage, lang), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								accept: "image/*",
								className: "sr-only",
								onChange: (e) => void onImage(e.target.files?.[0] ?? null)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: t(copy.studio.imageHint, lang)
						}),
						draft.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: draft.imageUrl,
							alt: "",
							className: "h-32 w-full rounded-md object-cover"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex h-11 items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: draft.isAvailable,
								onChange: (e) => setDraft({
									...draft,
									isAvailable: e.target.checked
								})
							}), t(copy.studio.available, lang)]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex h-11 items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: draft.isFeatured,
								onChange: (e) => setDraft({
									...draft,
									isFeatured: e.target.checked
								})
							}), t(copy.studio.featured, lang)]
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
									onClick: () => void saveItem(),
									children: flash.busy ? t(copy.state.loading, lang) : t(copy.studio.save, lang)
								}),
								draft.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "danger",
									onClick: () => setPendingDelete({
										type: "product",
										id: draft.id
									}),
									children: t(copy.studio.delete, lang)
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "ghost",
									onClick: () => setDraft(null),
									children: t(copy.studio.cancel, lang)
								})
							]
						})
					]
				})
			}) : null,
			catDraft ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				title: catDraft.id ? lang === "ar" ? "تعديل تصنيف" : "Edit category" : t(copy.studio.addCategory, lang),
				onClose: () => setCatDraft(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: t(copy.studio.nameAr, lang),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: catDraft.nameAr,
								onChange: (e) => setCatDraft({
									...catDraft,
									nameAr: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: t(copy.studio.nameEn, lang),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: catDraft.nameEn,
								onChange: (e) => setCatDraft({
									...catDraft,
									nameEn: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							disabled: flash.busy || !catDraft.nameAr.trim(),
							onClick: async () => {
								if (await flash.run(() => saveCategory({ data: {
									id: catDraft.id,
									nameAr: catDraft.nameAr.trim(),
									nameEn: catDraft.nameEn.trim()
								} }))) setCatDraft(null);
							},
							children: t(copy.studio.save, lang)
						})
					]
				})
			}) : null,
			pendingDelete ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				title: t(copy.studio.confirmDelete, lang),
				onClose: () => setPendingDelete(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "danger",
						disabled: flash.busy,
						onClick: async () => {
							if (await flash.run(() => pendingDelete.type === "product" ? deleteProduct({ data: { id: pendingDelete.id } }) : deleteCategory({ data: { id: pendingDelete.id } }))) {
								setPendingDelete(null);
								setDraft(null);
								if (pendingDelete.type === "category") setCatFilter("all");
							}
						},
						children: t(copy.studio.yesDelete, lang)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => setPendingDelete(null),
						children: t(copy.studio.cancel, lang)
					})]
				})
			}) : null
		]
	});
}
//#endregion
export { MenuStudio as component };
