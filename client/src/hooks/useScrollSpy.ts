import { useEffect, useState } from "react";

/**
 * Track which section is currently in view, for the nav's active link.
 *
 * Uses IntersectionObserver rather than a scroll listener: the browser does the
 * work off the main thread, so this stays smooth on a long page. The rootMargin
 * biases the "active" band toward the upper third of the viewport, which is
 * where a reader's attention actually is.
 */
export function useScrollSpy(sectionIds: readonly string[], offset = 96): string {
  const [active, setActive] = useState(sectionIds[0] ?? "");

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top of the viewport among those visible.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      {
        rootMargin: `-${offset}px 0px -55% 0px`,
        threshold: 0,
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds, offset]);

  return active;
}
