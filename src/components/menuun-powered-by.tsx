import { MenuunLogo } from "@/components/menuun-logo";

type MenuunPoweredByProps = {
  lang: "ar" | "en";
};

export function MenuunPoweredBy({ lang }: MenuunPoweredByProps) {
  return (
    <footer
      className="border-t border-white/10 bg-[#0F1115] px-4 py-7 text-white"
      data-menuun-powered-by
    >
      <div
        className="mx-auto flex max-w-3xl items-center justify-center gap-3"
        dir="ltr"
      >
        <MenuunLogo
          lang={lang}
          className="h-7 w-auto max-w-[9rem] [filter:brightness(0)_invert(1)]"
        />
        <span
          className="text-xs font-medium tracking-wide text-white/55"
          dir={lang === "ar" ? "rtl" : "ltr"}
        >
          {lang === "ar" ? "مقدم من" : "Powered by"}
        </span>
      </div>
    </footer>
  );
}
