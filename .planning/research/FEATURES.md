# Feature Landscape

**Domain:** Personal assessment / wellbeing tracking PWA
**Project:** Peace Index
**Researched:** 2026-04-13
**Overall confidence:** HIGH (core assessment UX), MEDIUM (PWA specifics, differentiators)

---

## Table Stakes

Features users expect in a personal assessment/tracking tool. Missing any of these and the app feels incomplete or untrustworthy.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Score input per dimension | The core action — without it nothing works | Low | Slider or numeric input for 1-100 range; sliders are more tactile and satisfying |
| Dimension labels + descriptions | Users need context to score honestly; blind scoring is meaningless | Low | One sentence per dimension explaining what it measures |
| Score summary on completion | Immediate feedback loop — users need to see what they just did | Low | Show all 5 scores together after submission |
| Radar/spider chart visualization | Standard pattern for multi-dimension assessments; the "wheel of life" format is near-universal in coaching tools | Medium | 5-axis radar makes dimension balance instantly legible |
| Assessment history list | Users expect to see past attempts with dates — without history there's no tracking | Low | Date + overall or per-dimension scores; sorted newest-first |
| Trend charts over time | Core value prop of any tracking tool; expected from first session | Medium | Line chart per dimension showing score changes across sessions |
| Offline-first functionality | PWA contract — if it breaks when offline the user uninstalls it | Medium | Service worker + IndexedDB; app must work 100% offline |
| Installability (add to home screen) | PWA users expect this; without it the app is just a website | Low | Web app manifest with icons, name, theme color |
| Responsive layout (mobile + desktop) | Assessment tools are used on phones in coaching sessions, desktops at home | Low | Single responsive layout, no separate mobile/desktop codebases |
| Data persistence across sessions | Users assume their data is safe; losing history kills trust immediately | Low | IndexedDB for structured data; localStorage for settings |
| Custom offline fallback page | Without this the browser shows a default error — breaks the "installed app" illusion | Low | Custom offline.html served by service worker |

---

## Differentiators

Features not universally expected but that meaningfully elevate the experience. Any one of these is a competitive advantage in the coaching tool space.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Overlay/compare radar charts | Show two assessments on the same chart — powerful for coaching conversations comparing "then" vs "now" | Medium | Requires date picker UI + layered chart rendering |
| Dimension delta indicators | Show +/- change since last assessment next to each score — surfaces progress without needing to read charts | Low | Pure derived data; calculation is trivial |
| Color-coded score zones | Green/amber/red banding (e.g. 0-33 = needs attention, 34-66 = developing, 67-100 = thriving) provides immediate at-a-glance reading | Low | Consistent color system applied to sliders, charts, and summary |
| Assessment notes/context field | Optional free-text per session (not per dimension) lets users capture what was happening in their life — adds meaning to the numbers over time | Low | Single textarea stored with each assessment record |
| Data export (JSON or CSV) | Local-only apps create "data trap" anxiety; export gives users a safety net and enables manual backup | Medium | Browser download API; JSON is simplest, CSV is more portable |
| Print/screenshot-ready summary view | Coaches and users share results verbally or visually; a clean, printable summary removes friction in coaching sessions | Low | Print-optimized CSS + clean layout; no extra infrastructure |
| Streaks / last-assessed date | "You last assessed 14 days ago" nudges re-engagement without needing push notifications | Low | Derived from history; surface on dashboard/home screen |
| Average score across all dimensions | Single composite "Peace Score" gives users a headline number for easy communication ("I'm at 72 this week") | Low | Arithmetic mean; display prominently on summary and history |
| Coaching-mode shareable snapshot | A read-only snapshot URL (hash-encoded, no backend) that coaches can review — no account needed | High | Complex without a backend; low priority for v1 |
| Dark mode | Professional polish; many coaching sessions happen in evening contexts | Low | CSS custom properties + prefers-color-scheme media query |

---

## Anti-Features

