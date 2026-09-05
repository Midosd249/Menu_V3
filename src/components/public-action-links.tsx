import { Instagram, MapPin, Phone } from "lucide-react";
import { recordPublicEvent } from "@/lib/menu/public";
import type { Branch, Lang, Tenant } from "@/lib/menu/types";
import { cn } from "@/lib/utils";

type PublicActionLinksProps = {
  tenant: Tenant;
  branch: Branch;
  lang: Lang;
  preview?: boolean;
  className?: string;
};

type Action = {
  key: "whatsapp" | "location" | "phone" | "instagram";
  href: string;
  label: string;
  icon: typeof MapPin;
  external?: boolean;
};

const MAP_HOSTS = new Set([
  "apple.com",
  "goo.gl",
  "google.com",
  "maps.app.goo.gl",
  "maps.google.com",
  "waze.com",
]);
const SOCIAL_HOSTS = new Set(["instagram.com"]);

function isAllowedHost(hostname: string, allowed: Set<string>): boolean {
  const host = hostname.toLowerCase();
  return [...allowed].some((allowedHost) => host === allowedHost || host.endsWith(`.${allowedHost}`));
}

export function sanitizeExternalUrl(value: string, allowedHosts: Set<string>): string | null {
  const raw = value.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:") return null;
    if (url.username || url.password) return null;
    return isAllowedHost(url.hostname, allowedHosts) ? url.toString() : null;
  } catch {
    return null;
  }
}

export function normalizePhoneDigits(value: string, country = "SA"): string | null {
  const raw = value.trim();
  if (!raw) return null;
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (country.toUpperCase() === "SA") {
    if (digits.startsWith("0") && digits.length === 10) digits = `966${digits.slice(1)}`;
    else if (digits.length === 9 && digits.startsWith("5")) digits = `966${digits}`;
  }
  if (digits.length < 8 || digits.length > 15) return null;
  return digits;
}

export function buildWhatsAppUrl(tenant: Tenant, lang: Lang): string | null {
  const digits = normalizePhoneDigits(tenant.whatsapp, tenant.country);
  if (!digits) return null;
  const restaurant = lang === "ar" ? tenant.nameAr || tenant.nameEn : tenant.nameEn || tenant.nameAr;
  const message = (tenant.whatsappTemplate || "السلام عليكم، أريد الاستفسار عن {restaurant}.")
    .replaceAll("{restaurant}", restaurant)
    .replaceAll("{product}", lang === "ar" ? "المنيو" : "the menu")
    .trim();
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function getPublicActions(tenant: Tenant, branch: Branch, lang: Lang): Action[] {
  const whatsapp = buildWhatsAppUrl(tenant, lang);
  const maps = sanitizeExternalUrl(branch.mapsUrl, MAP_HOSTS);
  const instagram = sanitizeExternalUrl(tenant.instagramUrl, SOCIAL_HOSTS);
  const phone = normalizePhoneDigits(branch.phone, tenant.country);
  const label = (ar: string, en: string) => lang === "ar" ? ar : en;
  return [
    whatsapp ? { key: "whatsapp" as const, href: whatsapp, label: label("واتساب", "WhatsApp"), icon: Phone, external: true } : null,
    maps ? { key: "location" as const, href: maps, label: label("الموقع", "Location"), icon: MapPin, external: true } : null,
    phone ? { key: "phone" as const, href: `tel:+${phone}`, label: label("اتصال", "Call"), icon: Phone } : null,
    instagram ? { key: "instagram" as const, href: instagram, label: "Instagram", icon: Instagram, external: true } : null,
  ].filter((action): action is Action => Boolean(action));
}

export function PublicActionLinks({ tenant, branch, lang, preview = false, className }: PublicActionLinksProps) {
  const actions = getPublicActions(tenant, branch, lang);
  if (!actions.length) return null;

  return (
    <nav aria-label={lang === "ar" ? "تواصل ومعلومات الفرع" : "Contact and branch information"} className={cn("flex flex-wrap items-center gap-2", className)}>
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <a
            key={action.key}
            href={action.href}
            target={action.external ? "_blank" : undefined}
            rel={action.external ? "noopener noreferrer" : undefined}
            onClick={() => {
              if (!preview && action.key === "whatsapp") {
                void recordPublicEvent({
                  data: {
                    slug: tenant.slug,
                    branchSlug: branch.slug,
                    eventType: "whatsapp",
                    lang,
                  },
                });
              }
            }}
            className={cn(
              "inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-paper/70 px-4 text-sm font-medium text-ink-soft transition hover:-translate-y-0.5 hover:border-ink/30 hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
              action.key === "whatsapp" && "border-accent/35 text-accent",
            )}
          >
            <Icon className="size-4" aria-hidden />
            <span>{action.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
