import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { Search, CheckCircle2, AlertTriangle, Info, LockKeyhole, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type WorkspaceNavigationItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  active?: boolean;
  disabled?: boolean;
};

export function InternalShell({
  navigation,
  header,
  children,
  className,
}: {
  navigation?: ReactNode;
  header?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div dir="inherit" className={cn("min-h-[100dvh] bg-paper text-ink", className)}>
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-[1600px]">
        {navigation ? (
          <aside className="hidden w-64 shrink-0 border-e border-line bg-paper lg:block" aria-label="Workspace navigation">
            {navigation}
          </aside>
        ) : null}
        <div className="min-w-0 flex-1">
          {header ? <header className="border-b border-line bg-paper">{header}</header> : null}
          <main className="min-w-0 px-4 py-5 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

export function WorkspaceNavigation({
  items,
  onSelect,
  footer,
  ariaLabel = "Workspace navigation",
}: {
  items: WorkspaceNavigationItem[];
  onSelect?: (item: WorkspaceNavigationItem) => void;
  footer?: ReactNode;
  ariaLabel?: string;
}) {
  return (
    <nav aria-label={ariaLabel} className="flex h-full flex-col gap-2 p-3">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="grid gap-1">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              disabled={item.disabled}
              aria-current={item.active ? "page" : undefined}
              onClick={() => onSelect?.(item)}
              className={cn(
                "flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-start text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "disabled:pointer-events-none disabled:opacity-40",
                item.active ? "bg-sand text-ink" : "text-ink-soft hover:bg-sand/70 hover:text-ink",
              )}
            >
              {item.icon ? <span className="grid size-5 shrink-0 place-items-center" aria-hidden>{item.icon}</span> : null}
              <span className="min-w-0 truncate">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      {footer ? <div className="border-t border-line pt-3">{footer}</div> : null}
    </nav>
  );
}

export function WorkspaceHeader({
  eyebrow,
  title,
  restaurantName,
  context,
  actions,
  className,
}: {
  eyebrow?: ReactNode;
  title?: ReactNode;
  restaurantName?: ReactNode;
  context?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-h-16 items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8", className)}>
      <div className="min-w-0">
        {eyebrow ? <p className="mb-0.5 text-xs font-medium text-muted">{eyebrow}</p> : null}
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
          {restaurantName ? <span className="max-w-full truncate text-sm font-medium text-ink-soft">{restaurantName}</span> : null}
          {title ? <h1 className="min-w-0 text-base font-semibold tracking-tight text-ink">{title}</h1> : null}
        </div>
        {context ? <p className="mt-0.5 max-w-3xl text-xs text-muted">{context}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="min-w-0">
        {eyebrow ? <p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-muted">{eyebrow}</p> : null}
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-soft">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function SectionHeader({
  title,
  description,
  action,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div className="min-w-0">
        <h2 className="text-base font-semibold text-ink">{title}</h2>
        {description ? <p className="mt-0.5 text-sm text-muted">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

const statusClasses = {
  success: "border-good/25 bg-good/10 text-good",
  warning: "border-warn/25 bg-warn/10 text-warn",
  danger: "border-bad/25 bg-bad/10 text-bad",
  info: "border-ring/25 bg-accent/10 text-accent",
  neutral: "border-line bg-sand text-ink-soft",
} as const;

export function StatusBadge({
  status,
  children,
  className,
}: {
  status: keyof typeof statusClasses;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex min-h-7 items-center rounded-full border px-2.5 text-xs font-semibold", statusClasses[status], className)}>
      {children}
    </span>
  );
}

export function EmptyState({
  title,
  body,
  action,
  className,
}: {
  title: ReactNode;
  body?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid place-items-center gap-3 rounded-lg border border-line bg-paper px-6 py-12 text-center", className)}>
      <div className="grid size-10 place-items-center rounded-full bg-sand text-ink-soft" aria-hidden>
        <Info className="size-5" />
      </div>
      <div className="grid gap-1">
        <p className="text-base font-semibold text-ink">{title}</p>
        {body ? <p className="mx-auto max-w-lg text-sm leading-6 text-muted">{body}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function LoadingState({ label = "جارٍ التحميل…", className }: { label?: ReactNode; className?: string }) {
  return (
    <div role="status" aria-live="polite" className={cn("grid min-h-40 place-items-center gap-3 px-6 py-10 text-muted", className)}>
      <LoaderCircle className="size-6 animate-spin" aria-hidden />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function ErrorState({
  title = "تعذر تحميل البيانات",
  message,
  action,
  className,
}: {
  title?: ReactNode;
  message?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div role="alert" className={cn("grid gap-3 rounded-lg border border-bad/30 bg-paper px-5 py-6", className)}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-bad" aria-hidden />
        <div className="min-w-0">
          <p className="font-semibold text-ink">{title}</p>
          {message ? <p className="mt-1 text-sm leading-6 text-muted">{message}</p> : null}
        </div>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

export function PermissionDeniedState({
  title = "ليس لديك صلاحية للوصول",
  message,
  action,
  className,
}: {
  title?: ReactNode;
  message?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div role="alert" className={cn("grid place-items-center gap-3 rounded-lg border border-line bg-paper px-6 py-12 text-center", className)}>
      <div className="grid size-10 place-items-center rounded-full bg-sand text-ink-soft" aria-hidden>
        <LockKeyhole className="size-5" />
      </div>
      <div className="grid gap-1">
        <p className="text-base font-semibold text-ink">{title}</p>
        {message ? <p className="max-w-lg text-sm leading-6 text-muted">{message}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function SearchField({
  label = "بحث",
  hideLabel = false,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label?: string; hideLabel?: boolean }) {
  return (
    <label className={cn("grid min-w-0 gap-1.5", className)}>
      <span className={cn("text-sm font-medium text-ink-soft", hideLabel && "sr-only")}>{label}</span>
      <span className="relative block">
        <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
        <Input {...props} type="search" className="ps-10" />
      </span>
    </label>
  );
}

export function FilterBar({
  children,
  actions,
  className,
}: {
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3 rounded-lg border border-line bg-paper p-3 sm:flex-row sm:items-end sm:flex-wrap", className)}>
      <div className="flex min-w-0 flex-1 flex-wrap items-end gap-3">{children}</div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function DataTable({
  children,
  label = "Operational data",
  className,
}: {
  children: ReactNode;
  label?: string;
  className?: string;
}) {
  return (
    <div role="region" aria-label={label} tabIndex={0} className={cn("w-full overflow-x-auto rounded-lg border border-line bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}>
      <table className="w-full min-w-[720px] border-collapse text-sm">{children}</table>
    </div>
  );
}

export function MetricRow({
  label,
  value,
  detail,
  status,
  className,
}: {
  label: ReactNode;
  value: ReactNode;
  detail?: ReactNode;
  status?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-line py-3 last:border-b-0", className)}>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-ink">{label}</p>
        {detail ? <p className="mt-0.5 text-xs leading-5 text-muted">{detail}</p> : null}
      </div>
      <div className="flex items-center gap-2 text-end">
        <span className="tabular text-sm font-semibold text-ink">{value}</span>
        {status}
      </div>
    </div>
  );
}

export function InsightCard({
  title,
  body,
  meta,
  action,
  tone = "neutral",
  className,
}: {
  title: ReactNode;
  body?: ReactNode;
  meta?: ReactNode;
  action?: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
  className?: string;
}) {
  const icon = tone === "success" ? CheckCircle2 : tone === "danger" ? AlertTriangle : tone === "info" ? Info : null;
  const Icon = icon;
  return (
    <article className={cn("rounded-lg border border-line bg-paper p-4", className)}>
      <div className="flex items-start gap-3">
        {Icon ? <Icon className={cn("mt-0.5 size-5 shrink-0", tone === "success" && "text-good", tone === "danger" && "text-bad", tone === "info" && "text-accent")} aria-hidden /> : null}
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-ink">{title}</h3>
          {body ? <p className="mt-1 text-sm leading-6 text-ink-soft">{body}</p> : null}
          {meta ? <div className="mt-3 text-xs text-muted">{meta}</div> : null}
          {action ? <div className="mt-4">{action}</div> : null}
        </div>
      </div>
    </article>
  );
}

export function ActionCard({
  title,
  body,
  action,
  className,
}: {
  title: ReactNode;
  body?: ReactNode;
  action: ReactNode;
  className?: string;
}) {
  return (
    <article className={cn("flex flex-col gap-4 rounded-lg border border-line bg-sand/35 p-4 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        {body ? <p className="mt-1 max-w-2xl text-sm leading-6 text-ink-soft">{body}</p> : null}
      </div>
      <div className="shrink-0">{action}</div>
    </article>
  );
}

export function MobileBottomNav({
  items,
  onSelect,
  className,
}: {
  items: WorkspaceNavigationItem[];
  onSelect?: (item: WorkspaceNavigationItem) => void;
  className?: string;
}) {
  return (
    <nav aria-label="Mobile workspace navigation" className={cn("fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgb(23_20_17_/_0.08)] backdrop-blur-sm lg:hidden", className)}>
      <div className="mx-auto grid max-w-lg grid-cols-5 gap-1 py-1.5">
        {items.slice(0, 5).map((item) => (
          <button
            key={item.id}
            type="button"
            disabled={item.disabled}
            aria-current={item.active ? "page" : undefined}
            onClick={() => onSelect?.(item)}
            className={cn(
              "grid min-h-11 min-w-0 place-items-center gap-0.5 rounded-md px-1 text-center text-[0.7rem] font-medium",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40",
              item.active ? "bg-sand text-ink" : "text-muted hover:bg-sand/70 hover:text-ink",
            )}
          >
            {item.icon ? <span className="grid size-5 place-items-center" aria-hidden>{item.icon}</span> : null}
            <span className="max-w-full truncate">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;
