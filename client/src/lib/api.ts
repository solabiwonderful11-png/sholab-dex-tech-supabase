import type {
  ContactMessage,
  Faq,
  NewContactMessage,
  PricingPackage,
  Project,
  Service,
  SiteContent,
  SiteSettings,
  Stat,
  Testimonial,
} from "@shared/types";
import { MEDIA_BUCKET, getSupabase } from "./supabase";
import {
  DEFAULT_FAQS,
  DEFAULT_PACKAGES,
  DEFAULT_PROJECTS,
  DEFAULT_SERVICES,
  DEFAULT_SETTINGS,
  DEFAULT_STATS,
  DEFAULT_TESTIMONIALS,
} from "@shared/defaults";
import {
  bySortOrder,
  faqToRow,
  packageToRow,
  projectToRow,
  serviceToRow,
  settingsToRow,
  statToRow,
  testimonialToRow,
  toContactMessage,
  toFaq,
  toPackage,
  toProject,
  toService,
  toSettings,
  toStat,
  toTestimonial,
} from "./mappers";
import { slugify } from "./utils";

/**
 * Every read and write the app performs, in one place.
 *
 * Components never touch the Supabase client directly. That keeps the query
 * shapes, the ordering rules and the error normalisation in a single file, and
 * means swapping the backend again would only touch this module.
 */

/**
 * Normalise a Supabase error into a plain Error with a readable message.
 * PostgREST returns useful text (e.g. a policy violation) that would otherwise
 * be swallowed by a generic "something went wrong".
 */
function fail(context: string, error: { message?: string } | null): never {
  throw new Error(`${context}: ${error?.message ?? "unknown error"}`);
}

// ── Reads ────────────────────────────────────────────────────────────────────

export async function fetchSettings(): Promise<SiteSettings> {
  const { data, error } = await getSupabase()
    .from("site_settings")
    .select("*")
    .eq("id", "main")
    .maybeSingle();
  if (error) fail("Could not load site settings", error);
  return toSettings(data);
}

export async function fetchServices(): Promise<Service[]> {
  const { data, error } = await getSupabase()
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) fail("Could not load services", error);
  return (data ?? []).map(toService).sort(bySortOrder);
}

export async function fetchPackages(): Promise<PricingPackage[]> {
  const { data, error } = await getSupabase()
    .from("pricing_packages")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) fail("Could not load pricing", error);
  return (data ?? []).map(toPackage).sort(bySortOrder);
}

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await getSupabase()
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) fail("Could not load projects", error);
  return (data ?? []).map(toProject).sort(bySortOrder);
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await getSupabase()
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) fail("Could not load testimonials", error);
  return (data ?? []).map(toTestimonial).sort(bySortOrder);
}

export async function fetchStats(): Promise<Stat[]> {
  const { data, error } = await getSupabase()
    .from("stats")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) fail("Could not load stats", error);
  return (data ?? []).map(toStat).sort(bySortOrder);
}

export async function fetchFaqs(): Promise<Faq[]> {
  const { data, error } = await getSupabase()
    .from("faqs")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) fail("Could not load FAQs", error);
  return (data ?? []).map(toFaq).sort(bySortOrder);
}

/**
 * Everything the public site needs.
 *
 * The seven queries run in parallel — they are independent, so serialising them
 * would make the page wait for seven round trips instead of one.
 */
export async function fetchSiteContent(): Promise<SiteContent> {
  const [settings, services, packages, projects, testimonials, stats, faqs] =
    await Promise.all([
      fetchSettings(),
      fetchServices(),
      fetchPackages(),
      fetchProjects(),
      fetchTestimonials(),
      fetchStats(),
      fetchFaqs(),
    ]);
  return { settings, services, packages, projects, testimonials, stats, faqs };
}

export async function fetchContactMessages(): Promise<ContactMessage[]> {
  const { data, error } = await getSupabase()
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) fail("Could not load messages", error);
  return (data ?? []).map(toContactMessage);
}

// ── Writes ───────────────────────────────────────────────────────────────────

