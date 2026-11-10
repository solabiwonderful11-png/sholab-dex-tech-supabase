import { useState } from "react";
import { Check, MessageCircle, Star } from "lucide-react";
import { CATEGORIES, CATEGORY_LABELS } from "@shared/constants";
import type { PricingPackage, ServiceCategory, SiteSettings } from "@shared/types";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { useQuote } from "@/hooks/useQuote";
import { cn } from "@/lib/utils";

/**
 * Pricing, grouped by category.
 *
 * Each card's call to action opens the quote popup with that exact package
 * pre-selected (brief 1.6 / 4.2), so the owner knows precisely what the enquiry
 * is about without asking — the single biggest drop-off point in a quote
 * conversation.
 *
 * Below the cards sits the comparison table the brief asks for. It is generated
 * from the same package rows the cards use, so it can never drift out of sync
 * with the prices above it.
 */
export function Pricing({
  packages,
  settings,
}: {
  packages: PricingPackage[];
  settings: SiteSettings;
}) {
  const [active, setActive] = useState<ServiceCategory>("websites");
  const { openQuote } = useQuote();

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

              <button
                type="button"
                onClick={() => openQuote({ category: p.category, packageId: p.id })}
                className={cn(
                  "btn mt-6 w-full",
                  p.isPopular ? "btn-primary" : "btn-ghost",
                )}
                aria-label={`Chat on WhatsApp about the ${p.name} package`}
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Chat on WhatsApp
              </button>
            </article>
          </Reveal>
        ))}
      </div>

      {/* ── Comparison table — brief 1.6 ─────────────────────────────────── */}
      {shown.length > 0 ? (
        <Reveal className="mt-14">
          <h3 className="text-center text-sm font-bold uppercase tracking-wider text-ink-subtle">
            Compare {CATEGORY_LABELS[active].toLowerCase()} packages
          </h3>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-line bg-surface-raised">
            <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
              <caption className="sr-only">
                What is included in each {CATEGORY_LABELS[active]} package
              </caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="p-4 font-bold">
                    Package
                  </th>
                  <th scope="col" className="p-4 font-bold">
                    Price
                  </th>
                  <th scope="col" className="p-4 font-bold">
                    What&apos;s included
                  </th>
                </tr>
              </thead>
              <tbody>
                {shown.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-line last:border-0 align-top"
                  >
                    <th scope="row" className="p-4 font-semibold">
                      <span className="flex items-center gap-2">
                        {p.name}
                        {p.isPopular ? (
                          <span className="rounded-full bg-accent-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-600">
                            Popular
                          </span>
                        ) : null}
                      </span>
                    </th>
                    <td className="whitespace-nowrap p-4 text-ink-muted">
                      <span className="block font-semibold text-ink">{p.priceNgn}</span>
                      {p.priceUsd ? (
                        <span className="text-xs text-ink-subtle">{p.priceUsd}</span>
                      ) : null}
                    </td>
                    <td className="p-4 text-ink-muted">
                      {p.features.length > 0 ? (
                        <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
                          {p.features.map((f) => (
                            <li key={f} className="flex items-center gap-1.5 text-xs">
                              <Check
                                className="h-3.5 w-3.5 shrink-0 text-brand-500"
                                aria-hidden="true"
                              />
                              {f}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-xs text-ink-subtle">
                          Tailored to your project — ask us.
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      ) : null}

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
