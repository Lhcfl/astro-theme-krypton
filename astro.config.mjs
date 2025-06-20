// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import icon from "astro-icon";
import svelte from "@astrojs/svelte";
import { createShikiConfig } from "./shiki-ext.js";
import tailwindcss from "@tailwindcss/vite";
import YAML from "js-yaml";
import fs from "node:fs";

/** @type {any} */
const ThemeConfig = (() => {
  try {
    const str = fs.readFileSync("./data/theme-config.yml", "utf8");
    return YAML.load(str);
  } catch (e) {
    console.error("Error reading theme-config.yml:", e);
    throw e;
  }
})();

// https://astro.build/config
export default defineConfig({
  site: ThemeConfig.site,
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: createShikiConfig(),
  },
  integrations: [mdx(), sitemap(), icon(), svelte()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": new URL("./src/", import.meta.url).pathname,
        "@data": new URL("./data/", import.meta.url).pathname,
      },
    },
  },
  prefetch: { defaultStrategy: "viewport" },
  image: {
    remotePatterns: [{ protocol: "https" }],
  },
});
