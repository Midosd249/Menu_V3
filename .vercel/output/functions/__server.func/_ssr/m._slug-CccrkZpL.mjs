import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { V as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as PublicMenuView } from "./public-menu-DL5Cjxfh.mjs";
import { c as ErrorState, n as getPublicMenu, u as LoadingState } from "./router-CGkHkz2N.mjs";
import { r as Route$11 } from "./router-CGkHkz2N2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/m._slug-CccrkZpL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PublicMenuPage() {
	const { slug } = Route$11.useParams();
	const search = Route$11.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuLoader, {
		slug,
		branch: search.branch
	});
}
function MenuLoader({ slug, branch }) {
	const [state, setState] = (0, import_react.useState)({ status: "loading" });
	function load() {
		setState({ status: "loading" });
		getPublicMenu({ data: {
			slug,
			branch
		} }).then((result) => {
			if (!result.ok) {
				setState({
					status: "error",
					message: result.error,
					retry: load
				});
				return;
			}
			setState({
				status: "ok",
				menu: result.data
			});
		}).catch((err) => {
			setState({
				status: "error",
				message: err instanceof Error ? err.message : "تعذر تحميل المنيو",
				retry: load
			});
		});
	}
	(0, import_react.useEffect)(() => {
		load();
	}, [slug, branch]);
	if (state.status === "loading") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, {});
	if (state.status === "error") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
		message: state.message,
		onRetry: state.retry
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicMenuView, { menu: state.menu });
}
//#endregion
export { MenuLoader, PublicMenuPage as component };
