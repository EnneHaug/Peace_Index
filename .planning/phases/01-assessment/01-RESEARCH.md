# Phase 1: Assessment - Research

**Researched:** 2026-04-13
**Domain:** React PWA — step-by-step assessment form, IndexedDB persistence, shadcn/ui slider component
**Confidence:** HIGH (stack verified in project-level STACK.md; patterns confirmed in ARCHITECTURE.md; UI contract locked in UI-SPEC.md)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Slider input with numeric value displayed alongside (not just the slider thumb)
- **D-02:** Continuous range 1-100, no step increments
- **D-03:** Slider must be paired with visible numeric readout to address mobile touch occlusion
- **D-04:** Step-by-step flow — one dimension per screen, not all 5 on one page
- **D-05:** Progress indicator showing which dimension the user is on (e.g., "2 of 5")
- **D-06:** User can navigate back to previous dimensions to adjust scores before submitting
- **D-07:** After completing all 5 dimensions, show a clean score summary with dimension names and values
- **D-08:** Simple list/card layout showing all 5 scores at once — no radar chart in v1
- **D-09:** Flat assessment record in IndexedDB with one column per dimension (purpose, people, place, personalHealth, provision)
- **D-10:** Every record includes `schemaVersion: 1` field from day one
- **D-11:** Timestamps stored as ISO 8601 UTC strings
- **D-12:** Use Dexie.js as IndexedDB wrapper with `useLiveQuery` for reactive data access

### Claude's Discretion

- Exact slider styling and color scheme
- Progress indicator visual design (dots, bar, step counter)
- Transition/animation between dimension screens
- Empty state handling for first-time users
- Button labels and microcopy

### Deferred Ideas (OUT OF SCOPE)

None declared — discussion stayed within phase scope.

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ASMT-01 | User can score each of the 5 dimensions (Purpose, People, Place, Personal Health, Provision) on a 1-100% scale using a slider | shadcn `Slider` component (Radix UI), continuous range min=1 max=100 step=1, component patterns in Code Examples |
| ASMT-02 | Each dimension displays a description/prompt explaining what it measures | `config.ts` dimension config pattern; dimension text lives as static data, not fetched |
| ASMT-03 | User sees a summary of all 5 scores after completing an assessment | Results Summary screen; score cards pattern from UI-SPEC.md |
| DATA-01 | Assessment results are saved locally in IndexedDB with timestamp | Dexie.js `db.assessments.add(...)` with ISO 8601 date; schema versioning pattern |
| DATA-02 | Data persists across browser sessions and app restarts | IndexedDB native persistence; `useLiveQuery` for reactive reads across sessions |

</phase_requirements>

---

## Summary

Phase 1 builds the entire core loop of the app: take an assessment, see results, persist data. It is a greenfield project — no existing code. The technology stack has already been fully decided at the project level (React 19, Vite 8, TypeScript 5, Tailwind v4, shadcn/ui canary, Dexie 4.4, date-fns, lucide-react). The UI design contract is locked in `01-UI-SPEC.md`.

The implementation has four distinct concerns: (1) project scaffolding (Vite + Tailwind + shadcn initialization), (2) the data layer (Dexie schema, typed assessment record, `saveAssessment` function), (3) the assessment wizard (step-by-step screen using shadcn Slider + numeric readout), and (4) the summary screen (5 score cards). The architecture research defines the correct build order: config first, data layer second, screens third.

The most common Phase 1 failure modes are already documented in PITFALLS.md: using `localStorage` instead of IndexedDB, omitting `schemaVersion` from day one, and slider touch-target size on mobile. All three are addressed in the locked decisions.

**Primary recommendation:** Build in the order defined in ARCHITECTURE.md — config → data layer → assessment screen → summary screen. Do not scaffold the PWA service worker in Phase 1 (that is Phase 3 scope). Initialize shadcn first; the Slider component is a hard dependency.

---

## Project Constraints (from CLAUDE.md)

