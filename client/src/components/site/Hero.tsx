import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import type { SiteSettings, Stat } from "@shared/types";
import { useCountUp } from "@/hooks/useCountUp";
import { useQuote } from "@/hooks/useQuote";
import { mediaUrl } from "@/lib/supabase";

/**
 * Hero.
 *
 * The layout is deliberately asymmetric on desktop (7/5 split): a centred hero
 * with a symmetric image reads as a template, while an off-centre one gives the
 * eye a path from the headline down to the call to action.
 */
export function Hero({ settings, stats }: { settings: SiteSettings; stats: Stat[] }) {
  const heroImage = mediaUrl(settings.heroImage);
  const { openQuote } = useQuote();

  return (
    <section id="home" className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
      {/* Decorative backdrop — grid plus two colour blooms. aria-hidden because
          it carries no information. */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="grid-backdrop absolute inset-0" />
        <div className="glow -left-24 top-0 h-72 w-72 bg-brand-400" />
        <div className="glow right-0 top-24 h-80 w-80 bg-accent-400" />
      </div>

      <div className="shell grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Copy */}
        <div className="lg:col-span-7">
          <span className="eyebrow animate-[reveal_0.6s_var(--ease-premium)_both]">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Websites · AI Automation · Promotions
          </span>

          <h1 className="mt-5 text-display font-extrabold tracking-tight">
            <span className="gradient-text">{settings.heroHeadline}</span>
          </h1>

          <p className="mt-5 max-w-2xl text-lg font-semibold leading-snug text-ink sm:text-xl">
            {settings.heroTagline}
          </p>

          {settings.heroIntro ? (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">
              {settings.heroIntro}
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => openQuote()}
              className="btn btn-primary"
            >
              {settings.heroCtaPrimary}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => openQuote()}
              className="btn btn-whatsapp"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              {settings.heroCtaSecondary}
            </button>
          </div>

          {/* Trust line */}
          <p className="mt-6 text-sm text-ink-subtle">
            Free consultation · Clear pricing · Support after launch
          </p>
        </div>

        {/* Visual */}
        <div className="lg:col-span-5">
          <div className="relative">
            {heroImage ? (
              <img
                src={heroImage}
                alt={`${settings.companyName} work`}
                className="w-full rounded-3xl border border-line object-cover shadow-lg"
                loading="eager"
              />
            ) : (
              <HeroPanel settings={settings} />
            )}
          </div>
        </div>
      </div>

      {/* Stats strip */}
      {stats.length > 0 ? (
        <div className="shell mt-16 md:mt-20">
          <dl className="grid grid-cols-2 gap-4 rounded-2xl border border-line bg-surface-raised p-6 shadow-sm sm:grid-cols-4 sm:p-8">
            {stats.map((s) => (
              <StatItem key={s.id} stat={s} />
            ))}
          </dl>
        </div>
      ) : null}
    </section>
  );
}

/**
 * Placeholder visual shown when no hero image has been uploaded.
 * A styled panel rather than a grey box, so the hero still looks finished on a
 * fresh install before the owner has added any images.
 */
function HeroPanel({ settings }: { settings: SiteSettings }) {
  const items = [
    { label: "Websites", value: "Built to convert" },
    { label: "Automation", value: "Hours saved weekly" },
    { label: "Promotions", value: "Reach real buyers" },
  ];

  return (
    <div className="glass-strong animate-[float_6s_ease-in-out_infinite] rounded-3xl p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 text-base font-bold text-white">
          {settings.companyName.charAt(0)}
        </span>
        <div>
          <p className="text-sm font-bold">{settings.companyName}</p>
          <p className="text-xs text-ink-subtle">Digital solutions partner</p>
        </div>
      </div>

      <ul className="mt-6 space-y-3">
        {items.map((it) => (
          <li
            key={it.label}
            className="flex items-center justify-between rounded-xl border border-line bg-surface/60 px-4 py-3"
          >
            <span className="text-sm font-semibold">{it.label}</span>
            <span className="text-xs text-ink-muted">{it.value}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center gap-2 rounded-xl bg-brand-500/10 px-4 py-3">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-[pulse-ring_2.4s_var(--ease-soft)_infinite] rounded-full bg-brand-500" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
        </span>
        <span className="text-xs font-medium text-brand-700 dark:text-brand-300">
          Available for new projects
        </span>
      </div>
    </div>
  );
}

function StatItem({ stat }: { stat: Stat }) {
  const { ref, display } = useCountUp(stat.value);

  return (
    <div className="text-center">
      <dt className="sr-only">{stat.label}</dt>
      <dd>
        <span
          ref={ref}
          className="block text-2xl font-extrabold tracking-tight text-brand-600 sm:text-3xl dark:text-brand-300"
        >
          {display}
        </span>
        <span className="mt-1 block text-xs font-medium text-ink-muted sm:text-sm">
          {stat.label}
        </span>
      </dd>
    </div>
  );
}
