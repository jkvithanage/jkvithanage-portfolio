import { useEffect, useRef } from "react";

/**
 * Adds the page's reveal class when an element enters the viewport.
 * Reduced-motion visitors see the content immediately and the observer is
 * always disconnected when the owning component unmounts.
 */
export function useScrollReveal() {
  const ref = useRef(/** @type {HTMLElement | null} */ (null));

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      element.classList.add("reveal");
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      element.classList.add("reveal");
      observer.disconnect();
    });
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return ref;
}