export async function saveSettings(settings: SiteSettings): Promise<void> {
  const { error } = await getSupabase()
    .from("site_settings")
    .upsert(settingsToRow(settings), { onConflict: "id" });
  if (error) fail("Could not save settings", error);
}

export async function createService(input: Omit<Service, "id">): Promise<void> {
  const { error } = await getSupabase().from("services").insert(serviceToRow({ ...input, id: "" }));
  if (error) fail("Could not add service", error);
}

export async function updateService(id: string, input: Omit<Service, "id">): Promise<void> {
  const { error } = await getSupabase().from("services").update(serviceToRow({ ...input, id })).eq("id", id);
  if (error) fail("Could not update service", error);
}

export async function deleteService(id: string): Promise<void> {
  const { error } = await getSupabase().from("services").delete().eq("id", id);
  if (error) fail("Could not delete service", error);
}

export async function createPackage(input: Omit<PricingPackage, "id">): Promise<void> {
  const { error } = await getSupabase()
    .from("pricing_packages")
    .insert(packageToRow({ ...input, id: "" }));
  if (error) fail("Could not add package", error);
}

export async function updatePackage(
  id: string,
  input: Omit<PricingPackage, "id">,
): Promise<void> {
  const { error } = await getSupabase()
    .from("pricing_packages")
    .update(packageToRow({ ...input, id }))
    .eq("id", id);
  if (error) fail("Could not update package", error);
}

export async function deletePackage(id: string): Promise<void> {
  const { error } = await getSupabase().from("pricing_packages").delete().eq("id", id);
  if (error) fail("Could not delete package", error);
}

/**
 * Mark one package as the category's "Most Popular".
 *
 * The database enforces at most one per category with a partial unique index,
 * so the old badge must be cleared BEFORE the new one is set — doing it the
 * other way round would violate the index.
 */
export async function setPopularPackage(category: string, id: string): Promise<void> {
  const clear = await getSupabase()
    .from("pricing_packages")
    .update({ is_popular: false })
    .eq("category", category)
    .eq("is_popular", true);
  if (clear.error) fail("Could not clear the previous popular package", clear.error);

  const set = await getSupabase().from("pricing_packages").update({ is_popular: true }).eq("id", id);
  if (set.error) fail("Could not set the popular package", set.error);
}

export async function createProject(input: Omit<Project, "id">): Promise<void> {
  const { error } = await getSupabase().from("projects").insert(projectToRow({ ...input, id: "" }));
  if (error) fail("Could not add project", error);
}

export async function updateProject(id: string, input: Omit<Project, "id">): Promise<void> {
  const { error } = await getSupabase().from("projects").update(projectToRow({ ...input, id })).eq("id", id);
  if (error) fail("Could not update project", error);
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await getSupabase().from("projects").delete().eq("id", id);
  if (error) fail("Could not delete project", error);
}

export async function createTestimonial(input: Omit<Testimonial, "id">): Promise<void> {
  const { error } = await getSupabase()
    .from("testimonials")
    .insert(testimonialToRow({ ...input, id: "" }));
  if (error) fail("Could not add testimonial", error);
}

export async function updateTestimonial(
  id: string,
  input: Omit<Testimonial, "id">,
): Promise<void> {
  const { error } = await getSupabase()
    .from("testimonials")
    .update(testimonialToRow({ ...input, id }))
    .eq("id", id);
  if (error) fail("Could not update testimonial", error);
}

export async function deleteTestimonial(id: string): Promise<void> {
  const { error } = await getSupabase().from("testimonials").delete().eq("id", id);
  if (error) fail("Could not delete testimonial", error);
}

export async function createStat(input: Omit<Stat, "id">): Promise<void> {
  const { error } = await getSupabase().from("stats").insert(statToRow({ ...input, id: "" }));
  if (error) fail("Could not add stat", error);
}

export async function updateStat(id: string, input: Omit<Stat, "id">): Promise<void> {
  const { error } = await getSupabase().from("stats").update(statToRow({ ...input, id })).eq("id", id);
  if (error) fail("Could not update stat", error);
}

export async function deleteStat(id: string): Promise<void> {
  const { error } = await getSupabase().from("stats").delete().eq("id", id);
  if (error) fail("Could not delete stat", error);
}

