import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

/**
 * A page section with a consistent heading block.
 *
 * Every section on the site uses this, which is what keeps the vertical rhythm
 * and the heading hierarchy identical from top to bottom — the thing that most
 * often makes a hand-built page feel uneven.
 */
export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className,
  align = "center",
  tone = "default",
}: {
  id: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  children: ReactNode;
  className?: string;
  align?: "center" | "left";
  tone?: "default" | "sunken";
}) {
  return (
    <section
      id={id}
      className={cn(
        "section",
        tone === "sunken" && "bg-surface-sunken",
        className,
      )}
    >
      <div className="shell">
        <Reveal
          className={cn(
            "max-w-3xl",
            align === "center" ? "mx-auto text-center" : "text-left",
          )}
        >
          {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
          <h2 className="mt-3 text-h2 font-bold tracking-tight">{title}</h2>
          {intro ? (
            <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">
              {intro}
            </p>
          ) : null}
        </Reveal>

        <div className="mt-12 sm:mt-16">{children}</div>
      </div>
    </section>
  );
}
