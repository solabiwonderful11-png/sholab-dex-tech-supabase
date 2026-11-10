import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * The single Supabase client for the whole app.
 *
 * The publishable (anon) key is meant to be public — it is embedded in the
 * browser bundle by design, and Row Level Security is what actually protects
 * the data. See supabase/migrations/0002_rls.sql for the policies this app
 * relies on, and README › Security for how to lock the admin panel down.
 *
 * ── Why this module no longer throws ─────────────────────────────────────────
 * It used to `throw` at module load when the environment variables were
 * missing. That is the worst possible place to fail: `main.tsx` imports this
 * module transitively, so the throw aborted the entry chunk BEFORE React could
 * mount. The result was a completely blank white page with the real reason
 * visible only in the browser console — exactly the bug that was reported.
 *
 * Now the module always loads. A missing configuration is recorded in
 * `configError` and surfaced by the UI (see `App.tsx` → `ConfigScreen`), so the
 * visitor and the owner both see a readable message instead of nothing.
 */

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();

/**
 * Human-readable description of what is wrong with the configuration, or
 * `null` when everything needed is present.
 */
export const configError: string | null = (() => {
  const missing: string[] = [];
  if (!url) missing.push("VITE_SUPABASE_URL");
  if (!anonKey) missing.push("VITE_SUPABASE_ANON_KEY");
  if (missing.length === 0) return null;

  return (
    `Missing Supabase configuration: ${missing.join(", ")}. ` +
    "Set these in your host's environment variables (Vercel → Settings → " +
    "Environment Variables) and redeploy — Vite bakes them in at build time, " +
    "so changing them without a new build has no effect."
  );
})();

/**
 * The client, or `null` when the configuration is incomplete.
 *
 * Callers must go through `getSupabase()` (or check `configError` first) rather
 * than assuming a client exists.
 */
export const supabase: SupabaseClient | null =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          // The public site has no OAuth redirect flow, so there is nothing to
          // detect.
          detectSessionInUrl: false,
        },
      })
    : null;

/**
 * The client, guaranteed non-null.
 *
 * Throws a clear, actionable error when the configuration is missing. This is
 * only reached from inside a query function — i.e. after React has mounted —
 * so the throw is caught by React Query and rendered by `ErrorScreen` instead
 * of blanking the page.
 */
export function getSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error(configError ?? "Supabase client is not configured.");
  }
  return supabase;
}

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
  if (!supabase) return null;
  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}
