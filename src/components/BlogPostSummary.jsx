import React from "react";

/** @param {{post: import("../content/blogPosts").BlogPost, headingLevel: 2 | 3}} props */
export function BlogPostSummary({ post, headingLevel }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return <article>
    <Heading><a href={`/blog/${post.slug}/`}>{post.title}</a></Heading>
    <time dateTime={post.date}>{post.date}</time>
    {post.draft && <strong className="draft-label">Draft preview</strong>}
    <p>{post.description}</p>
  </article>;
}
