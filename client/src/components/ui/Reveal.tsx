import type { ElementType, ReactNode } from "react";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";

/**
 * Wrap children in a reveal-on-scroll animation.
 *
 * `delay` staggers a grid: pass index * 60 so cards arrive in sequence rather
 * than all at once, which reads as intentional rather than as a rendering
 * glitch. The delay is applied as an inline style because it is data, not a
 * design token.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
}) {
  const { ref, shown } = useReveal();

  return (
    <Tag
      ref={ref}
      className={cn("reveal", shown && "reveal-in", className)}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
