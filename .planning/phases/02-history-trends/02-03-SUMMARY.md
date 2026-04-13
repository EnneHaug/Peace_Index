---
phase: 02-history-trends
plan: "03"
subsystem: trends-chart
tags: [recharts, trends, chart, dexie, useLiveQuery]
dependency_graph:
  requires:
    - "02-01"   # tab nav shell + recharts install + TrendsScreen stub
  provides:
    - TrendsScreen multi-line chart (TRAK-02)
  affects:
    - src/screens/TrendsScreen.tsx
tech_stack:
  added: []
  patterns:
    - Recharts ResponsiveContainer + LineChart + 5 Line components
    - useLiveQuery with orderBy ascending for time-series data
    - Sparse-data dot rule (D-08)
key_files:
  created: []
  modified:
    - src/screens/TrendsScreen.tsx
decisions:
  - "DIMENSION_COLORS defined inline in TrendsScreen (not a separate file) per plan spec"
  - "height={300} on ResponsiveContainer to prevent zero-height collapse (Pitfall 2)"
  - "orderBy('date').toArray() ascending — oldest-first for left-to-right time axis"
metrics:
  duration: "~5 minutes"
  completed: "2026-04-13"
  tasks_completed: 1
  tasks_total: 1
  files_changed: 1
---

# Phase 02 Plan 03: TrendsScreen Multi-Line Chart Summary

**One-liner:** Recharts multi-line trend chart with 5 dimension lines, date X-axis, 0-100% Y-axis, and sparse-data dot rule replacing the Plan 01 stub.

## What Was Built

Replaced the `TrendsScreen` stub with a production-ready Recharts multi-line chart implementing TRAK-02. The chart renders one `Line` per Peace Index dimension using `DIMENSIONS.map`, reads assessment records via `useLiveQuery(() => db.assessments.orderBy('date').toArray(), [])`, and applies the D-08 sparse-data rule (dots visible for 1-2 records, lines only for 3+).

## Tasks

| # | Name | Commit | Files |
|---|------|--------|-------|
| 1 | Build TrendsScreen with Recharts multi-line chart | 710c7af5 | src/screens/TrendsScreen.tsx |

## Acceptance Criteria Verification

- `export function TrendsScreen` — present
- `useLiveQuery` with `orderBy('date').toArray()` — present, no `.reverse()`
- `from 'recharts'` — `ResponsiveContainer`, `LineChart`, `Line`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `Legend` all imported
- `height={300}` on `ResponsiveContainer` — present
- `showDots` sparse-data rule — `records.length <= 2`
- `DIMENSIONS.map` renders one `Line` per dimension — present
- `personalHealth` in `DIMENSION_COLORS` — present (all 5 keys)
- `domain={[0, 100]}` on YAxis — present
- `records === undefined` loading guard before `records.length === 0` empty guard — correct order
- `npx tsc --noEmit` — 0 errors

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — TrendsScreen is fully implemented and wired to live IndexedDB data.

## Threat Flags

None — no new network endpoints, auth paths, or trust boundary surface introduced. All data is local IndexedDB reads.

## Self-Check: PASSED

- `src/screens/TrendsScreen.tsx` — exists and contains full implementation
- Commit `710c7af5` — verified in git log
