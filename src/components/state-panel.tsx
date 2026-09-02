import { AlertTriangle, LoaderCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/lang";
import { copy, t } from "@/lib/menu/i18n";

export function LoadingState({ label }: { label?: string }) {
  const { lang } = useLang();
  return (
    <div className="grid min-h-48 place-items-center gap-3 px-6 py-16 text-muted">
      <LoaderCircle className="size-6 animate-spin" aria-hidden />
      <p className="text-sm">{label || t(copy.state.loading, lang)}</p>
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title?: string;
  body?: string;
  action?: React.ReactNode;
}) {
  const { lang } = useLang();
  return (
    <div className="grid place-items-center gap-3 rounded-xl border border-line bg-paper px-6 py-14 text-center">
      <p className="text-base font-medium text-ink">{title || t(copy.state.empty, lang)}</p>
      {body ? <p className="max-w-md text-sm text-muted">{body}</p> : null}
      {action}
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  const { lang } = useLang();
  return (
    <div className="grid place-items-center gap-3 rounded-xl border border-bad/30 bg-paper px-6 py-12 text-center">
      <AlertTriangle className="size-6 text-bad" aria-hidden />
      <p className="text-base font-medium text-ink">{t(copy.state.error, lang)}</p>
      <p className="max-w-md text-sm text-muted">{message || t(copy.state.unavailable, lang)}</p>
      {onRetry ? (
        <Button type="button" variant="outline" onClick={onRetry}>
          <RefreshCw className="size-4" />
          {t(copy.state.retry, lang)}
        </Button>
      ) : null}
    </div>
  );
}

export function Flash({ error, ok }: { error: string; ok: boolean }) {
  const { lang } = useLang();
  if (error) return <p role="alert" className="text-sm text-bad">{error}</p>;
  if (ok) return <p role="status" className="text-sm text-good">{t(copy.state.saved, lang)}</p>;
  return null;
}

export function Sheet({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const { lang } = useLang();
  return (
    <div className="fixed inset-0 z-40 grid place-items-end bg-ink/40 sm:place-items-center sm:p-6">
      <button type="button" className="absolute inset-0" aria-label={t(copy.studio.cancel, lang)} onClick={onClose} />
      <div className="relative z-10 max-h-[90dvh] w-full max-w-lg overflow-auto rounded-t-xl bg-paper p-5 sm:rounded-xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold">{title}</h2>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-md hover:bg-sand"
            onClick={onClose}
            aria-label={t(copy.studio.cancel, lang)}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
