import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { CATEGORY_LABELS, whatsappLink } from "@shared/constants";
import type { PricingPackage, ServiceCategory, SiteSettings } from "@shared/types";
import { cn } from "@/lib/utils";

const SEEN_KEY = "sholab-quote-popup-seen";

/**
 * Smart quote popup.
 *
 * Appears once per session after the visitor has shown real interest — either
 * they have scrolled a good way down the page, or they have been on it long
 * enough to be reading. Firing it on load would be the classic mistake: it
 * interrupts before there is anything to interrupt.
 *
 * The "smart" part is that it builds the WhatsApp message from what the visitor
 * picks, so the owner receives a pre-qualified enquiry instead of "hi".
 */
export function QuotePopup({
  settings,
  packages,
}: {
  settings: SiteSettings;
  packages: PricingPackage[];
}) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<ServiceCategory>("websites");
  const [packageName, setPackageName] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");

  // Trigger: 45% scrolled, or 25 seconds on the page. Whichever comes first.
  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) return;

    let done = false;
    const show = () => {
      if (done) return;
      done = true;
      setOpen(true);
      sessionStorage.setItem(SEEN_KEY, "1");
      cleanup();
    };

    const onScroll = () => {
      const scrolled =
        window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
      if (scrolled > 0.45) show();
    };

    const timer = window.setTimeout(show, 25_000);

    function cleanup() {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return cleanup;
  }, []);

  // Escape closes it, and body scroll is locked while it is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const options = packages.filter((p) => p.category === category);

  const message = [
    `Hi ${settings.companyName}, I'd like a quote.`,
    `Service: ${CATEGORY_LABELS[category]}`,
    packageName ? `Package: ${packageName}` : null,
    budget ? `Budget: ${budget}` : null,
    timeline ? `Timeline: ${timeline}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quote-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        onClick={() => setOpen(false)}
        className="absolute inset-0 cursor-default bg-black/50 backdrop-blur-sm"
      />

      <div className="glass-strong relative w-full max-w-lg animate-[reveal_0.5s_var(--ease-premium)_both] rounded-3xl p-6 sm:p-7">
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-ink-subtle transition-colors hover:bg-surface-sunken hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>

        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#25d366]/15 text-[#25d366]">
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
        </span>

        <h2 id="quote-title" className="mt-4 text-lg font-bold">
          Get a free quote in 30 seconds
        </h2>
        <p className="mt-1.5 text-sm text-ink-muted">
          Answer three quick questions and we will open WhatsApp with your details ready to
          send.
        </p>

        <div className="mt-5 space-y-4">
          {/* Category */}
          <div>
            <span className="label">What do you need?</span>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(CATEGORY_LABELS) as ServiceCategory[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setCategory(c);
                    setPackageName("");
                  }}
                  aria-pressed={category === c}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-xs font-semibold transition-colors",
                    category === c
                      ? "bg-brand-500 text-white"
                      : "border border-line text-ink-muted hover:text-ink",
                  )}
                >
                  {CATEGORY_LABELS[c]}
                </button>
              ))}
            </div>
          </div>

          {/* Package */}
          {options.length > 0 ? (
            <div>
              <label className="label" htmlFor="q-package">
                Which package?
              </label>
              <select
                id="q-package"
                className="field"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
              >
                <option value="">Not sure yet</option>
                {options.map((p) => (
                  <option key={p.id} value={`${p.name} (${p.priceNgn})`}>
                    {p.name} — {p.priceNgn}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="q-budget">
                Budget
              </label>
              <select
                id="q-budget"
                className="field"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              >
                <option value="">Prefer not to say</option>
                <option value="Under ₦100,000">Under ₦100,000</option>
                <option value="₦100,000 – ₦300,000">₦100,000 – ₦300,000</option>
                <option value="₦300,000 – ₦600,000">₦300,000 – ₦600,000</option>
                <option value="Above ₦600,000">Above ₦600,000</option>
              </select>
            </div>
            <div>
              <label className="label" htmlFor="q-timeline">
                Timeline
              </label>
              <select
                id="q-timeline"
                className="field"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
              >
                <option value="">Flexible</option>
                <option value="As soon as possible">As soon as possible</option>
                <option value="Within 2 weeks">Within 2 weeks</option>
                <option value="Within a month">Within a month</option>
                <option value="Just planning">Just planning</option>
              </select>
            </div>
          </div>
        </div>

        <a
          href={whatsappLink(settings.whatsappNumber, message)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
          className="btn btn-whatsapp mt-6 w-full"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Send on WhatsApp
        </a>

        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mt-3 w-full text-center text-xs text-ink-subtle transition-colors hover:text-ink"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
