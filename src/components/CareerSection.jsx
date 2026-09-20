import React from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";

const employmentEntries = [
  {
    organization: {
      name: "Swivel Group Pty Ltd",
      href: "https://swivelgroup.com.au/",
      label: "Visit Swivel Group official website",
    },
    title: "Ruby on Rails Developer",
    dates: "2025 Jan - Present",
    description: (
      <ul className="list career__description">
        <li>Developed backend services for a Ruby on Rails-based Strata Management System.</li>
        <li>Collaborated with cross-functional teams to translate business requirements into technical solutions and deliver impactful features.</li>
        <li>Implemented features and bug fixes, utilizing test-driven development (TDD) practices.</li>
        <li>Optimized performance-critical endpoints, reducing response times by 40-70% and ensuring all requests met SLAs of under 3 seconds.</li>
        <li>Delivered urgent hotfixes for production issues, restoring functionality quickly and minimizing downtime.</li>
        <li>Reported directly to the Engineering Manager, ensuring alignment with project goals and technical requirements.</li>
      </ul>
    ),
  },
  {
    organization: { name: "Self employed" },
    title: "Freelance Web Developer",
    dates: "2023 Jan - Now",
    description: (
      <ul className="list career__description">
        <li>Built an inventory management system for AYT Trading Ltd using Ruby on Rails, Hotwire, PostgreSQL, and Tailwind CSS.</li>
        <li>Developed an invoice generator module for an e-commerce platform.</li>
        <li>Created a Reddit web scraper using Ruby and Selenium WebDriver.</li>
        <li><a href="https://www.upwork.com/freelancers/~01ac14c03ad8691410" target="_blank" className="link" rel="noopener noreferrer" aria-label="Hire me on Upwork">Find me on Upwork.</a></li>
      </ul>
    ),
  },
  {
    organization: { name: "Self employed" },
    title: "Graphic Designer",
    dates: "2012 Oct - 2022 May",
    description: (
      <ul className="list career__description">
        <li>Offered various graphic design services on Fiverr, from print designs to web designs.</li>
        <li>Worked with over 3,000 clients from different industries, including advertising, photography, digital marketing, and real estate.</li>
        <li><a href="https://graphics.jkvithanage.com" target="_blank" className="link" rel="noopener noreferrer" aria-label="Visit my graphic design portfolio">Visit my graphic design portfolio.</a></li>
      </ul>
    ),
  },
  {
    organization: {
      name: "Lanka Sugar Company Ltd",
      href: "https://www.linkedin.com/company/lscl/",
      label: "Visit Lanka Sugar Company LinkedIn profile",
    },
    title: "Chemical Engineer",
    dates: "2017 Nov - 2018 Dec",
    description: (
      <ul className="list career__description">
        <li>Managed and coordinated the production process.</li>
        <li>Led process optimization efforts that boosted plant efficiency by 8%.</li>
        <li>Developed engineering schematics using AutoCAD and MS Visio.</li>
      </ul>
    ),
  },
];

const educationEntries = [
  {
    organization: {
      name: "Torrens University Australia",
      href: "https://www.torrens.edu.au/",
      label: "Visit Torrens University homepage",
    },
    title: "Master of Business Information Systems",
    dates: "2024 Feb - Present",
    description: (
      <ul className="list career__description">
        <li>Currently in my last trimester with a GPA of 6.3/7.0.</li>
        <li>Gained a solid end-to-end knowledge of the Software Development Lifecycle.</li>
        <li>Got hands-on with data analytics and AI/ML (keen to dive deeper into ML).</li>
        <li>Volunteered twice at Social Enterprise Hub as a developer and a design thinker.</li>
      </ul>
    ),
  },
  {
    organization: {
      name: "Le Wagon - Melbourne",
      href: "https://www.lewagon.com/melbourne",
      label: "Read more about Le Wagon Melbourne campus",
    },
    title: "Web Development Bootcamp",
    dates: "2022 Oct - 2022 Dec",
    description: (
      <ul className="list career__description">
        <li>Attended full-stack web development bootcamp (Batch #1044).</li>
        <li>It was an 11-week intensive coding bootcamp learning a complete set of technical skills required for a full-stack developer based on the Ruby on Rails framework, along with HTML, CSS, JavaScript, PostgreSQL, Git, Heroku, and more.</li>
      </ul>
    ),
  },
  {
    organization: {
      name: "University of Peradeniya",
      href: "https://eng.pdn.ac.lk/",
      label: "Visit University of Peradeniya Engineering faculty website",
    },
    title: "BSc Engineering (Hons)",
    dates: "2013 March - 2017 Dec",
    description: (
      <ul className="list career__description">
        <li>Specialised in Chemical &amp; Process Engineering.</li>
        <li>Gained a broad knowledge of many engineering disciplines, including electrical &amp; electronic, mechanical, computer, civil, and manufacturing engineering.</li>
        <li>
          Conducted highly successful research in{" "}
          <a href="https://www.dropbox.com/s/oxfwj6k1ti81j33/CP507%20E11223.pdf?dl=0" target="_blank" className="link" rel="noopener noreferrer" aria-label="Read my final research publication">biogas production using sugar industry waste</a>. (The research impressed the chairman and board of directors of Lanka Sugar Company, who offered me my first job as a fresh graduate.).
        </li>
      </ul>
    ),
  },
];

export function TimelineEntry({ organization, title, dates, description }) {
  return (
    <li className="timeline-entry career">
      {organization.href ? (
        <a
          href={organization.href}
          className="career__employer"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={organization.label}
        >
          {organization.name}
        </a>
      ) : (
        <p className="career__employer">{organization.name}</p>
      )}
      <div className="career-heading">
        <h3 className="career-heading__title">{title}</h3>
        <p className="career-heading__time">{dates}</p>
      </div>
      {description}
    </li>
  );
}

export function Timeline({ entries, label }) {
  return (
    <ul className={`timeline careers timeline--${label}`} aria-label={label}>
      {entries.map((entry) => (
        <TimelineEntry key={`${entry.organization.name}-${entry.title}`} {...entry} />
      ))}
    </ul>
  );
}

export function CareerSection() {
  const sectionRef = useScrollReveal();
  return (
    <section className="section section-careers" id="career" ref={sectionRef}>
      <div className="flex-left">
        <h2 className="stroke-left">Career</h2>
      </div>
      <Timeline entries={employmentEntries} label="employment" />
      <div className="section-edu">
        <div className="flex-left">
          <h2 className="stroke-left">Education</h2>
        </div>
        <Timeline entries={educationEntries} label="education" />
      </div>
    </section>
  );
}

