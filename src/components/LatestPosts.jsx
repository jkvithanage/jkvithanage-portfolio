import React from "react";
import { blogPosts } from "../content/blogPosts";
import { BlogPostSummary } from "./BlogPostSummary";

export function LatestPosts() {
  return (
    <section id="latest-posts" className="section latest-posts" aria-labelledby="latest-posts-title">
      <h2 id="latest-posts-title" className="stroke-left">Latest posts</h2>
      {blogPosts.length ? <ol className="blog-post-list">
        {blogPosts.slice(0, 3).map((post) => <li key={post.slug}><BlogPostSummary post={post} headingLevel={3} /></li>)}
      </ol> : <p>Articles are coming soon.</p>}
      <a className="btn btn-outlined" href="/blog/">Visit the Blog</a>
    </section>
  );
}
