import { Quote } from "lucide-react";
import type { Testimonial } from "@shared/types";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Stars } from "@/components/ui/Stars";
import { mediaUrl } from "@/lib/supabase";

/**
 * Client reviews.
 *
 * A masonry-style column layout rather than a fixed grid: reviews vary a lot in
 * length, and equal-height rows would leave large gaps under the short ones.
 */
export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <Section
      id="testimonials"
      eyebrow="Client reviews"
      title="What our clients say"
      intro="Real feedback from businesses we have worked with."
    >
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {testimonials.map((t, i) => (
          <Reveal
            key={t.id}
            delay={Math.min(i, 6) * 60}
            className="mb-5 break-inside-avoid"
          >
            <TestimonialCard testimonial={t} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const photo = mediaUrl(testimonial.photo);

  return (
    <figure className="card card-hover p-6">
      <Quote className="h-5 w-5 text-brand-500/60" aria-hidden="true" />

      <blockquote className="mt-3 text-sm leading-relaxed text-ink-muted">
        {testimonial.reviewText}
      </blockquote>

      <Stars rating={testimonial.rating} className="mt-4" />

      <figcaption className="mt-4 flex items-center gap-3 border-t border-line pt-4">
        {photo ? (
          <img
            src={photo}
            alt=""
            loading="lazy"
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-brand-700 text-xs font-bold text-white">
            {testimonial.clientName.charAt(0)}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{testimonial.clientName}</p>
          {testimonial.businessName ? (
            <p className="truncate text-xs text-ink-subtle">{testimonial.businessName}</p>
          ) : null}
        </div>
      </figcaption>
    </figure>
  );
}
