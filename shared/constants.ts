import type { ServiceCategory } from "./types";

/**
 * Site-wide constants that are NOT editable content.
 *
 * Anything the owner might reasonably want to change lives in the database and
 * is edited through /sholab. What stays here is structural: the three service
 * categories the schema constrains to, and the section anchors the nav links to.
 */

export const CATEGORIES: ServiceCategory[] = ["websites", "automation", "promotions"];

export const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  websites: "Websites",
  automation: "AI Automation",
  promotions: "Business Promotions",
};

/** One-line description of each category, used on the services tabs. */
export const CATEGORY_TAGLINES: Record<ServiceCategory, string> = {
  websites: "Fast, modern, mobile-first sites built to turn visitors into customers.",
  automation: "Let AI handle the repetitive work so you can focus on the business.",
  promotions: "Get in front of the right people and turn attention into revenue.",
};

/**
 * Section anchors. The nav, the footer and the scroll-spy all read from this
 * list, so adding a section means adding one entry here.
 */
export const NAV_SECTIONS = [
  { id: "home", label: "Home" },
  { id: "services", label: "Services" },
  { id: "portfolio", label: "Portfolio" },
  { id: "pricing", label: "Pricing" },
  { id: "about", label: "About" },
  { id: "testimonials", label: "Reviews" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
] as const;

export type NavSectionId = (typeof NAV_SECTIONS)[number]["id"];

/**
 * Build a wa.me link with a pre-filled message.
 * Strips anything that is not a digit so a number stored as "+234 816 978 1185"
 * still produces a valid link.
 */
export function whatsappLink(number: string, message?: string): string {
  const digits = (number || "").replace(/\D/g, "");
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** "₦80,000" / "~$55" → the pair shown on a pricing card. */
export function formatPrice(ngn: string, usd: string): string {
  if (ngn && usd) return `${ngn} · ${usd}`;
  return ngn || usd || "Contact us";
}
