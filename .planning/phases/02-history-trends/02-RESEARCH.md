# Phase 2: History & Trends - Research

**Researched:** 2026-04-13
**Domain:** Recharts LineChart, Dexie history queries, tab-based navigation, React component patterns
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**History List**
- D-01: Card list layout — each entry shows date and composite Peace Index score (average of 5 dimensions)
- D-02: Sorted newest-first
- D-03: Tapping a history entry shows the full 5-dimension breakdown for that assessment
- D-04: Empty state when no history exists yet — prompt to take first assessment

**Trend Charts**
- D-05: Single line chart with all 5 dimensions as separate colored lines
- D-06: X-axis shows dates, Y-axis shows score 0-100%
- D-07: Use Recharts LineChart component (per project STACK.md decision)
- D-08: Handle sparse data gracefully — show dots for 1-2 data points, lines for 3+

**Navigation**
- D-09: Bottom tab bar with three tabs: Assessment, History, Trends
- D-10: Replace current useState screen switcher in App.tsx with tab-based navigation
- D-11: Active tab highlighted with accent color (blue-500)

### Claude's Discretion
- Chart colors per dimension (should be distinct and accessible)
- Exact card styling for history entries (follow Phase 1 patterns)
- Tab bar icon choices (use lucide-react)
- Chart legend placement and formatting
- Responsive behavior of charts on mobile

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| TRAK-01 | User can view a list of past assessments with dates (newest first) | Dexie `orderBy('date').reverse().toArray()` query pattern confirmed; `useLiveQuery` provides reactivity |
| TRAK-02 | User can view trend line charts showing each dimension's score over time | Recharts 3.8.1 `LineChart` + `ResponsiveContainer` pattern confirmed; 5 `Line` components one per dimension |
</phase_requirements>

---

## Summary

Phase 2 adds two new screens (HistoryScreen, TrendsScreen) and refactors the App.tsx screen switcher into a three-tab bottom navigation. All data is already in Dexie from Phase 1 — no schema changes are needed. This phase is primarily a UI rendering problem: query all assessment records, display them as cards, and visualize them as a multi-line Recharts chart.

The most consequential implementation decision is the navigation refactor. App.tsx currently uses a `useState` three-state switcher. It must become a tab bar that persists across all three tab screens while still supporting the Assessment-to-Summary flow within the Assessment tab. The cleanest approach is to maintain a `tab` state (the active tab) alongside a separate `assessmentStep` state for the assessment sub-flow — no router library is needed given the simplicity of the navigation tree.

Recharts 3.8.1 is the latest version and is not yet installed. It must be added as a dependency. The `ResponsiveContainer` + `LineChart` pattern is straightforward, and the sparse-data requirement (D-08) is handled by conditionally passing the `dot` prop to each `Line` component based on the record count.

**Primary recommendation:** Install Recharts 3.8.1, build `HistoryScreen` and `TrendsScreen` as self-contained components querying `db.assessments` via `useLiveQuery`, and refactor `App.tsx` to a tab-bar layout that keeps Assessment/History/Trends in tabs while managing the assessment sub-flow inline within the Assessment tab.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| recharts | 3.8.1 | Multi-line trend chart | Locked decision D-07; React-native chart library with responsive container support |
| dexie | 4.4.2 (installed) | IndexedDB reads for history list and trend data | Already in schema; `orderBy('date').reverse()` gives newest-first list |
| dexie-react-hooks | 4.4.0 (installed) | `useLiveQuery` for reactive data binding | Already used in SummaryScreen — same pattern extends to HistoryScreen and TrendsScreen |
| date-fns | 4.1.0 (installed) | Date formatting on history cards and XAxis | Already used in SummaryScreen for `format(new Date(date), 'MMMM d, yyyy')` |
| lucide-react | 1.8.0 (installed) | Tab bar icons | Locked by project stack; already installed |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| tailwindcss | 4.2.2 (installed) | All layout and styling | All components — no inline styles |
| shadcn/ui Card | installed | History entry card shell | Follow existing card pattern from SummaryScreen |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Recharts | Victory, Chart.js | Not applicable — D-07 locks Recharts |
| useState tab switcher | React Router | Router adds unnecessary complexity for 3 tabs; useState is sufficient and consistent with Phase 1 approach |

