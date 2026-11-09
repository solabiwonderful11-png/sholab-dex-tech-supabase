import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Faq as FaqItem } from "@shared/types";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * FAQ accordion.
 *
 * A button + panel pair rather than <details>/<summary>, because the panel is
 * animated and <details> cannot be transitioned reliably across browsers. The
 * button carries aria-expanded and aria-controls, so the semantics a screen
 * reader needs are still there.
 */
export function Faq({ faqs }: { faqs: FaqItem[] }) {
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null);

  if (faqs.length === 0) return null;

  return (
    <Section
      id="faq"
      eyebrow="Questions"
      title="Frequently asked questions"
      intro="Everything people usually ask before getting started. Still unsure? Message us on WhatsApp."
      tone="sunken"
    >
      <div className="mx-auto max-w-3xl space-y-3">
        {faqs.map((f, i) => {
          const isOpen = open === f.id;
          return (
            <Reveal key={f.id} delay={Math.min(i, 6) * 40}>
              <div
                className={cn(
                  "card overflow-hidden transition-colors",
                  isOpen && "border-brand-500/50",
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : f.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${f.id}`}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="text-sm font-semibold leading-snug">{f.question}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-ink-subtle transition-transform duration-300",
                      isOpen && "rotate-180 text-brand-500",
                    )}
                    aria-hidden="true"
                  />
                </button>

                <div id={`faq-panel-${f.id}`} hidden={!isOpen} className="px-5 pb-5">
                  <p className="text-sm leading-relaxed text-ink-muted">{f.answer}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
