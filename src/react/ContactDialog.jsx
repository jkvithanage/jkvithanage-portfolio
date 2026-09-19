import React, { useEffect, useRef } from "react";
import { setScrollLock } from "../js/scroll-lock";
import { ContactForm } from "./ContactForm";

/** @param {{onClose: () => void, returnFocus: HTMLElement}} props */
export function ContactDialog({ onClose, returnFocus }) {
  const dialogRef = useRef(/** @type {HTMLDialogElement | null} */ (null));
  const closeRef = useRef(/** @type {HTMLButtonElement | null} */ (null));

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    setScrollLock("contact", true);
    closeRef.current?.focus();
    return () => {
      dialog.close();
      setScrollLock("contact", false);
      returnFocus.focus();
    };
  }, [returnFocus]);

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby="contact-title"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = event.currentTarget.querySelectorAll(
          'button:not(:disabled), input:not([type="hidden"]):not([tabindex="-1"]), textarea',
        );
        const first = /** @type {HTMLElement} */ (controls[0]);
        const last = /** @type {HTMLElement} */ (controls[controls.length - 1]);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }}
    >
      <div className="modal-dialog">
        <div className="modal__header">
          <h2 id="contact-title" className="stroke-left modal__title">Let's work together</h2>
          <button ref={closeRef} className="modal__close" type="button" aria-label="Close contact form" onClick={onClose} />
        </div>
        <div className="modal__body"><ContactForm /></div>
      </div>
    </dialog>
  );
}