| Directive | Source | Enforcement |
|-----------|--------|-------------|
| Platform must be PWA — installable and work offline | CLAUDE.md constraints | Phase 3 handles PWA; Phase 1 must not use `localStorage` for data |
| Storage: local-only (IndexedDB) — no backend for v1 | CLAUDE.md constraints | Dexie.js; zero network calls for data |
| Design: clean and modern, suitable for coaching contexts | CLAUDE.md constraints | shadcn/ui + Tailwind; UI-SPEC color/type scale |
| Do not make direct repo edits outside a GSD workflow | CLAUDE.md GSD enforcement | Planner tasks must use GSD execute path |
| No Redux, Zustand, Firebase, Supabase, localStorage for data | CLAUDE.md stack constraints | `useLiveQuery` + `useState` only; Dexie for persistence |

---

## Standard Stack

### Core (Phase 1 scope)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.x | UI framework | Current stable; `useState` for wizard step state [VERIFIED: STACK.md] |
| Vite | 8.x | Build + dev server | Rolldown bundler; zero-config React+TS [VERIFIED: STACK.md] |
| TypeScript | 5.x | Type safety | Dexie 4.x TypeScript-first; catches schema bugs at compile time [VERIFIED: STACK.md] |
| Tailwind CSS | 4.x | Utility styling | CSS-first config via `@tailwindcss/vite` plugin [VERIFIED: STACK.md] |
| shadcn/ui | canary | Component primitives (Slider, Card, Button, Progress) | Components copied into repo; Radix UI accessible primitives [VERIFIED: STACK.md + UI-SPEC.md] |
| Dexie.js | 4.4.x | IndexedDB wrapper | Schema versioning, `useLiveQuery`, TypeScript-first [VERIFIED: STACK.md] |
| dexie-react-hooks | 4.x | `useLiveQuery` hook | Reactive data reads; auto-rerenders on DB change [VERIFIED: STACK.md] |
| date-fns | 3.x | Date formatting | Format assessment date on summary screen [VERIFIED: STACK.md] |
| lucide-react | current | Icons | Individual SVG components, no unused bundle weight [VERIFIED: STACK.md] |

### Not Used in Phase 1 (deferred)

| Library | Deferred To | Reason |
|---------|------------|--------|
| vite-plugin-pwa / Workbox | Phase 3 | PWA installability is Phase 3 scope |
| Recharts | Phase 2 | Charts are Phase 2 (Tracking) scope |

### Installation (full Phase 1 command set)

```bash
# 1. Scaffold
npm create vite@latest peace-index -- --template react-ts
cd peace-index

# 2. Tailwind CSS v4
npm install tailwindcss @tailwindcss/vite

# 3. shadcn/ui (Tailwind v4 canary path — required for v4 compatibility)
npx shadcn@canary init
npx shadcn@canary add slider card button progress

# 4. Storage
npm install dexie dexie-react-hooks

# 5. Utilities
npm install date-fns lucide-react
```

**shadcn Gate (CRITICAL):** `components.json` does not yet exist. Run `npx shadcn@canary init` BEFORE any component work. This gate is documented in UI-SPEC.md. [VERIFIED: UI-SPEC.md]

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── config/
│   └── dimensions.ts       # The 5 Ps — single source of truth for all screens
├── data/
│   ├── db.ts               # Dexie database definition + schema
│   └── assessments.ts      # saveAssessment(), useLiveQuery wrappers
├── components/
│   └── ui/                 # shadcn generated components live here (Slider, Card, etc.)
├── screens/
│   ├── AssessmentScreen.tsx  # Step-by-step wizard (one dimension per render)
│   └── SummaryScreen.tsx     # 5 score cards after completion
├── App.tsx                 # Root router / screen switcher
└── main.tsx
```

[VERIFIED: ARCHITECTURE.md component build order pattern]

### Pattern 1: Dimension Config as Single Source of Truth

**What:** A `dimensions.ts` config file exports the 5 Peace Index dimensions as a typed array. Every screen that shows dimension names or descriptions reads from this file.

**When to use:** Always — prevents label drift, makes adding a dimension a one-file change.

```typescript
// Source: ARCHITECTURE.md Pattern 4
// src/config/dimensions.ts

export type DimensionKey = 'purpose' | 'people' | 'place' | 'personalHealth' | 'provision';

export interface Dimension {
  key: DimensionKey;
  label: string;
  description: string;
}

