import { o as __toESM } from "../_runtime.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as cn } from "./utils-DRrjZD06.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { V as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { c as RefreshCw, i as TriangleAlert, m as LoaderCircle } from "../_libs/lucide-react.mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { cn as _enum, gn as object, pn as literal, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { a as router_exports } from "./router-CGkHkz2N2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/i18n-6YVeMG7q.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LangContext = (0, import_react.createContext)({
	lang: "ar",
	setLang: () => {},
	dir: "rtl"
});
function readStored() {
	if (typeof window === "undefined") return "ar";
	try {
		const stored = window.localStorage.getItem("menu-lang");
		if (stored === "en" || stored === "ar") return stored;
	} catch {}
	return "ar";
}
function LangProvider({ children }) {
	const [lang, setLangState] = (0, import_react.useState)(readStored);
	const setLang = (next) => {
		setLangState(next);
		try {
			window.localStorage.setItem("menu-lang", next);
		} catch {}
		if (typeof document !== "undefined") {
			document.documentElement.lang = next === "ar" ? "ar" : "en";
			document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
		}
	};
	const value = (0, import_react.useMemo)(() => ({
		lang,
		setLang,
		dir: lang === "ar" ? "rtl" : "ltr"
	}), [lang]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LangContext.Provider, {
		value,
		children
	});
}
function useLang() {
	return (0, import_react.useContext)(LangContext);
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors duration-(--motion-quick) ease-(--ease-out) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4", {
	variants: {
		variant: {
			default: "bg-accent text-accent-foreground hover:bg-accent/90",
			solid: "bg-ink text-paper hover:bg-ink/90",
			outline: "border border-line bg-transparent text-ink hover:bg-sand",
			ghost: "text-ink hover:bg-sand",
			danger: "bg-bad text-paper hover:bg-bad/90"
		},
		size: {
			default: "h-11 rounded-md px-4 text-sm",
			sm: "h-9 rounded-sm px-3 text-sm",
			lg: "h-12 rounded-lg px-5 text-base",
			icon: "size-11 rounded-md"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
var copy = {
	brand: {
		ar: "منيو",
		en: "Menu"
	},
	brandMark: {
		ar: "منيو",
		en: "MENU"
	},
	tagline: {
		ar: "منصة المنـيو الرقمية للمطاعم السعودية",
		en: "The digital menu platform for Saudi restaurants"
	},
	marketing: {
		heroEyebrow: {
			ar: "عربي أولاً · جاهز للمسح",
			en: "Arabic-first · QR ready"
		},
		heroTitle: {
			ar: "منيو مطعمك كما يجب أن يظهر.",
			en: "Your restaurant menu, as it should look."
		},
		heroBody: {
			ar: "منيو سريع، أنيق، وسهل الإدارة. من الهوية إلى المنتج إلى رمز الاستجابة، دون لوحة تحكم مربكة.",
			en: "A fast, refined menu your guests actually enjoy — and an owner studio you can run in minutes."
		},
		ctaPrimary: {
			ar: "ابدأ منيو مطعمك",
			en: "Start your menu"
		},
		ctaSecondary: {
			ar: "شاهد مثالاً حياً",
			en: "See a live example"
		},
		ctaLogin: {
			ar: "دخول الاستوديو",
			en: "Owner studio"
		},
		proofA: {
			ar: "عربي أصلي، لا ترجمة مقلوبة",
			en: "Native Arabic, not flipped English"
		},
		proofB: {
			ar: "رمز QR حقيقي لكل فرع",
			en: "Real QR for every branch"
		},
		proofC: {
			ar: "تحليلات صادقة، بلا أرقام وهمية",
			en: "Honest analytics — never fake zeros"
		},
		sectionProduct: {
			ar: "ماذا يحصل عليه المطعم",
			en: "What the restaurant gets"
		},
		f1t: {
			ar: "منيو الضيف",
			en: "Guest menu"
		},
		f1d: {
			ar: "تجربة جوال تُفتح من الطاولة في أقل من ثانية. تصنيفات، صور، أسعار بالريال، وتواصل واتساب.",
			en: "A phone experience that opens from the table in under a second. Categories, photos, SAR prices, WhatsApp."
		},
		f2t: {
			ar: "استوديو المالك",
			en: "Owner studio"
		},
		f2d: {
			ar: "لوحة تجيب: ماذا يحدث؟ ماذا يحتاج انتباهاً؟ أي صنف يُشاهد؟ أي فرع يعمل؟",
			en: "A control room that answers: what is happening, what needs attention, which items perform."
		},
		f3t: {
			ar: "من لا شيء إلى منيو منشور",
			en: "From nothing to published"
		},
		f3d: {
			ar: "هوية، فرع، أصناف، صور، معاينة، رمز QR، ثم نشر. أو استورد القائمة دفعة واحدة.",
			en: "Identity, branch, items, photos, preview, QR, publish. Or import the whole list at once."
		},
		liveExample: {
			ar: "مثال حي · مقهى نَفَس",
			en: "Live example · Nafas Café"
		},
		liveHint: {
			ar: "بيانات تجريبية أصلية، ليست عميلاً حقيقياً.",
			en: "Original demo data, not a real client."
		},
		leadTitle: {
			ar: "اطلب منيو لمطعمك",
			en: "Request a menu for your restaurant"
		},
		leadBody: {
			ar: "نجهّز الهوية، القائمة، والرمز. أرسل بياناتك وسنتواصل عبر الواتساب.",
			en: "We set up identity, menu, and QR. Send your details and we will reach you on WhatsApp."
		},
		sent: {
			ar: "وصل طلبك. سنتواصل قريباً.",
			en: "Request received. We will be in touch."
		}
	},
	auth: {
		title: {
			ar: "دخول الاستوديو",
			en: "Studio sign in"
		},
		subtitle: {
			ar: "لمالك المطعم ومدير القائمة. الضيف لا يحتاج حساباً.",
			en: "For the restaurant owner. Guests never need an account."
		},
		email: {
			ar: "البريد الإلكتروني",
			en: "Email"
		},
		password: {
			ar: "كلمة المرور",
			en: "Password"
		},
		name: {
			ar: "الاسم",
			en: "Name"
		},
		signIn: {
			ar: "دخول",
			en: "Sign in"
		},
		signUp: {
			ar: "إنشاء حساب",
			en: "Create account"
		},
		haveAccount: {
			ar: "لديك حساب؟ دخول",
			en: "Have an account? Sign in"
		},
		noAccount: {
			ar: "مطعم جديد؟ أنشئ حساباً",
			en: "New restaurant? Create an account"
		},
		or: {
			ar: "أو",
			en: "or"
		},
		google: {
			ar: "المتابعة عبر Google",
			en: "Continue with Google"
		},
		x: {
			ar: "المتابعة عبر X",
			en: "Continue with X"
		},
		error: {
			ar: "تعذر الدخول. تحقق من البيانات وحاول مرة أخرى.",
			en: "Could not sign in. Check your details."
		}
	},
	nav: {
		overview: {
			ar: "نظرة عامة",
			en: "Overview"
		},
		menu: {
			ar: "القائمة",
			en: "Menu"
		},
		branches: {
			ar: "الفروع",
			en: "Branches"
		},
		brand: {
			ar: "الهوية",
			en: "Brand"
		},
		qr: {
			ar: "رمز QR",
			en: "QR"
		},
		analytics: {
			ar: "التحليلات",
			en: "Analytics"
		},
		import: {
			ar: "الاستيراد",
			en: "Import"
		},
		settings: {
			ar: "الإعدادات",
			en: "Settings"
		},
		preview: {
			ar: "معاينة المنيو",
			en: "Preview menu"
		},
		signOut: {
			ar: "خروج",
			en: "Sign out"
		},
		more: {
			ar: "المزيد",
			en: "More"
		}
	},
	state: {
		loading: {
			ar: "جارٍ التحميل…",
			en: "Loading…"
		},
		empty: {
			ar: "لا توجد بيانات بعد",
			en: "Nothing here yet"
		},
		error: {
			ar: "تعذر تحميل البيانات",
			en: "Could not load data"
		},
		retry: {
			ar: "إعادة المحاولة",
			en: "Try again"
		},
		notFound: {
			ar: "المنيو غير موجود",
			en: "Menu not found"
		},
		unavailable: {
			ar: "المنيو غير متاح حالياً",
			en: "This menu is currently unavailable"
		},
		unauthorized: {
			ar: "يلزم تسجيل الدخول",
			en: "Sign in required"
		},
		forbidden: {
			ar: "ليست لديك صلاحية",
			en: "You do not have access"
		},
		noDataYet: {
			ar: "لا توجد بيانات كافية بعد",
			en: "Not enough data yet"
		},
		saved: {
			ar: "تم الحفظ",
			en: "Saved"
		},
		published: {
			ar: "منشور",
			en: "Published"
		},
		draft: {
			ar: "مسودة",
			en: "Draft"
		}
	},
	studio: {
		greeting: {
			ar: "استوديو المطعم",
			en: "Restaurant studio"
		},
		needsAttention: {
			ar: "يحتاج انتباهاً",
			en: "Needs attention"
		},
		allClear: {
			ar: "كل شيء على ما يرام",
			en: "All clear"
		},
		health: {
			ar: "صحة المنيو",
			en: "Menu health"
		},
		visits7: {
			ar: "زيارات ٧ أيام",
			en: "7-day visits"
		},
		products: {
			ar: "الأصناف",
			en: "Items"
		},
		categories: {
			ar: "التصنيفات",
			en: "Categories"
		},
		branches: {
			ar: "الفروع",
			en: "Branches"
		},
		openMenu: {
			ar: "افتح المنيو العام",
			en: "Open public menu"
		},
		addProduct: {
			ar: "صنف جديد",
			en: "New item"
		},
		addCategory: {
			ar: "تصنيف جديد",
			en: "New category"
		},
		addBranch: {
			ar: "فرع جديد",
			en: "New branch"
		},
		available: {
			ar: "متاح",
			en: "Available"
		},
		unavailable: {
			ar: "غير متاح",
			en: "Unavailable"
		},
		featured: {
			ar: "مميز",
			en: "Featured"
		},
		save: {
			ar: "حفظ",
			en: "Save"
		},
		delete: {
			ar: "حذف",
			en: "Delete"
		},
		cancel: {
			ar: "إلغاء",
			en: "Cancel"
		},
		publish: {
			ar: "نشر المنيو",
			en: "Publish menu"
		},
		unpublish: {
			ar: "إلغاء النشر",
			en: "Unpublish"
		},
		price: {
			ar: "السعر",
			en: "Price"
		},
		calories: {
			ar: "السعرات",
			en: "Calories"
		},
		imageUrl: {
			ar: "رابط الصورة",
			en: "Image URL"
		},
		nameAr: {
			ar: "الاسم بالعربية",
			en: "Arabic name"
		},
		nameEn: {
			ar: "الاسم بالإنجليزية",
			en: "English name"
		},
		descAr: {
			ar: "الوصف بالعربية",
			en: "Arabic description"
		},
		descEn: {
			ar: "الوصف بالإنجليزية",
			en: "English description"
		},
		allergens: {
			ar: "الحساسية",
			en: "Allergens"
		},
		confirmDelete: {
			ar: "تأكيد الحذف؟",
			en: "Confirm delete?"
		},
		yesDelete: {
			ar: "نعم، احذف",
			en: "Yes, delete"
		},
		searchItems: {
			ar: "ابحث عن صنف أو تصنيف",
			en: "Search items or categories"
		},
		noImage: {
			ar: "بدون صورة",
			en: "No photo"
		},
		uploadImage: {
			ar: "رفع صورة",
			en: "Upload photo"
		},
		imageHint: {
			ar: "ارفع صورة من الجوال أو الصق رابطاً. الصور تُضغط تلقائياً.",
			en: "Upload from your phone or paste a URL. Photos are compressed automatically."
		},
		hours: {
			ar: "ساعات العمل",
			en: "Hours"
		},
		address: {
			ar: "العنوان",
			en: "Address"
		},
		phone: {
			ar: "الهاتف",
			en: "Phone"
		},
		maps: {
			ar: "رابط الخريطة",
			en: "Maps link"
		},
		closedDay: {
			ar: "مغلق",
			en: "Closed"
		},
		logoUrl: {
			ar: "رابط الشعار",
			en: "Logo URL"
		},
		coverUrl: {
			ar: "رابط الغلاف",
			en: "Cover URL"
		},
		instagram: {
			ar: "إنستغرام",
			en: "Instagram"
		},
		whatsapp: {
			ar: "واتساب",
			en: "WhatsApp"
		},
		whatsappTpl: {
			ar: "نص رسالة الواتساب",
			en: "WhatsApp message"
		},
		city: {
			ar: "المدينة",
			en: "City"
		},
		slug: {
			ar: "رابط المنيو",
			en: "Menu slug"
		},
		primaryColor: {
			ar: "لون الهوية",
			en: "Brand color"
		},
		accentColor: {
			ar: "لون التمييز",
			en: "Accent color"
		},
		previewDraft: {
			ar: "معاينة المسودة",
			en: "Preview draft"
		},
		copyLink: {
			ar: "نسخ الرابط",
			en: "Copy link"
		}
	},
	onboarding: {
		title: {
			ar: "جهّز منيو مطعمك",
			en: "Set up your menu"
		},
		step1: {
			ar: "الهوية",
			en: "Identity"
		},
		step2: {
			ar: "الفرع",
			en: "Branch"
		},
		step3: {
			ar: "أول أصناف",
			en: "First items"
		},
		step4: {
			ar: "نشر",
			en: "Publish"
		},
		restaurantAr: {
			ar: "اسم المطعم بالعربية",
			en: "Restaurant name in Arabic"
		},
		restaurantEn: {
			ar: "الاسم بالإنجليزية (اختياري)",
			en: "English name (optional)"
		},
		slug: {
			ar: "رابط المنيو",
			en: "Menu link"
		},
		city: {
			ar: "المدينة",
			en: "City"
		},
		continue: {
			ar: "التالي",
			en: "Continue"
		},
		back: {
			ar: "رجوع",
			en: "Back"
		},
		skipItems: {
			ar: "تخطي وإضافة لاحقاً",
			en: "Skip and add later"
		},
		finish: {
			ar: "نشر وافتح المنيو",
			en: "Publish and open menu"
		}
	},
	menu: {
		search: {
			ar: "ابحث في المنيو",
			en: "Search the menu"
		},
		featured: {
			ar: "اختياراتنا",
			en: "Featured"
		},
		all: {
			ar: "الكل",
			en: "All"
		},
		closed: {
			ar: "مغلق الآن",
			en: "Closed now"
		},
		open: {
			ar: "مفتوح الآن",
			en: "Open now"
		},
		hours: {
			ar: "ساعات العمل",
			en: "Hours"
		},
		location: {
			ar: "الموقع",
			en: "Location"
		},
		call: {
			ar: "اتصال",
			en: "Call"
		},
		whatsapp: {
			ar: "واتساب",
			en: "WhatsApp"
		},
		instagram: {
			ar: "إنستغرام",
			en: "Instagram"
		},
		vat: {
			ar: "الأسعار بالريال السعودي",
			en: "Prices in Saudi Riyal"
		},
		unavailable: {
			ar: "غير متوفر حالياً",
			en: "Currently unavailable"
		},
		kcal: {
			ar: "سعرة",
			en: "kcal"
		},
		noResults: {
			ar: "لا توجد نتائج لهذا البحث",
			en: "No items match this search"
		},
		emptyMenu: {
			ar: "القائمة قيد التجهيز",
			en: "This menu is being prepared"
		}
	},
	qr: {
		title: {
			ar: "رمز الاستجابة",
			en: "QR code"
		},
		hint: {
			ar: "اطبع هذا الرمز على الطاولة. يفتح منيو هذا الفرع مباشرة.",
			en: "Print this on the table. It opens this branch menu."
		},
		download: {
			ar: "تنزيل PNG",
			en: "Download PNG"
		},
		print: {
			ar: "طباعة",
			en: "Print"
		},
		copy: {
			ar: "نسخ الرابط",
			en: "Copy link"
		},
		copied: {
			ar: "تم النسخ",
			en: "Copied"
		}
	},
	import: {
		title: {
			ar: "استيراد القائمة",
			en: "Import menu"
		},
		hint: {
			ar: "ارفع ملف CSV. نعرض لك ما سيُحفظ قبل التثبيت. لن نمرر صفاً فيه خطأ.",
			en: "Upload a CSV. You will see exactly what will be saved. Bad rows are never imported silently."
		},
		template: {
			ar: "تنزيل نموذجاً",
			en: "Download template"
		},
		preview: {
			ar: "معاينة الاستيراد",
			en: "Import preview"
		},
		commit: {
			ar: "تثبيت الأصناف الصحيحة",
			en: "Import valid items"
		},
		valid: {
			ar: "صفوف جاهزة",
			en: "Ready rows"
		},
		invalid: {
			ar: "صفوف مرفوضة",
			en: "Rejected rows"
		}
	},
	analytics: {
		title: {
			ar: "أداء المنيو",
			en: "Menu performance"
		},
		days7: {
			ar: "٧ أيام",
			en: "7 days"
		},
		days30: {
			ar: "٣٠ يوماً",
			en: "30 days"
		},
		visits: {
			ar: "الزيارات",
			en: "Visits"
		},
		sessions: {
			ar: "جلسات مميزة",
			en: "Unique sessions"
		},
		views: {
			ar: "مشاهدات الأصناف",
			en: "Item views"
		},
		qr: {
			ar: "مسح QR",
			en: "QR scans"
		},
		wa: {
			ar: "واتساب",
			en: "WhatsApp"
		},
		topItems: {
			ar: "أكثر الأصناف مشاهدة",
			en: "Most viewed items"
		},
		byCategory: {
			ar: "حسب التصنيف",
			en: "By category"
		},
		language: {
			ar: "لغة الضيف",
			en: "Guest language"
		}
	}
};
function t(node, lang) {
	if (!node) return "";
	return node[lang] || node.ar;
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/state-panel-DcKA7c_z.js
function LoadingState({ label }) {
	const { lang } = useLang();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid min-h-48 place-items-center gap-3 px-6 py-16 text-muted",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
			className: "size-6 animate-spin",
			"aria-hidden": true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm",
			children: label || t(copy.state.loading, lang)
		})]
	});
}
function EmptyState({ title, body, action }) {
	const { lang } = useLang();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid place-items-center gap-3 rounded-xl border border-line bg-paper px-6 py-14 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-base font-medium text-ink",
				children: title || t(copy.state.empty, lang)
			}),
			body ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm text-muted",
				children: body
			}) : null,
			action
		]
	});
}
function ErrorState({ message, onRetry }) {
	const { lang } = useLang();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid place-items-center gap-3 rounded-xl border border-bad/30 bg-paper px-6 py-12 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
				className: "size-6 text-bad",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-base font-medium text-ink",
				children: t(copy.state.error, lang)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm text-muted",
				children: message || t(copy.state.unavailable, lang)
			}),
			onRetry ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				variant: "outline",
				onClick: onRetry,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4" }), t(copy.state.retry, lang)]
			}) : null
		]
	});
}
function Flash({ error, ok }) {
	const { lang } = useLang();
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		role: "alert",
		className: "text-sm text-bad",
		children: error
	});
	if (ok) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		role: "status",
		className: "text-sm text-good",
		children: t(copy.state.saved, lang)
	});
	return null;
}
function Sheet({ title, onClose, children }) {
	const { lang } = useLang();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-40 grid place-items-end bg-ink/40 sm:place-items-center sm:p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "absolute inset-0",
			"aria-label": t(copy.studio.cancel, lang),
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 max-h-[90dvh] w-full max-w-lg overflow-auto rounded-t-xl bg-paper p-5 sm:rounded-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "grid size-11 place-items-center rounded-md hover:bg-sand",
					onClick: onClose,
					"aria-label": t(copy.studio.cancel, lang),
					children: "×"
				})]
			}), children]
		})]
	});
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/createSsrRpc-B2Izd0c7.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/lang-toggle-Cj3z92K2.js
function LangToggle({ className }) {
	const { lang, setLang } = useLang();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("inline-flex h-9 items-center rounded-full border border-line bg-paper p-0.5 text-xs", className),
		role: "group",
		"aria-label": "Language",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: cn("h-8 min-w-10 rounded-full px-3 font-medium", lang === "ar" ? "bg-ink text-paper" : "text-muted"),
			onClick: () => setLang("ar"),
			children: "عربي"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: cn("h-8 min-w-10 rounded-full px-3 font-medium", lang === "en" ? "bg-ink text-paper" : "text-muted"),
			onClick: () => setLang("en"),
			children: "EN"
		})]
	});
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/public-BzyFut46.js
var slugSchema = string().min(1).max(63).regex(/^[a-z0-9][a-z0-9-]*$/);
var getPublicMenu = createServerFn({ method: "GET" }).validator(object({
	slug: slugSchema,
	branch: string().max(63).optional()
})).handler(createSsrRpc("852131eb30b9fbff25e1e06e05fd859cd4587a0495f25505e703ce99c64a2079"));
var recordPublicEvent = createServerFn({ method: "POST" }).validator(object({
	slug: slugSchema,
	branchSlug: string().max(63).optional(),
	productId: string().max(80).optional(),
	eventType: _enum([
		"visit",
		"product_view",
		"qr_scan",
		"whatsapp"
	]),
	lang: _enum(["ar", "en"]).optional(),
	sessionId: string().min(8).max(80)
})).handler(createSsrRpc("3343a0af62196f7c5bc046a9e6c297fa1a2ad829cda898bde955abf66a1522f7"));
var submitLead = createServerFn({ method: "POST" }).validator(object({
	businessName: string().trim().min(2).max(120),
	city: string().trim().max(80).optional(),
	contactName: string().trim().min(2).max(80),
	contactPhone: string().trim().min(8).max(30),
	contactEmail: string().trim().email().optional().or(literal("")),
	details: string().trim().max(1e3).optional()
})).handler(createSsrRpc("8de37b0ab7c6f750c453e235b5dd72fede62d111d76a0f8b6615b8fa8cb018f9"));
//#endregion
export { LangToggle as a, ErrorState as c, Sheet as d, Button as f, useLang as g, t as h, submitLead as i, Flash as l, copy as m, getPublicMenu as n, createSsrRpc as o, LangProvider as p, recordPublicEvent as r, EmptyState as s, router_exports as t, LoadingState as u };
