# Requirements: Peace Index

**Defined:** 2026-04-13
**Core Value:** Users can quickly assess their Peace Index across five dimensions and track their scores over time to identify trends and areas that need attention.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Assessment

- [ ] **ASMT-01**: User can score each of the 5 Peace Index dimensions (Purpose, People, Place, Personal Health, Provision) on a 1-100% scale using a slider
- [ ] **ASMT-02**: Each dimension displays a description/prompt explaining what it measures
- [ ] **ASMT-03**: User sees a summary of all 5 scores after completing an assessment

### Data

- [ ] **DATA-01**: Assessment results are saved locally in IndexedDB with timestamp
- [ ] **DATA-02**: Data persists across browser sessions and app restarts

### Tracking

- [ ] **TRAK-01**: User can view a list of past assessments with dates (newest first)
- [ ] **TRAK-02**: User can view trend line charts showing each dimension's score over time

### PWA

- [ ] **PWA-01**: App is installable as a PWA (web app manifest, icons, service worker)
- [ ] **PWA-02**: App works offline after initial load
- [ ] **PWA-03**: Responsive layout works on both mobile and desktop

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Hope Meter

- **HOPE-01**: User can take the Hope Meter assessment across 5 Circles of Influence (Self, Family, Team, Organization, Community)
- **HOPE-02**: User sees reflection prompts after completing Hope Meter assessment
- **HOPE-03**: Hope Meter results tracked alongside Peace Index history

### Differentiators

- **DIFF-01**: Composite average "Peace Score" displayed on summary and history
- **DIFF-02**: Delta indicators showing +/- change since last assessment
- **DIFF-03**: Color-coded score zones (needs attention / developing / thriving)
- **DIFF-04**: Radar/spider chart visualization of assessment results
- **DIFF-05**: JSON data export for backup
- **DIFF-06**: Dark mode
- **DIFF-07**: Print-ready summary view for coaching sessions

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| User accounts / authentication | Local-first principle; no backend for v1 |
| Cloud sync | Backend complexity; JSON export covers manual backup |
| Push notifications / reminders | Intrusive for reflective tool; passive "last assessed" display instead |
| Social features / leaderboards | Wellbeing scores are personal; no gamification via competition |
| Customizable dimensions | The 5 Ps are the framework; consistency matters for coaching |
| AI-generated insights | Adds API dependency and cost; let coaches draw conclusions |
| In-app journaling per dimension | Prompts shown but not stored; avoids privacy implications |
| Multi-user / family sharing | Complex data model without backend |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| ASMT-01 | Phase 1 | Pending |
| ASMT-02 | Phase 1 | Pending |
| ASMT-03 | Phase 1 | Pending |
| DATA-01 | Phase 1 | Pending |
| DATA-02 | Phase 1 | Pending |
| TRAK-01 | Phase 2 | Pending |
| TRAK-02 | Phase 2 | Pending |
| PWA-01 | Phase 3 | Pending |
| PWA-02 | Phase 3 | Pending |
| PWA-03 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 10 total
- Mapped to phases: 10
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-13*
*Last updated: 2026-04-13 after roadmap creation*
