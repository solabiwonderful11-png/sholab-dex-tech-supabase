import { useEffect, useRef, useState } from "react";

/**
 * Reveal-on-scroll.
 *
 * Returns a ref to attach to the element and a boolean to drive the animation.
 * The observer disconnects after the first reveal, so an element animates once
 * and never re-triggers when the user scrolls back up.
 *
 * Respects prefers-reduced-motion: when the user has asked for less motion the
 * element starts visible and no observer is created at all.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, shown };
}
