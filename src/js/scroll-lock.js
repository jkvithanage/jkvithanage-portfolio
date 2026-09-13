// Each overlay releases only its own lock, including during React effect cleanup.
const owners = new Set();

/** @param {string} owner @param {boolean} locked */
export function setScrollLock(owner, locked) {
  if (locked) owners.add(owner);
  else owners.delete(owner);
  document.body.classList.toggle("overflow-hidden", owners.size > 0);
}
