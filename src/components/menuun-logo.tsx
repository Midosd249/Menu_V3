import type { ComponentPropsWithoutRef } from "react";
import logoAr from "../../assets/brand/menuun/final/menuun-logo-ar.svg";
import logoEn from "../../assets/brand/menuun/final/menuun-logo-en.svg";

type MenuunLogoProps = Omit<ComponentPropsWithoutRef<"img">, "src" | "alt"> & {
  lang: "ar" | "en";
};

export function MenuunLogo({ lang, ...props }: MenuunLogoProps) {
  return (
    <img
      {...props}
      src={lang === "ar" ? logoAr : logoEn}
      alt={lang === "ar" ? "Menuun — منيو رقمي للمطاعم والكافيهات" : "Menuun"}
      role="img"
    />
  );
}