export async function createFaq(input: Omit<Faq, "id">): Promise<void> {
  const { error } = await getSupabase().from("faqs").insert(faqToRow({ ...input, id: "" }));
  if (error) fail("Could not add FAQ", error);
}

export async function updateFaq(id: string, input: Omit<Faq, "id">): Promise<void> {
  const { error } = await getSupabase().from("faqs").update(faqToRow({ ...input, id })).eq("id", id);
  if (error) fail("Could not update FAQ", error);
}

export async function deleteFaq(id: string): Promise<void> {
  const { error } = await getSupabase().from("faqs").delete().eq("id", id);
  if (error) fail("Could not delete FAQ", error);
}

/** Public contact form submission. */
export async function createContactMessage(input: NewContactMessage): Promise<void> {
  const { error } = await getSupabase().from("contact_messages").insert({
    name: input.name,
    email: input.email,
    phone: input.phone,
    service: input.service,
    message: input.message,
  });
  if (error) fail("Could not send your message", error);
}

export async function deleteContactMessage(id: string): Promise<void> {
  const { error } = await getSupabase().from("contact_messages").delete().eq("id", id);
  if (error) fail("Could not delete message", error);
}

// ── Storage ──────────────────────────────────────────────────────────────────

// ── Reset ────────────────────────────────────────────────────────────────────

/**
 * Restore every content table to the shipped defaults.
 *
 * Backs the /sholab "Reset to default" button. It clears the current rows and
 * re-inserts the snapshot in shared/defaults.ts, so the site returns to exactly
 * the state a fresh install starts in.
 *
 * The settings row is upserted rather than deleted, because it is a single
 * well-known row (id = 'main') and deleting it would briefly leave the site with
 * no settings at all.
 */
export async function resetToDefaults(): Promise<void> {
  // 1. Clear the content tables. `.not("id", "is", null)` matches every row
  //    without needing a sentinel id.
  for (const table of [
    "services",
    "pricing_packages",
    "projects",
    "testimonials",
    "stats",
    "faqs",
  ]) {
    const { error } = await getSupabase().from(table).delete().not("id", "is", null);
    if (error) fail(`Could not clear ${table}`, error);
  }

  // 2. Re-insert the shipped rows.
  const inserts: [string, Record<string, unknown>[]][] = [
    ["services", DEFAULT_SERVICES.map((s) => serviceToRow({ ...s, id: "" }))],
    ["pricing_packages", DEFAULT_PACKAGES.map((p) => packageToRow({ ...p, id: "" }))],
    ["projects", DEFAULT_PROJECTS.map((p) => projectToRow({ ...p, id: "" }))],
    ["testimonials", DEFAULT_TESTIMONIALS.map((t) => testimonialToRow({ ...t, id: "" }))],
    ["stats", DEFAULT_STATS.map((s) => statToRow({ ...s, id: "" }))],
    ["faqs", DEFAULT_FAQS.map((f) => faqToRow({ ...f, id: "" }))],
  ];

  for (const [table, rows] of inserts) {
    if (rows.length === 0) continue;
    const { error } = await getSupabase().from(table).insert(rows);
    if (error) fail(`Could not restore ${table}`, error);
  }

  // 3. Rewrite the settings row.
  await saveSettings(DEFAULT_SETTINGS);
}

/**
 * Upload an image to the public media bucket and return its object path.
 *
 * The path is namespaced by folder and made unique with a timestamp, so
 * uploading a new version of "logo.png" never overwrites the old file — which
 * matters because the old URL may still be cached by a CDN or a browser.
 */
export async function uploadImage(file: File, folder: string): Promise<string> {
  const ext = (file.name.split(".").pop() || "png").toLowerCase();
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "image";
  const path = `${folder}/${base}-${Date.now()}.${ext}`;

  const { error } = await getSupabase().storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) fail("Could not upload the image", error);
  return path;
}

/** Remove an object from the media bucket. Best-effort: never blocks a save. */
export async function deleteImage(path: string): Promise<void> {
  if (!path || /^https?:\/\//i.test(path)) return;
  await getSupabase().storage.from(MEDIA_BUCKET).remove([path]);
}
