import type { PricingPackage, Service, ServiceCategory } from "@shared/types";
import { CATEGORY_LABELS } from "@shared/constants";

/**
 * The WhatsApp smart-message builder.
 *
 * The brief specifies the pre-filled message word for word, so it lives here as
 * a single function rather than being assembled inline in each component. Every
 * WhatsApp button on the site funnels through this, which is what guarantees the
 * owner always receives the same, parseable shape of enquiry.
 *
 *   Hi Sholab Dex Tech, my name is [NAME]. I am interested in
 *   [SERVICE] - [PACKAGE/PRICING]. Please send me more details and a quote.
 *
 * When the visitor skips the name, the greeting drops the "my name is" clause
 * instead of leaving a blank in the sentence.
 */

export interface QuoteSelection {
  /** The visitor's name. Empty or whitespace-only means "not given". */
  name?: string;
  /** The specific service they picked, e.g. "Business & Corporate Websites". */
  service?: string;
  /** The package they picked, e.g. "Business Website (₦180,000 / ~$120)". */
  packageLabel?: string;
}

/** Trim and collapse internal whitespace so the message stays on one line. */
function clean(value: string | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

/**
 * Build the exact message the brief asks for.
 *
 * `companyName` is passed in rather than hard-coded because the owner can rename
 * the business from /sholab, and the message must follow.
 */
export function buildQuoteMessage(
  companyName: string,
  selection: QuoteSelection,
): string {
  const company = clean(companyName) || "Sholab Dex Tech";
  const name = clean(selection.name);
  const service = clean(selection.service);
  const packageLabel = clean(selection.packageLabel);

  // "Business Website (₦180,000 / ~$120)" — the price is part of the label so
  // the owner sees the figure without opening the site.
  const interest = [service, packageLabel].filter(Boolean).join(" - ");

  const greeting = name
    ? `Hi ${company}, my name is ${name}.`
    : `Hi ${company},`;

  const middle = interest
    ? `I am interested in ${interest}.`
    : "I am interested in your services.";

  return `${greeting} ${middle} Please send me more details and a quote.`;
}

/** "Business Website" + "₦180,000" + "~$120" → "Business Website (₦180,000 / ~$120)". */
export function packageLabel(pkg: PricingPackage): string {
  const price = [pkg.priceNgn, pkg.priceUsd].filter(Boolean).join(" / ");
  return price ? `${pkg.name} (${price})` : pkg.name;
}

/**
 * The service label used in the message.
 *
 * A specific service is preferred; when the visitor only chose a category (for
 * example from the nav's "Get a Quote" button) the category name is used, so the
 * message is never left with an empty slot.
 */
export function serviceLabel(
  service: Service | undefined,
  category: ServiceCategory | undefined,
): string {
  if (service) return service.name;
  if (category) return CATEGORY_LABELS[category];
  return "";
}
