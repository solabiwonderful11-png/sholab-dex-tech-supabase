import { AlertTriangle, Loader2 } from "lucide-react";

/**
 * Full-page loading state.
 *
 * A skeleton of the real layout rather than a bare spinner: it communicates
 * what is coming and makes the wait feel shorter than an empty screen does.
 */
export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="shell pt-32">
        <div className="skeleton h-4 w-40" />
        <div className="skeleton mt-6 h-14 w-full max-w-2xl" />
        <div className="skeleton mt-3 h-14 w-full max-w-xl" />
        <div className="skeleton mt-6 h-5 w-full max-w-lg" />
        <div className="mt-10 flex gap-3">
          <div className="skeleton h-12 w-40 rounded-full" />
          <div className="skeleton h-12 w-44 rounded-full" />
        </div>

        <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="skeleton h-32" />
          ))}
        </div>
      </div>

      <p className="sr-only" role="status">
        Loading site content
      </p>
    </div>
  );
}

/**
 * Full-page error state.
 *
 * Shows the real message rather than a generic apology — the most likely cause
 * is a misconfigured Supabase URL or key, and hiding that would send the owner
 * hunting through the code for no reason.
 */
export function ErrorScreen({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div className="grid min-h-screen place-items-center bg-surface p-6">
      <div className="card max-w-lg p-8 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-red-500/12 text-red-500">
          <AlertTriangle className="h-6 w-6" aria-hidden="true" />
        </span>
        <h1 className="mt-4 text-lg font-bold">Could not load the site</h1>
        <p className="mt-2 text-sm text-ink-muted">
          The content could not be fetched from Supabase. Check that the project URL and
          publishable key in your <code className="text-xs">.env</code> are correct, and that
          the migrations in <code className="text-xs">supabase/migrations</code> have been
          applied.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-xl bg-surface-sunken p-3 text-left text-xs text-ink-subtle">
          {error.message}
        </pre>
        <button type="button" onClick={onRetry} className="btn btn-primary mt-6">
          <Loader2 className="h-4 w-4" aria-hidden="true" />
          Try again
        </button>
      </div>
    </div>
  );
}