export const DIMENSIONS: Dimension[] = [
  {
    key: 'purpose',
    label: 'Purpose',
    description: 'How aligned are you with a clear sense of meaning and direction in your life?',
  },
  {
    key: 'people',
    label: 'People',
    description: 'How supported and connected do you feel in your key relationships?',
  },
  {
    key: 'place',
    label: 'Place',
    description: 'How much does your physical environment contribute to your wellbeing?',
  },
  {
    key: 'personalHealth',
    label: 'Personal Health',
    description: 'How well are you maintaining your physical, mental, and emotional health?',
  },
  {
    key: 'provision',
    label: 'Provision',
    description: 'How secure and sufficient are your financial and material resources?',
  },
];
```

**Note on dimension descriptions:** The exact prompt text for each dimension is not prescribed in the decisions or research. The planner should flag this as needing owner input before final implementation, or use reasonable defaults that can be updated. [ASSUMED — placeholder descriptions above; canonical text should come from the coaching framework owner]

### Pattern 2: Dexie Schema with `schemaVersion` (D-10 mandatory)

**What:** Define the IndexedDB schema using Dexie 4.x class-based API. Include `schemaVersion: 1` on every record per decision D-10.

**When to use:** Before any data write. Schema must exist before screens.

```typescript
// Source: ARCHITECTURE.md Pattern 3 + Dexie official docs
// src/data/db.ts

import Dexie, { type EntityTable } from 'dexie';

export interface AssessmentRecord {
  id?: number;            // auto-increment primary key
  schemaVersion: 1;       // D-10: always 1 in v1; enables future migrations
  date: string;           // D-11: ISO 8601 UTC string — new Date().toISOString()
  purpose: number;        // 1-100
  people: number;         // 1-100
  place: number;          // 1-100
  personalHealth: number; // 1-100
  provision: number;      // 1-100
}

class PeaceIndexDB extends Dexie {
  assessments!: EntityTable<AssessmentRecord, 'id'>;

  constructor() {
    super('PeaceIndexDB');
    this.version(1).stores({
      assessments: '++id, date',  // id auto-increment; date indexed for ordering
    });
  }
}

export const db = new PeaceIndexDB();
```

### Pattern 3: Assessment Write Function

**What:** All DB writes go through a named function in `data/assessments.ts`. Screens never call `db.assessments.add` directly.

```typescript
// src/data/assessments.ts

import { db, type AssessmentRecord } from './db';

type ScoreMap = Omit<AssessmentRecord, 'id' | 'schemaVersion' | 'date'>;

export async function saveAssessment(scores: ScoreMap): Promise<number> {
  return db.assessments.add({
    schemaVersion: 1,
    date: new Date().toISOString(),  // D-11: UTC ISO string
    ...scores,
  });
}
```

### Pattern 4: Step-by-Step Wizard State

**What:** Assessment wizard uses local `useState` — one current step index and an array of scores indexed to dimensions. No Redux, no context provider needed.

**When to use:** Assessment screen only. Scores are ephemeral until `saveAssessment` is called on final step.

```typescript
// src/screens/AssessmentScreen.tsx (skeleton)
import { useState } from 'react';
import { DIMENSIONS } from '../config/dimensions';
import { saveAssessment } from '../data/assessments';

type Scores = Record<string, number>; // keyed by DimensionKey

export function AssessmentScreen({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);                        // current dimension index 0-4
  const [scores, setScores] = useState<Scores>(() =>
    Object.fromEntries(DIMENSIONS.map(d => [d.key, 50]))      // D-02: default midpoint
  );

  const current = DIMENSIONS[step];
  const isLast = step === DIMENSIONS.length - 1;

  async function handleNext() {
    if (isLast) {
      await saveAssessment(scores as any);
      onComplete();
    } else {
      setStep(s => s + 1);
    }
  }

  function handleBack() {
    if (step > 0) setStep(s => s - 1);  // D-06: back navigation
  }

  // Render current dimension screen with Slider + numeric readout
}
```

### Pattern 5: shadcn Slider with Numeric Readout (D-01, D-02, D-03)

**What:** The shadcn `Slider` component with a live numeric display above the thumb. The numeric display must always be visible (not obscured by the thumb on mobile — D-03).

```tsx
// Within AssessmentScreen — slider + readout per D-01/D-02/D-03
import { Slider } from '@/components/ui/slider';

