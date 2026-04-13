# Phase 3: PWA & Polish - Context

**Gathered:** 2026-04-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Make the app installable as a PWA with offline support and ensure responsive layout works on mobile, tablet, and desktop. No new features — wrap the existing app in production-ready PWA packaging.

</domain>

<decisions>
## Implementation Decisions

### PWA Setup
- **D-01:** Use vite-plugin-pwa (already in project STACK.md) with generateSW strategy
- **D-02:** Web app manifest with app name "Peace Index", theme color blue-500 (#3B82F6), background white
- **D-03:** Generate PWA icons (192x192 and 512x512) — simple text-based or geometric placeholder icons
- **D-04:** Service worker caches all static assets for full offline capability

### Offline Behavior
- **D-05:** App works completely offline after first load (all data is local IndexedDB anyway)
- **D-06:** Custom offline fallback page not needed — the entire app IS the offline experience

### Responsive Layout
- **D-07:** Verify and fix any layout issues on mobile (< 640px), tablet (640-1024px), and desktop (> 1024px)
- **D-08:** Bottom tab bar must be touch-friendly on mobile (44px minimum tap targets)
- **D-09:** Charts must be readable and usable on mobile screens

### Claude's Discretion
- Exact manifest display mode (standalone recommended)
- Service worker update strategy (skipWaiting + reload prompt vs silent)
- Icon design (simple geometric placeholder)
- Any meta tags needed for iOS PWA support

</decisions>

<canonical_refs>
## Canonical References

### Research
- `.planning/research/STACK.md` — vite-plugin-pwa 1.2.x decision
- `.planning/research/PITFALLS.md` — iOS Safari PWA quirks, service worker update stickiness

### Existing implementation
- `src/App.tsx` — Tab navigation layout to verify responsive behavior
- `vite.config.ts` — Vite config to add PWA plugin
- `index.html` — Add PWA meta tags

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Tailwind responsive utilities already used (sm: breakpoint in SummaryScreen grid)
- vite.config.ts ready for plugin addition

### Established Patterns
- Tailwind v4 for all styling
- Vite 8 build pipeline

### Integration Points
- vite.config.ts — add vite-plugin-pwa plugin
- index.html — PWA meta tags, apple-touch-icon
- public/ — manifest icons

</code_context>

<specifics>
## Specific Ideas

No specific requirements — standard PWA packaging following research recommendations

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-pwa-polish*
*Context gathered: 2026-04-13*
