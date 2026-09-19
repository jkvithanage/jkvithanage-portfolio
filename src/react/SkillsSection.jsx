import React from "react";
import {
  siRuby,
  siJavascript,
  siHtml5,
  siCss3,
  siSass,
  siRubyonrails,
  siReact,
  siNodedotjs,
  siPostgresql,
  siGit,
  siGithub,
  siPostman,
  siHeroku,
  siSelenium,
  siFigma,
  siAdobephotoshop,
  siAdobeillustrator,
  siAmazonaws,
  siElasticsearch,
  siPhp,
  siPython,
  siLaravel,
  siJenkins,
  siTensorflow,
  siScikitlearn,
  siPandas,
  siPowerbi,
  siNumpy,
  siTableau,
  siTailwindcss,
} from "simple-icons";
import { useScrollReveal } from "./useScrollReveal";

const skillGroups = [
  {
    title: "Languages",
    icons: [siRuby, siJavascript, siPython, siPhp, siHtml5, siCss3, siSass],
  },
  {
    title: "Development",
    icons: [
      siRubyonrails,
      siLaravel,
      siReact,
      siTailwindcss,
      siNodedotjs,
      siPostgresql,
      siElasticsearch,
    ],
  },
  {
    title: "Tools",
    icons: [siGit, siGithub, siPostman, siJenkins, siAmazonaws, siHeroku, siSelenium],
  },
  {
    title: "Data & AI/ML",
    icons: [siPandas, siNumpy, siPowerbi, siTableau, siScikitlearn, siTensorflow],
  },
  {
    title: "Design",
    icons: [siFigma, siAdobephotoshop, siAdobeillustrator],
  },
];

export function SkillIcon({ icon }) {
  const skillStyle = /** @type {any} */ ({
    "--skill-color": `#${icon.hex}`,
  });

  return (
    <li className="skill-icon" style={skillStyle}>
      <button
        type="button"
        className="skill-icon__button"
        aria-label={icon.title}
      >
        <span
          className="skill-icon__svg"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: icon.svg }}
        />
        <span className="icon-label" aria-hidden="true">
          {icon.title}
        </span>
      </button>
    </li>
  );
}

export function SkillGroup({ title, icons }) {
  return (
    <div className="skills-card">
      <h3 className="skills-card__title">{title}</h3>
      <div className="skills-card__body">
        <ul className="skill-icons">
          {icons.map((icon) => (
            <SkillIcon key={icon.slug} icon={icon} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export function SkillsSection() {
  const revealRef = useScrollReveal();

  return (
    <section className="section skills-section" id="skills" ref={revealRef}>
      <div className="flex-center">
        <h2 className="stroke-center">Skills</h2>
      </div>
      <div className="skills">
        {skillGroups.map((group) => (
          <SkillGroup key={group.title} {...group} />
        ))}
      </div>
    </section>
  );
}
