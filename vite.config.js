import { defineConfig } from "vite";
import autoprefixer from "autoprefixer";
import postcss from "postcss";
import { cpSync } from "node:fs";

export default defineConfig({
    plugins: [
        {
            name: "copy-static-assets",
            closeBundle() {
                cpSync("static", "dist/static", { recursive: true });
            },
        },
    ],
    css: {
        postcss: {
            plugins: [autoprefixer({})],
        },
    },
});
