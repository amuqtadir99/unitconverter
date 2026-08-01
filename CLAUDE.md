# Convertly — Project Memory

Guidance for any AI/dev agent working in this repo. Keep this file current; it is
the single source of truth for architecture, conventions, and shipping standards.

## What this is

**Convertly** is a modern, production-ready unit converter web app. Users perform
fast, accurate conversions across 14 categories (length, mass, volume,
temperature, area, speed, time, digital storage, pressure, energy, power, angle,
data rate, fuel economy) inside an immersive, glassmorphic, 3D interface.

Design brief: upscale the generic Scrimba "unit converter" solo project into a
polished, mobile-first, SEO-ready product with a 3D/immersive design system.

## Tech stack

| Concern        | Choice                              | Notes                                   |
| -------------- | ----------------------------------- | --------------------------------------- |
| Framework      | Next.js 14 (App Router)             | Static-exportable; deploys to Vercel    |
| Language       | TypeScript (strict)                 | `npm run typecheck` must pass           |
| Styling        | Tailwind CSS 3                      | Design tokens as CSS vars in globals.css |
| Animation      | Framer Motion 11                    | 3D tilt, layout animation, transitions  |
| Fonts          | Inter + JetBrains Mono (next/font)  | Self-hosted, no layout shift            |
| Deploy target  | Vercel / any Node 18+ host          | Fully static output, no server runtime  |

## Architecture

```
app/
  layout.tsx      Root layout, metadata, fonts, aurora backdrop, no-flash theme script
  page.tsx        Server component: header, hero, <Converter/>, features, footer, JSON-LD
  globals.css     Design tokens (CSS vars), glass/aurora/shimmer utilities, a11y resets
  robots.ts       SEO: robots.txt
  sitemap.ts      SEO: sitemap.xml (home + per-category anchors)
  manifest.ts     PWA manifest
  icon.svg        App icon (used by manifest + favicon)
components/
  Converter.tsx   Client: category tabs, from/to inputs, swap, live "all units" grid, 3D tilt
  ThemeToggle.tsx Client: light/dark toggle persisted to localStorage
lib/
  units.ts        Conversion engine: categories, units, convert(), formatResult()
```

### Conversion engine (`lib/units.ts`) — the core

- Every `Unit` declares `toBase`/`fromBase`. Most are `linear(id, name, symbol, factor)`;
  temperature and `L/100km` use custom `affine`/inverse functions.
- Convert across units in a category with `convert(category, fromId, toId, value)`
  (goes value → base → target). This keeps N units at O(N) factors, not O(N²) pairs.
- **When adding a unit:** add one entry with an exact SI-derived factor. Do not
  add pairwise conversions. Verify against a known reference (e.g. 1 m = 3.28084 ft).
- `formatResult()` owns all display formatting (sig-figs, thousands separators,
  exponential fallback for extreme magnitudes). Do not format numbers inline.

## Commands

```bash
npm run dev        # local dev server
npm run build      # production build (must pass before commit)
npm run typecheck  # tsc --noEmit (must pass before commit)
npm run lint       # next lint
```

## Conventions & standards

- **Accessibility:** semantic landmarks, `aria-label`s on icon-only controls,
  `role="tab"`/`aria-selected` on category pills, honors `prefers-reduced-motion`.
- **Performance:** everything renders statically; keep First Load JS lean. All
  conversion math runs client-side — no network calls, no analytics beacons.
- **Design tokens:** colors/spacing live as CSS variables in `globals.css` and are
  surfaced to Tailwind via `tailwind.config.ts`. Theme both light and dark.
- **Security:** hardening headers set in `next.config.mjs`; keep the runtime Next
  version patched (audit on dependency bumps).
- **Immersive design system:** aurora gradient-mesh backdrop, frosted `.glass`
  surfaces, pointer-driven 3D card tilt with a glare highlight, shimmer headline,
  spring-animated category pill. Prefer transform/opacity animations (GPU-cheap).

## Reference repositories (engineering memory)

These informed the workflow and standards for shipping this app. Consult them
when extending the project; they are references, not runtime dependencies.

- **[JustVugg/colibri](https://github.com/JustVugg/colibri)** — lightweight,
  fast UI patterns; informs the minimal-footprint, component-first structure.
- **[ruvnet/ruflo](https://github.com/ruvnet/ruflo)** — agentic/workflow
  orchestration patterns for structuring multi-step build tasks.
- **[AgriciDaniel/claude-seo](https://github.com/AgriciDaniel/claude-seo)** —
  SEO playbook: drives the metadata, JSON-LD `WebApplication` schema, sitemap,
  robots, and per-category discoverability here.
- **[nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)**
  — UI/UX heuristics behind the immersive 3D/glassmorphism design system,
  spacing rhythm, and responsive layout.
- **[rohitg00/awesome-claude-code-toolkit](https://github.com/rohitg00/awesome-claude-code-toolkit)**
  — curated Claude Code tooling/skills; reference for repo automation and DX.
- **[drona23/claude-token-efficient](https://github.com/drona23/claude-token-efficient)**
  — token-efficiency practices: write files directly, avoid redundant fetches,
  batch independent operations, cite references instead of re-deriving them.

## Roadmap ideas

- URL state (`?cat=length&from=m&to=ft&v=20`) for shareable conversions.
- Favorites / recent conversions in localStorage.
- Currency conversion (needs a rates API — would add a server route).
- Keyboard shortcuts and command palette.
- Unit tests for `lib/units.ts` (Vitest) covering round-trips and edge magnitudes.
