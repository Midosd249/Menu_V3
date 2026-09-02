import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-Bs72scqa.mjs";
import { bn as union, cn as _enum, dn as boolean, gn as object, hn as number, pn as literal, un as array, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { o as createSsrRpc } from "./router-CGkHkz2N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/owner-FHUt_4Qp.js
var getMyStudio = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("332f1ff261b33dcae60b51848be7e49ce31c972d915fadbb8816e709861164a0"));
var createRestaurant = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	nameAr: string().trim().min(2).max(80),
	nameEn: string().trim().max(80).optional(),
	slug: string().trim().max(63).optional(),
	city: string().trim().max(80).optional(),
	branchNameAr: string().trim().min(2).max(80),
	branchNameEn: string().trim().max(80).optional(),
	addressAr: string().trim().max(200).optional(),
	whatsapp: string().trim().max(30).optional()
})).handler(createSsrRpc("0f18bfb5ab772d161a924af0f085416fd02cc5123829b92f26b9b833fc5d2c21"));
var updateTenant = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	nameAr: string().trim().min(2).max(80).optional(),
	nameEn: string().trim().max(80).optional(),
	taglineAr: string().trim().max(160).optional(),
	taglineEn: string().trim().max(160).optional(),
	logoUrl: string().trim().max(500).optional(),
	coverUrl: string().trim().max(500).optional(),
	instagramUrl: string().trim().max(200).optional(),
	whatsapp: string().trim().max(30).optional(),
	whatsappTemplate: string().trim().max(240).optional(),
	primaryColor: string().trim().max(20).optional(),
	accentColor: string().trim().max(20).optional(),
	city: string().trim().max(80).optional(),
	isPublished: boolean().optional()
})).handler(createSsrRpc("62212f44155f0d5d93ea9aa2ed99d65bdb708ebc1862ec2a0bc86a0c7718e712"));
var saveCategory = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: string().optional(),
	nameAr: string().trim().min(1).max(80),
	nameEn: string().trim().max(80).optional(),
	sortOrder: number().int().optional(),
	isActive: boolean().optional()
})).handler(createSsrRpc("fbf5a3a7a732d2b1121d966a184433a435e0372e80f0ee58a867e1b4879e5a8f"));
var deleteCategory = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: string().min(1) })).handler(createSsrRpc("d859f2946c4ba7e7cf97bdb219cad797a1aa7468b05a4588e6605a8597fdbacc"));
var saveProduct = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: string().optional(),
	categoryId: string().nullable().optional(),
	nameAr: string().trim().min(1).max(120),
	nameEn: string().trim().max(120).optional(),
	descriptionAr: string().trim().max(600).optional(),
	descriptionEn: string().trim().max(600).optional(),
	price: number().min(0).max(1e5),
	imageUrl: string().trim().max(500).optional(),
	calories: number().int().min(0).max(1e4).nullable().optional(),
	isAvailable: boolean().optional(),
	isFeatured: boolean().optional(),
	allergens: string().trim().max(200).optional(),
	sortOrder: number().int().optional()
})).handler(createSsrRpc("227b814459c26bd27f8becb5a5fb054e8f22cd5faf39f3a6cbc295ed8aa5830f"));
var toggleProduct = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: string().min(1),
	field: _enum(["isAvailable", "isFeatured"]),
	value: boolean()
})).handler(createSsrRpc("386e888f9bd1f68267060464991c39dd8742964de5bf224659e339c34d235762"));
var deleteProduct = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: string().min(1) })).handler(createSsrRpc("0e731316b2165076364239625f3e57ce8a6f97fee980bd9ee451a67ed7552328"));
var saveBranch = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: string().optional(),
	nameAr: string().trim().min(1).max(80),
	nameEn: string().trim().max(80).optional(),
	slug: string().trim().max(63).optional(),
	addressAr: string().trim().max(200).optional(),
	addressEn: string().trim().max(200).optional(),
	mapsUrl: string().trim().max(400).optional(),
	phone: string().trim().max(30).optional(),
	isActive: boolean().optional(),
	hours: array(object({
		weekday: number().int().min(0).max(6),
		opensAt: string().nullable(),
		closesAt: string().nullable(),
		isClosed: boolean()
	})).optional()
})).handler(createSsrRpc("0766acc254cbfca99819708343de0ce7343f169eb2a27a691d3a17cfffedb5b2"));
var deleteBranch = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: string().min(1) })).handler(createSsrRpc("7710444e6bc635eee74147ea6ac9bfa19fa4bbb2b47db4e9311cbb26cec8af5d"));
var getBranchHours = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({ branchId: string().min(1) })).handler(createSsrRpc("9da79b8772a27af2ae42391815f3c925bace40cbe3eb426fcc6f26624fcd02a3"));
var importProducts = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ rows: array(object({
	nameAr: string().trim().min(1).max(120),
	nameEn: string().trim().max(120),
	categoryAr: string().trim().min(1).max(80),
	categoryEn: string().trim().max(80),
	descriptionAr: string().trim().max(600),
	descriptionEn: string().trim().max(600),
	price: number().min(0).max(1e5),
	imageUrl: string().trim().max(500),
	calories: number().int().min(0).max(1e4).nullable(),
	isFeatured: boolean(),
	isAvailable: boolean()
})).min(1).max(400) })).handler(createSsrRpc("6fe017d7b5059d29a4b217a2903a77a8184a01c14c8b11dc27611ce8e6b733ec"));
var getOwnerAnalytics = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({ days: union([literal(7), literal(30)]).optional() })).handler(createSsrRpc("e583d78af6f72b9c5cfe6f95277f75facc8eed6857a2dbf6a1032c8f928b188d"));
var seedStarterItems = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ items: array(object({
	categoryAr: string(),
	categoryEn: string(),
	nameAr: string(),
	nameEn: string(),
	price: number().min(0)
})).max(20) })).handler(createSsrRpc("8b12e124d987fe7da7596030cfadeebfa4298f1bd4408979ff7d50fa4141eadf"));
var getOwnerPreviewMenu = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({ branchSlug: string().max(63).optional() })).handler(createSsrRpc("92b12c4e2ab30eff02b5ecb4711a06e4e5c2fe5e20dd6f1cec70af37b9b8955f"));
//#endregion
export { getBranchHours as a, getOwnerPreviewMenu as c, saveCategory as d, saveProduct as f, updateTenant as h, deleteProduct as i, importProducts as l, toggleProduct as m, deleteBranch as n, getMyStudio as o, seedStarterItems as p, deleteCategory as r, getOwnerAnalytics as s, createRestaurant as t, saveBranch as u };
