/**
 * Canonical / Open Graph URL handling.
 *
 * Why this is not in `index.html`:
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
 */

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

/**
 * Point the canonical link and `og:url` at the current page.
 *
 * Called once on boot and again on navigation, so the admin panel does not
 * advertise itself as the canonical homepage.
 */
export function applySeo(path: string = window.location.pathname): void {
  const href = absoluteUrl(path);

  let canonical = document.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = href;

  let ogUrl = document.querySelector<HTMLMetaElement>(
    'meta[property="og:url"]',
  );
  if (!ogUrl) {
    ogUrl = document.createElement("meta");
    ogUrl.setAttribute("property", "og:url");
    document.head.appendChild(ogUrl);
  }
  ogUrl.content = href;
}
