import { createClient } from "@supabase/supabase-js";

/**
 * The single Supabase client for the whole app.
 *
 * The publishable (anon) key is meant to be public — it is embedded in the
 * browser bundle by design, and Row Level Security is what actually protects
 * the data. See supabase/migrations/0002_rls.sql for the policies this app
 * relies on, and README › Security for how to lock the admin panel down.
 */

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !anonKey) {
  // Fail loudly and early. A missing key would otherwise surface as a confusing
  // "fetch failed" deep inside a query, which is much harder to diagnose.
  throw new Error(
    "Missing Supabase configuration. Copy .env.example to .env and set " +
      "VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
  );
}

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    // The public site has no OAuth redirect flow, so there is nothing to detect.
    detectSessionInUrl: false,
  },
});

/** Public Storage bucket the admin panel uploads images to. */
export const MEDIA_BUCKET =
  (import.meta.env.VITE_SUPABASE_BUCKET as string | undefined) || "site-media";

/**
 * Public URL for an object in the media bucket.
 * Returns null for an empty value so callers can fall back to a placeholder
 * instead of rendering a broken <img>.
 */
export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  // Already an absolute URL (e.g. pasted from elsewhere) — use it as-is.
  if (/^https?:\/\//i.test(path)) return path;
  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}
