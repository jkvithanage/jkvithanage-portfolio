import React from "react";
import { educationEntries, workExperiences } from "../content/career";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { RichText } from "./RichText";

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
      <ul className="list career__description">
        {description.map((line, index) => <li key={index}><RichText content={line} /></li>)}
      </ul>
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
      <Timeline entries={workExperiences} label="employment" />
      <div className="section-edu">
        <div className="flex-left">
          <h2 className="stroke-left">Education</h2>
        </div>
        <Timeline entries={educationEntries} label="education" />
      </div>
    </section>
  );
}
