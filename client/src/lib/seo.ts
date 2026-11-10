/**
 * Canonical / Open Graph / favicon handling.
 *
 * Why the canonical link is not in `index.html`:
 *
 * Vite's `build-html` plugin treats every `<link href="...">` in the HTML entry
 * as an asset reference. A root-relative value such as `href="/"` is resolved
 * against the project root, which is a *directory*, and the plugin then tries to
 * read it as a file. The production build dies with:
 *
 *     [vite:build-html] EISDIR: illegal operation on a directory, read
 *
 * So the canonical link is created here, at runtime, from `VITE_SITE_URL`.
 * `scripts/check-html.mjs` fails the build if a root-relative `<link href>`
 * ever creeps back into `index.html`.
 *
 * The Open Graph tags and the favicon are also applied here rather than being
 * hard-coded, because the owner can change them from the /sholab SEO and Media
 * tabs (brief 8.8 / 8.9) — a static tag in index.html could never follow.
 */

import type { SiteSettings } from "@shared/types";

/**
 * Public URL for a Storage object, resolved without importing the Supabase
 * client.
 *
 * `lib/supabase.ts` throws at module load when the environment variables are
 * missing, which is the right behaviour for the app but would make this module
 * — and therefore its tests — impossible to import in a bare test run. The
 * public-URL format is stable and documented, so it is built here directly.
 */
function storageUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;

  const base = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(
    /\/+$/,
    "",
  );
  if (!base) return "";

  const bucket = (import.meta.env.VITE_SUPABASE_BUCKET as string | undefined) || "site-media";
  return `${base}/storage/v1/object/public/${bucket}/${path.replace(/^\/+/, "")}`;
}

/** Absolute site origin, without a trailing slash. Empty when unconfigured. */
export function siteOrigin(): string {
  const raw = (import.meta.env.VITE_SITE_URL as string | undefined)?.trim();
  if (!raw) return "";
  return raw.replace(/\/+$/, "");
}

/** Absolute URL for a path such as `/` or `/sholab`. */
export function absoluteUrl(path = "/"): string {
  const origin = siteOrigin();
  const clean = path.startsWith("/") ? path : `/${path}`;
  return origin ? `${origin}${clean}` : clean;
}

/** Create the tag if it is missing, then set its content. */
function setMeta(selector: string, attrs: Record<string, string>, content: string) {
  if (!content) return;
  let tag = document.head.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement("meta");
    for (const [k, v] of Object.entries(attrs)) tag.setAttribute(k, v);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

/**
 * Point the canonical link and `og:url` at the current page.
 *
 * Called once on boot and again on navigation, so the admin panel does not
 * advertise itself as the canonical homepage.
 */
export function applySeo(path: string = window.location.pathname): void {
  const href = absoluteUrl(path);

  let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = href;

  setMeta('meta[property="og:url"]', { property: "og:url" }, href);
}

/**
 * Apply the owner-editable SEO fields to the document.
 *
 * Everything here is driven by the `site_settings` row, so an edit in /sholab
 * takes effect on the next load without a redeploy. Fields left empty are
 * skipped, which leaves the sensible defaults in `index.html` in place.
 */
export function applySiteSeo(settings: SiteSettings): void {
  if (settings.seoTitle) document.title = settings.seoTitle;

  setMeta('meta[name="description"]', { name: "description" }, settings.seoDescription);
  setMeta('meta[name="keywords"]', { name: "keywords" }, settings.seoKeywords);

  // Open Graph — brief 5.4 / 8.9.
  setMeta('meta[property="og:title"]', { property: "og:title" }, settings.seoTitle);
  setMeta(
    'meta[property="og:description"]',
    { property: "og:description" },
    settings.seoDescription,
  );
  setMeta('meta[property="og:site_name"]', { property: "og:site_name" }, settings.companyName);

  const ogImage = storageUrl(settings.seoOgImage);
  if (ogImage) {
    setMeta('meta[property="og:image"]', { property: "og:image" }, ogImage);
    setMeta('meta[name="twitter:image"]', { name: "twitter:image" }, ogImage);
  }

  setMeta('meta[name="twitter:title"]', { name: "twitter:title" }, settings.seoTitle);
  setMeta(
    'meta[name="twitter:description"]',
    { name: "twitter:description" },
    settings.seoDescription,
  );

  // Favicon — brief 8.8. Falls back to the inline SVG in index.html when unset.
  const favicon = storageUrl(settings.favicon);
  if (favicon) {
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = favicon;
  }
}
