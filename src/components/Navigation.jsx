import React, { useEffect, useRef, useState } from "react";
import logoUrl from "../assets/logo.svg";
import { useScrollLock } from "../hooks/useScrollLock";
import { SocialLinks } from "./SocialLinks";
import { ThemeSelector } from "../theme/ThemeProvider";

export function BrandLogo() {
  return (
    <a href="/" className="nav__logo">
      <img
        src={logoUrl}
        alt="Janaka Vithanage brand logo"
        width="48"
        height="48"
      />
    </a>
  );
}

/** @param {{open: boolean, onToggle: () => void, buttonRef: React.RefObject<HTMLButtonElement | null>}} props */
export function MobileMenuToggle({ open, onToggle, buttonRef }) {
  return (
    <button
      ref={buttonRef}
      type="button"
      className="hamburger"
      aria-label="Navigation menu toggler"
      aria-expanded={open}
      aria-controls="navigation-content"
      onClick={onToggle}
    >
      <span className="hamburger__bar" />
      <span className="hamburger__bar" />
      <span className="hamburger__bar" />
    </button>
  );
}

const links = [
  { title: "About", href: "#about", label: "Go to about section" },
  { title: "Skills", href: "#skills", label: "Go to skill section" },
  { title: "Career", href: "#career", label: "Go to career section" },
  { title: "Portfolio", href: "#portfolio", label: "Go to portfolio section" },
  { title: "Blog", href: "/blog/", label: "Visit Blog" },
  {
    title: "Graphics",
    href: "https://graphics.jkvithanage.com",
    label: "Visit graphics portfolio",
  },
];

/** @param {{onNavigate: () => void, homePage: boolean}} props */
export function NavigationLinks({ onNavigate, homePage }) {
  return (
    <ul className="nav__list">
      {links.map(({ title, href, label }) => (
        <li className="nav__item" key={href}>
          <a
            className="nav__link"
            href={!homePage && href.startsWith("#") ? `/${href}` : href}
            aria-label={label}
            onClick={onNavigate}
            target={href.startsWith("https:") ? "_blank" : undefined}
            rel={href.startsWith("https:") ? "noreferrer" : undefined}
          >
            {title}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** @param {{onContact: (returnFocus: HTMLElement) => void, homePage: boolean}} props */
export function Navigation({ onContact, homePage }) {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const toggleRef = useRef(/** @type {HTMLButtonElement | null} */ (null));
  const navRef = useRef(/** @type {HTMLElement | null} */ (null));

  useScrollLock("navigation", open);

  useEffect(() => {
    let previousY = window.scrollY;
    const onScroll = () => {
      setHidden(window.scrollY > 0 && window.scrollY > previousY && !open);
      previousY = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onResize = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", onResize);
    return () => desktop.removeEventListener("change", onResize);
  }, []);

  useEffect(() => {
    if (!open) return;
    setHidden(false);
    /** @param {KeyboardEvent} event */
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (event.key === "Tab") {
        const controls = navRef.current?.querySelectorAll("a, button, select");
        const first = /** @type {HTMLElement | undefined} */ (controls?.[0]);
        const last = /** @type {HTMLElement | undefined} */ (
          controls?.[controls.length - 1]
        );
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <nav
      ref={navRef}
      className={`nav${hidden ? " nav--hidden" : ""}`}
      aria-label="Main navigation"
      onFocusCapture={() => setHidden(false)}
    >
      <BrandLogo />
      <MobileMenuToggle
        open={open}
        onToggle={() => setOpen(!open)}
        buttonRef={toggleRef}
      />
      <div
        id="navigation-content"
        className={`nav__content${open ? " nav__content--open" : ""}`}
      >
        <NavigationLinks homePage={homePage} onNavigate={() => setOpen(false)} />
        <button
          className="btn btn-outlined"
          type="button"
          aria-label="Open contact form to send a message to Janaka"
          onClick={(event) => {
            onContact(
              open && toggleRef.current
                ? toggleRef.current
                : event.currentTarget,
            );
            setOpen(false);
          }}
        >
          Contact me
        </button>
        <ThemeSelector />
        <div className="socials-mobile-nav">
          <SocialLinks />
        </div>
      </div>
    </nav>
  );
}

/** @param {{onContact: (returnFocus: HTMLElement) => void, homePage: boolean}} props */
export function SiteHeader({ onContact, homePage }) {
  return <Navigation homePage={homePage} onContact={onContact} />;
}
