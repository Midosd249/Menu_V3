import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { V as require_jsx_runtime, v as Link, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Input, t as Field } from "./input-C3tB8iIa.mjs";
import { r as signIn, t as authClient } from "./client-B40BzJxt.mjs";
import { n as useCurrentUserState } from "./use-current-user-DG6UNzh9.mjs";
import { t as GROK_PROVIDERS } from "./server-D2ZJN8I4.mjs";
import { a as LangToggle, f as Button, g as useLang, h as t, m as copy, u as LoadingState } from "./router-CGkHkz2N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-BB0CroXi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const { lang } = useLang();
	const { user, isPending } = useCurrentUserState();
	const [mode, setMode] = (0, import_react.useState)("in");
	const [error, setError] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, {});
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/studio" });
	async function onSubmit(e) {
		e.preventDefault();
		const form = new FormData(e.currentTarget);
		const email = String(form.get("email") || "");
		const password = String(form.get("password") || "");
		const name = String(form.get("name") || "");
		setBusy(true);
		setError("");
		try {
			if (mode === "up") {
				const result = await authClient.signUp.email({
					email,
					password,
					name: name || email.split("@")[0]
				});
				if (result.error) throw new Error(result.error.message);
			} else {
				const result = await authClient.signIn.email({
					email,
					password
				});
				if (result.error) throw new Error(result.error.message);
			}
			window.location.assign("/studio");
		} catch (err) {
			setError(err instanceof Error && err.message ? err.message : t(copy.auth.error, lang));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center px-5 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm grid gap-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "font-display text-xl font-semibold",
						children: t(copy.brand, lang)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LangToggle, {})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl font-semibold",
						children: t(copy.auth.title, lang)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: t(copy.auth.subtitle, lang)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-2",
						children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => signIn(p.providerId, { callbackURL: "/studio" }),
							children: p.providerId === "google" ? t(copy.auth.google, lang) : t(copy.auth.x, lang)
						}, p.providerId))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-xs text-muted",
						children: t(copy.auth.or, lang)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "grid gap-3",
						onSubmit,
						children: [
							mode === "up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: t(copy.auth.name, lang),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									name: "name",
									autoComplete: "name"
								})
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: t(copy.auth.email, lang),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									name: "email",
									type: "email",
									required: true,
									autoComplete: "email"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: t(copy.auth.password, lang),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									name: "password",
									type: "password",
									required: true,
									minLength: 8,
									autoComplete: mode === "up" ? "new-password" : "current-password"
								})
							}),
							error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-bad",
								children: error
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: busy,
								children: busy ? t(copy.state.loading, lang) : mode === "up" ? t(copy.auth.signUp, lang) : t(copy.auth.signIn, lang)
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-sm text-ink-soft underline-offset-4 hover:underline",
						onClick: () => setMode(mode === "up" ? "in" : "up"),
						children: mode === "up" ? t(copy.auth.haveAccount, lang) : t(copy.auth.noAccount, lang)
					})
				] })
			]
		})
	});
}
//#endregion
export { Login as component };
