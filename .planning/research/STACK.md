# Technology Stack

**Project:** Peace Index PWA
**Researched:** 2026-04-13
**Confidence:** MEDIUM-HIGH (versions verified via npm/official sources; some version numbers sourced from web search rather than direct package inspection)

---

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| React | 19.x | UI framework | Stable, widely supported, Actions/useOptimistic reduce boilerplate for form-heavy flows. React 19 is the current release and is the default for new Vite projects as of 2025. Backward-compatible with React 18 patterns. |
| Vite | 8.x | Build tool / dev server | Current stable (8.0.x as of April 2026). Ships Rolldown (Rust bundler) for 10–30x faster builds. Zero-config for React + TypeScript. @vitejs/plugin-react v6 no longer needs Babel — smaller install. |
| TypeScript | 5.x | Type safety | Dexie 4.x is TypeScript-first (schema types are inferred from DB definition). Recharts has full typings. Tailwind v4 tooling works best with TS. Avoids runtime data-shape bugs for stored assessment records. |

### PWA Layer

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| vite-plugin-pwa | 1.2.x | Service worker + web manifest | Zero-config PWA on top of Vite. Wraps Workbox (v7). Handles offline caching, installability, and manifest generation in `vite.config.ts` — no manual service worker authoring needed. This is the established standard for Vite PWAs. |
| Workbox | 7.x (via plugin) | Service worker strategies | Included transitively through vite-plugin-pwa. `generateSW` strategy is sufficient for a static-asset + local-data app. No need to configure separately unless adding background sync later. |

### Storage

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Dexie.js | 4.4.x | IndexedDB wrapper | **Use IndexedDB, not localStorage.** localStorage is capped at 5–10 MB and is synchronous (blocks main thread). Dexie 4.x provides a typed, table-based API, schema versioning/migrations, and `useLiveQuery` for reactive React integration. Assessment records are structured objects with dates — a natural fit for a table schema. Dexie is the community standard for this use case. |
| dexie-react-hooks | 4.x | `useLiveQuery` hook | Comes alongside Dexie. Makes any component that reads assessment history automatically re-render when data changes. Eliminates manual state sync between storage and UI. |

### UI & Styling

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Tailwind CSS | 4.x | Utility-first styling | v4 ships as a CSS-first config (no `tailwind.config.js`). Integrates via `@tailwindcss/vite` Vite plugin. Smaller output, faster HMR. Perfect for a minimal/modern coaching-context aesthetic. |
| shadcn/ui | current (CLI-based) | Component primitives | Not a package — components are copied into your repo via CLI, so you own the code. Provides accessible, Tailwind-styled Slider, Card, Progress, Button, and Dialog primitives that are exactly what this app needs for the scoring UI. Supports Tailwind v4 (use `npx shadcn@canary init` for new projects). |

**Note on shadcn/ui with Tailwind v4:** As of early 2026, shadcn/ui Tailwind v4 support is in canary. If you want a stable, non-canary setup, pin Tailwind to 3.x and use `npx shadcn@latest init`. Either path works — Tailwind v4 is the forward direction but canary carries some integration risk.

### Charts

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Recharts | 3.8.x | Data visualization | The right choice for this app. Supports `RadarChart` (spider/pentagon view of the 5 dimensions) and `LineChart`/`AreaChart` (trend over time). SVG-based, composable React components, minimal API. The LogRocket 2025 chart library survey ranks Recharts as the top pick for "simplicity, ease of use, and strong community support" for tracking/dashboard apps. The app will have at most dozens of data points — no need for Canvas-based performance of Chart.js. |

### Supporting Utilities

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| date-fns | 3.x | Date formatting | Format assessment timestamps in history view (e.g., "March 14, 2026"). Lightweight, tree-shakeable. Use instead of moment.js (deprecated) or day.js (fewer locale utilities). |
| lucide-react | current | Icon set | Clean, consistent icons for the UI (dimension icons, navigation). Ships as individual SVG components, zero unused icons in bundle. |

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Build tool | Vite 8 | Create React App | CRA is unmaintained. Not appropriate for new projects in 2025. |
| Build tool | Vite 8 | Next.js | Next.js is SSR-focused. This app has no server, no routing complexity beyond 2–3 views. Next.js adds meaningless overhead. |
| Storage | Dexie (IndexedDB) | localStorage | localStorage is 5–10 MB max, synchronous, string-only. Not appropriate for structured timestamped records that grow over time. |
| Storage | Dexie (IndexedDB) | localForage | localForage is a simpler abstraction but lacks Dexie's schema versioning, TypeScript-first API, and React live query hook. Dexie is strictly better for structured data. |
| Charts | Recharts | Chart.js / react-chartjs-2 | Chart.js uses Canvas, which is harder to style consistently and doesn't compose as React components. react-chartjs-2 is a wrapper that fights React's model. Only preferred over Recharts when rendering thousands of data points — not applicable here. |
| Charts | Recharts | Nivo | Nivo has larger bundle size and steeper learning curve. Radar + Line charts in Nivo require more boilerplate. Recharts is simpler for this use case. |
| Charts | Recharts | visx (Airbnb) | visx is a low-level primitive library — you build charts from scratch. Power you don't need when Recharts' `RadarChart` and `LineChart` map directly to requirements. |
| UI components | shadcn/ui | MUI (Material UI) | MUI enforces Google Material Design opinionated visuals. The coaching context requires a neutral, clean aesthetic — Tailwind + shadcn/ui gives full visual control without fighting a design system. |
| UI components | shadcn/ui | Mantine | Mantine is a full-featured component library with its own styling system. Conflicts with Tailwind. Unnecessary complexity for this scope. |
| CSS | Tailwind CSS | CSS Modules / plain CSS | Tailwind removes the need to name classes and keeps styling colocated with components. For a small team (or solo) shipping fast, Tailwind utility classes reduce context-switching. |

