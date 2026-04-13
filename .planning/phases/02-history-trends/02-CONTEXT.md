# Phase 2: History & Trends - Context

**Gathered:** 2026-04-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can view a list of all past assessments (newest first with dates) and see trend line charts showing each dimension's score over time. No new assessment capabilities — builds on Phase 1's data layer.

</domain>

<decisions>
## Implementation Decisions

### History List
- **D-01:** Card list layout — each entry shows date and composite Peace Index score (average of 5 dimensions)
- **D-02:** Sorted newest-first
- **D-03:** Tapping a history entry shows the full 5-dimension breakdown for that assessment
- **D-04:** Empty state when no history exists yet — prompt to take first assessment

### Trend Charts
- **D-05:** Single line chart with all 5 dimensions as separate colored lines
- **D-06:** X-axis shows dates, Y-axis shows score 0-100%
- **D-07:** Use Recharts LineChart component (per project STACK.md decision)
- **D-08:** Handle sparse data gracefully — show dots for 1-2 data points, lines for 3+

### Navigation
- **D-09:** Bottom tab bar with three tabs: Assessment, History, Trends
- **D-10:** Replace current useState screen switcher in App.tsx with tab-based navigation
- **D-11:** Active tab highlighted with accent color (blue-500)

### Claude's Discretion
- Chart colors per dimension (should be distinct and accessible)
- Exact card styling for history entries (follow Phase 1 patterns)
- Tab bar icon choices (use lucide-react)
- Chart legend placement and formatting
- Responsive behavior of charts on mobile

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase 1 implementation
- `src/data/db.ts` — Dexie schema, AssessmentRecord type
- `src/data/assessments.ts` — saveAssessment() write function
- `src/config/dimensions.ts` — DIMENSIONS array, DimensionKey type
- `src/screens/SummaryScreen.tsx` — existing card pattern and Peace Index score calculation
- `src/App.tsx` — current screen switcher to be refactored

### Research
- `.planning/research/STACK.md` — Recharts 3.8.x decision
- `.planning/research/FEATURES.md` — tracking feature requirements
- `.planning/phases/01-assessment/01-CONTEXT.md` — Phase 1 decisions (design patterns to follow)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `db.assessments` Dexie table — query with `orderBy('date')`, `toArray()`, `last()`
- `useLiveQuery` from dexie-react-hooks — reactive data binding
- `DIMENSIONS` config — use for chart line definitions (key, label, color)
- Peace Index calculation pattern — from SummaryScreen (average of 5 dimensions)
- Card styling pattern — from SummaryScreen score cards (rounded-lg, border, bg-slate-50)

### Established Patterns
- Tailwind v4 utility classes for all styling
- shadcn/ui components (Card, Button) for UI primitives
- date-fns for date formatting
- TypeScript strict mode

### Integration Points
- App.tsx needs refactoring from useState switcher to tab navigation
- New screens: HistoryScreen, TrendsScreen
- New data query: `db.assessments.orderBy('date').reverse().toArray()` for history list

</code_context>

<specifics>
## Specific Ideas

- Peace Index score (average) should be the prominent number on each history card
- Chart should clearly show which dimension is which — use the dimension labels from config
- Follow the same clean/modern aesthetic established in Phase 1

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-history-trends*
*Context gathered: 2026-04-13*
