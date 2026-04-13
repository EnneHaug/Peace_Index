# Architecture Patterns

**Domain:** PWA assessment/tracking app (offline-first, local storage, React)
**Researched:** 2026-04-13
**Confidence:** HIGH (multiple converging sources, well-established patterns)

---

## Recommended Architecture

The Peace Index app maps cleanly onto a layered App Shell + Local-First Data architecture — the standard for installable PWAs with no backend.

```
┌─────────────────────────────────────────────────────────┐
│                    PWA Layer (browser)                   │
│  Web App Manifest + Service Worker (Workbox/vite-pwa)   │
└─────────────────────────────────────────────────────────┘
          │ cache-first for shell, no network for data
          ▼
┌─────────────────────────────────────────────────────────┐
│                    App Shell (React)                     │
│  Router, Layout, Navigation — always cached, instant    │
└─────────────────────────────────────────────────────────┘
          │ renders
          ▼
┌───────────────────────────────────────────────────────────────────┐
│                         UI Layer                                   │
│                                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐  │
│  │  Assessment  │  │   Results    │  │   History / Trends     │  │
│  │    Screen    │  │   Summary    │  │   Screen (Charts)      │  │
│  │  (5 sliders) │  │  (5 scores)  │  │   (Recharts line)      │  │
│  └──────────────┘  └──────────────┘  └────────────────────────┘  │
└───────────────────────────────────────────────────────────────────┘
          │ reads/writes via hooks
          ▼
┌─────────────────────────────────────────────────────────┐
│                   Data Layer (Dexie.js)                  │
│   useLiveQuery hooks → IndexedDB → reactive re-renders  │
│                                                         │
│   Table: assessments                                    │
│   { id, date, purpose, people, place, health, provision}│
└─────────────────────────────────────────────────────────┘
          │ persists to
          ▼
┌─────────────────────────────────────────────────────────┐
│                IndexedDB (browser native)               │
│          Structured, asynchronous, large capacity       │
└─────────────────────────────────────────────────────────┘
```

---

## Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| **PWA Layer** (service worker + manifest) | Cache app shell assets, enable install prompt, offline load | Browser runtime; no React components directly |
| **App Shell** (root layout + router) | Navigation structure, route switching, global UI chrome | All screen components |
| **Assessment Screen** | Collect 5 dimension scores via sliders; submit triggers save | Data layer (write), Results Summary (navigation) |
| **Results Summary** | Display scores after submission, entry point to history | Assessment Screen (back), History Screen (navigation) |
| **History / Trends Screen** | Display past assessments in list + line chart over time | Data layer (read), Chart Component |
| **Chart Component** | Render a multi-line trend chart (one line per dimension) | History Screen (receives data as props) |
| **Data Layer** (`db.ts` + hooks) | Wrap Dexie.js; expose `useLiveQuery` hooks for reads, async functions for writes | All screens that need data; no UI knowledge |
| **Assessment Config** (`config.ts`) | Dimension definitions: names, descriptions, default values | Assessment Screen (reads), Results Summary (reads labels) |

---

## Data Flow

### Write Path (taking an assessment)

```
User adjusts sliders (Assessment Screen)
  → local component state (useState per dimension)
  → User submits
  → db.assessments.add({ date: now, ...scores })  [Dexie write to IndexedDB]
  → navigation to Results Summary
```

### Read Path (viewing history)

```
History Screen mounts
  → useLiveQuery(() => db.assessments.orderBy('date').toArray())
  → Dexie queries IndexedDB asynchronously
  → React re-renders with data (live, reactive — updates auto on new writes)
  → Chart Component receives array as props, renders lines
```

### PWA / Offline Path

```
First visit: browser downloads and caches app shell assets via service worker
Subsequent visits (offline or online):
  → service worker serves shell from cache (cache-first)
  → all data reads/writes go to local IndexedDB — zero network dependency
  → app is fully functional offline
```

---

## Patterns to Follow

### Pattern 1: App Shell + Cache-First for Static Assets

**What:** Pre-cache the compiled JS/CSS/HTML at install time. The "frame" of the app (navigation, layout) is always available instantly from cache.

**When:** Always — this is the baseline PWA pattern for SPAs.

**Implementation:** `vite-plugin-pwa` + Workbox `generateSW` strategy. Handles precache manifest injection automatically at build time.

### Pattern 2: Dexie `useLiveQuery` for Reactive Data

**What:** Instead of manually reading IndexedDB and managing state, `useLiveQuery` from `dexie-react-hooks` returns live query results that auto-update whenever the database changes.

**When:** All screens that display stored data (History, Results Summary showing latest entry).

**Why it matters:** Eliminates manual cache invalidation — write once, all subscribers update automatically. This is the primary reactive primitive for the data layer.

```typescript
// Example shape
const assessments = useLiveQuery(
  () => db.assessments.orderBy('date').toArray()
);
```

### Pattern 3: Single Assessments Table, Flat Schema

**What:** One IndexedDB object store with one record per assessment containing all five dimension scores and a timestamp.

**When:** This scope (single user, local only, five fixed dimensions).

**Why:** Joins add complexity without benefit when there's no backend. Flat records are trivially queryable, exportable, and schema-migratable via Dexie versioning.

```typescript
// Schema
db.version(1).stores({
  assessments: '++id, date'  // id auto-increment, date indexed for ordering
});
```