**Installation — new dependency only:**
```bash
npm install recharts
```

**Version verification:** `npm view recharts version` returned `3.8.1` on 2026-04-13. [VERIFIED: npm registry]

---

## Architecture Patterns

### Recommended Project Structure
```
src/
├── screens/
│   ├── AssessmentScreen.tsx   # existing
│   ├── SummaryScreen.tsx      # existing
│   ├── HistoryScreen.tsx      # new — TRAK-01
│   └── TrendsScreen.tsx       # new — TRAK-02
├── components/
│   └── ui/                    # existing shadcn components
├── data/
│   ├── db.ts                  # existing — no changes needed
│   └── assessments.ts         # existing — no changes needed
├── config/
│   └── dimensions.ts          # existing — drives chart line definitions
└── App.tsx                    # refactor: useState switcher → tab bar
```

### Pattern 1: Tab Bar Navigation (no router)

**What:** App.tsx manages `activeTab` state (`'assessment' | 'history' | 'trends'`). A persistent bottom tab bar renders on all screens. The Assessment tab has its own internal sub-flow state (`assessmentStep`: `'welcome' | 'assessment' | 'summary'`).

**When to use:** 3-screen flat tab navigation with one tab having a sub-flow. No deep linking required.

**Example:**
```typescript
// Source: derived from existing App.tsx pattern [ASSUMED — pattern, not library API]
type Tab = 'assessment' | 'history' | 'trends';
type AssessmentStep = 'welcome' | 'assessment' | 'summary';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('assessment');
  const [assessmentStep, setAssessmentStep] = useState<AssessmentStep>('welcome');

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Tab content area */}
      <main className="flex-1 overflow-y-auto pb-16">
        {activeTab === 'assessment' && (
          // render based on assessmentStep
        )}
        {activeTab === 'history' && <HistoryScreen />}
        {activeTab === 'trends' && <TrendsScreen />}
      </main>

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 text-xs
              ${activeTab === tab.id ? 'text-blue-500' : 'text-slate-400'}`}
          >
            <tab.Icon size={20} />
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
```

### Pattern 2: HistoryScreen with useLiveQuery

**What:** Reactive query returning all records newest-first. Renders empty state when array length is 0. Each card is tappable to show dimension breakdown inline.

**When to use:** Any screen reading from Dexie that must reflect writes immediately.

**Example:**
```typescript
// Source: Dexie docs pattern + existing SummaryScreen [VERIFIED: codebase]
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../data/db';

export function HistoryScreen() {
  const records = useLiveQuery(
    () => db.assessments.orderBy('date').reverse().toArray(),
    []
  );

  if (records === undefined) return <LoadingSpinner />;

  if (records.length === 0) {
    return <EmptyState message="No assessments yet" ctaLabel="Take your first assessment" />;
  }

  return (
    <div className="flex flex-col gap-3 px-4 pt-6">
      {records.map(record => (
        <HistoryCard key={record.id} record={record} />
      ))}
    </div>
  );
}
```

### Pattern 3: Recharts Multi-Line TrendsScreen

**What:** `ResponsiveContainer` wraps `LineChart`. One `Line` per dimension, keyed from `DIMENSIONS` config. Data is shaped from `AssessmentRecord[]` into Recharts-compatible objects. Sparse-data rule (D-08) uses record count to toggle `dot` prop.

**When to use:** All instances of the trends chart.

**Example:**
```typescript
// Source: recharts.github.io/en-US/api/Line/ [CITED: recharts.github.io/en-US/api/Line/]
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';
import { DIMENSIONS } from '../config/dimensions';

// Shape AssessmentRecord[] into Recharts data array
const chartData = records.map(r => ({
  date: r.date,          // ISO string — used as XAxis dataKey
  purpose: r.purpose,
  people: r.people,
  place: r.place,
  personalHealth: r.personalHealth,
  provision: r.provision,
}));

