import { useEffect, useState } from "react";
import { Instagram, MapPin, MessageCircle, Phone } from "lucide-react";
import { recordPublicEvent } from "@/lib/menu/public";
import { getGuestSessionId } from "@/lib/menu/session";
import { ACTIVE_EXPERIMENT, getExperimentVariant, type ExperimentVariant } from "@/lib/menu/experiment";
import { getPublicActions } from "@/lib/menu/public-actions";
import type { Branch, Lang, PublicTenant } from "@/lib/menu/types";
import { cn } from "@/lib/utils";

type PublicActionLinksProps = {
  tenant: PublicTenant;
  branch: Branch;
  lang: Lang;
  preview?: boolean;
  className?: string;
};

const ICONS = { whatsapp: MessageCircle, location: MapPin, phone: Phone, instagram: Instagram };

export function PublicActionLinks({ tenant, branch, lang, preview = false, className }: PublicActionLinksProps) {
  const actions = getPublicActions(tenant, branch, lang);
  const [experimentVariant, setExperimentVariant] = useState<ExperimentVariant>("control");

  useEffect(() => {
    if (preview) return;
    setExperimentVariant(getExperimentVariant(getGuestSessionId()));
  }, [preview]);

  if (!actions.length) return null;
  const sessionId = getGuestSessionId();

  return (
    <nav aria-label={lang === "ar" ? "تواصل ومعلومات الفرع" : "Contact and branch information"} className={cn("flex flex-wrap items-center gap-2", className)}>
      {actions.map((action) => {
        const Icon = ICONS[action.key];
        const isExperimentTreatment = !preview && action.key === "whatsapp" && experimentVariant === "prominent";
        return (
          <a
            key={action.key}
            data-action-key={action.key}
            data-experiment={!preview && action.key === "whatsapp" ? ACTIVE_EXPERIMENT : undefined}
            data-experiment-variant={!preview && action.key === "whatsapp" ? experimentVariant : undefined}
            href={action.href}
            target={action.external ? "_blank" : undefined}
            rel={action.external ? "noopener noreferrer" : undefined}
            onClick={() => {
              if (!preview && action.key === "whatsapp") {
                void recordPublicEvent({ data: { slug: tenant.slug, branchSlug: branch.slug, eventType: "whatsapp", lang, sessionId } });
              }
            }}
            className={cn(
              "inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-paper/70 px-4 text-sm font-medium text-ink-soft transition hover:-translate-y-0.5 hover:border-ink/30 hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
              action.key === "whatsapp" && "border-accent/35 text-accent",
              isExperimentTreatment && "font-semibold shadow-sm",
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