### Pattern 4: Dimension Config as Single Source of Truth

**What:** A `config.ts` file exports the five dimensions as an array of objects `{ key, label, description, color }`. Both the assessment form and the chart derive dimension order, labels, and colors from this config.

**When:** Always — prevents label drift between screens and makes adding dimensions (or the Hope Meter) a one-file change.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Using localStorage for Assessment Records

**What:** Storing the full assessment history in `localStorage` as a JSON blob.

**Why bad:** localStorage is synchronous, limited to ~5 MB, stores only strings (requires JSON serialization), has no indexing. Fine for simple flags/settings; wrong for a growing record collection.

**Instead:** Use IndexedDB via Dexie. localStorage is acceptable only for trivial flags (e.g., "has user seen onboarding").

### Anti-Pattern 2: Writing a Service Worker From Scratch

**What:** Manually authoring `service-worker.js` with custom fetch event handlers and cache versioning.

**Why bad:** Cache versioning, precache manifest generation, and update lifecycle are error-prone and tedious to maintain. Manual service workers are a common source of stale-cache bugs.

**Instead:** Let `vite-plugin-pwa` generate the service worker from Workbox. Zero-config for the standard use case; `injectManifest` mode if customization is needed.

### Anti-Pattern 3: Coupling Data Logic to Screen Components

**What:** Putting `db.assessments.add(...)` calls directly inside JSX event handlers or mixed with rendering logic.

**Why bad:** Makes testing difficult and creates implicit dependencies between screens and DB schema.

**Instead:** Extract all DB operations to a `db.ts` module (or thin hooks in a `/data` folder). Screens call named functions (`saveAssessment(scores)`) and receive data via `useLiveQuery`.

### Anti-Pattern 4: Storing Derived Metrics

**What:** Pre-computing and storing an "overall score" (average of five dimensions) in the database.

**Why bad:** Derived values become stale if the calculation logic changes (e.g., weighted average later). They also duplicate information.

**Instead:** Compute on read. Five raw dimension values is the ground truth. Derive overall score, percentages, and deltas in the component or a pure utility function.

---

## Component Build Order (Dependencies)

Build in this sequence — each layer depends on the previous being stable:

```
1. Assessment Config (config.ts)
   └─ No dependencies; everything else reads from here

2. Data Layer (db.ts + Dexie schema)
   └─ Depends on: config (dimension keys)

3. PWA Shell (Vite + vite-plugin-pwa + manifest + router skeleton)
   └─ Depends on: nothing domain-specific; sets up install + routing frame

4. Assessment Screen
   └─ Depends on: config (labels/descriptions), data layer (write)

5. Results Summary Screen
   └─ Depends on: config (labels), data layer (read latest), Assessment Screen (navigation from)

6. History List
   └─ Depends on: data layer (read all)

7. Chart Component + Trends Screen
   └─ Depends on: History List data, config (colors/labels per dimension)
```

**Rationale:** Config and data layer are purely structural — no UI concerns. PWA shell can be scaffolded in parallel. Assessment → Results → History → Charts follows user journey order and ensures each build step is independently testable without needing later components.

---

## Scalability Considerations

This app is intentionally local-only. The architecture choices that matter for future growth:

| Concern | v1 (current) | v2 (cloud sync) | v3 (multi-user/coach) |
|---------|-------------|-----------------|----------------------|
| Storage | IndexedDB (Dexie) | Dexie Cloud or migrate to Supabase | Backend DB |
| Auth | None | Device-based token | OAuth |
| Data format | Flat assessments table | Same schema, add userId + syncedAt | Shared assessments |
| Charting | Recharts local data | Same | Aggregation on server |

The flat Dexie schema is deliberately forward-compatible: adding `userId` and `syncedAt` columns in a Dexie version migration is a non-breaking change.

---

## Key Technology Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| PWA tooling | `vite-plugin-pwa` + Workbox | Zero-config for standard patterns; active maintenance; React official support |
| Local DB | Dexie.js (IndexedDB wrapper) | `useLiveQuery` eliminates manual state sync; best DX for React; widely adopted |
| Charting | Recharts | Native React components (SVG); simple API; good defaults; actively maintained |
| Build tool | Vite | Required by vite-plugin-pwa; fastest React dev experience; native ESM |

---

## Sources

- [Progressive Web Apps 2026 — Service Workers Explained](https://jsmanifest.com/service-workers-pwa-guide) (MEDIUM confidence, WebSearch)
- [vite-plugin-pwa GitHub](https://github.com/vite-pwa/vite-plugin-pwa) (HIGH confidence, official repo)
- [Getting Started — Vite PWA](https://vite-pwa-org.netlify.app/guide/) (HIGH confidence, official docs)
- [Using Dexie.js in React apps for offline data storage — LogRocket](https://blog.logrocket.com/dexie-js-indexeddb-react-apps-offline-data-storage/) (HIGH confidence, verified against official Dexie docs)
- [dexie-react-hooks official docs](https://dexie.org/docs/libs/dexie-react-hooks) (HIGH confidence, official docs)
- [Best React chart libraries 2025 — LogRocket](https://blog.logrocket.com/best-react-chart-libraries-2025/) (MEDIUM confidence, WebSearch)
- [Offline-first frontend apps in 2025 — LogRocket](https://blog.logrocket.com/offline-first-frontend-apps-2025-indexeddb-sqlite/) (MEDIUM confidence, WebSearch)
