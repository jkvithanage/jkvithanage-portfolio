import { defineConfig } from "vite";
import autoprefixer from "autoprefixer";
import postcss from "postcss";

export default defineConfig({
    css: {
        postcss: {
            plugins: [autoprefixer({})],
        },
    },
});
