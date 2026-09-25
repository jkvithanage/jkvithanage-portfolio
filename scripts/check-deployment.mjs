import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

async function checkDeployment() {
  const [input, ...extra] = process.argv.slice(2);
  assert.ok(input && !extra.length, "Usage: npm run test:deployment -- https://your-deployment.example");
  const base = new URL(input);
  assert.ok(["http:", "https:"].includes(base.protocol) && !base.username && !base.password,
    "Supply an HTTP(S) deployment URL without credentials");
  assert.ok(base.pathname === "/" && !base.search && !base.hash, "Supply the deployment origin, without a path, query, or fragment");

  const checks = [
    { path: "/", status: 200, content: /<main\b[^>]*>[\s\S]*id="portfolio"/ },
    { path: "/blog/", status: 200, content: /<h1\b[^>]*>Blog<\/h1>/ },
    { path: `/blog/deployment-check-${randomUUID()}/`, status: 404, content: /<h1\b[^>]*>Page not found<\/h1>/ },
  ];

  for (const { path, status, content } of checks) {
    const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(15_000), redirect: "error" });
    assert.equal(response.status, status, `${path}: expected HTTP ${status}, received ${response.status}`);
    assert.match(response.headers.get("content-type") || "", /text\/html/i, `${path}: expected HTML`);
    const html = await response.text();
    assert.match(html, content, `${path}: expected generated page content before JavaScript`);
    if (status === 404) {
      assert.match(html, /<meta\b(?=[^>]*\bname=["']robots["'])(?=[^>]*\bcontent=["'][^"']*\bnoindex\b)[^>]*>/i,
        `${path}: expected noindex metadata`);
    }
    console.log(`PASS ${path}: HTTP ${status}, generated HTML${status === 404 ? ", noindex" : ""}`);
  }
}

checkDeployment().catch((error) => {
  console.error(`Deployment check failed: ${error.message}`);
  process.exitCode = 1;
});
