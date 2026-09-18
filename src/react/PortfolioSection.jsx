import React from "react";
import { useScrollReveal } from "./useScrollReveal";

const projects = [
  {
    title: "My Cash Flow",
    summary: "Personal finance tracking application.",
    description: <>Analyse your financial transactions to determine how you have spent money and your earnings. You can add multiple bank accounts and add transactions associated with each. Most importantly, you can import bulk transactions at once from a CSV file. You can see a summary of your financial activities from the dashboard section.</>,
    image: { src: "./static/screenshots/mycashflow.webp", alt: "Screenshot of My Cash Flow dashboard page" },
    preview: { href: "https://mycashflow.cc/", label: "Visit My Cash Flow website" },
    tags: ["Ruby on Rails", "Tabler UI", "PostgreSQL", "Stimulus", "Apexcharts"],
    actions: [
      { label: "Live", href: "https://mycashflow.cc/", ariaLabel: "Visit My Cash Flow website" },
      { label: "GitHub", href: "https://github.com/jkvithanage/mycashflow", ariaLabel: "Visit My Cash Flow GitHub repository" },
    ],
  },
  {
    title: "My Portfolio Website",
    summary: "My first personal portfolio website.",
    description: (
      <>This is the first version of my portfolio website. I created it using just HTML5, SCSS, and some JavaScript. All components and sections were designed and developed from scratch with plain HTML and CSS. My main goal was to build a fully responsive, accessible and high-performance website. Below is a screenshot of the <a href="https://pagespeed.web.dev/analysis/https-www-jkvithanage-com/lpw35hijlz?form_factor=desktop" target="_blank" className="link" rel="noopener noreferrer" aria-label="Visit Google PageSpeed Insights">Google PageSpeed Insights</a> of this website.</>
    ),
    image: { src: "./static/screenshots/portfolio.png", alt: "Screenshot of my personal portfolio website" },
    additionalImage: { src: "./static/screenshots/portfolio_pagespeed_insights.png", alt: "PageSpeed Insights of the portfolio website." },
    preview: { href: "https://www.jkvithanage.com/", label: "Visit My Portfolio Website" },
    tags: ["HTML5", "SCSS", "JavaScript", "Vite.js", "PostCSS"],
    actions: [
      { label: "Live", href: "https://www.jkvithanage.com/", ariaLabel: "Visit my portfolio website" },
      { label: "GitHub", href: "https://github.com/jkvithanage/jkvithanage-portfolio", ariaLabel: "Visit My Portfolio Website GitHub repository" },
    ],
  },
  {
    title: "Customer Invoice Portal",
    summary: "Invoice generator for a software retailer.",
    description: <>Christy Software sells software licenses on the <a href="https://sellix.io/" target="_blank" className="link" rel="noopener noreferrer" aria-label="Visit Sellix e-commerce platform">Sellix</a> e-commerce platform, and this app was developed to let their customers get an invoice for all purchase activities for a given period.</>,
    image: { src: "./static/screenshots/invoice_portal.webp", alt: "Screenshot of invoice portal web app" },
    preview: { href: "https://invoices.christysoftware.com/", label: "Visit invoice portal web app" },
    tags: ["JavaScript", "Bootstrap", "SCSS", "Fetch API", "Tagify", "jsPDF"],
    actions: [
      { label: "Live", href: "https://invoices.christysoftware.com/", ariaLabel: "Visit invoice portal web app" },
      { label: "GitHub", disabled: true },
    ],
  },
  {
    title: "Astrolog",
    summary: "A social platform for space enthusiasts, along with a built-in community.",
    description: <>This is a full-stack Ruby on Rails app developed as the final project at Le Wagon coding bootcamp with a team of 3 members in 2 weeks.</>,
    image: { src: "./static/screenshots/astrolog.webp", alt: "Screenshot of Astrolog website" },
    preview: { href: "https://astrolog.fly.dev", label: "Visit Astrolog website" },
    tags: ["Ruby on Rails", "PostgreSQL", "Bootstrap", "SCSS", "Cloudinary", "RESTful APIs"],
    actions: [
      { label: "Live", href: "https://astrolog.fly.dev", ariaLabel: "Visit Astrolog website" },
      { label: "GitHub", href: "https://github.com/McDrivin/astrolog", ariaLabel: "Visit Astrolog GitHub repository" },
    ],
  },
];

export function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <div className="project-card__body">
        <div className="project__preview">
          <a href={project.preview.href} target="_blank" rel="noopener noreferrer" aria-label={project.preview.label}>
            <img src={project.image.src} className="project__preview__image lazy-img" alt={project.image.alt} loading="lazy" />
          </a>
        </div>
        <div className="project__details">
          <a href={project.preview.href} target="_blank" rel="noopener noreferrer" aria-label={project.preview.label}>
            <h3 className="stroke-left project__title">{project.title}</h3>
          </a>
          <p className="project__summary">{project.summary}</p>
          <p className="project__description">{project.description}</p>
          {project.additionalImage && <img src={project.additionalImage.src} alt={project.additionalImage.alt} />}
          <ul className="project__tags">
            {project.tags.map((tag) => <li className="project__tag" key={tag}>{tag}</li>)}
          </ul>
          <div className="project__buttons">
            {project.actions.map((action) => action.disabled ? (
              <button key={action.label} disabled className="btn btn-black">{action.label}</button>
            ) : (
              <a key={action.label} href={action.href} target="_blank" rel="noopener noreferrer" className="btn btn-black" aria-label={action.ariaLabel}>{action.label}</a>
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