Features to deliberately NOT build — either because they add complexity without proportionate value, or because they contradict the product's local-only, clean design principles.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| User accounts / authentication | Adds backend, security surface, GDPR complexity — contradicts local-first principle | Keep all data on device; export for backup |
| Cloud sync | Same backend complexity problem; creates sync conflicts, account lockout issues | Offer JSON export/import as a manual sync path |
| Push notifications / reminders | Requires notification permission prompts; users deny 60%+ of time; feels intrusive for a reflective tool | Show "days since last assessment" passively on the home screen |
| Social features / leaderboards | Wellbeing scores are deeply personal; gamification via competition is antithetical to the reflective/coaching context | Focus on self-comparison (over time) not social comparison |
| Habit tracking / daily check-ins | Scope creep — this is an assessment tool, not a habit tracker; different UX contract | Refer users to dedicated habit apps; Peace Index is periodic (weekly/monthly) |
| Customizable dimensions | The 5 Ps are the framework — letting users rename them dilutes the brand and breaks coaching consistency | Hard-code the 5 dimensions; descriptions can be refined in copy |
| AI-generated insights / coaching | Adds API dependency, cost, and latency; undermines the human coaching relationship | Surface clean data; let coaches/users draw their own conclusions |
| In-app journaling per dimension | Prompts shown = good; stored reflections per dimension = scope creep with privacy implications | Show reflection prompts but do not store them |
| Multi-user / family sharing | Complex data model, no backend — not worth the complexity for v1 | Single-user, single device; coach reviews via screen share |
| Animated/gamified onboarding | Adds time-to-first-value friction; the assessment IS the onboarding | Start the assessment immediately on first launch |

---

## Feature Dependencies

```
Dimension labels + descriptions → Score input per dimension
Score input per dimension → Score summary on completion
Score summary on completion → Assessment record saved
Assessment record saved → Assessment history list
Assessment history list → Trend charts over time
Assessment history list → Overlay/compare radar charts
Assessment record saved → Delta indicators (requires 2+ records)
Assessment record saved → Average composite score
Assessment record saved → Data export

Offline-first (service worker) → Installability
Installability → Custom offline fallback page
IndexedDB → Assessment record saved
```

---

## MVP Recommendation

**Prioritize (Phase 1 — Core Loop):**
1. Score input (slider, 1-100) per dimension with descriptions
2. Score summary + radar chart on completion
3. Assessment saved to IndexedDB
4. PWA installability + offline service worker
5. Responsive layout

**Prioritize (Phase 2 — Tracking Value):**
6. Assessment history list with dates
7. Trend line charts per dimension
8. Composite average score display
9. Dimension delta indicators (change since last)

**Add for polish (Phase 3 — Differentiators):**
10. Color-coded score zones
11. Data export (JSON)
12. Print-ready summary view
13. Dark mode

**Defer indefinitely:**
- Overlay/compare charts (high value but requires more UI complexity)
- Assessment notes field (easy to add later, not critical for MVP)
- Coaching snapshot URL (requires backend or hash encoding complexity)

---

## Sources

- UX Studio Team — "5 UX Best Practices For Successful Self-tracking Apps": https://www.uxstudioteam.com/ux-blog/self-tracking
- web.dev — PWA Checklist (core vs optimal): https://web.dev/articles/pwa-checklist
- Wheel of Life Coaching Tool patterns: https://www.lifecoachmagazine.com/wheel-of-life-coaching/
- Logrocket — Offline storage for PWAs: https://blog.logrocket.com/offline-storage-for-pwas/
- Medium (Scott Kuhl) — "The PWA Data Trap": https://scottkuhl.medium.com/the-pwa-data-trap-5bd94d546348
- UX Studio Dashboard design principles: https://www.uxstudioteam.com/ux-blog/self-tracking
- Radar/Spider chart coaching patterns: https://fastercapital.com/content/Radar-Charts--How-to-Use-Radar-Charts-to-Show-Your-Attributes-and-Scores.html
