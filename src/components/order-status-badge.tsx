import { CheckCircle2, CircleCheck, CircleX, Clock3, PackageCheck, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { getOrderStatusPresentation } from "@/lib/menu/order-status-presentation";
import type { OrderStatus } from "@/lib/menu/order-lifecycle";
import { t } from "@/lib/menu/i18n";
import { cn } from "@/lib/utils";

const toneClasses = {
  info: "border-accent/25 bg-accent/10 text-accent",
  indigo: "border-ink/20 bg-ink/5 text-ink",
  warning: "border-warn/25 bg-warn/10 text-warn",
  success: "border-good/25 bg-good/10 text-good",
  neutral: "border-line bg-sand text-ink-soft",
  danger: "border-bad/25 bg-bad/10 text-bad",
} as const;

const icons = {
  sparkles: Sparkles,
  "circle-check": CircleCheck,
  clock: Clock3,
  "package-check": PackageCheck,
  "check-circle": CheckCircle2,
  "circle-x": CircleX,
} as const;

export function OrderStatusBadge({ status, lang, className }: { status: OrderStatus; lang: "ar" | "en"; className?: string }): ReactNode {
  const presentation = getOrderStatusPresentation(status);
  if (!presentation) return null;
  const Icon = icons[presentation.icon];

  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs font-semibold",
        toneClasses[presentation.tone],
        className,
      )}
      aria-label={t(presentation.label, lang)}
    >
      <Icon className="size-3.5 shrink-0" aria-hidden />
      <span>{t(presentation.label, lang)}</span>
    </span>
  );
}
