import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { V as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as getOwnerPreviewMenu } from "./owner-FHUt_4Qp.mjs";
import { t as PublicMenuView } from "./public-menu-DL5Cjxfh.mjs";
import { c as ErrorState, u as LoadingState } from "./router-CGkHkz2N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/preview-Z3VVBsFN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PreviewPage() {
	const [state, setState] = (0, import_react.useState)({ status: "loading" });
	(0, import_react.useEffect)(() => {
		getOwnerPreviewMenu({ data: {} }).then((result) => {
			if (!result.ok) setState({
				status: "error",
				message: result.error
			});
			else setState({
				status: "ok",
				menu: result.data
			});
		}).catch((err) => setState({
			status: "error",
			message: err instanceof Error ? err.message : "تعذر تحميل المعاينة"
		}));
	}, []);
	if (state.status === "loading") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, {});
	if (state.status === "error") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, { message: state.message });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "-mx-4 -my-6 lg:-mx-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicMenuView, {
			menu: state.menu,
			preview: true
		})
	});
}
//#endregion
export { PreviewPage as component };
