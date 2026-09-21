import React from "react";

/**
 * Renders serializable content spans without putting JSX in a content model.
 *
 * @param {{ content: import("../content/models.js").InlineContent[] }} props
 */
export function RichText({ content }) {
  return content.map((span, index) => span.type === "link" ? (
    <a key={index} href={span.href} target="_blank" className="link" rel="noopener noreferrer" aria-label={span.label}>{span.content}</a>
  ) : span.content);
}
