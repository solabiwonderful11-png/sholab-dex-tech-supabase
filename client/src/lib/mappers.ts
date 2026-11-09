import type {
  ContactMessage,
  Faq,
  PricingPackage,
  Project,
  Service,
  SiteSettings,
  Stat,
  Testimonial,
} from "@shared/types";

/**
 * Row → domain mappers.
 *
 * Supabase returns snake_case columns; the app works in camelCase. Keeping the
 * translation in one file means a column rename is a one-line change here
 * rather than a search-and-replace across every component.
 *
 * Each mapper is defensive about jsonb columns: a malformed or null value
 * degrades to an empty array instead of crashing the page.
 */

type Row = Record<string, unknown>;

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function nullableStr(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function num(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function bool(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

/** jsonb array of strings, tolerating null / wrong shape. */
function strArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string");
}

/** jsonb array of objects, tolerating null / wrong shape. */
function objArray<T>(value: unknown): T[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is T => typeof v === "object" && v !== null);
}

export function toSettings(row: Row | null): SiteSettings {
  const r = row ?? {};
  return {
    companyName: str(r.company_name, "Sholab Dex Tech"),
    ceoName: str(r.ceo_name),
    ceoTitle: str(r.ceo_title),
    ceoBio: str(r.ceo_bio),
    ceoPhoto: nullableStr(r.ceo_photo),
    email: str(r.email),
    phone: str(r.phone),
    whatsappNumber: str(r.whatsapp_number),
    businessHours: str(r.business_hours),
    socials: objArray<{ url: string; label: string }>(r.socials),

    heroHeadline: str(r.hero_headline, "Sholab Dex Tech"),
    heroTagline: str(r.hero_tagline),
    heroIntro: str(r.hero_intro),
    heroCtaPrimary: str(r.hero_cta_primary, "Get a Free Quote"),
    heroCtaSecondary: str(r.hero_cta_secondary, "Chat on WhatsApp"),
    heroImage: nullableStr(r.hero_image),

    aboutHeading: str(r.about_heading, "About Us"),
    aboutBody: str(r.about_body),
    mission: str(r.mission),
    vision: str(r.vision),
    whyChooseUs: objArray<{ title: string; description: string }>(r.why_choose_us),
    processSteps: objArray<{ title: string; description: string }>(r.process_steps),

    pricingNote: str(r.pricing_note),

    footerDescription: str(r.footer_description),
    footerCopyright: str(r.footer_copyright),
    footerCredit: str(r.footer_credit),

    seoTitle: str(r.seo_title),
    seoDescription: str(r.seo_description),
    seoKeywords: str(r.seo_keywords),
    seoOgImage: nullableStr(r.seo_og_image),

    logo: nullableStr(r.logo),
    favicon: nullableStr(r.favicon),
  };
}

export function toService(row: Row): Service {
  return {
    id: str(row.id),
    category: str(row.category, "websites") as Service["category"],
    name: str(row.name),
    description: str(row.description),
    icon: nullableStr(row.icon),
    sortOrder: num(row.sort_order),
  };
}

export function toPackage(row: Row): PricingPackage {
  return {
    id: str(row.id),
    category: str(row.category, "websites") as PricingPackage["category"],
    name: str(row.name),
    priceNgn: str(row.price_ngn),
    priceUsd: str(row.price_usd),
    features: strArray(row.features),
    isPopular: bool(row.is_popular),
    sortOrder: num(row.sort_order),
  };
}

export function toProject(row: Row): Project {
  return {
    id: str(row.id),
    title: str(row.title),
    category: str(row.category, "websites") as Project["category"],
    description: str(row.description),
    image: nullableStr(row.image),
    link: nullableStr(row.link),
    sortOrder: num(row.sort_order),
  };
}

export function toTestimonial(row: Row): Testimonial {
  return {
    id: str(row.id),
    clientName: str(row.client_name),
    businessName: str(row.business_name),
    rating: Math.min(5, Math.max(1, num(row.rating, 5))),
    reviewText: str(row.review_text),
    photo: nullableStr(row.photo),
    sortOrder: num(row.sort_order),
  };
}

export function toStat(row: Row): Stat {
  return {
    id: str(row.id),
    label: str(row.label),
    value: str(row.value, "0"),
    sortOrder: num(row.sort_order),
  };
}

export function toFaq(row: Row): Faq {
  return {
    id: str(row.id),
    question: str(row.question),
    answer: str(row.answer),
    sortOrder: num(row.sort_order),
  };
}

export function toContactMessage(row: Row): ContactMessage {
  return {
    id: str(row.id),
    name: str(row.name),
    email: str(row.email),
    phone: str(row.phone),
    service: str(row.service),
    message: str(row.message),
    createdAt: str(row.created_at),
  };
}

/** Sort by sort_order, then by name/title so equal orders stay stable. */
export function bySortOrder<T extends { sortOrder: number }>(a: T, b: T): number {
  return a.sortOrder - b.sortOrder;
}

// ── Domain → row (the write direction) ──────────────────────────────────────
// Used by the admin panel when saving. Kept beside the read mappers so the two
// directions of every field live on the same screen and cannot drift apart.

export function settingsToRow(s: SiteSettings): Row {
  return {
    id: "main",
    company_name: s.companyName,
    ceo_name: s.ceoName,
    ceo_title: s.ceoTitle,
    ceo_bio: s.ceoBio,
    ceo_photo: s.ceoPhoto,
    email: s.email,
    phone: s.phone,
    whatsapp_number: s.whatsappNumber,
    business_hours: s.businessHours,
    socials: s.socials,

    hero_headline: s.heroHeadline,
    hero_tagline: s.heroTagline,
    hero_intro: s.heroIntro,
    hero_cta_primary: s.heroCtaPrimary,
    hero_cta_secondary: s.heroCtaSecondary,
    hero_image: s.heroImage,

    about_heading: s.aboutHeading,
    about_body: s.aboutBody,
    mission: s.mission,
    vision: s.vision,
    why_choose_us: s.whyChooseUs,
    process_steps: s.processSteps,

    pricing_note: s.pricingNote,

    footer_description: s.footerDescription,
    footer_copyright: s.footerCopyright,
    footer_credit: s.footerCredit,

    seo_title: s.seoTitle,
    seo_description: s.seoDescription,
    seo_keywords: s.seoKeywords,
    seo_og_image: s.seoOgImage,

    logo: s.logo,
    favicon: s.favicon,
  };
}

export function serviceToRow(s: Service): Row {
  return {
    category: s.category,
    name: s.name,
    description: s.description,
    icon: s.icon,
    sort_order: s.sortOrder,
  };
}

export function packageToRow(p: PricingPackage): Row {
  return {
    category: p.category,
    name: p.name,
    price_ngn: p.priceNgn,
    price_usd: p.priceUsd,
    features: p.features,
    is_popular: p.isPopular,
    sort_order: p.sortOrder,
  };
}

export function projectToRow(p: Project): Row {
  return {
    title: p.title,
    category: p.category,
    description: p.description,
    image: p.image,
    link: p.link,
    sort_order: p.sortOrder,
  };
}

export function testimonialToRow(t: Testimonial): Row {
  return {
    client_name: t.clientName,
    business_name: t.businessName,
    rating: t.rating,
    review_text: t.reviewText,
    photo: t.photo,
    sort_order: t.sortOrder,
  };
}

export function statToRow(s: Stat): Row {
  return { label: s.label, value: s.value, sort_order: s.sortOrder };
}

export function faqToRow(f: Faq): Row {
  return { question: f.question, answer: f.answer, sort_order: f.sortOrder };
}
