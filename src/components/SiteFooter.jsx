import React, { useEffect, useState } from "react";
import { SocialLinks } from "./SocialLinks";

/** @param {{year: number}} props */
export function SiteFooter({ year }) {
  const [currentYear, setCurrentYear] = useState(year);
  useEffect(() => setCurrentYear(new Date().getFullYear()), []);
  return (
    <footer className="footer">
      <div className="socials-footer">
        <SocialLinks />
      </div>
      <p>
        <span>&copy;</span> <span id="current-year">{currentYear}</span>{" "}
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
