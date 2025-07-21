// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import remarkMath from "remark-math";
import remarkDirective from "remark-directive";
import rehypeKatex from "rehype-katex";
import { rehypeLanguageDetect } from "./plugins/rehype-language-detect.js";
import icon from "astro-icon";
import svelte from "@astrojs/svelte";
import { createShikiConfig } from "./shiki-ext.js";
import tailwindcss from "@tailwindcss/vite";
import YAML from "js-yaml";
import fs from "node:fs";
import { typst } from "astro-typst";

const dataOutside = fs.existsSync("../data");
export const dataPath = dataOutside ? "../data" : "./data";

/** @type {any} */
const ThemeConfig = (() => {
  try {
    const str = fs.readFileSync(
      new URL(`${dataPath}/theme-config.yml`, import.meta.url),
      "utf8"
    );
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
    remarkPlugins: [remarkMath, remarkDirective],
    rehypePlugins: [rehypeKatex, rehypeLanguageDetect],
    shikiConfig: createShikiConfig(),
    remarkRehype: {
      allowDangerousHtml: true,
      footnoteLabel: "脚注",
    },
  },
  integrations: [
    mdx(),
    sitemap(),
    icon(),
    svelte(),
    typst({
      options: {
        remPx: 14,
      },
      target: (id) => {
        if (id.endsWith(".html.typ") || id.includes("/html/")) return "html";
        return "svg";
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": new URL("./src/", import.meta.url).pathname,
        "@data": new URL(dataPath, import.meta.url).pathname,
      },
    },
  },
  prefetch: { defaultStrategy: "viewport" },
  image: {
    remotePatterns: [{ protocol: "https" }],
  },
});
