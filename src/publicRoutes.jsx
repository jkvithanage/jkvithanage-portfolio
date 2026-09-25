import React from "react";
import { App } from "./App";
import { SiteFooter } from "./components/SiteFooter";
import { BlogPage } from "./components/BlogPage";
import { BlogPostPage } from "./components/BlogPostPage";
import { blogPosts } from "./content/blogPosts";

const siteUrl = "https://www.jkvithanage.com";
const homeDescription = "Janaka Vithanage is a software developer specialized in Ruby on Rails, React and JavaScript.";
const blogDescription = blogPosts.length
  ? "Technical articles by Janaka Vithanage."
  : "Technical articles by Janaka Vithanage are coming soon.";

/** @param {{year: number}} props */
function NotFoundPage({ year }) {
  return (
    <>
      <main className="main not-found">
        <h1>Page not found</h1>
        <p>The page you requested could not be found.</p>
        <a href="/">Return to the home page</a>
      </main>
      <SiteFooter year={year} />
    </>
  );
}

/**
 * The public route is the shared boundary for browser rendering and generation.
 * Unknown paths use the same not-found document as /404.html.
 * @param {string} pathname
 * @param {number} year
 */
export function renderPublicRoute(pathname, year) {
  if (pathname === "/" || pathname === "/index.html") {
    return {
      page: <App year={year} />,
      metadata: {
        title: "Janaka Vithanage",
        description: homeDescription,
        canonical: `${siteUrl}/`,
        socialTitle: "Janaka Vithanage - Software Developer",
        socialDescription: homeDescription,
      },
    };
  }

  if (pathname === "/blog/" || pathname === "/blog/index.html") {
    return {
      page: <BlogPage year={year} />,
      metadata: {
        title: "Blog | Janaka Vithanage",
        description: blogDescription,
        canonical: `${siteUrl}/blog/`,
        socialTitle: "Blog | Janaka Vithanage",
        socialDescription: blogDescription,
      },
    };
  }

  const post = blogPosts.find((item) => pathname === `/blog/${item.slug}/` || pathname === `/blog/${item.slug}/index.html`);
  if (post) {
    const canonical = `${siteUrl}/blog/${post.slug}/`;
    return {
      page: <BlogPostPage year={year} post={post} />,
      metadata: {
        title: `${post.title} | Janaka Vithanage`,
        description: post.description,
        canonical: post.draft ? undefined : canonical,
        robots: post.draft ? "noindex" : undefined,
        socialTitle: post.title,
        socialDescription: post.description,
        type: "article",
        publishedTime: post.date,
        image: post.cover || "/og-image.jpg",
        structuredData: post.draft ? undefined : {
          "@context": "https://schema.org", "@type": "BlogPosting",
          headline: post.title, description: post.description,
          datePublished: post.date, mainEntityOfPage: canonical,
          image: `${siteUrl}${post.cover || "/og-image.jpg"}`,
          author: { "@type": "Person", name: "Janaka Vithanage" },
        },
      },
    };
  }

  return {
    page: <NotFoundPage year={year} />,
    metadata: {
      title: "Page not found | Janaka Vithanage",
      description: "The requested page could not be found on Janaka Vithanage's portfolio.",
      robots: "noindex",
      socialTitle: "Page not found | Janaka Vithanage",
      socialDescription: "The requested page could not be found on Janaka Vithanage's portfolio.",
    },
  };
}

/** @param {string} value */
function escapeAttribute(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
}

/** @param {ReturnType<typeof renderPublicRoute>["metadata"]} metadata */
export function renderPageMetadata(metadata) {
  const title = escapeAttribute(metadata.title);
  const description = escapeAttribute(metadata.description);
  const socialTitle = escapeAttribute(metadata.socialTitle);
  const socialDescription = escapeAttribute(metadata.socialDescription);
  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    ...(metadata.canonical ? [`<link rel="canonical" href="${escapeAttribute(metadata.canonical)}" />`] : []),
    ...(metadata.robots ? [`<meta name="robots" content="${escapeAttribute(metadata.robots)}" />`] : []),
    `<meta property="og:title" content="${socialTitle}" />`,
    `<meta property="og:description" content="${socialDescription}" />`,
    `<meta property="og:type" content="${metadata.type || "website"}" />`,
    ...(metadata.publishedTime ? [`<meta property="article:published_time" content="${escapeAttribute(metadata.publishedTime)}" />`] : []),
    ...(metadata.canonical ? [`<meta property="og:url" content="${escapeAttribute(metadata.canonical)}" />`] : []),
    `<meta property="og:image" content="${escapeAttribute(metadata.image || "/og-image.jpg")}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta property="twitter:domain" content="jkvithanage.com" />`,
    ...(metadata.canonical ? [`<meta property="twitter:url" content="${escapeAttribute(metadata.canonical)}" />`] : []),
    `<meta name="twitter:title" content="${socialTitle}" />`,
    `<meta name="twitter:description" content="${socialDescription}" />`,
    `<meta name="twitter:image" content="${escapeAttribute(metadata.image || "/og-image.jpg")}" />`,
    `<meta name="twitter:creator" content="@jkvithanage" />`,
    `<meta name="twitter:creator:id" content="@jkvithanage" />`,
    ...(metadata.structuredData ? [`<script type="application/ld+json">${JSON.stringify(metadata.structuredData).replaceAll("<", "\\u003c")}</script>`] : []),
  ].join("\n    ");
}
