# Leuchtturm Online

A fictional German news article page built with **Astro 5** as a case study. The project demonstrates three distinct frontend patterns on a single article page: a weather widget, a share web component, and a related articles island.

## Getting Started

**Prerequisites:** Node.js 18+ and [pnpm](https://pnpm.io/)

```sh
pnpm install
pnpm dev
```

The dev server starts at `http://localhost:4321`.

## Commands

| Command           | Action                                                     |
| :---------------- | :--------------------------------------------------------- |
| `pnpm dev`        | Start dev server at `localhost:4321`                       |
| `pnpm build`      | Build production site to `./dist/`                         |
| `pnpm preview`    | Preview production build locally                           |
| `pnpm test`       | Run unit tests (Vitest)                                    |
| `pnpm test:e2e`   | Run E2E tests (Playwright)                                 |

## Tech Stack

- **Astro 5** — static site generation, zero JS by default
- **Vue 3** — island architecture via `client:visible`
- **SCSS** — scoped component styles + global design tokens
- **TypeScript** — strict mode
- **Vitest + Playwright** — unit and E2E testing with accessibility checks (axe-core)

## Three Features

1. **Weather Widget** — server-rendered at build time with client-side refresh via the Open-Meteo API.
2. **Share Section** — a Custom Element with Shadow DOM offering Web Share, clipboard, email, and Twitter sharing. Falls back gracefully without JS.
3. **Related Articles** — a Vue 3 island loaded with `client:visible` that fetches Hacker News top stories. Handles loading, success, error, and empty states.

## Project Structure

```
src/
├── components/     # Astro components, Vue island, Custom Element
├── layouts/        # Base HTML shell (lang="de", skip link, header, footer)
├── pages/          # File-based routing
├── lib/            # Pure logic (weather, hacker-news)
├── types/          # TypeScript type definitions
└── styles/         # SCSS partials (_variables, _mixins, _reset, _typography)
tests/
├── unit/           # Vitest tests
└── e2e/            # Playwright + axe-core accessibility tests
```

## Key Principles

- **Accessibility** — skip link, ARIA landmarks, keyboard navigation, WCAG AA contrast, `prefers-reduced-motion`
- **Progressive enhancement** — every JS feature has a visible no-JS fallback
- **Zero initial JS** — Vue is deferred via `client:visible`, other scripts are inline bundles
