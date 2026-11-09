import { useState } from "react";
import { Check, MessageCircle, Star } from "lucide-react";
import { CATEGORIES, CATEGORY_LABELS, whatsappLink } from "@shared/constants";
import type { PricingPackage, ServiceCategory, SiteSettings } from "@shared/types";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * Pricing, grouped by category.
 *
 * Each card's call to action opens WhatsApp with the package name already in
 * the message, so the owner knows exactly what the enquiry is about without
 * asking — the single biggest drop-off point in a quote conversation.
 */
export function Pricing({
  packages,
  settings,
}: {
  packages: PricingPackage[];
  settings: SiteSettings;
}) {
  const [active, setActive] = useState<ServiceCategory>("websites");
  const shown = packages.filter((p) => p.category === active);

  return (
    <Section
      id="pricing"
      eyebrow="Pricing"
      title="Clear, honest pricing"
      intro="Starting prices so you know roughly where you stand before we talk. Every quote is tailored to what you actually need."
    >
      <Reveal className="flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((c) => {
          const isActive = active === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              aria-pressed={isActive}
              className={cn(
                "rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300",
                isActive
                  ? "bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-brand"
                  : "border border-line bg-surface-raised text-ink-muted hover:border-brand-500 hover:text-ink",
              )}
            >
              {CATEGORY_LABELS[c]}
            </button>
          );
        })}
      </Reveal>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((p, i) => (
          <Reveal key={p.id} delay={Math.min(i, 8) * 55}>
            <article
              className={cn(
                "card card-hover relative flex h-full flex-col p-6",
                p.isPopular && "border-brand-500/60 shadow-brand",
              )}
            >
              {p.isPopular ? (
                <span className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-md">
                  <Star className="h-3 w-3" aria-hidden="true" />
                  Most popular
                </span>
              ) : null}

              <h3 className="text-base font-bold leading-snug">{p.name}</h3>

              <div className="mt-4">
                <p className="text-2xl font-extrabold tracking-tight text-brand-600 dark:text-brand-300">
                  {p.priceNgn || "Contact us"}
                </p>
                {p.priceUsd ? (
                  <p className="mt-0.5 text-sm text-ink-subtle">{p.priceUsd}</p>
                ) : null}
              </div>

              {p.features.length > 0 ? (
                <ul className="mt-5 flex-1 space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-ink-muted">
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-brand-500"
                        aria-hidden="true"
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex-1" />
              )}

              <a
                href={whatsappLink(
                  settings.whatsappNumber,
                  `Hi ${settings.companyName}, I'm interested in the "${p.name}" package (${p.priceNgn}).`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "btn mt-6 w-full",
                  p.isPopular ? "btn-primary" : "btn-ghost",
                )}
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Get this package
              </a>
            </article>
          </Reveal>
        ))}
      </div>

      {settings.pricingNote ? (
        <Reveal className="mx-auto mt-10 max-w-3xl">
          <p className="rounded-2xl border border-line bg-surface-raised p-5 text-center text-sm leading-relaxed text-ink-muted">
            {settings.pricingNote}
          </p>
        </Reveal>
      ) : null}
    </Section>
  );
}
