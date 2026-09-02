import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { V as require_jsx_runtime, d as useRouterState, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as getMyStudio } from "./owner-FHUt_4Qp.mjs";
import { n as useCurrentUserState } from "./use-current-user-DG6UNzh9.mjs";
import { t as RedirectToSignIn } from "./gates-B9U5tCeZ.mjs";
import { c as ErrorState, u as LoadingState } from "./router-CGkHkz2N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/studio-Cc4LhrBg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Ctx = (0, import_react.createContext)(null);
function useStudio() {
	const value = (0, import_react.useContext)(Ctx);
	if (!value) throw new Error("Studio context missing");
	return value;
}
function useStudioFlash() {
	const { setSnapshot } = useStudio();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [ok, setOk] = (0, import_react.useState)(false);
	return {
		busy,
		error,
		ok,
		setError,
		setOk,
		run: (0, import_react.useCallback)(async (fn) => {
			setBusy(true);
			setError("");
			setOk(false);
			try {
				const result = await fn();
				if (!result.ok) {
					setError(result.error);
					return false;
				}
				setSnapshot(result.data);
				setOk(true);
				return true;
			} catch (err) {
				setError(err instanceof Error ? err.message : "تعذر الحفظ");
				return false;
			} finally {
				setBusy(false);
			}
		}, [setSnapshot])
	};
}
function StudioGate({ children }) {
	const { user, isPending } = useCurrentUserState();
	const path = useRouterState({ select: (s) => s.location.pathname });
	const [state, setState] = (0, import_react.useState)({ status: "loading" });
	const load = (0, import_react.useCallback)(async () => {
		setState({ status: "loading" });
		try {
			const result = await getMyStudio();
			if (!result.ok) {
				setState({
					status: "error",
					error: result
				});
				return;
			}
			if (!("tenant" in result.data) || result.data.tenant == null) {
				setState({ status: "empty" });
				return;
			}
			setState({
				status: "ok",
				snapshot: result.data
			});
		} catch (err) {
			setState({
				status: "error",
				error: {
					ok: false,
					code: "unavailable",
					error: err instanceof Error ? err.message : "تعذر تحميل الاستوديو"
				}
			});
		}
	}, []);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		load();
	}, [user, load]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, {});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (state.status === "loading") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, {});
	if (state.status === "error") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
		message: state.error.error,
		onRetry: () => void load()
	});
	if (state.status === "empty") {
		if (path.startsWith("/onboarding")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/onboarding" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx.Provider, {
		value: {
			snapshot: state.snapshot,
			reload: load,
			setSnapshot: (next) => setState({
				status: "ok",
				snapshot: next
			})
		},
		children
	});
}
//#endregion
export { useStudio as n, useStudioFlash as r, StudioGate as t };
