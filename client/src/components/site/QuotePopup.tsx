import { useEffect, useMemo, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { CATEGORIES, CATEGORY_LABELS, whatsappLink } from "@shared/constants";
import type {
  PricingPackage,
  Service,
  ServiceCategory,
  SiteSettings,
} from "@shared/types";
import { buildQuoteMessage, packageLabel } from "@/lib/quote";
import { useQuote } from "@/hooks/useQuote";
import { cn } from "@/lib/utils";

/**
 * The WhatsApp smart-quote popup.
 *
 * Built to the brief's Section 4 exactly:
 *
 *   1. "Your Name" — one text input, required
 *   2. Service selector — the services, grouped by the three categories
 *   3. Package / pricing selector — the tiers for the chosen category
 *   4. "Send on WhatsApp"
 *
 * and it opens WhatsApp with:
 *
 *   Hi Sholab Dex Tech, my name is [NAME]. I am interested in
 *   [SERVICE] - [PACKAGE/PRICING]. Please send me more details and a quote.
 *
 * The name is required by the form, but the message builder still handles an
 * empty name gracefully (it drops the "my name is" clause) so a visitor who
 * clears the field after typing never sends a broken sentence.
 *
 * Every WhatsApp button on the site opens this popup through `useQuote()`, which
 * is what makes the name capture universal — including the floating button.
 */
export function QuotePopup({
  settings,
  services,
  packages,
}: {
  settings: SiteSettings;
  services: Service[];
  packages: PricingPackage[];
}) {
  const { isOpen, request, closeQuote } = useQuote();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<ServiceCategory>("websites");
  const [serviceName, setServiceName] = useState("");
  const [packageId, setPackageId] = useState("");
  const [touched, setTouched] = useState(false);

  /**
   * Apply the caller's pre-selection each time the popup opens.
   *
   * This runs on `isOpen` rather than on mount because the popup stays mounted
   * between openings — without the reset, a visitor who opened it from the
   * "E-commerce Store" card would see that selection again when they later
   * clicked the nav's generic "Get a Quote".
   */
  useEffect(() => {
    if (!isOpen) return;

    const pkg = request.packageId
      ? packages.find((p) => p.id === request.packageId)
      : undefined;

    // A package implies its category, so the tabs stay in sync with the card
    // the visitor actually clicked.
    const nextCategory = pkg?.category ?? request.category ?? "websites";

    setCategory(nextCategory);
    setServiceName(request.serviceName ?? "");
    setPackageId(pkg?.id ?? "");
    setTouched(false);
  }, [isOpen, request, packages]);

  // Escape closes it, and body scroll is locked while it is open.
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeQuote();
    };

    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [isOpen, closeQuote]);

  const categoryServices = useMemo(
    () => services.filter((s) => s.category === category),
    [services, category],
  );

  const categoryPackages = useMemo(
    () => packages.filter((p) => p.category === category),
    [packages, category],
  );

  if (!isOpen) return null;

  const selectedPackage = categoryPackages.find((p) => p.id === packageId);
  const nameMissing = touched && name.trim().length === 0;

  const message = buildQuoteMessage(settings.companyName, {
    name,
    service: serviceName || CATEGORY_LABELS[category],
    packageLabel: selectedPackage ? packageLabel(selectedPackage) : "",
  });

  const href = whatsappLink(settings.whatsappNumber, message);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quote-title"
    >
      {/* Backdrop — a button so a click outside closes it, as the brief asks. */}
      <button
        type="button"
        aria-label="Close"
        onClick={closeQuote}
        className="absolute inset-0 cursor-default bg-black/50 backdrop-blur-sm"
      />

      <div className="glass-strong relative max-h-[92vh] w-full max-w-lg animate-[reveal_0.5s_var(--ease-premium)_both] overflow-y-auto rounded-3xl p-6 sm:p-7">
        <button
          type="button"
          onClick={closeQuote}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-ink-subtle transition-colors hover:bg-surface-sunken hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>

        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#25d366]/15 text-[#25d366]">
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
        </span>

        <h2 id="quote-title" className="mt-4 text-lg font-bold">
          Get a quote on WhatsApp
        </h2>
        <p className="mt-1.5 text-sm text-ink-muted">
          Tell us who you are and what you need — we will open WhatsApp with your
          message ready to send.
        </p>

        <form
          className="mt-5 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setTouched(true);
            if (!name.trim()) return;
            window.open(href, "_blank", "noopener,noreferrer");
            closeQuote();
          }}
        >
          {/* 1. Name — required, per the brief. */}
          <div>
            <label className="label" htmlFor="q-name">
              Your Name *
            </label>
            <input
              id="q-name"
              name="name"
              required
              maxLength={80}
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched(true)}
              aria-invalid={nameMissing || undefined}
              aria-describedby={nameMissing ? "q-name-error" : undefined}
              className={cn("field", nameMissing && "border-red-500/60")}
              placeholder="e.g. John"
            />
            {nameMissing ? (
              <p id="q-name-error" role="alert" className="mt-1.5 text-xs text-red-500">
                Please enter your name so we know who we are talking to.
              </p>
            ) : null}
          </div>

          {/* 2. Service — grouped by the three categories. */}
          <div>
            <span className="label">What do you need?</span>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setCategory(c);
                    setServiceName("");
                    setPackageId("");
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

            <label className="sr-only" htmlFor="q-service">
              Service
            </label>
            <select
              id="q-service"
              className="field mt-2.5"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
            >
              <option value="">
                {CATEGORY_LABELS[category]} — not sure which one
              </option>
              {categoryServices.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Package / pricing for the chosen category. */}
          <div>
            <label className="label" htmlFor="q-package">
              Package / Pricing
            </label>
            <select
              id="q-package"
              className="field"
              value={packageId}
              onChange={(e) => setPackageId(e.target.value)}
            >
              <option value="">Not sure yet — send me options</option>
              {categoryPackages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.priceNgn}
                  {p.priceUsd ? ` / ${p.priceUsd}` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Live preview of exactly what will be sent. */}
          <div className="rounded-xl border border-line bg-surface-sunken/70 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-subtle">
              Message preview
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">{message}</p>
          </div>

          {/* 4. Send. */}
          <button type="submit" className="btn btn-whatsapp w-full">
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Send on WhatsApp
          </button>
        </form>

        <button
          type="button"
          onClick={closeQuote}
          className="mt-3 w-full text-center text-xs text-ink-subtle transition-colors hover:text-ink"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
