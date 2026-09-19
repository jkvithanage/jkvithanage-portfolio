import React from "react";

export function HeroSection() {
  return (
    <section className="section-hero" aria-labelledby="hero-title">
      <div className="hero__content">
        <p className="hero__greet">Hello, my name is</p>
        <h1 id="hero-title" className="hero__title stroke-center">
          Janaka Vithanage
        </h1>
        <p className="hero__subtitle">Full Stack Developer</p>
        <a
          href="#portfolio"
          className="btn btn-lg btn-outlined hero__btn"
        >
          See my work
        </a>
      </div>
      <div className="hero__scroll-down" aria-hidden="true" />
    </section>
  );
}