const showDots = records.length <= 2;

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={chartData} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
    <XAxis
      dataKey="date"
      tickFormatter={(iso: string) => format(new Date(iso), 'MMM d')}
      tick={{ fontSize: 11, fill: '#64748b' }}
    />
    <YAxis
      domain={[0, 100]}
      tickFormatter={(v: number) => `${v}%`}
      tick={{ fontSize: 11, fill: '#64748b' }}
      width={36}
    />
    <Tooltip
      formatter={(value: number, name: string) => [`${value}%`, name]}
      labelFormatter={(iso: string) => format(new Date(iso), 'MMMM d, yyyy')}
    />
    <Legend />
    {DIMENSIONS.map(dim => (
      <Line
        key={dim.key}
        type="monotone"
        dataKey={dim.key}
        name={dim.label}
        stroke={DIMENSION_COLORS[dim.key]}
        strokeWidth={2}
        dot={showDots}
        activeDot={{ r: 5 }}
        connectNulls={false}
      />
    ))}
  </LineChart>
</ResponsiveContainer>
```

### Pattern 4: Peace Index Score Calculation

**What:** Reuse the exact pattern from SummaryScreen — average of all 5 dimension scores, rounded.

**When to use:** History card headline number.

```typescript
// Source: SummaryScreen.tsx line 47 [VERIFIED: codebase]
const peaceIndex = Math.round(
  DIMENSIONS.reduce((sum, d) => sum + (record[d.key as keyof typeof record] as number), 0)
  / DIMENSIONS.length
);
```

### Anti-Patterns to Avoid

- **Importing `db` directly in components outside `data/` layer:** The project pattern is screens import from `../data/db` and `../data/assessments`. Do not add a new data access layer — continue this direct import pattern.
- **Passing chart data as ISO string without parsing for XAxis type="number":** Using `type="number"` on XAxis requires numeric timestamps. Either keep `type="category"` (default) with `tickFormatter`, or convert to `Date.parse(iso)` when using `type="number"` with `scale="time"`. The simpler approach is `type="category"` + `tickFormatter`.
- **Rendering Recharts inside a zero-height container:** `ResponsiveContainer` requires a parent with explicit height or use `height` prop directly. Always set `height={number}` or wrap in a div with `h-[300px]`.
- **Switching away from the Assessment tab resetting assessment progress:** Use separate `assessmentStep` state from `activeTab` state. Do not reset `assessmentStep` when user switches tabs.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Line chart with hover tooltips | Custom SVG chart | `recharts` LineChart | Tooltip positioning, touch support, axis scaling are all complex to implement correctly |
| Date axis tick spacing | Custom tick calculation | Recharts XAxis `type="category"` with `tickFormatter` | Recharts handles tick density automatically for category axes |
| Reactive DB reads | Manual `useEffect` + `useState` subscription | `useLiveQuery` from dexie-react-hooks | Already in the project; handles subscription cleanup automatically |
| Empty state detection | Manual null/undefined checks | `records.length === 0` after `useLiveQuery` resolves | `useLiveQuery` returns `undefined` while loading, then the actual array |

**Key insight:** All the hard problems in this phase (chart rendering, reactive queries, date formatting) already have solutions installed in the project. The implementation is primarily composition of existing tools.

---

## Common Pitfalls

### Pitfall 1: useLiveQuery undefined vs. empty array

**What goes wrong:** Developer checks `if (!records)` and treats both undefined (loading) and empty array as the same — either shows wrong empty state during load, or crashes on `records.map()`.

**Why it happens:** `useLiveQuery` returns `undefined` on initial render before the async query resolves, then the actual result.

**How to avoid:** Always check `if (records === undefined)` first for loading state, then `if (records.length === 0)` for empty state. This is the same pattern used in `SummaryScreen.tsx`.

**Warning signs:** Empty state flickering on page load, or TypeScript error on `records.map` because type is `AssessmentRecord[] | undefined`.

### Pitfall 2: Recharts ResponsiveContainer in zero-height parent

**What goes wrong:** Chart renders with 0px height and is invisible. No error is thrown.

**Why it happens:** `ResponsiveContainer width="100%"` requires the parent to have a defined height. Flexbox parents with `flex-1` alone may collapse to 0.

**How to avoid:** Either set `height={300}` directly on `ResponsiveContainer`, or wrap in `<div className="h-[300px] w-full">`. The `height` prop approach is simpler. [CITED: recharts.github.io]

**Warning signs:** Chart area appears but has no content; browser dev tools show chart container with height: 0.

### Pitfall 3: Tab switch resets assessment in-progress

**What goes wrong:** User starts an assessment, switches to History tab to check something, returns to Assessment tab — progress is lost.

**Why it happens:** If `assessmentStep` is stored inside a component that unmounts when the tab switches, state is lost.

**How to avoid:** Keep `assessmentStep` in `App.tsx` alongside `activeTab`, not inside `AssessmentScreen`. All tab state should live at the `App` level.

**Warning signs:** Assessment restarts from the welcome screen every time the user leaves and returns to the Assessment tab.

### Pitfall 4: XAxis date sorting with ISO strings

**What goes wrong:** Dates render out of order on the X-axis, especially if records were entered manually or in unusual sequences.

**Why it happens:** With `type="category"`, Recharts renders data in array order. The query must guarantee sort order.

**How to avoid:** Always use `db.assessments.orderBy('date').toArray()` (ascending for chart) rather than relying on insertion order. The chart data array must be oldest-first for left-to-right time progression. The history list (newest-first) is a different query from the chart data (oldest-first).

**Warning signs:** Chart lines zigzag backwards in time.

### Pitfall 5: Bottom tab bar obscuring content

**What goes wrong:** The last card in the history list or the bottom of the chart is hidden behind the fixed tab bar.

**Why it happens:** `position: fixed` tab bar overlaps scrollable content if the content area does not have bottom padding.

**How to avoid:** Add `pb-16` (or `pb-20` for mobile safe area) to the main scrollable content wrapper. The tab bar height is `h-16` (4rem).

**Warning signs:** Content appears cut off at the bottom; user cannot scroll to see last item.

---

## Code Examples

### History data query (oldest-to-newest for chart, newest-to-oldest for list)

```typescript
// Source: Dexie API — orderBy indexed field [VERIFIED: codebase — date is indexed in db.ts line 29]

