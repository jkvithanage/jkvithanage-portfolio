import React from "react";
import { projects } from "../content/projects";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { RichText } from "./RichText";
import myCashFlowScreenshot from "../assets/screenshots/mycashflow.webp";
import portfolioScreenshot from "../assets/screenshots/portfolio.png";
import portfolioPageSpeedScreenshot from "../assets/screenshots/portfolio_pagespeed_insights.png";
import invoicePortalScreenshot from "../assets/screenshots/invoice_portal.webp";
import astrologScreenshot from "../assets/screenshots/astrolog.webp";

const projectImageSources = {
  myCashFlow: myCashFlowScreenshot,
  portfolio: portfolioScreenshot,
  portfolioPageSpeed: portfolioPageSpeedScreenshot,
  invoicePortal: invoicePortalScreenshot,
  astrolog: astrologScreenshot,
};

export function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <div className="project-card__body">
        <div className="project__preview">
          <a href={project.preview.href} target="_blank" rel="noopener noreferrer" aria-label={project.preview.label}>
            <img src={projectImageSources[project.image.asset]} className="project__preview__image" alt={project.image.alt} loading="lazy" />
          </a>
        </div>
        <div className="project__details">
          <a href={project.preview.href} target="_blank" rel="noopener noreferrer" aria-label={project.preview.label}>
            <h3 className="stroke-left project__title">{project.title}</h3>
          </a>
          <p className="project__summary">{project.summary}</p>
          <p className="project__description"><RichText content={project.description} /></p>
          {project.additionalImage && <img src={projectImageSources[project.additionalImage.asset]} alt={project.additionalImage.alt} />}
          <ul className="project__tags">
            {project.tags.map((tag) => <li className="project__tag" key={tag}>{tag}</li>)}
          </ul>
          <div className="project__buttons">
            {project.actions.map((action) => action.type === "disabled" ? (
              <button key={action.label} disabled className="btn btn-solid">{action.label}</button>
            ) : (
              <a key={action.label} href={action.href} target="_blank" rel="noopener noreferrer" className="btn btn-solid" aria-label={action.ariaLabel}>{action.label}</a>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

export function PortfolioSection() {
  const sectionRef = useScrollReveal();
  return (
    <section className="section-full" id="portfolio" ref={sectionRef}>
      <div className="flex-center"><h2 className="stroke-center">Portfolio</h2></div>
      <div className="projects">{projects.map((project) => <ProjectCard key={project.title} project={project} />)}</div>
    </section>
  );
}
