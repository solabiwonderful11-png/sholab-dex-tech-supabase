import { useState } from "react";
import { Check, MessageCircle } from "lucide-react";
import { CATEGORIES, CATEGORY_LABELS, CATEGORY_TAGLINES } from "@shared/constants";
import type { Service, ServiceCategory } from "@shared/types";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { useQuote } from "@/hooks/useQuote";
import { cn } from "@/lib/utils";

/**
 * Services, grouped by category with a tab switcher.
 *
 * Tabs rather than one long list: there are 46 services, and showing them all
 * at once buries the ones a visitor actually came for. The tab state is local
 * because it is presentation, not content — it does not belong in the URL or
 * in the database.
 *
 * Every card carries its own "Chat on WhatsApp" button (brief 1.4) which opens
 * the quote popup with that exact service pre-selected, so the owner receives
 * "I am interested in Website Redesign & Revamp" rather than a bare "hi".
 */
export function Services({ services }: { services: Service[] }) {
  const [active, setActive] = useState<ServiceCategory>("websites");
  const { openQuote } = useQuote();

  const shown = services.filter((s) => s.category === active);

  return (
    <Section
      id="services"
      eyebrow="What we do"
      title="Services built around your business"
      intro="From a first website to a full AI automation system — pick what you need today and add the rest as you grow."
    >
      {/* Tabs */}
      <Reveal className="flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((c) => {
          const count = services.filter((s) => s.category === c).length;
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
              <span
                className={cn(
                  "ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                  isActive ? "bg-white/20" : "bg-surface-sunken",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </Reveal>

      <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-ink-muted">
        {CATEGORY_TAGLINES[active]}
      </p>

      {/* Grid */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((s, i) => (
          <Reveal key={s.id} delay={Math.min(i, 8) * 45}>
            <article className="card card-hover flex h-full flex-col p-5">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-500/12 text-brand-600 dark:text-brand-300">
                  <Check className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-sm font-bold leading-snug">{s.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                    {s.description}
                  </p>
                </div>
              </div>

              {/* Per-service WhatsApp button — brief 1.4. */}
              <button
                type="button"
                onClick={() =>
                  openQuote({ category: s.category, serviceName: s.name })
                }
                className="mt-4 inline-flex items-center gap-1.5 self-start rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink-muted transition-colors hover:border-[#25d366] hover:text-[#25d366]"
                aria-label={`Chat on WhatsApp about ${s.name}`}
              >
                <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                Chat on WhatsApp
              </button>
            </article>
          </Reveal>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="mt-10 text-center text-sm text-ink-subtle">
          No services listed in this category yet.
        </p>
      ) : null}

      {/* Section-level call to action — brief 1.4. */}
      <Reveal className="mt-12 text-center">
        <button
          type="button"
          onClick={() => openQuote({ category: active })}
          className="btn btn-primary"
        >
          Get a Free Quote
        </button>
      </Reveal>
    </Section>
  );
}