// Inside render:
<div className="space-y-4">
  {/* Numeric readout above slider — always visible, not under thumb */}
  <div className="flex justify-between items-center">
    <span className="text-sm text-slate-500">{current.label}</span>
    <span className="text-2xl font-semibold text-blue-500">
      {scores[current.key]}%
    </span>
  </div>

  {/* shadcn Slider: continuous 1-100, no step (D-02) */}
  <Slider
    min={1}
    max={100}
    step={1}          // continuous feel; integer precision is sufficient
    value={[scores[current.key]]}
    onValueChange={([val]) =>
      setScores(prev => ({ ...prev, [current.key]: val }))
    }
    className="w-full"
  />
</div>
```

**Touch target:** The shadcn Slider uses Radix UI's Thumb which renders a 20px visual but Radix adds a larger invisible hit area. Verify thumb hit target is >= 44px per UI-SPEC.md — may need a custom className override. [ASSUMED — Radix default hit area not confirmed in this session; verify during implementation]

### Pattern 6: Summary Screen

**What:** After save, navigate to summary. Summary reads scores from the saved record via `useLiveQuery`, rendering 5 score cards.

```tsx
// src/screens/SummaryScreen.tsx (skeleton)
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../data/db';
import { DIMENSIONS } from '../config/dimensions';
import { format } from 'date-fns';

export function SummaryScreen({ onNewAssessment }: { onNewAssessment: () => void }) {
  // Get the most recent assessment
  const latest = useLiveQuery(
    () => db.assessments.orderBy('date').last()
  );

  if (!latest) return null; // shouldn't happen after save

  return (
    <div>
      <h1>Your Peace Index</h1>
      <p>Scored on {format(new Date(latest.date), 'MMMM d, yyyy')}</p>

      <div className="grid gap-4">
        {DIMENSIONS.map(d => (
          <div key={d.key} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="font-semibold text-slate-900">{d.label}</p>
            <p className="text-3xl font-semibold text-blue-500">
              {latest[d.key]}%
            </p>
          </div>
        ))}
      </div>

      <button onClick={onNewAssessment}>Start New Assessment</button>
    </div>
  );
}
```

### Pattern 7: App-level Screen Routing (no router library needed)

**What:** With only 2 screens in Phase 1, simple `useState` in `App.tsx` is sufficient. No React Router needed until Phase 2 adds the History screen.

```tsx
// src/App.tsx
type Screen = 'assessment' | 'summary';

