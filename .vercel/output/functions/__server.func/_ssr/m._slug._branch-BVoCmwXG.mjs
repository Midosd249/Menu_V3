import { V as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Route, t as MenuLoader } from "./router-CGkHkz2N2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/m._slug._branch-BVoCmwXG.js
var import_jsx_runtime = require_jsx_runtime();
function BranchMenuPage() {
	const { slug, branch } = Route.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuLoader, {
		slug,
		branch
	});
}
//#endregion
export { BranchMenuPage as component };
