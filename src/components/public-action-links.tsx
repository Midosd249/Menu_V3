import { Instagram, MapPin, MessageCircle, Phone } from "lucide-react";
import { recordPublicEvent } from "@/lib/menu/public";
import { getGuestSessionId } from "@/lib/menu/session";
import { getPublicActions } from "@/lib/menu/public-actions";
import type { Branch, Lang, Tenant } from "@/lib/menu/types";
import { cn } from "@/lib/utils";

const ICONS = { whatsapp: MessageCircle, location: MapPin, phone: Phone, instagram: Instagram };

type PublicActionLinksProps = {
  tenant: Tenant;
  branch: Branch;
  lang: Lang;
  preview?: boolean;
  className?: string;
};

export function PublicActionLinks({ tenant, branch, lang, preview = false, className }: PublicActionLinksProps) {
  const actions = getPublicActions(tenant, branch, lang);
  if (!actions.length) return null;

  return (
    <nav aria-label={lang === "ar" ? "تواصل ومعلومات الفرع" : "Contact and branch information"} className={cn("flex flex-wrap items-center gap-2", className)}>
      {actions.map((action) => {
        const Icon = ICONS[action.key];
        return (
          <a
            key={action.key}
            data-action-key={action.key}
            href={action.href}
            target={action.external ? "_blank" : undefined}
            rel={action.external ? "noopener noreferrer" : undefined}
            onClick={() => {
              if (!preview && action.key === "whatsapp") {
                void recordPublicEvent({ data: { slug: tenant.slug, branchSlug: branch.slug, eventType: "whatsapp", lang, sessionId: getGuestSessionId() } });
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
