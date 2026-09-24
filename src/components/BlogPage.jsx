import React from "react";
import { SiteLayout } from "./SiteLayout";
import { ThemeProvider } from "../theme/ThemeProvider";
import { blogPosts } from "../content/blogPosts";
import { BlogPostSummary } from "./BlogPostSummary";

/** @param {{year: number}} props */
export function BlogPage({ year }) {
  return (
    <ThemeProvider>
      <SiteLayout year={year}>
        <main className="main blog-page">
          <div className="section blog-page__content">
            <h1 className="stroke-left">Blog</h1>
            {blogPosts.length ? (
              <ol className="blog-post-list">
                {blogPosts.map((post) => <li key={post.slug}><BlogPostSummary post={post} headingLevel={2} /></li>)}
              </ol>
            ) : <><p>Articles are coming soon.</p><p>Until then, explore my <a className="link" href="/#portfolio">portfolio</a>.</p></>}
          </div>
        </main>
      </SiteLayout>
    </ThemeProvider>
  );
}
