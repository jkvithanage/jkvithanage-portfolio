import React from "react";
import portraitSmall from "../../static/me/me_350.jpg";
import portraitMedium from "../../static/me/me_847.jpg";
import portraitLarge from "../../static/me/me_1200.jpg";
import { useScrollReveal } from "./useScrollReveal";

export function AboutSection() {
  const revealRef = useScrollReveal();

  return (
    <section className="section about-section" id="about" ref={revealRef}>
      <div className="flex-left">
        <h2 className="stroke-left">About</h2>
      </div>
      <div className="about-content">
        <div className="about-content__image-container">
          <div className="about-content__image-wrapper">
            <picture>
              <source media="(max-width: 576px)" srcSet={portraitSmall} />
              <source media="(max-width: 768px)" srcSet={portraitMedium} />
              <img
                className="about-content__image"
                src={portraitLarge}
                alt="Portrait photo of Janaka Vithanage"
                loading="lazy"
              />
            </picture>
          </div>
        </div>
        <div className="about-content__details">
          <p>
            Hello! My name is Janaka, and I am a software developer and a
            final-year master's student at Torrens University Australia. I am
            passionate about creating beautiful and interactive web
            applications that provide the best user experience. Additionally,
            I have a keen interest in new technologies and enjoy crafting and
            DIY activities. I love mechanical keyboards 😎.
          </p>
          <p>
            I was born in Sri Lanka and currently live in Melbourne. I hold a
            bachelor's degree in Chemical and Process Engineering. After
            graduating, I worked in the sugar manufacturing industry, I worked
            in the sugar manufacturing industry, where I held an engineering
            role that involved managing and improving the production process.
          </p>
          <p>
            During the COVID pandemic, I decided to chase my childhood dream
            of being a programmer and jumped into coding. I joined{" "}
            <a
              href="https://www.lewagon.com/melbourne"
              className="link"
              aria-label="Visit Le Wagon Melbourne official website"
            >
              Le Wagon
            </a>{" "}
            coding bootcamp, where I learned the elegant web framework,{" "}
            <a
              href="https://rubyonrails.org/"
              className="link"
              aria-label="Visit Ruby on Rails official website"
            >
              Ruby on Rails
            </a>{" "}
            ❤️. Since then, I've picked up and used a range of tech in
            development, deployment, management, data, and AI/ML.
          </p>
          <p>
            I currently work as a Ruby on Rails developer at{" "}
            <a
              href="https://swivelgroup.com.au/"
              className="link"
              aria-label="Visit Swivel Group official website"
            >
              Swivel Group
            </a>
            , a role focused on developing and maintaining backend services for
            a Ruby on Rails-based{" "}
            <a
              href="https://en.wikipedia.org/wiki/Strata_management"
              className="link"
              aria-label="Learn more about Strata Management"
            >
              Strata Management
            </a>{" "}
            System. If you are looking to build a web application or
            collaborate on an exciting project, feel free to message me. Let's
            work together!
          </p>
        </div>
      </div>
    </section>
  );
}
