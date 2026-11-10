import { Mail, MapPin, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { NAV_SECTIONS } from "@shared/constants";
import type { Service, SiteSettings } from "@shared/types";
import { SocialIcon } from "@/components/icons/social";
import { useQuote } from "@/hooks/useQuote";

/**
 * Footer.
 *
 * Carries the full navigation again plus the contact details, because a visitor
 * who has read to the bottom is the most likely to act — making them scroll
 * back up to find a phone number would waste that intent.
 */
export function Footer({
  settings,
  services,
}: {
  settings: SiteSettings;
  services: Service[];
}) {
  const year = new Date().getFullYear();
  const { openQuote } = useQuote();
  // A short, representative slice of services rather than all 46.
  const highlights = services.slice(0, 6);

  // The control panel path is configurable, so the footer link follows it.
  const adminPath = `/${import.meta.env.VITE_ADMIN_PATH || "sholab"}`;

  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <footer className="border-t border-line bg-surface-sunken">
      <div className="shell py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2.5">
              {settings.logo ? (
                <img
                  src={settings.logo}
                  alt=""
                  className="h-9 w-9 rounded-xl object-cover"
                  loading="lazy"
                />
              ) : (
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 text-sm font-bold text-white">
                  {settings.companyName.charAt(0)}
                </span>
              )}
              <span className="text-sm font-bold">{settings.companyName}</span>
            </div>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-muted">
              {settings.footerDescription}
            </p>

            {settings.socials.length > 0 ? (
              <ul className="mt-5 flex flex-wrap gap-2">
                {settings.socials.map((s) => (
                  <li key={`${s.label}-${s.url}`}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      title={s.label}
                      className="grid h-9 w-9 place-items-center rounded-full border border-line bg-surface-raised text-ink-muted transition-colors hover:border-brand-500 hover:text-brand-500"
                    >
                      <SocialIcon label={s.label} className="h-4 w-4" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* Navigation */}
          <nav className="lg:col-span-2" aria-label="Footer">
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink-subtle">
              Explore
            </h2>
            <ul className="mt-4 space-y-2.5">
              {NAV_SECTIONS.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => go(s.id)}
                    className="text-sm text-ink-muted transition-colors hover:text-brand-500"
                  >
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <div className="lg:col-span-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink-subtle">
              Popular services
            </h2>
            <ul className="mt-4 space-y-2.5">
              {highlights.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => go("services")}
                    className="text-left text-sm text-ink-muted transition-colors hover:text-brand-500"
                  >
                    {s.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink-subtle">
              Contact
            </h2>
            <ul className="mt-4 space-y-3">
              <li>
                <button
                  type="button"
                  onClick={() => openQuote()}
                  className="flex items-start gap-2.5 text-sm text-ink-muted transition-colors hover:text-brand-500"
                >
                  <MessageCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>WhatsApp us</span>
                </button>
              </li>
              <li>
                <a
                  href={`tel:${settings.phone.replace(/\s/g, "")}`}
                  className="flex items-start gap-2.5 text-sm text-ink-muted transition-colors hover:text-brand-500"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{settings.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-start gap-2.5 text-sm text-ink-muted transition-colors hover:text-brand-500"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="break-all">{settings.email}</span>
                </a>
              </li>
              {settings.businessHours ? (
                <li className="flex items-start gap-2.5 text-sm text-ink-muted">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{settings.businessHours}</span>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 sm:flex-row">
          <p className="text-xs text-ink-subtle">
            {settings.footerCopyright ||
              `© ${year} ${settings.companyName}. All rights reserved.`}
          </p>
          <div className="flex items-center gap-4">
            <p className="text-xs text-ink-subtle">{settings.footerCredit}</p>
            {/*
              Discreet link to the control panel (brief 7). Deliberately quiet:
              it is for the owner, not for visitors, so it sits at the very end
              of the footer in the smallest type on the page.
            */}
            <a
              href={adminPath}
              className="inline-flex items-center gap-1 text-xs text-ink-subtle transition-colors hover:text-brand-500"
              title="Site control panel"
            >
              <ShieldCheck className="h-3 w-3" aria-hidden="true" />
              Site Control
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
