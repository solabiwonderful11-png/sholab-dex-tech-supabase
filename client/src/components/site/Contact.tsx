import { useState, type FormEvent, type ReactNode } from "react";
import { CheckCircle2, Clock, Loader2, Mail, MessageCircle, Phone, Send } from "lucide-react";
import { whatsappLink } from "@shared/constants";
import type { SiteSettings } from "@shared/types";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { useSubmitContact } from "@/hooks/useSiteContent";

/**
 * Contact section: details on the left, form on the right.
 *
 * The form writes to Supabase, and the WhatsApp button is offered alongside it
 * because for this business WhatsApp is the channel people actually use — the
 * form is the fallback, not the primary path.
 */
export function Contact({ settings }: { settings: SiteSettings }) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submit = useSubmitContact();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      await submit.mutateAsync({
        name: String(data.get("name") ?? "").trim(),
        email: String(data.get("email") ?? "").trim(),
        phone: String(data.get("phone") ?? "").trim(),
        service: String(data.get("service") ?? "").trim(),
        message: String(data.get("message") ?? "").trim(),
      });
      form.reset();
      setSent(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try WhatsApp instead.",
      );
    }
  }

  return (
    <Section
      id="contact"
      eyebrow="Get in touch"
      title="Let's talk about your project"
      intro="Tell us what you need and we will come back with clear next steps and a quote."
    >
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Details */}
        <div className="lg:col-span-5">
          <Reveal>
            <div className="space-y-3">
              <ContactRow
                icon={<MessageCircle className="h-4 w-4" />}
                label="WhatsApp (fastest)"
                value={settings.phone}
                href={whatsappLink(settings.whatsappNumber, `Hi ${settings.companyName}!`)}
              />
              <ContactRow
                icon={<Phone className="h-4 w-4" />}
                label="Phone"
                value={settings.phone}
                href={`tel:${settings.phone.replace(/\s/g, "")}`}
              />
              <ContactRow
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                value={settings.email}
                href={`mailto:${settings.email}`}
              />
              {settings.businessHours ? (
                <ContactRow
                  icon={<Clock className="h-4 w-4" />}
                  label="Business hours"
                  value={settings.businessHours}
                />
              ) : null}
            </div>
          </Reveal>

          <Reveal delay={80}>
            <a
              href={whatsappLink(
                settings.whatsappNumber,
                `Hi ${settings.companyName}, I'd like a free quote.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp mt-6 w-full"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Chat on WhatsApp
            </a>
          </Reveal>
        </div>

        {/* Form */}
        <div className="lg:col-span-7">
          <Reveal delay={60}>
            <div className="card p-6 sm:p-8">
              {sent ? (
                <div className="py-10 text-center">
                  <CheckCircle2
                    className="mx-auto h-12 w-12 text-brand-500"
                    aria-hidden="true"
                  />
                  <h3 className="mt-4 text-lg font-bold">Message sent</h3>
                  <p className="mx-auto mt-2 max-w-sm text-sm text-ink-muted">
                    Thanks for reaching out. We will get back to you shortly. For a faster
                    reply, message us on WhatsApp.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="btn btn-ghost mt-6"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label" htmlFor="c-name">
                        Your name *
                      </label>
                      <input
                        id="c-name"
                        name="name"
                        required
                        maxLength={120}
                        className="field"
                        placeholder="e.g. Adaeze Okafor"
                        autoComplete="name"
                      />
                    </div>
                    <div>
                      <label className="label" htmlFor="c-phone">
                        Phone / WhatsApp
                      </label>
                      <input
                        id="c-phone"
                        name="phone"
                        maxLength={40}
                        className="field"
                        placeholder="+234 800 000 0000"
                        autoComplete="tel"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label" htmlFor="c-email">
                      Email
                    </label>
                    <input
                      id="c-email"
                      name="email"
                      type="email"
                      maxLength={160}
                      className="field"
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </div>

                  <div>
                    <label className="label" htmlFor="c-service">
                      What do you need?
                    </label>
                    <select id="c-service" name="service" className="field" defaultValue="">
                      <option value="">Select a service (optional)</option>
                      <option value="websites">Website</option>
                      <option value="automation">AI Automation</option>
                      <option value="promotions">Business Promotion</option>
                      <option value="other">Something else</option>
                    </select>
                  </div>

                  <div>
                    <label className="label" htmlFor="c-message">
                      Tell us about your project *
                    </label>
                    <textarea
                      id="c-message"
                      name="message"
                      required
                      rows={5}
                      maxLength={4000}
                      className="field resize-y"
                      placeholder="What are you trying to achieve? Any deadline or budget in mind?"
                    />
                  </div>

                  {error ? (
                    <p
                      role="alert"
                      className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400"
                    >
                      {error}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={submit.isPending}
                    className="btn btn-primary w-full"
                  >
                    {submit.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" aria-hidden="true" />
                        Send message
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-ink-subtle">
                    We only use your details to reply to this enquiry.
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="card flex items-center gap-4 p-4 transition-colors hover:border-brand-500/50">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-500/12 text-brand-600 dark:text-brand-300">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
          {label}
        </p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  );

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block">
      {inner}
    </a>
  ) : (
    inner
  );
}
