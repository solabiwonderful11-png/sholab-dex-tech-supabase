/// <reference types="vite/client" />

/**
 * Typed environment variables.
 *
 * Declaring them here means a typo in `import.meta.env.VITE_...` is a compile
 * error rather than a silent `undefined` at runtime — which for the Supabase URL
 * would otherwise surface as a confusing fetch failure.
 */

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_SUPABASE_BUCKET?: string;
  readonly VITE_ADMIN_PATH?: string;
  readonly VITE_ADMIN_REQUIRE_AUTH?: string;
  readonly VITE_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
