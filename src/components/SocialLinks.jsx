import React from "react";

export const socialLinks = [
  ["github", "https://github.com/jkvithanage", "Link to the GitHub profile"],
  [
    "linkedin",
    "https://www.linkedin.com/in/jkvithanage/",
    "Link to the LinkedIn profile",
  ],
  [
    "instagram",
    "https://www.instagram.com/jkvithanage/",
    "Link to the Instagram profile",
  ],
  ["twitter", "https://twitter.com/jkvithanage", "Link to the Twitter profile"],
  ["email", "mailto:jkvithana@gmail.com", "Email address of Janaka"],
];

export function SocialLinks() {
  return (
    <div className="social-icons">
      {socialLinks.map(([icon, href, label]) => (
        <a
          className="social-link"
          key={icon}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
        >
          <span className={`icon-${icon}`} aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}
