// ── Domain types ────────────────────────────────────────────────────────────
// These mirror the Supabase tables in supabase/migrations/0001_init.sql.
// The database uses snake_case; the app uses camelCase. The mappers in
// client/src/lib/mappers.ts are the single place that translates between them,
// so a column rename only ever touches one file.

export type ServiceCategory = "websites" | "automation" | "promotions";

export interface SocialLink {
  url: string;
  label: string;
}

export interface WhyChooseUsItem {
  title: string;
  description: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface SiteSettings {
  companyName: string;
  ceoName: string;
  ceoTitle: string;
  ceoBio: string;
  ceoPhoto: string | null;
  email: string;
  phone: string;
  whatsappNumber: string;
  businessHours: string;
  socials: SocialLink[];

  heroHeadline: string;
  heroTagline: string;
  heroIntro: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  heroImage: string | null;

  aboutHeading: string;
  aboutBody: string;
  mission: string;
  vision: string;
  whyChooseUs: WhyChooseUsItem[];
  processSteps: ProcessStep[];

  pricingNote: string;

  footerDescription: string;
  footerCopyright: string;
  footerCredit: string;

  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  seoOgImage: string | null;

  logo: string | null;
  favicon: string | null;
}

export interface Service {
  id: string;
  category: ServiceCategory;
  name: string;
  description: string;
  icon: string | null;
  sortOrder: number;
}

export interface PricingPackage {
  id: string;
  category: ServiceCategory;
  name: string;
  priceNgn: string;
  priceUsd: string;
  features: string[];
  isPopular: boolean;
  sortOrder: number;
}

export interface Project {
  id: string;
  title: string;
  category: ServiceCategory;
  description: string;
  image: string | null;
  link: string | null;
  sortOrder: number;
}

export interface Testimonial {
  id: string;
  clientName: string;
  businessName: string;
  rating: number;
  reviewText: string;
  photo: string | null;
  sortOrder: number;
}

export interface Stat {
  id: string;
  label: string;
  value: string;
  sortOrder: number;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  createdAt: string;
}

/** Everything the public site needs, fetched in one round of parallel queries. */
export interface SiteContent {
  settings: SiteSettings;
  services: Service[];
  packages: PricingPackage[];
  projects: Project[];
  testimonials: Testimonial[];
  stats: Stat[];
  faqs: Faq[];
}

/** A new enquiry, before the database assigns it an id and timestamp. */
export type NewContactMessage = Omit<ContactMessage, "id" | "createdAt">;