// For HistoryScreen (newest first — D-02):
const records = useLiveQuery(
  () => db.assessments.orderBy('date').reverse().toArray(),
  []
);

// For TrendsScreen (oldest first — left-to-right time axis):
const records = useLiveQuery(
  () => db.assessments.orderBy('date').toArray(),
  []
);
```

### Dimension colors (Claude's discretion — accessible, distinct palette)

```typescript
// [ASSUMED] — accessible palette recommendation based on common chart design practice
import type { DimensionKey } from '../config/dimensions';

export const DIMENSION_COLORS: Record<DimensionKey, string> = {
  purpose:        '#3b82f6', // blue-500
  people:         '#10b981', // emerald-500
  place:          '#f59e0b', // amber-500
  personalHealth: '#8b5cf6', // violet-500
  provision:      '#ef4444', // red-500
};
```

### Tab configuration

```typescript
// [ASSUMED] — pattern, not library API
import { ClipboardList, History, TrendingUp } from 'lucide-react';

const TABS = [
  { id: 'assessment' as const, label: 'Assessment', Icon: ClipboardList },
  { id: 'history'    as const, label: 'History',    Icon: History },
  { id: 'trends'     as const, label: 'Trends',     Icon: TrendingUp },
];
```

### HistoryCard breakdown toggle (D-03)

```typescript
// [ASSUMED] — derived from SummaryScreen card pattern [VERIFIED: codebase]
const [expanded, setExpanded] = useState(false);

<div
  className="rounded-lg border border-slate-200 bg-slate-50 p-4 cursor-pointer"
  onClick={() => setExpanded(e => !e)}
>
  <div className="flex justify-between items-center">
    <p className="text-sm text-slate-500">{formattedDate}</p>
    <p className="text-[20px] font-semibold text-blue-500">{peaceIndex}%</p>
  </div>
  {expanded && (
    <div className="mt-3 grid grid-cols-2 gap-2">
      {DIMENSIONS.map(dim => (
        <div key={dim.key} className="flex justify-between text-sm">
          <span className="text-slate-600">{dim.label}</span>
          <span className="font-medium text-slate-900">{record[dim.key]}%</span>
        </div>
      ))}
    </div>
  )}
</div>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `useState` screen switcher | `activeTab` + `assessmentStep` in App.tsx | This phase | Enables persistent tab bar while preserving assessment sub-flow |
| No chart dependency | Recharts 3.8.1 | This phase | Adds ~100KB gzipped to bundle (acceptable for PWA with offline caching) |

