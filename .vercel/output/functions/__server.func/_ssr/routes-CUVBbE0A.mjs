import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { V as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as ArrowUpLeft, b as Check } from "../_libs/lucide-react.mjs";
import { n as Input, r as Textarea, t as Field } from "./input-C3tB8iIa.mjs";
import { n as SignedIn, r as SignedOut } from "./gates-B9U5tCeZ.mjs";
import { a as LangToggle, f as Button, g as useLang, h as t, i as submitLead, m as copy } from "./router-CGkHkz2N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CUVBbE0A.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const { lang } = useLang();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-paper text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "font-display text-xl font-semibold tracking-tight",
					children: t(copy.brand, lang)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LangToggle, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedOut, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "inline-flex h-10 items-center rounded-md border border-line px-3 text-sm",
							children: t(copy.marketing.ctaLogin, lang)
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/studio",
							className: "inline-flex h-10 items-center rounded-md bg-ink px-3 text-sm text-paper",
							children: t(copy.nav.overview, lang)
						}) })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mx-auto grid max-w-5xl gap-10 px-5 pb-16 pt-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid max-w-xl gap-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm tracking-wide text-muted",
								children: t(copy.marketing.heroEyebrow, lang)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-4xl font-semibold leading-[1.15] sm:text-5xl",
								children: t(copy.marketing.heroTitle, lang)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-base text-ink-soft sm:text-lg",
								children: t(copy.marketing.heroBody, lang)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									size: "lg",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/login",
										children: [t(copy.marketing.ctaPrimary, lang), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpLeft, { className: "size-4" })]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									variant: "outline",
									size: "lg",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/m/$slug",
										params: { slug: "nafas" },
										children: t(copy.marketing.ctaSecondary, lang)
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "grid gap-2 text-sm text-ink-soft",
								children: [
									copy.marketing.proofA,
									copy.marketing.proofB,
									copy.marketing.proofC
								].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-accent" }), t(item, lang)]
								}, item.ar))
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveCard, {})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "border-y border-line bg-sand/40",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto grid max-w-5xl gap-8 px-5 py-14 md:grid-cols-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "md:col-span-3 text-sm text-muted",
							children: t(copy.marketing.sectionProduct, lang)
						}), [
							[copy.marketing.f1t, copy.marketing.f1d],
							[copy.marketing.f2t, copy.marketing.f2d],
							[copy.marketing.f3t, copy.marketing.f3d]
						].map(([title, body]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "grid gap-2 rounded-xl bg-paper p-5 hairline",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-semibold",
								children: t(title, lang)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-ink-soft",
								children: t(body, lang)
							})]
						}, title.ar))]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeadForm, {})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "mx-auto max-w-5xl px-5 py-10 text-sm text-muted",
				children: [
					t(copy.brand, lang),
					" · ",
					lang === "ar" ? "منصة مستقلة عن النسخة السابقة" : "Independent from the previous version"
				]
			})
		]
	});
}
function LiveCard() {
	const { lang } = useLang();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/m/$slug",
		params: { slug: "nafas" },
		className: "block overflow-hidden rounded-xl bg-ink text-paper hairline",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-36 bg-[radial-gradient(80%_80%_at_80%_0%,#9a5a38,transparent),linear-gradient(#1c1712,#0d0b09)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-2 p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-paper/60",
					children: t(copy.marketing.liveExample, lang)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-2xl",
					children: "نَفَس"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-paper/70",
					children: lang === "ar" ? "قهوة مختصة ومخبوزات يومية في العليا" : "Specialty coffee and daily pastry in Al Olaya"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-paper/50",
					children: t(copy.marketing.liveHint, lang)
				})
			]
		})]
	});
}
function LeadForm() {
	const { lang } = useLang();
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [error, setError] = (0, import_react.useState)("");
	async function onSubmit(e) {
		e.preventDefault();
		const form = new FormData(e.currentTarget);
		setStatus("saving");
		setError("");
		const result = await submitLead({ data: {
			businessName: String(form.get("businessName") || ""),
			city: String(form.get("city") || ""),
			contactName: String(form.get("contactName") || ""),
			contactPhone: String(form.get("contactPhone") || ""),
			contactEmail: String(form.get("contactEmail") || ""),
			details: String(form.get("details") || "")
		} });
		if (!result.ok) {
			setStatus("error");
			setError(result.error);
			return;
		}
		setStatus("done");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto grid max-w-5xl gap-8 px-5 py-16 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid content-start gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-3xl font-semibold",
				children: t(copy.marketing.leadTitle, lang)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-ink-soft",
				children: t(copy.marketing.leadBody, lang)
			})]
		}), status === "done" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "rounded-xl border border-line bg-sand/50 p-6 text-lg",
			children: t(copy.marketing.sent, lang)
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "grid gap-3 rounded-xl bg-paper p-5 hairline",
			onSubmit,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: lang === "ar" ? "اسم المطعم" : "Restaurant name",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "businessName",
						required: true,
						minLength: 2
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: lang === "ar" ? "المدينة" : "City",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "city",
						placeholder: lang === "ar" ? "الرياض" : "Riyadh"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: lang === "ar" ? "اسم المسؤول" : "Contact name",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "contactName",
						required: true,
						minLength: 2
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: lang === "ar" ? "الجوال / واتساب" : "Mobile / WhatsApp",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "contactPhone",
						required: true,
						minLength: 8,
						inputMode: "tel"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: lang === "ar" ? "البريد (اختياري)" : "Email (optional)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "contactEmail",
						type: "email"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: lang === "ar" ? "تفاصيل" : "Details",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						name: "details",
						rows: 3
					})
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-bad",
					children: error
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: status === "saving",
					children: status === "saving" ? t(copy.state.loading, lang) : t(copy.marketing.ctaPrimary, lang)
				})
			]
		})]
	});
}
//#endregion
export { Home as component };
