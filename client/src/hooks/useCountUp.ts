import { useEffect, useRef, useState } from "react";

/**
 * Animate a numeric stat from 0 to its target when it scrolls into view.
 *
 * The stored value is a display string like "50+" or "24/7", so the numeric
 * part is extracted, animated, and the suffix re-attached. Values with no
 * leading number ("24/7") are returned unchanged — animating them would be
 * meaningless and would briefly show a wrong figure.
 */
export function useCountUp(value: string, durationMs = 1400) {
  const match = /^(\d+)(.*)$/.exec(value.trim());
  const target = match ? Number(match[1]) : null;
  const suffix = match ? match[2] : "";

  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(target === null ? value : `0${suffix}`);

  useEffect(() => {
    if (target === null) {
      setDisplay(value);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    let start = 0;

    const step = (now: number) => {
      if (!start) start = now;
      const progress = Math.min(1, (now - start) / durationMs);
      // easeOutCubic — fast start, gentle settle. Feels deliberate rather than
      // mechanical, and matches the reveal animations elsewhere on the page.
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(`${Math.round(target * eased)}${suffix}`);
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          frame = requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target, suffix, value, durationMs]);

  return { ref, display };
}
