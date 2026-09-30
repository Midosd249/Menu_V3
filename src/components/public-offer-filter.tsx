import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Lang } from "@/lib/menu/types";

type Props = { lang: Lang; selected: boolean; onClick: () => void; className?: string };

export function PublicOffersFilter({ lang, selected, onClick, className }: Props) {
  return <button type="button" data-public-offers-filter="true" aria-pressed={selected} onClick={onClick} className={cn("inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm font-semibold shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2", selected ? "border-accent bg-accent text-paper" : "border-accent/30 bg-accent/10 text-accent hover:bg-accent/20", className)}>
    <Sparkles className="size-4" aria-hidden="true" /><span>{lang === "ar" ? "العروض" : "Offers"}</span>
  </button>;
}
