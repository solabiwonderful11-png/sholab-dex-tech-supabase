import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_SECTIONS } from "@shared/constants";
import type { SiteSettings } from "@shared/types";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useQuote } from "@/hooks/useQuote";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const SECTION_IDS = NAV_SECTIONS.map((s) => s.id);

/**
 * Sticky header.
 *
 * Starts transparent over the hero and gains a glass background once the user
 * scrolls past it — so the hero reads as full-bleed on arrival, but the nav
 * stays legible over content further down.
 */
export function Nav({ settings }: { settings: SiteSettings }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useScrollSpy(SECTION_IDS);
  const { openQuote } = useQuote();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile drawer is open, so the page behind it
  // does not scroll away underneath the user.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "glass-strong shadow-md" : "bg-transparent",
      )}
    >
      <nav className="shell flex h-16 items-center justify-between gap-4 md:h-20">
        {/* Brand */}
        <button
          type="button"
          onClick={() => go("home")}
          className="flex items-center gap-2.5 text-left"
          aria-label={`${settings.companyName} — back to top`}
        >
          {settings.logo ? (
            <img
              src={settings.logo}
              alt=""
              className="h-9 w-9 rounded-xl object-cover"
              loading="eager"
            />
          ) : (
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 text-sm font-bold text-white shadow-brand">
              {settings.companyName.charAt(0)}
            </span>
          )}
          <span className="hidden text-sm font-bold tracking-tight sm:block">
            {settings.companyName}
          </span>
        </button>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_SECTIONS.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => go(s.id)}
                aria-current={active === s.id ? "true" : undefined}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-200",
                  active === s.id
                    ? "text-brand-600 dark:text-brand-300"
                    : "text-ink-muted hover:text-ink",
                )}
              >
                {s.label}
                {active === s.id ? (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand-500" />
                ) : null}
              </button>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden sm:inline-flex" />
          <button
            type="button"
            onClick={() => openQuote()}
            className="btn btn-primary hidden !px-4 !py-2.5 !text-sm md:inline-flex"
          >
            Get a Quote
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={cn(
          "overflow-hidden border-t border-line bg-surface transition-[max-height,opacity] duration-300 lg:hidden",
          open ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <ul className="shell flex flex-col gap-1 py-4">
          {NAV_SECTIONS.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => go(s.id)}
                className={cn(
                  "w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors",
                  active === s.id
                    ? "bg-brand-500/10 text-brand-600 dark:text-brand-300"
                    : "text-ink-muted hover:bg-surface-sunken",
                )}
              >
                {s.label}
              </button>
            </li>
          ))}
          <li className="mt-2 flex items-center justify-between gap-3 px-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
              Theme
            </span>
            <ThemeToggle />
          </li>
          <li className="mt-2 px-4 pb-2">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openQuote();
              }}
              className="btn btn-primary w-full"
            >
              Get a Free Quote
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}
