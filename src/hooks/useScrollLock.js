import { useEffect } from "react";

const owners = new Set();

/**
 * Keeps page scrolling locked while any overlay is open.
 * Each caller releases only its own lock when it closes or unmounts.
 * @param {string} owner
 * @param {boolean} locked
 */
export function useScrollLock(owner, locked) {
  useEffect(() => {
    if (locked) owners.add(owner);
    else owners.delete(owner);

    document.body.classList.toggle("overflow-hidden", owners.size > 0);

    return () => {
      if (!locked) return;
      owners.delete(owner);
      document.body.classList.toggle("overflow-hidden", owners.size > 0);
    };
  }, [owner, locked]);
}
