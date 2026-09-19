import React from "react";
import { SocialLinks } from "./SocialLinks";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="socials-footer">
        <SocialLinks />
      </div>
      <p>
        <span>&copy;</span> <span id="current-year">{new Date().getFullYear()}</span>{" "}
        - built by
        <a
          href="https://github.com/jkvithanage/jkvithanage-portfolio"
          target="_blank"
          rel="noreferrer"
          aria-label="Go to GitHub repository of this website"
        >
          jkvithanage
        </a>
      </p>
    </footer>
  );
}
