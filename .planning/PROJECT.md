# Peace Index

## What This Is

A PWA app that helps individuals and coaches/leaders take and track the Peace Index assessment — a personal wellbeing tool that measures five life dimensions (Purpose, People, Place, Personal Health, Provision) on a 1-100% scale. Users can retake the assessment regularly and see how their scores change over time.

## Core Value

Users can quickly assess their Peace Index across five dimensions and track their scores over time to identify trends and areas that need attention.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] User can take a Peace Index assessment scoring 5 dimensions (Purpose, People, Place, Personal Health, Provision) from 1-100%
- [ ] Each dimension includes a description/prompt explaining what it measures
- [ ] User sees a summary of their scores after completing an assessment
- [ ] Assessment results are saved locally on the device
- [ ] User can view history of past assessments with dates
- [ ] User can see trends/charts of their scores over time
- [ ] App works offline as a PWA (installable, service worker)
- [ ] Clean, modern, minimal UI suitable for both personal and professional coaching contexts

### Out of Scope

- Hope Meter assessment — deferred to future milestone
- User accounts / login / cloud sync — local-only for v1
- In-app sharing or coach dashboard — manual sharing (screenshot/verbal) for now
- Journal/note-taking for reflections — prompts shown but not stored
- Mobile native app — PWA covers mobile use cases

## Context

- The Peace Index is a coaching/personal development tool used by leaders, coaches, and individuals
- The five dimensions (Purpose, People, Place, Personal Health, Provision) form the "5 Ps"
- Users are encouraged to retake regularly and track changes over time
- The tool is also used in group settings where people share scores as a common language for check-ins
- The Hope Meter is a companion tool that will be added in a future milestone

## Constraints

- **Platform**: PWA — must be installable and work offline
- **Storage**: Local-only (localStorage/IndexedDB) — no backend required for v1
- **Design**: Clean and modern — professional enough for coaching contexts, approachable for personal use

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| PWA over native app | Cross-platform, no app store needed, installable | — Pending |
| Local storage only | Simplifies v1, no backend infrastructure needed | — Pending |
| Peace Index only for v1 | Focus on core tool first, add Hope Meter later | — Pending |
| No user accounts | Reduces complexity, data stays on device | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-13 after initialization*
