import type { SiteSettings } from "@shared/types";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

/**
 * How we work — a numbered timeline.
 *
 * The connecting line is drawn as an absolutely positioned span rather than a
 * border on the list, so it stays aligned with the markers at every breakpoint
 * without any magic numbers.
 */
export function Process({ settings }: { settings: SiteSettings }) {
  if (settings.processSteps.length === 0) return null;

  return (
    <Section
      id="process"
      eyebrow="How we work"
      title="A clear process, start to finish"
      intro="You always know what stage your project is at and what happens next."
      tone="sunken"
    >
      <ol className="relative grid gap-6 md:grid-cols-5 md:gap-4">
        {/* Connector — desktop only; on mobile the cards stack and a horizontal
            line would be meaningless. */}
        <span
          className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-line-strong to-transparent md:block"
          aria-hidden="true"
        />

        {settings.processSteps.map((step, i) => (
          <Reveal key={step.title} delay={i * 80} as="li" className="relative">
            <div className="flex gap-4 md:flex-col md:items-center md:text-center">
              <span className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-line bg-surface-raised text-sm font-extrabold text-brand-600 shadow-sm dark:text-brand-300">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="md:mt-4">
                <h3 className="text-sm font-bold">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                  {step.description}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
