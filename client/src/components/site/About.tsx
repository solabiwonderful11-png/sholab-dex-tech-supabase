import { Eye, Quote, Target } from "lucide-react";
import type { SiteSettings } from "@shared/types";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { mediaUrl } from "@/lib/supabase";

/**
 * About: the story, the mission/vision pair, and why-choose-us.
 *
 * The CEO block is what makes this read as a real company rather than a
 * template — a named person with a face and a point of view.
 */
export function About({ settings }: { settings: SiteSettings }) {
  const photo = mediaUrl(settings.ceoPhoto);

  return (
    <Section
      id="about"
      eyebrow="Who we are"
      title={settings.aboutHeading}
      align="left"
    >
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Story */}
        <div className="lg:col-span-7">
          <Reveal>
            <p className="text-base leading-relaxed text-ink-muted sm:text-lg">
              {settings.aboutBody}
            </p>
          </Reveal>

          {/* Mission / vision */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {settings.mission ? (
              <Reveal delay={60}>
                <div className="card h-full p-5">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500/12 text-brand-600 dark:text-brand-300">
                    <Target className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <h3 className="mt-3 text-sm font-bold">Our mission</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                    {settings.mission}
                  </p>
                </div>
              </Reveal>
            ) : null}

            {settings.vision ? (
              <Reveal delay={120}>
                <div className="card h-full p-5">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent-500/15 text-accent-600">
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <h3 className="mt-3 text-sm font-bold">Our vision</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                    {settings.vision}
                  </p>
                </div>
              </Reveal>
            ) : null}
          </div>

          {/* Why choose us */}
          {settings.whyChooseUs.length > 0 ? (
            <div className="mt-10">
              <h3 className="text-sm font-bold uppercase tracking-wider text-ink-subtle">
                Why businesses choose us
              </h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {settings.whyChooseUs.map((item, i) => (
                  <Reveal key={item.title} delay={Math.min(i, 6) * 45} as="li">
                    <div className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                      <div>
                        <p className="text-sm font-semibold">{item.title}</p>
                        <p className="mt-0.5 text-sm leading-relaxed text-ink-muted">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        {/* CEO card */}
        <div className="lg:col-span-5">
          <Reveal delay={80}>
            <div className="card sticky top-28 overflow-hidden">
              <div className="relative aspect-[4/3] bg-gradient-to-br from-brand-500/15 to-accent-500/15">
                {photo ? (
                  <img
                    src={photo}
                    alt={settings.ceoName}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center">
                    <span className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-brand-700 text-2xl font-bold text-white shadow-brand">
                      {settings.ceoName.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <Quote className="h-5 w-5 text-brand-500" aria-hidden="true" />
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {settings.ceoBio}
                </p>
                <div className="mt-5 border-t border-line pt-4">
                  <p className="text-sm font-bold">{settings.ceoName}</p>
                  <p className="text-xs text-ink-subtle">{settings.ceoTitle}</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