export default function App() {
  const [screen, setScreen] = useState<Screen>('assessment');

  if (screen === 'summary') {
    return <SummaryScreen onNewAssessment={() => setScreen('assessment')} />;
  }
  return <AssessmentScreen onComplete={() => setScreen('summary')} />;
}
```

**Note:** When Phase 2 adds History, introduce React Router at that point. Do not add it in Phase 1 — it is unnecessary complexity for 2 screens.

### Anti-Patterns to Avoid

- **localStorage for assessment data:** Synchronous, 5 MB cap, no schema versioning. Use Dexie. [VERIFIED: PITFALLS.md Pitfall 1]
- **No `schemaVersion` field:** Omitting this makes future migrations impossible without data loss. [VERIFIED: PITFALLS.md Pitfall 2]
- **Slider with no numeric readout:** Mobile users' thumbs occlude the value. Always show the number above the track. [VERIFIED: PITFALLS.md Pitfall 5, CONTEXT.md D-03]
- **Coupling DB calls to JSX:** `db.assessments.add(...)` must not appear in onClick handlers inline. Use named functions in `data/assessments.ts`. [VERIFIED: ARCHITECTURE.md Anti-Pattern 3]
- **Storing derived metrics:** Do not store a computed "average score." Compute on read. [VERIFIED: ARCHITECTURE.md Anti-Pattern 4]
- **Adding a router library prematurely:** useState screen switching is correct for 2 views. [ASSUMED — engineering judgment; not a documented pitfall]

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Slider UI | Custom HTML input[range] with CSS | `shadcn/ui` Slider (Radix UI) | Radix handles keyboard accessibility, ARIA, and touch targets correctly |
| IndexedDB access | Raw IDBOpenDBRequest + transaction management | Dexie.js | Schema versioning, migrations, TypeScript types, and `useLiveQuery` eliminate ~200 lines of boilerplate |
| Reactive data sync | Manual `useEffect` + state to read IndexedDB | `useLiveQuery` from dexie-react-hooks | Auto-subscribes; rerenders on any DB change without manual invalidation |
| Date formatting | `new Date().toLocaleDateString()` | `date-fns` `format()` | Locale-consistent, tree-shakeable, avoids locale-dependent formatting bugs |
| Component styling | Writing slider styles from scratch | Tailwind + shadcn theme | shadcn components use Tailwind CSS variables; customization via theme tokens, not custom CSS |

**Key insight:** The hardest parts of this domain (accessible slider, IndexedDB schema migrations, reactive data subscriptions) have excellent library solutions. Hand-rolling any of these trades correctness for false control.

---

## Common Pitfalls

### Pitfall 1: shadcn Not Initialized Before Component Work

**What goes wrong:** Developer runs `npx shadcn@canary add slider` before running `npx shadcn@canary init`. The CLI errors or generates components with no theme context.

**Why it happens:** Developers skip initialization assuming it's optional.

**How to avoid:** Wave 0 task must initialize shadcn first. Verify `components.json` exists in repo root before any component is added.

**Warning signs:** Missing `components.json`, components referencing undefined CSS variables.

### Pitfall 2: Omitting `schemaVersion` from First Write

**What goes wrong:** Assessment records written without `schemaVersion: 1`. When Phase 2 or beyond changes the schema (e.g., adding a notes field), there is no way to distinguish old records from new ones — migration code cannot run safely.

**Why it happens:** Feels premature on the first write.

**How to avoid:** The `saveAssessment()` function hardcodes `schemaVersion: 1` — it cannot be forgotten if the function is the only write path. [VERIFIED: PITFALLS.md Pitfall 2, CONTEXT.md D-10]

### Pitfall 3: Slider Thumb Smaller Than 44px Touch Target

**What goes wrong:** The slider thumb is visually 20px but the touch hit area is insufficient. Mobile users struggle to grab and drag accurately, especially with a 1-100 continuous range.

**Why it happens:** Desktop testing only. Touch targets look fine in DevTools.

**How to avoid:** Pair slider with numeric readout (D-01/D-03) so users can see the value. Consider if shadcn's Radix Slider thumb has adequate hit area; add `className` overrides if needed. Test on a physical phone. [VERIFIED: PITFALLS.md Pitfall 5, UI-SPEC.md 44px minimum]

### Pitfall 4: Not Restoring Previous Score on Back Navigation

**What goes wrong:** User on step 3, navigates back to step 2, and the slider resets to 50 instead of their previously entered value.

**Why it happens:** Step state holds the current step index but scores are stored in a dictionary keyed by dimension — if implemented correctly, back navigation just decrements the step index and the stored score is preserved naturally.

**How to avoid:** Scores live in a single `scores` state object (Pattern 4 above). Navigating back/forward just changes `step` index — the scores object is untouched. This is the correct implementation. [VERIFIED: CONTEXT.md D-06]

### Pitfall 5: ISO Date Stored Incorrectly

**What goes wrong:** Timestamp stored as `new Date().toString()` (locale-dependent, non-sortable) or `Date.now()` (number, requires additional formatting logic). History sorting breaks for international users.

**Why it happens:** Convenient shortcuts.

**How to avoid:** Always use `new Date().toISOString()` — produces UTC ISO 8601 string, sortable alphabetically, parses cleanly with `date-fns`. This is enforced in `saveAssessment()`. [VERIFIED: PITFALLS.md Pitfall 11, CONTEXT.md D-11]

---

## Component Build Order (for Wave Planning)

Per ARCHITECTURE.md — build in this dependency order:

```
Wave 0: Project scaffolding
  1. npm create vite + TypeScript template
  2. Tailwind v4 setup (vite.config.ts plugin)
  3. shadcn@canary init + add slider card button progress
  4. src/ folder structure established (empty files with correct exports)

Wave 1: Data foundation
  5. src/config/dimensions.ts — dimension definitions (the 5 Ps)
  6. src/data/db.ts — Dexie schema, AssessmentRecord type
  7. src/data/assessments.ts — saveAssessment() function

Wave 2: Assessment wizard
  8. App.tsx — screen switcher (useState, no router yet)
  9. AssessmentScreen.tsx — step-by-step, slider + readout, progress indicator, back/next

Wave 3: Summary screen
  10. SummaryScreen.tsx — 5 score cards, useLiveQuery for latest record
  11. Empty state — first-time user experience (no prior assessments)

