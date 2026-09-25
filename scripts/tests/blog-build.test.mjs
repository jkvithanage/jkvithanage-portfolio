import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { cp, mkdir, mkdtemp, readFile, realpath, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

const run = promisify(execFile);
const repository = fileURLToPath(new URL("../../", import.meta.url));
const metadata = {
  title: "Build validation post",
  slug: "build-validation-post",
  description: "A post used to exercise the production build.",
  date: "2026-09-24",
  draft: false,
};

function post(fields = metadata, body = "A readable article.") {
  return `---\n${Object.entries(fields).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join("\n")}\n---\n\n${body}\n`;
}

test("production builds validate Blog Posts", { timeout: 180_000 }, async (t) => {
  const workspace = await mkdtemp(join(tmpdir(), "portfolio-blog-validation-"));
  t.after(() => rm(workspace, { recursive: true, force: true }));
  // Exercise the real build without touching the author's content or dist/.
  for (const path of ["package.json", "vite.config.js", "index.html", "scripts", "src", "public"]) {
    await cp(join(repository, path), join(workspace, path), { recursive: true });
  }
  await symlink(await realpath(join(repository, "node_modules")), join(workspace, "node_modules"), "junction");
  const content = join(workspace, "content/blog");
  await mkdir(content, { recursive: true });
  const env = { ...process.env };
  delete env.BLOG_POSTS_DIR;

  async function build() {
    return run(process.execPath, ["scripts/build.mjs"], {
      cwd: workspace, env, timeout: 30_000, maxBuffer: 2 * 1024 * 1024,
    });
  }

  await t.test("valid metadata and a local image generate a published article", async () => {
    await writeFile(join(content, "post.md"), post(metadata, "![Site icon](/favicon-32x32.png)"));
    await build();
    const html = await readFile(join(workspace, "dist/blog/build-validation-post/index.html"), "utf8");
    assert.match(html, /Build validation post/);
    assert.match(html, /<img src="\/favicon-32x32.png" alt="Site icon"/);
  });

  const cases = [];
  for (const field of ["title", "slug", "description", "date", "draft"]) {
    const fields = { ...metadata };
    delete fields[field];
    cases.push({ name: `missing ${field}`, source: post(fields), error: field === "draft"
      ? /draft must be true or false/ : new RegExp(`required metadata ${field}`) });
  }
  cases.push(
    { name: "malformed slug", source: post({ ...metadata, slug: "Bad Slug" }), error: /slug must use lowercase letters, digits, and single hyphens/ },
    { name: "duplicate slug", source: post(), duplicate: true, file: "second.md", error: /duplicate slug: build-validation-post/ },
    { name: "impossible date", source: post({ ...metadata, date: "2026-02-30" }), error: /date must be a real YYYY-MM-DD date: 2026-02-30/ },
    { name: "missing Markdown image", source: post(metadata, "![Missing image](/blog-assets/absent.png)"), error: /missing local asset: \/blog-assets\/absent.png/ },
    { name: "missing cover image", source: post({ ...metadata, cover: "/blog-assets/absent.png", coverAlt: "Missing cover" }), error: /missing local asset: \/blog-assets\/absent.png/ },
    { name: "missing cover alternative text", source: post({ ...metadata, cover: "/favicon-32x32.png" }), error: /coverAlt is required when cover is set/ },
  );

  for (const scenario of cases) {
    await t.test(scenario.name, async () => {
      await rm(content, { recursive: true });
      await mkdir(content, { recursive: true });
      await writeFile(join(content, "post.md"), scenario.source);
      if (scenario.duplicate) await writeFile(join(content, "second.md"), scenario.source);
      await assert.rejects(build(), (error) => {
        assert.equal(error.code, 1, "the build must reject the content, rather than time out or fail to start");
        const output = `${error.stdout}\n${error.stderr}`;
        assert.ok(output.includes(join(content, scenario.file || "post.md")), output);
        assert.match(output, scenario.error);
        return true;
      });
    });
  }
});
