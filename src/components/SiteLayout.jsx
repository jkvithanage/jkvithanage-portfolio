import React, { useState } from "react";
import { SiteHeader } from "./Navigation";
import { SocialLinks } from "./SocialLinks";
import { ContactCallout } from "./ContactCallout";
import { SiteFooter } from "./SiteFooter";
import { ContactDialog } from "./ContactDialog";

/** @param {{year: number, homePage?: boolean, contactCallout?: boolean, children: React.ReactNode}} props */
export function SiteLayout({ year, homePage = false, contactCallout = false, children }) {
  const [contactTrigger, setContactTrigger] = useState(/** @type {HTMLElement | null} */ (null));

  return (
    <>
      <div className="socials-desktop"><SocialLinks /></div>
      <header id="header"><SiteHeader homePage={homePage} onContact={setContactTrigger} /></header>
      {children}
      {contactCallout && <ContactCallout onContact={setContactTrigger} />}
      <SiteFooter year={year} />
      {contactTrigger && <ContactDialog returnFocus={contactTrigger} onClose={() => setContactTrigger(null)} />}
    </>
  );
}