Wave 4: Polish + verification
  12. Responsive layout checks (mobile/tablet/desktop per UI-SPEC)
  13. Manual test: complete assessment, verify IndexedDB write, close/reopen, verify persistence
  14. Slider touch target verification on physical mobile (or BrowserStack)
```

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| `localStorage` for structured data | Dexie.js (IndexedDB) | No quota risk; typed schema; migrations |
| Manual `useEffect` + state for DB reads | `useLiveQuery` (dexie-react-hooks) | Reactive, auto-updating, no manual invalidation |
| `tailwind.config.js` | `@tailwindcss/vite` plugin (CSS-first, no config file) | Faster HMR; no separate config to maintain |
| `npx shadcn-ui@latest init` | `npx shadcn@canary init` (for Tailwind v4) | Required for v4 compatibility |
| React Router for 2-screen apps | `useState` screen switching | Right tool for the scope; Router added in Phase 2 |

---

## Environment Availability

This is a greenfield project — no existing codebase. The scaffolding commands install all dependencies. The planner must treat Wave 0 as creating the entire project from scratch.

| Dependency | Required By | Available | Notes |
|------------|------------|-----------|-------|
| Node.js / npm | All waves | Assumed present (project already has git) | Verify node >= 18 for Vite 8 |
| Git | Commits | Present (confirmed by git status) | — |
| npx | shadcn init | Ships with npm | — |

**No external services, databases, or running processes are required for Phase 1.** Everything is local to the browser's IndexedDB. The only "environment" concern is Node.js version for the build toolchain.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Dimension prompt/description text (the exact sentences in config.ts) | Code Examples — Pattern 1 | Placeholder text used in research; real coaching text from framework owner must replace before production |
| A2 | shadcn Radix Slider thumb has adequate touch hit area by default | Pitfall 3, Pattern 5 | May need className override to meet 44px minimum; verify during implementation |
| A3 | No React Router needed in Phase 1; useState is sufficient for 2 screens | Pattern 7 | If routing logic grows unexpectedly, may need to add React Router mid-phase |
| A4 | Node.js >= 18 is installed on developer machine | Environment Availability | Vite 8 requires Node 18+; if older Node is present, upgrade needed before scaffolding |

---

## Open Questions

1. **Canonical dimension prompt text**
   - What we know: The 5 Ps are Purpose, People, Place, Personal Health, Provision
   - What's unclear: The exact description text from the coaching framework (not prescribed in any planning doc)
   - Recommendation: Planner should include a task for the owner to confirm/supply the 5 dimension descriptions before the implementation task runs. Placeholder text can be used for development scaffolding.

2. **Transition animations scope**
   - What we know: UI-SPEC.md specifies slide-left/slide-right 200ms transitions between dimension screens
   - What's unclear: Whether to implement transitions in Wave 2 or defer to Wave 4 polish
   - Recommendation: Implement in Wave 2 since it affects the step navigation interaction; Tailwind transition utilities are sufficient (no animation library)

---

## Sources

### Primary (HIGH confidence)

- `.planning/phases/01-assessment/01-CONTEXT.md` — locked decisions D-01 through D-12
- `.planning/phases/01-assessment/01-UI-SPEC.md` — UI design contract (colors, typography, spacing, component inventory, interaction contracts)
- `.planning/research/STACK.md` — technology stack with verified versions
- `.planning/research/ARCHITECTURE.md` — component boundaries, data flow, build order, patterns
- `.planning/research/PITFALLS.md` — critical and moderate pitfall documentation
- `.planning/REQUIREMENTS.md` — requirement IDs and descriptions

### Secondary (MEDIUM confidence)

- `.planning/research/FEATURES.md` — feature landscape and MVP priority ordering
- `.planning/PROJECT.md` — project constraints and core value
- `CLAUDE.md` — project-level conventions and technology constraints

---

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH — fully verified in STACK.md with npm-confirmed versions
- Architecture: HIGH — ARCHITECTURE.md documents patterns with sources; build order is well-established
- Pitfalls: HIGH — PITFALLS.md covers the domain thoroughly with verified sources
- UI patterns: HIGH — UI-SPEC.md is a locked design contract, not a recommendation
- Dimension prompt text: LOW — placeholder text only; requires owner input

**Research date:** 2026-04-13
**Valid until:** Stable stack — valid for 30 days. shadcn canary status means shadcn-specific patterns should be re-checked if implementation starts > 30 days from this date.
