import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

const run = promisify(execFile);
const script = fileURLToPath(new URL("../check-deployment.mjs", import.meta.url));

for (const scenario of [
  { name: "accepts generated pages and a real custom 404" },
  { name: "rejects a soft 404", status: 200, error: /expected HTTP 404, received 200/ },
  { name: "rejects the host's generic 404", body: "Not Found", error: /expected generated page content/ },
  { name: "rejects an indexable 404", body: "<h1>Page not found</h1>", error: /expected noindex metadata/ },
  { name: "rejects a redirect to the homepage", status: 302, error: /fetch failed/ },
]) {
  test(scenario.name, async (t) => {
    const paths = [];
    const server = createServer((request, response) => {
      paths.push(request.url);
      response.setHeader("content-type", "text/html; charset=utf-8");
      if (request.url === "/") return response.end('<main><section id="portfolio">Portfolio</section></main>');
      if (request.url === "/blog/") return response.end("<h1>Blog</h1>");
      response.statusCode = scenario.status || 404;
      if (response.statusCode === 302) response.setHeader("location", "/");
      response.end(scenario.body ?? '<meta name="robots" content="noindex"><h1>Page not found</h1>');
    });
    t.after(() => new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
      server.closeAllConnections();
    }));
    await new Promise((resolve, reject) => {
      server.once("error", reject);
      server.listen(0, "127.0.0.1", resolve);
    });
    const result = run(process.execPath, [script, `http://127.0.0.1:${server.address().port}`], { timeout: 20_000 });
    if (scenario.error) {
      await assert.rejects(result, (error) => {
        assert.equal(error.code, 1);
        assert.match(error.stderr, scenario.error);
        return true;
      });
    } else {
      const { stdout } = await result;
      assert.equal((stdout.match(/PASS /g) || []).length, 3);
    }
    assert.deepEqual(paths.slice(0, 2), ["/", "/blog/"]);
    assert.match(paths[2], /^\/blog\/deployment-check-[a-f0-9-]+\/$/);
  });
}
