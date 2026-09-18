import { useEffect, useRef } from "react";

/**
 * Adds the page's reveal class once an element enters the viewport.
 * Pass a selector when a migration shell needs to observe several static
 * sections; without one the returned ref observes one React-owned element.
 */
export function useScrollReveal(selector) {
  const ref = useRef(null);

  useEffect(() => {
    const targets = selector
      ? Array.from(document.querySelectorAll(selector))
      : ref.current
        ? [ref.current]
        : [];
    if (!targets.length) return undefined;

    const reveal = (element) => element.classList.add("reveal");
    const reducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach(reveal);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          reveal(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1 },
    );
    targets.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [selector]);

  return ref;
}
