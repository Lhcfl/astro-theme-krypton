# Astro Theme Krypton

## 🚀 Install

```sh
pnpm dev
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `pnpm install`         | Installs dependencies                            |
| `pnpm dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm build`           | Build your production site to `./dist/`          |
| `pnpm preview`         | Preview your build locally, before deploying     |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help` | Get help using the Astro CLI                     |

Features:

- ✅ 100/100 Lighthouse performance
- ✅ SEO-friendly with canonical URLs and OpenGraph data
- ✅ Sitemap support
- ✅ RSS Feed support
- ✅ Markdown & MDX support
- ✅ Dark / Light mode toggle
- ✅ Responsive design
- ✅ Full text fuzzy search
- ✅ Good accessibility

## 🚀 Project Structure

Inside of this project, you'll see the following folders and files:

```text
├── data/
│   ├── blog/
│   │   └── helloworld.md
│   └── pages/
│       ├── links.mdx
│       └── about.md
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   ├── pages/
│   ├── styles/
│   ├── utils/
│   ├── consts.ts
│   └── content.config.ts
├── astro.config.mjs
├── README.md
├── package.json
└── tsconfig.json
```

The theme will looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

And you can put any `.md` and `.mdx` pages in `data/pages/` directory, which will be rendered as static pages. For example, `data/pages/links.mdx` will create a `your-website.com/links/index.html`. The `data/` directory is a good place to put any static content that you want to render as pages and **being searched**, like an "About" page or a "Links" page.

For blogs, you can put your `.md` files in the `data/blog/` directory. Each file will be rendered as a blog post, and the theme will automatically generate a list of all blog posts at `your-website.com/blog/[filename]`.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.
