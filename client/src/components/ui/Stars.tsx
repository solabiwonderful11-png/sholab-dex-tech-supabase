import { cn } from "@/lib/utils";

/**
 * Star rating.
 *
 * Renders as a single accessible label rather than five separate icons, so a
 * screen reader announces "Rated 5 out of 5" instead of reading five stars.
 */
export function Stars({ rating, className }: { rating: number; className?: string }) {
  const clamped = Math.min(5, Math.max(0, Math.round(rating)));

  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      role="img"
      aria-label={`Rated ${clamped} out of 5`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={cn(
            "h-4 w-4",
            i < clamped ? "text-accent-500" : "text-line-strong",
          )}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}