**Deprecated/outdated:**
- `type Screen = 'welcome' | 'assessment' | 'summary'` in App.tsx: will be replaced with `type Tab` + `type AssessmentStep` split.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Dimension colors (`DIMENSION_COLORS` palette) | Code Examples | Colors may be too similar for colorblind users — can be adjusted at implementation time |
| A2 | Tab icons (`ClipboardList`, `History`, `TrendingUp` from lucide-react) | Code Examples | Icon names may differ in lucide-react 1.8.0 — verify with `import` at implementation time |
| A3 | `assessmentStep` stays in App.tsx to survive tab switches | Architecture Patterns | If current AssessmentScreen manages its own step state internally, refactoring may be needed — check AssessmentScreen.tsx during planning |
| A4 | `pb-16` is sufficient safe-area padding for the tab bar | Common Pitfalls | iOS devices with home indicator may need `pb-20` or CSS env(safe-area-inset-bottom) |

---

## Open Questions

1. **Does AssessmentScreen manage its own step state internally?**
   - What we know: App.tsx has `type Screen = 'welcome' | 'assessment' | 'summary'` at the app level
   - What's unclear: Whether `AssessmentScreen` itself has internal step/slide state that would be lost on tab switch
   - Recommendation: Read `AssessmentScreen.tsx` during planning to determine if assessment progress state needs lifting to `App.tsx`

2. **Should switching to History tab from a completed assessment navigate back to the Assessment tab's welcome step?**
   - What we know: D-03 says tapping a history entry shows dimension breakdown; no decision covers post-assessment tab switching behavior
   - What's unclear: Should the user return to "Start New Assessment" or the Summary screen when they come back to the Assessment tab?
   - Recommendation: Default to keeping `assessmentStep = 'summary'` (last state) when returning to Assessment tab — less surprising than resetting

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| recharts | TrendsScreen chart (TRAK-02) | not installed | — | None — must install |
| dexie | History/Trends data queries | installed | 4.4.2 | — |
| dexie-react-hooks | useLiveQuery reactivity | installed | 4.4.0 | — |
| date-fns | Date formatting | installed | 4.1.0 | — |
| lucide-react | Tab bar icons | installed | 1.8.0 | — |

**Missing dependencies with no fallback:**
- recharts: must be installed before TrendsScreen can be built (`npm install recharts`)

**Missing dependencies with fallback:**
- None

---

## Sources

### Primary (HIGH confidence)
- `src/data/db.ts` — AssessmentRecord schema, Dexie table definition, index on `date` field [VERIFIED: codebase]
- `src/data/assessments.ts` — saveAssessment() write pattern [VERIFIED: codebase]
- `src/config/dimensions.ts` — DIMENSIONS array, DimensionKey type [VERIFIED: codebase]
- `src/screens/SummaryScreen.tsx` — useLiveQuery pattern, Peace Index calculation, card styling [VERIFIED: codebase]
- `src/App.tsx` — current screen switcher structure to be refactored [VERIFIED: codebase]
- `package.json` — installed dependency versions [VERIFIED: codebase]

### Secondary (MEDIUM confidence)
- [recharts.github.io/en-US/api/Line/](https://recharts.github.io/en-US/api/Line/) — Line component `dot`, `connectNulls`, `type`, `stroke`, `strokeWidth` props [CITED: recharts.github.io]
- [recharts.github.io/en-US/api/XAxis/](https://recharts.github.io/en-US/api/XAxis/) — XAxis `tickFormatter`, `type`, `domain` props [CITED: recharts.github.io]
- [recharts.github.io/en-US/api/LineChart/](https://recharts.github.io/en-US/api/LineChart/) — LineChart container props [CITED: recharts.github.io]
- npm registry — recharts@3.8.1 is current latest [VERIFIED: npm registry, 2026-04-13]

### Tertiary (LOW confidence)
- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages verified against npm registry and project package.json
- Architecture: HIGH — directly derived from existing codebase patterns
- Recharts API: MEDIUM — fetched from official recharts.github.io docs; confirmed component names and key props
- Pitfalls: MEDIUM — derived from common Recharts/Dexie/React patterns; some from codebase analysis

**Research date:** 2026-04-13
**Valid until:** 2026-05-13 (recharts 3.x stable; Dexie 4.x stable)
