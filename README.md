# Convertly — Modern Unit Converter

A production-ready, mobile-first unit converter with an immersive 3D design
system. Convert across **14 categories** and **110+ units** — instantly,
accurately, and entirely in your browser.

![Next.js](https://img.shields.io/badge/Next.js-14-000?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss&logoColor=white)
![License: MIT](https://img.shields.io/badge/license-MIT-green)

## Features

- **14 categories** — length, mass, volume, temperature, area, speed, time,
  digital storage, pressure, energy, power, angle, data rate, fuel economy.
- **Live conversion** — results update as you type, computed from precise
  SI-derived factors.
- **All-units grid** — see your value in every unit of the category at once; tap
  any card to make it the target.
- **Immersive design** — animated aurora backdrop, frosted glass surfaces,
  pointer-driven 3D card tilt, spring-animated category tabs.
- **Mobile-first & responsive** — touch-friendly, installable as a PWA.
- **Light & dark themes** — follows your system, remembers your choice, no flash.
- **Accessible** — semantic markup, keyboard-friendly, honors reduced motion.
- **SEO-ready** — metadata, JSON-LD, sitemap, robots, web manifest.
- **Private by design** — all math runs locally; no network calls, no tracking.

## Tech stack

Next.js 14 (App Router) · TypeScript (strict) · Tailwind CSS 3 · Framer Motion 11.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

### Scripts

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Start the dev server                 |
| `npm run build`     | Production build                     |
| `npm run start`     | Serve the production build           |
| `npm run typecheck` | Type-check with `tsc --noEmit`       |
| `npm run lint`      | Lint with ESLint / next lint         |

## Project structure

```
app/         Routes, layout, global styles, SEO (sitemap/robots/manifest)
components/  Converter (client) + ThemeToggle
lib/         units.ts — the conversion engine
```

## Adding a unit

Add one entry to the relevant category in `lib/units.ts` with an exact
SI-derived factor — the engine handles every pairwise conversion automatically:

```ts
linear('fur', 'Furlong', 'fur', 201.168), // meters per furlong
```

See [`CLAUDE.md`](./CLAUDE.md) for architecture, conventions, and engineering
references.

## Deploy

Optimized for [Vercel](https://vercel.com) — import the repo and deploy. Output
is fully static and runs on any Node 18+ host.

## License

[MIT](./LICENSE)
