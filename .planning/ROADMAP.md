# Roadmap: Peace Index

## Overview

Build a PWA that lets users take the Peace Index assessment, see their scores, track history, and view trends over time — all stored locally with no backend required. The journey moves from core assessment flow, to history and trend visualization, to production-ready PWA packaging.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Assessment** - User can take and complete a Peace Index assessment with scores saved locally
- [ ] **Phase 2: History & Trends** - User can view past assessments and score trend charts
- [ ] **Phase 3: PWA & Polish** - App is installable, works offline, and is responsive on all devices

## Phase Details

### Phase 1: Assessment
**Goal**: Users can take a full Peace Index assessment, see their results, and have them saved for future reference
**Depends on**: Nothing (first phase)
**Requirements**: ASMT-01, ASMT-02, ASMT-03, DATA-01, DATA-02
**Success Criteria** (what must be TRUE):
  1. User can score all 5 dimensions (Purpose, People, Place, Personal Health, Provision) using a 1-100% slider
  2. Each dimension shows a description/prompt explaining what it measures before the user scores it
  3. After completing all 5 dimensions, user sees a summary view showing all 5 scores at once
  4. Assessment results persist in IndexedDB and remain available after closing and reopening the browser
**Plans**: TBD
**UI hint**: yes

### Phase 2: History & Trends
**Goal**: Users can review their assessment history and see how their scores have changed over time
**Depends on**: Phase 1
**Requirements**: TRAK-01, TRAK-02
**Success Criteria** (what must be TRUE):
  1. User can view a list of all past assessments ordered newest first, each showing its date
  2. User can view a chart for each dimension showing its score trend across all past assessments
**Plans**: 3 plans

Plans:
- [ ] 02-01-PLAN.md — Install Recharts and refactor App.tsx to three-tab bottom navigation
- [ ] 02-02-PLAN.md — Build HistoryScreen with card list, expand/collapse, and empty state
- [ ] 02-03-PLAN.md — Build TrendsScreen with Recharts multi-line trend chart

### Phase 3: PWA & Polish
**Goal**: The app is a fully installable, offline-capable PWA that works on any screen size
**Depends on**: Phase 2
**Requirements**: PWA-01, PWA-02, PWA-03
**Success Criteria** (what must be TRUE):
  1. User is prompted to install the app on mobile and desktop and it launches from the home screen/taskbar
  2. User can take an assessment and view history with no internet connection after the first load
  3. The app layout is usable and visually correct on mobile phones, tablets, and desktop browsers
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Assessment | 0/TBD | Not started | - |
| 2. History & Trends | 0/3 | Not started | - |
| 3. PWA & Polish | 0/TBD | Not started | - |