---

## Installation

```bash
# Scaffold project
npm create vite@latest peace-index -- --template react-ts
cd peace-index

# Tailwind CSS v4 (CSS-first config)
npm install tailwindcss @tailwindcss/vite

# shadcn/ui (Tailwind v4 canary path)
npx shadcn@canary init

# OR: stable path with Tailwind v3
# npm install tailwindcss postcss autoprefixer
# npx shadcn@latest init

# PWA
npm install -D vite-plugin-pwa

# Storage
npm install dexie dexie-react-hooks

# Charts
npm install recharts

# Utilities
npm install date-fns lucide-react
```

**vite.config.ts additions:**
```ts
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Peace Index',
        short_name: 'Peace Index',
        theme_color: '#ffffff',
        icons: [ /* 192x192, 512x512 */ ]
      }
    })
  ]
})
```

---

## What NOT to Use

| Technology | Reason |
|------------|--------|
| Next.js | No server needed. Adds SSR complexity, hydration overhead, and deployment requirements that provide zero benefit for a local-only PWA. |
| Create React App | Unmaintained since 2023. Slow builds. Dead end. |
| Redux / Zustand | Dexie's `useLiveQuery` IS your state management for persisted data. A separate state manager adds duplication. Local ephemeral state (current step in assessment) is fine with `useState`. |
| Firebase / Supabase | Explicitly out of scope. No backend for v1. Adds auth/network complexity that conflicts with offline-first goal. |
| localStorage (direct) | Too small, synchronous, no migrations. Use Dexie over IndexedDB instead. |
| moment.js | Deprecated. Use date-fns. |
| Chart.js / react-chartjs-2 | Canvas-based, React-unfriendly composition model. Recharts is the right tool at this data scale. |
| Tailwind v3 + v4 mixed | Pick one path and stay on it. Mixing causes class conflicts. |

---

## Confidence Assessment

| Decision | Confidence | Notes |
|----------|------------|-------|
| Vite 8 as build tool | HIGH | Official Vite blog confirms v8 stable (March 2026). Rolldown bundler. |
| React 19 | HIGH | Current stable release. Backward-compatible. |
| TypeScript 5.x | HIGH | Industry standard. |
| vite-plugin-pwa 1.2.x | MEDIUM | npm confirms version; changelog not directly inspected. |
| Dexie 4.4.x | HIGH | npm confirms 4.4.2, published 12 days ago. |
| Recharts 3.8.x | HIGH | npm confirms 3.8.1, published ~19 days ago. Radar + Line chart confirmed. |
| Tailwind v4 + shadcn canary | MEDIUM | shadcn Tailwind v4 support documented but canary status means potential rough edges. |
| date-fns 3.x | MEDIUM | Version based on training knowledge, not directly verified via npm this session. |

---

## Sources

- Vite 8 announcement: https://vite.dev/blog/announcing-vite8
- vite-plugin-pwa npm: https://www.npmjs.com/package/vite-plugin-pwa
- Dexie npm (v4.4.2): https://www.npmjs.com/package/dexie
- Dexie useLiveQuery docs: https://dexie.org/docs/dexie-react-hooks/useLiveQuery()
- Recharts npm (v3.8.1): https://www.npmjs.com/package/recharts
- LogRocket React chart libraries 2025: https://blog.logrocket.com/best-react-chart-libraries-2025/
- shadcn/ui Tailwind v4 docs: https://ui.shadcn.com/docs/tailwind-v4
- Offline storage for PWAs (LogRocket): https://blog.logrocket.com/offline-storage-for-pwas/
- React PWA with Vite + Workbox: https://rommelsaquicela.com/blog/building-an-offline-first-react-app-with-vite-and-workbox/
