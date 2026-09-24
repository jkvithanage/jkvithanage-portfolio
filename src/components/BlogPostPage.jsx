import React from "react";
import { SiteLayout } from "./SiteLayout";
import { ThemeProvider } from "../theme/ThemeProvider";

/** @param {{year: number, post: import("../content/blogPosts").BlogPost}} props */
export function BlogPostPage({ year, post }) {
  return <ThemeProvider><SiteLayout year={year}>
    <main className="main blog-page">
      <article className="section blog-page__content blog-article">
        <a className="link" href="/blog/">← All posts</a>
        {post.draft && <strong className="draft-label">Draft preview</strong>}
        <h1 className="stroke-left">{post.title}</h1>
        <time dateTime={post.date}>{post.date}</time>
        <p className="blog-article__description">{post.description}</p>
        {post.cover && <img className="blog-article__cover" src={post.cover} alt={post.coverAlt || ""} />}
        <div className="blog-article__body" dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
    </main>
  </SiteLayout></ThemeProvider>;
}
