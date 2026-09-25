import { defineConfig } from "vite";
import autoprefixer from "autoprefixer";
import { loadBlogPosts } from "./scripts/blog-posts.mjs";

export default defineConfig(({ command }) => ({
  plugins: [{
    name: "repository-blog-posts",
    resolveId(id) { return id === "virtual:blog-posts" ? "\0virtual:blog-posts" : null; },
    async load(id) {
      if (id !== "\0virtual:blog-posts") return null;
      const posts = await loadBlogPosts({
        directory: process.env.BLOG_POSTS_DIR || "content/blog",
        includeDrafts: command === "serve",
      });
      return `export default ${JSON.stringify(posts)};`;
    },
    configureServer(server) {
      server.watcher.add(process.env.BLOG_POSTS_DIR || "content/blog");
      server.watcher.on("all", (_event, path) => {
        if (!path.endsWith(".md")) return;
        const module = server.moduleGraph.getModuleById("\0virtual:blog-posts");
        if (module) server.moduleGraph.invalidateModule(module);
        server.ws.send({ type: "full-reload" });
      });
    },
  }],
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
}));
