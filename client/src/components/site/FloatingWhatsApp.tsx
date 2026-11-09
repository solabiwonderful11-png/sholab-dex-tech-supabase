import { useEffect, useState } from "react";
import { ArrowUp, MessageCircle } from "lucide-react";
import { whatsappLink } from "@shared/constants";
import type { SiteSettings } from "@shared/types";
import { cn } from "@/lib/utils";

/**
 * Floating WhatsApp button, plus a back-to-top control.
 *
 * The WhatsApp button is the site's primary conversion path, so it stays
 * reachable from anywhere on the page. The pulse ring is what draws the eye
 * without being a modal or a banner — it is noticeable but never blocks
 * content, and it stops after a few cycles so it does not become noise.
 */
export function FloatingWhatsApp({ settings }: { settings: SiteSettings }) {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 900);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="no-print fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {/* Back to top — only once the visitor is deep in the page. */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={cn(
          "grid h-10 w-10 place-items-center rounded-full border border-line bg-surface-raised text-ink-muted shadow-md transition-all duration-300 hover:text-brand-500",
          showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
        )}
      >
        <ArrowUp className="h-4 w-4" aria-hidden="true" />
      </button>

      <a
        href={whatsappLink(
          settings.whatsappNumber,
          `Hi ${settings.companyName}, I'd like to know more about your services.`,
        )}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="group relative grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_18px_44px_-14px_rgba(37,211,102,0.7)] transition-transform duration-300 hover:scale-105"
      >
        {/* Pulse ring — decorative, so it is hidden from assistive tech. */}
        <span
          className="absolute inset-0 animate-[pulse-ring_2.4s_var(--ease-soft)_infinite] rounded-full bg-[#25d366]"
          aria-hidden="true"
        />
        <MessageCircle className="relative h-6 w-6" aria-hidden="true" />

        {/* Tooltip on hover, desktop only. */}
        <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-ink-inverse opacity-0 transition-opacity duration-200 group-hover:opacity-100 lg:block">
          Chat with us
        </span>
      </a>
    </div>
  );
}
