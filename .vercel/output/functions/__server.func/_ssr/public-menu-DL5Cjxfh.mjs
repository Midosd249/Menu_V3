import { o as __toESM } from "../_runtime.mjs";
import { i as formatSar, n as cn, u as weekdayLabel } from "./utils-DRrjZD06.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { V as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as Phone, g as Instagram, p as MapPin, s as Search, t as X, y as Clock } from "../_libs/lucide-react.mjs";
import { a as LangToggle, g as useLang, h as t, m as copy, r as recordPublicEvent, s as EmptyState } from "./router-CGkHkz2N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/public-menu-DL5Cjxfh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KEY = "menu-v3-session";
function getGuestSessionId() {
	if (typeof window === "undefined") return "ssr";
	try {
		const existing = window.localStorage.getItem(KEY);
		if (existing && existing.length >= 8) return existing;
		const id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `s_${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
		window.localStorage.setItem(KEY, id);
		return id;
	} catch {
		return `s_${Date.now().toString(36)}`;
	}
}
function loc(lang, ar, en) {
	return lang === "ar" ? ar || en : en || ar;
}
function dishTone(name) {
	const tones = [
		"#8f4e32",
		"#5c4638",
		"#6b5344",
		"#9a6b2f",
		"#3d4a3a",
		"#4a3b32"
	];
	let hash = 0;
	for (let i = 0; i < name.length; i += 1) hash = (hash + name.charCodeAt(i) * (i + 1)) % tones.length;
	return tones[hash];
}
function isOpenNow(hours) {
	if (!hours.length) return null;
	const now = /* @__PURE__ */ new Date();
	const day = now.getDay();
	const row = hours.find((h) => h.weekday === day);
	if (!row || row.isClosed || !row.opensAt || !row.closesAt) return false;
	const toMin = (v) => {
		const [h, m] = v.split(":").map(Number);
		return h * 60 + m;
	};
	const current = now.getHours() * 60 + now.getMinutes();
	const open = toMin(row.opensAt);
	const close = toMin(row.closesAt);
	if (close <= open) return current >= open || current <= close;
	return current >= open && current <= close;
}
function WhatsAppIcon() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 24 24",
		className: "size-4 fill-current",
		"aria-hidden": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.5 2 2 6.49 2 12.05c0 1.77.46 3.45 1.28 4.92L2 22l5.16-1.35a9.96 9.96 0 0 0 4.88 1.24h.01c5.54 0 10.04-4.49 10.04-10.04 0-2.68-1.04-5.2-2.94-7.09Zm-7.01 15.4h-.01a8.28 8.28 0 0 1-4.22-1.16l-.3-.18-3.06.8.82-2.98-.2-.31a8.26 8.26 0 0 1-1.27-4.42c0-4.57 3.72-8.29 8.3-8.29 2.22 0 4.3.86 5.86 2.43a8.24 8.24 0 0 1 2.43 5.87c0 4.58-3.73 8.3-8.35 8.3Zm4.56-6.21c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.24-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.24.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42h-.48c-.16 0-.43.06-.65.31-.22.24-.86.84-.86 2.05 0 1.2.88 2.37 1 2.53.12.16 1.73 2.64 4.2 3.7.59.25 1.04.41 1.4.52.59.18 1.13.16 1.56.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.16-.48-.28Z" })
	});
}
function PublicMenuView({ menu, preview = false }) {
	const { lang } = useLang();
	const { tenant, branch, branches, hours, categories, products } = menu;
	const [query, setQuery] = (0, import_react.useState)("");
	const [cat, setCat] = (0, import_react.useState)("all");
	const [openId, setOpenId] = (0, import_react.useState)(null);
	const guestProducts = preview ? products : products.filter((p) => p.isAvailable);
	const open = isOpenNow(hours);
	const featured = guestProducts.filter((p) => p.isFeatured);
	const filtered = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return guestProducts.filter((p) => {
			if (cat !== "all" && p.categoryId !== cat) return false;
			if (!q) return true;
			return [
				p.nameAr,
				p.nameEn,
				p.descriptionAr,
				p.descriptionEn
			].some((v) => v.toLowerCase().includes(q));
		});
	}, [
		guestProducts,
		cat,
		query
	]);
	(0, import_react.useEffect)(() => {
		if (preview) return;
		const sessionId = getGuestSessionId();
		const source = new URLSearchParams(window.location.search).get("src");
		recordPublicEvent({ data: {
			slug: tenant.slug,
			branchSlug: branch.slug,
			eventType: source === "qr" ? "qr_scan" : "visit",
			lang,
			sessionId
		} });
	}, [
		tenant.slug,
		branch.slug,
		lang,
		preview
	]);
	const selected = guestProducts.find((p) => p.id === openId) ?? null;
	function track(type, product) {
		if (preview) return;
		recordPublicEvent({ data: {
			slug: tenant.slug,
			branchSlug: branch.slug,
			productId: product?.id,
			eventType: type,
			lang,
			sessionId: getGuestSessionId()
		} });
	}
	function waLink(product) {
		if (!tenant.whatsapp) return null;
		const phone = tenant.whatsapp.replace(/[^\d]/g, "");
		const msg = tenant.whatsappTemplate.replace("{product}", loc(lang, product?.nameAr ?? "", product?.nameEn ?? "") || loc(lang, tenant.nameAr, tenant.nameEn)).replace("{restaurant}", loc(lang, tenant.nameAr, tenant.nameEn));
		return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-paper text-ink",
		style: {
			"--menu-accent": tenant.accentColor,
			"--menu-ink": tenant.primaryColor
		},
		children: [
			preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-ink px-4 py-2 text-center text-xs text-paper",
				children: lang === "ar" ? "معاينة المالك — الضيوف يرون المنشور فقط" : "Owner preview — guests only see the published menu"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "relative overflow-hidden bg-ink text-paper",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 opacity-40",
					style: { background: tenant.coverUrl ? `center/cover url(${tenant.coverUrl})` : `radial-gradient(120% 80% at 80% 0%, ${tenant.accentColor} 0%, transparent 55%), linear-gradient(180deg, ${tenant.primaryColor}, #0d0b09)` }
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto flex max-w-lg flex-col gap-5 px-5 pb-8 pt-[max(1.5rem,env(safe-area-inset-top))]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [tenant.logoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: tenant.logoUrl,
									alt: "",
									className: "size-12 rounded-md object-cover"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid size-12 place-items-center rounded-md text-lg font-semibold",
									style: { background: tenant.accentColor },
									children: tenant.nameAr.slice(0, 1)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs tracking-wide text-paper/70",
									children: tenant.city
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "font-display text-2xl font-semibold leading-tight",
									children: loc(lang, tenant.nameAr, tenant.nameEn)
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LangToggle, {})]
						}),
						tenant.taglineAr || tenant.taglineEn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "max-w-sm text-sm text-paper/80",
							children: loc(lang, tenant.taglineAr, tenant.taglineEn)
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-paper/10 px-3 py-1",
								children: open == null ? t(copy.menu.hours, lang) : open ? t(copy.menu.open, lang) : t(copy.menu.closed, lang)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-paper/10 px-3 py-1",
								children: loc(lang, branch.nameAr, branch.nameEn)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								waLink() ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									className: "inline-flex h-10 items-center gap-2 rounded-md bg-[var(--menu-accent)] px-3 text-sm font-medium text-paper",
									href: waLink(),
									onClick: () => track("whatsapp"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsAppIcon, {}), t(copy.menu.whatsapp, lang)]
								}) : null,
								branch.mapsUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									className: "inline-flex h-10 items-center gap-2 rounded-md bg-paper/10 px-3 text-sm",
									href: branch.mapsUrl,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-4" }), t(copy.menu.location, lang)]
								}) : null,
								branch.phone ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									className: "inline-flex h-10 items-center gap-2 rounded-md bg-paper/10 px-3 text-sm",
									href: `tel:${branch.phone}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-4" }), t(copy.menu.call, lang)]
								}) : null,
								tenant.instagramUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									className: "inline-flex h-10 items-center gap-2 rounded-md bg-paper/10 px-3 text-sm",
									href: tenant.instagramUrl,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "size-4" }), t(copy.menu.instagram, lang)]
								}) : null
							]
						})
					]
				})]
			}),
			branches.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto flex max-w-lg gap-2 overflow-x-auto px-4 py-3 no-scrollbar",
				children: branches.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: `/m/${tenant.slug}/${b.slug}`,
					className: cn("shrink-0 rounded-full border px-3 py-1.5 text-sm", b.id === branch.id ? "border-ink bg-ink text-paper" : "border-line text-ink-soft"),
					children: loc(lang, b.nameAr, b.nameEn)
				}, b.id))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-lg flex-col gap-3 px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "relative block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-muted start-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: query,
							onChange: (e) => setQuery(e.target.value),
							placeholder: t(copy.menu.search, lang),
							className: "h-11 w-full rounded-md border border-line bg-paper pe-3 ps-10 text-sm"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2 overflow-x-auto no-scrollbar",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setCat("all"),
							className: cn("h-9 shrink-0 rounded-full px-3 text-sm", cat === "all" ? "bg-ink text-paper" : "bg-sand text-ink-soft"),
							children: t(copy.menu.all, lang)
						}), categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setCat(c.id),
							className: cn("h-9 shrink-0 rounded-full px-3 text-sm", cat === c.id ? "bg-ink text-paper" : "bg-sand text-ink-soft"),
							children: loc(lang, c.nameAr, c.nameEn)
						}, c.id))]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto flex max-w-lg flex-col gap-8 px-4 py-6",
				children: [
					featured.length > 0 && cat === "all" && !query ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "grid gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-medium text-muted",
							children: t(copy.menu.featured, lang)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-3 overflow-x-auto no-scrollbar",
							children: featured.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									setOpenId(p.id);
									track("product_view", p);
								},
								className: "w-44 shrink-0 overflow-hidden rounded-lg border border-line bg-paper text-start",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DishMedia, {
									product: p,
									className: "h-28 w-full"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-1 p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium leading-snug",
										children: loc(lang, p.nameAr, p.nameEn)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-accent",
										children: formatSar(p.price, lang)
									})]
								})]
							}, p.id))
						})]
					}) : null,
					guestProducts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { title: t(copy.menu.emptyMenu, lang) }) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { title: t(copy.menu.noResults, lang) }) : (cat === "all" ? categories : categories.filter((c) => c.id === cat)).map((c) => {
						const items = filtered.filter((p) => p.categoryId === c.id);
						if (!items.length) return null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "grid gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-semibold",
								children: loc(lang, c.nameAr, c.nameEn)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "grid gap-2",
								children: items.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										setOpenId(p.id);
										track("product_view", p);
									},
									className: "flex w-full items-stretch gap-3 rounded-lg border border-line bg-paper p-2 text-start",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DishMedia, {
										product: p,
										className: "size-20 shrink-0 rounded-md"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex min-w-0 flex-1 flex-col justify-center gap-1 py-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-medium leading-snug",
												children: loc(lang, p.nameAr, p.nameEn)
											}),
											p.descriptionAr || p.descriptionEn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "line-clamp-2 text-xs text-muted",
												children: loc(lang, p.descriptionAr, p.descriptionEn)
											}) : null,
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center gap-2 text-sm",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-medium text-accent",
														children: formatSar(p.price, lang)
													}),
													p.calories != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-xs text-muted",
														children: [
															p.calories,
															" ",
															t(copy.menu.kcal, lang)
														]
													}) : null,
													!p.isAvailable ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs text-bad",
														children: t(copy.menu.unavailable, lang)
													}) : null
												]
											})
										]
									})]
								}) }, p.id))
							})]
						}, c.id);
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
						className: "grid gap-3 border-t border-line pb-10 pt-6 text-sm text-ink-soft",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t(copy.menu.vat, lang) }),
							hours.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex items-center gap-2 font-medium text-ink",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4" }), t(copy.menu.hours, lang)]
								}), hours.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex justify-between text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: weekdayLabel(h.weekday, lang) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: h.isClosed ? lang === "ar" ? "مغلق" : "Closed" : `${h.opensAt ?? ""} – ${h.closesAt ?? ""}` })]
								}, h.weekday))]
							}) : null,
							branch.addressAr || branch.addressEn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-start gap-2 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mt-0.5 size-4 shrink-0" }), loc(lang, branch.addressAr, branch.addressEn)]
							}) : null
						]
					})
				]
			}),
			selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-40 grid place-items-end bg-ink/40 p-0 sm:place-items-center sm:p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "absolute inset-0",
					"aria-label": "Close",
					onClick: () => setOpenId(null)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "relative z-10 max-h-[90dvh] w-full max-w-lg overflow-auto rounded-t-xl bg-paper sm:rounded-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DishMedia, {
							product: selected,
							className: "h-48 w-full"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "absolute top-3 end-3 grid size-10 place-items-center rounded-full bg-paper/90",
							onClick: () => setOpenId(null),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-xl font-semibold",
									children: loc(lang, selected.nameAr, selected.nameEn)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-lg text-accent",
									children: formatSar(selected.price, lang)
								})] }),
								selected.descriptionAr || selected.descriptionEn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-ink-soft",
									children: loc(lang, selected.descriptionAr, selected.descriptionEn)
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-2 text-xs text-muted",
									children: [
										selected.calories != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											selected.calories,
											" ",
											t(copy.menu.kcal, lang)
										] }) : null,
										selected.allergens ? selected.allergens.split(",").map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-sand px-2 py-1",
											children: a.trim()
										}, a)) : null,
										!selected.isAvailable ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-bad",
											children: t(copy.menu.unavailable, lang)
										}) : null
									]
								}),
								waLink(selected) && selected.isAvailable ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									className: "inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[var(--menu-accent)] text-sm font-medium text-paper",
									href: waLink(selected),
									onClick: () => track("whatsapp", selected),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsAppIcon, {}), t(copy.menu.whatsapp, lang)]
								}) : null
							]
						})
					]
				})]
			}) : null
		]
	});
}
function DishMedia({ product, className }) {
	if (product.imageUrl) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: product.imageUrl,
		alt: "",
		className: cn("object-cover", className)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative overflow-hidden", className),
		style: { background: dishTone(product.nameAr || product.nameEn) },
		"aria-hidden": true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-3 rounded-full bg-paper/15" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-x-0 bottom-0 bg-ink/25 p-2 text-xs text-paper",
			children: (product.nameAr || product.nameEn).slice(0, 18)
		})]
	});
}
//#endregion
export { PublicMenuView as t };
