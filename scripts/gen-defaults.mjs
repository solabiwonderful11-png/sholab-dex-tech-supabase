/**
 * Generate `shared/defaults.ts` from the live Supabase content.
 *
 * The /sholab panel's "Reset to default" needs a copy of the shipped content to
 * restore. Rather than hand-maintaining a second copy of 46 services and 18
 * packages — which would drift the first time a price changed — this script
 * reads the current rows and emits them as a typed module.
 *
 * Run it whenever the shipped defaults change:
 *
 *   node scripts/gen-defaults.mjs
 *
 * It is a build-time tool only; nothing at runtime depends on it.
 */

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const URL_BASE = process.env.VITE_SUPABASE_URL || "https://suycnxrvnjhmjokxxbjx.supabase.co";
const KEY = process.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_RO66cKGx94aBw-kB43f9Mg_4W9-sX0d";

const TABLES = [
  "site_settings",
  "services",
  "pricing_packages",
  "projects",
  "testimonials",
  "stats",
  "faqs",
];

async function fetchTable(table) {
  const res = await fetch(`${URL_BASE}/rest/v1/${table}?select=*`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });
  if (!res.ok) throw new Error(`${table}: HTTP ${res.status}`);
  return res.json();
}

const data = {};
for (const t of TABLES) {
  data[t] = await fetchTable(t);
  console.log(`${t}: ${data[t].length} rows`);
}

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "..", "shared", "defaults.ts");

const banner = `// ─────────────────────────────────────────────────────────────────────────────
// GENERATED FILE — do not edit by hand.
//
// Produced by \`node scripts/gen-defaults.mjs\` from the live Supabase content.
// It is the snapshot the /sholab "Reset to default" button restores, so it must
// stay in step with supabase/seed.sql. Regenerate it after changing either.
// ─────────────────────────────────────────────────────────────────────────────
`;

const body = `${banner}
import type {
  Faq,
  PricingPackage,
  Project,
  Service,
  SiteSettings,
  Stat,
  Testimonial,
} from "./types";

/** The single site_settings row, as shipped. */
export const DEFAULT_SETTINGS: SiteSettings = ${JSON.stringify(
  mapSettings(data.site_settings[0]),
  null,
  2,
)} as SiteSettings;

export const DEFAULT_SERVICES: Omit<Service, "id">[] = ${JSON.stringify(
  data.services.map(mapService),
  null,
  2,
)};

export const DEFAULT_PACKAGES: Omit<PricingPackage, "id">[] = ${JSON.stringify(
  data.pricing_packages.map(mapPackage),
  null,
  2,
)};

export const DEFAULT_PROJECTS: Omit<Project, "id">[] = ${JSON.stringify(
  data.projects.map(mapProject),
  null,
  2,
)};

export const DEFAULT_TESTIMONIALS: Omit<Testimonial, "id">[] = ${JSON.stringify(
  data.testimonials.map(mapTestimonial),
  null,
  2,
)};

export const DEFAULT_STATS: Omit<Stat, "id">[] = ${JSON.stringify(
  data.stats.map(mapStat),
  null,
  2,
)};

export const DEFAULT_FAQS: Omit<Faq, "id">[] = ${JSON.stringify(
  data.faqs.map(mapFaq),
  null,
  2,
)};
`;

writeFileSync(out, body, "utf8");
console.log(`\nWrote ${out}`);

// ── row → domain mappers (mirror of client/src/lib/mappers.ts) ───────────────

function mapSettings(r = {}) {
  return {
    companyName: r.company_name ?? "",
    ceoName: r.ceo_name ?? "",
    ceoTitle: r.ceo_title ?? "",
    ceoBio: r.ceo_bio ?? "",
    ceoPhoto: r.ceo_photo ?? null,
    email: r.email ?? "",
    phone: r.phone ?? "",
    whatsappNumber: r.whatsapp_number ?? "",
    businessHours: r.business_hours ?? "",
    socials: r.socials ?? [],
    heroHeadline: r.hero_headline ?? "",
    heroTagline: r.hero_tagline ?? "",
    heroIntro: r.hero_intro ?? "",
    heroCtaPrimary: r.hero_cta_primary ?? "",
    heroCtaSecondary: r.hero_cta_secondary ?? "",
    heroImage: r.hero_image ?? null,
    aboutHeading: r.about_heading ?? "",
    aboutBody: r.about_body ?? "",
    mission: r.mission ?? "",
    vision: r.vision ?? "",
    whyChooseUs: r.why_choose_us ?? [],
    processSteps: r.process_steps ?? [],
    pricingNote: r.pricing_note ?? "",
    footerDescription: r.footer_description ?? "",
    footerCopyright: r.footer_copyright ?? "",
    footerCredit: r.footer_credit ?? "",
    seoTitle: r.seo_title ?? "",
    seoDescription: r.seo_description ?? "",
    seoKeywords: r.seo_keywords ?? "",
    seoOgImage: r.seo_og_image ?? null,
    logo: r.logo ?? null,
    favicon: r.favicon ?? null,
  };
}

function mapService(r) {
  return {
    category: r.category,
    name: r.name,
    description: r.description ?? "",
    icon: r.icon ?? null,
    sortOrder: r.sort_order ?? 0,
  };
}

function mapPackage(r) {
  return {
    category: r.category,
    name: r.name,
    priceNgn: r.price_ngn ?? "",
    priceUsd: r.price_usd ?? "",
    features: r.features ?? [],
    isPopular: r.is_popular ?? false,
    sortOrder: r.sort_order ?? 0,
  };
}

function mapProject(r) {
  return {
    title: r.title,
    category: r.category,
    description: r.description ?? "",
    image: r.image ?? null,
    link: r.link ?? null,
    sortOrder: r.sort_order ?? 0,
  };
}

function mapTestimonial(r) {
  return {
    clientName: r.client_name,
    businessName: r.business_name ?? "",
    rating: r.rating ?? 5,
    reviewText: r.review_text ?? "",
    photo: r.photo ?? null,
    sortOrder: r.sort_order ?? 0,
  };
}

function mapStat(r) {
  return {
    label: r.label,
    value: r.value ?? "0",
    sortOrder: r.sort_order ?? 0,
  };
}

function mapFaq(r) {
  return {
    question: r.question,
    answer: r.answer ?? "",
    sortOrder: r.sort_order ?? 0,
  };
}
