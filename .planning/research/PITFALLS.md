# Domain Pitfalls

**Domain:** PWA assessment/tracking app (local-only, offline-first)
**Project:** Peace Index
**Researched:** 2026-04-13

---

## Critical Pitfalls

Mistakes that cause rewrites, data loss, or broken installs.

---

### Pitfall 1: localStorage for Assessment History — Silent Data Loss

**What goes wrong:** Using `localStorage` to store the growing history of assessments. localStorage is limited to ~5 MB per origin across all browsers. For a tracking app that accumulates timestamped records over months or years, this fills up quietly. When the quota is hit, writes throw a `QuotaExceededError` — uncaught, this silently drops saves.

**Why it happens:** localStorage feels simple and familiar. Developers reach for it first without projecting data volume over time.

**Consequences:** User loses assessment history on write failure. No warning, no error shown in UI. Histories from power users (daily or weekly entries) will hit quota faster than expected.

**Prevention:**
- Use IndexedDB (via a thin wrapper like `idb`) as the primary store for all assessment records. IndexedDB quota is orders of magnitude larger (gigabytes, not megabytes).
- Reserve localStorage only for simple, tiny settings (e.g., theme preference, onboarding flag).
- Wrap all writes in `try/catch`, check quota with `navigator.storage.estimate()` on load, and show a user-facing warning if storage is critically low.

**Warning signs:**
- Any assessment record write that isn't wrapped in error handling.
- Storing arrays of objects (the assessment history) in a single localStorage key.

**Phase:** Address in the storage/data layer — the first phase that touches persistence.

---

### Pitfall 2: No Data Schema Versioning from Day One

**What goes wrong:** Storing assessment objects with no version field. When the data shape changes in a future update (e.g., adding a new dimension, renaming a field, adding metadata), the app reads old records and crashes or silently misinterprets values.

**Why it happens:** Greenfield apps have one data shape and no immediate pressure to version it. Future-proofing feels premature.

**Consequences:** Breaking update — users who update the app find their entire history unreadable or the app throws on load. Apps that don't handle this get terrible reviews and users who lose months of data. Recovering requires writing a migration and shipping another update, during which data may already be corrupted.

**Prevention:**
- Every stored assessment record must include a `schemaVersion` field (e.g., `"schemaVersion": 1`) from the very first write.
- At load time, run a migration function that upgrades old records to the current schema before passing data to the UI.
- The IndexedDB database itself should be opened with a version number (`IDBOpenDBRequest` `version` parameter), enabling `onupgradeneeded` migrations.

**Warning signs:**
- Assessment objects stored without a `schemaVersion` field.
- No migration layer between storage reads and app state.

**Phase:** Address in the storage/data layer — set this pattern before writing any real data, even in the first working version.

---

### Pitfall 3: Service Worker Update Loop — Users Stuck on Stale Version

**What goes wrong:** After deploying a bug fix or UI update, users who have the PWA installed continue running the old cached version. The browser checks for a new service worker on navigation, but a standalone installed PWA may stay open for days without a full close — meaning the update check never fires, or the new service worker waits in `waiting` state indefinitely.

**Why it happens:** Service worker lifecycle is counterintuitive. A new service worker installs but does not activate until all tabs using the old one are closed. Installed PWAs running in standalone mode are especially prone to this — users never "close and reopen" the browser the way they would a tab.

**Consequences:** Shipped bug fixes don't reach users. UI regressions linger. Users on old versions can develop incorrect mental models of the app that differ from the current design.

**Prevention:**
- Use `skipWaiting()` + `clients.claim()` in the service worker to allow the new version to take over immediately on update.
- Show an in-app "Update available — reload to get the latest version" banner when a new service worker is detected waiting (listen for `updatefound` / `statechange` events on the service worker registration).
- Use versioned cache names (`cache-v1`, `cache-v2`) so activating a new service worker deletes old caches in `onactivate`.
- If using Vite + vite-plugin-pwa, understand what its `autoUpdate` vs `prompt` modes do — don't accept defaults blindly.

**Warning signs:**
- No `skipWaiting()` in the service worker.
- No update notification UI.
- Cache key is a static string, not versioned.

**Phase:** Address during PWA/service worker setup — before any production deployment.

---

### Pitfall 4: iOS Safari PWA — Broken Installs, Data Disappears

**What goes wrong:** The app installs and works on Android/Chrome but behaves differently or loses data on iOS. Specific known issues:
- iOS has a 50 MB cache storage limit for PWAs (vs. gigabytes on Chrome).
- Safari may auto-delete IndexedDB data when device storage is low or the PWA hasn't been used in an extended period.
- There is no browser-level install prompt on iOS — users must use the Share menu and "Add to Home Screen" manually. Coaches handing this app to clients on iPhones will face friction.
- iOS does not use the web manifest for the splash screen — it uses `apple-touch-startup-image` link elements, which must be sized precisely per device.
- Service worker listeners (e.g., for events after a device restart) may not fire reliably on iOS when the PWA is launched from the home screen.

**Why it happens:** Chrome/Android and iOS/Safari have significantly diverging PWA implementations despite both being standards-compliant in theory.

**Consequences:** Coaching clients on iPhones either can't install the app without instruction, or install it and lose their data after a device storage crunch. The core value proposition (local history) breaks on a major platform.

**Prevention:**
- Test the full flow (install, save data, close, reopen, view history) on a real iOS device or BrowserStack — not just Chrome DevTools device emulation.
- Add an explicit in-app install prompt for iOS: detect `!window.matchMedia('(display-mode: standalone)').matches` and show step-by-step instructions for the Share > Add to Home Screen flow.
- Include iOS splash screen meta tags (`apple-touch-startup-image`) with at least the common iPhone sizes.
- Include `apple-mobile-web-app-capable` and `apple-mobile-web-app-status-bar-style` meta tags.
- Warn users (in the app) that clearing browser data will erase their history, and offer a JSON export so they can back it up.

**Warning signs:**
- Testing done exclusively in Chrome or DevTools.
- No iOS-specific meta tags in `<head>`.
- No install instructions for non-Android users.

**Phase:** Address during PWA manifest/installability setup; test on iOS before declaring any phase complete.

---

## Moderate Pitfalls

---

### Pitfall 5: Slider Input Unusable on Mobile Touch

**What goes wrong:** A 1–100 slider for each of the 5 dimensions looks great on desktop but is nearly impossible to use precisely on a small phone screen. The user's finger obscures the value label. Tapping and dragging to land on an exact number (e.g., 73) is frustrating. Assessments intended to take 2 minutes become an exercise in fine motor precision.

**Why it happens:** Sliders are the obvious visual metaphor for a 1–100 scale, and they look polished in design mockups. Touch usability issues only surface during real device testing.

**Consequences:** Users round to multiples of 5 or 10 (defeating precision scoring), abandon mid-assessment, or avoid using the app on mobile. Since a PWA is mobile-first, this is a core UX failure.

**Prevention:**
- Always pair a slider with a visible numeric input or step buttons (+/-) so users can fine-tune the value without fighting touch drag precision.
- Display the current value above the slider handle (not below, where a finger obscures it).
- Set the slider thumb hit target to at minimum 48px (WCAG 2.5.8 minimum touch target).
- Run user testing on a real phone before committing to the slider pattern — a large-number picker (scrolling drums) or simple number input may be more usable for this domain.

**Warning signs:**
- Slider thumb smaller than 44–48px.
- Value label positioned below the track.
- No numeric fallback input alongside the slider.

**Phase:** Address during assessment form/UI implementation. Test on physical mobile before marking complete.

---

### Pitfall 6: Missing PWA Manifest Icons Causing Silent Non-Installability

**What goes wrong:** The app technically has a manifest, but the install criteria aren't met because icons are missing required sizes, use the wrong format, or lack a `maskable` variant. On Android, the app either won't trigger the install prompt or installs with an ugly white-square icon.

**Why it happens:** Icon requirements are specific and cross-platform inconsistent. Developers generate one PNG and assume it's sufficient.

**Consequences:** "Install" button never appears. Coaches trying to install the app for a workshop can't. Android home screen shows a white-boxed icon that looks unprofessional.

**Prevention:**
- Generate at minimum: 192x192 PNG, 512x512 PNG, and a `maskable` variant of the 512x512 (with safe zone padding). Tools like `maskable.app` make this trivial.
- Also include `apple-touch-icon` (180x180) linked from `<head>` for iOS home screen icon quality.
- Validate using Lighthouse PWA audit before any release — installability failures surface there with specific error messages.
- Use the `purpose: "maskable any"` field correctly in the manifest icons array.

**Warning signs:**
- Only one icon size defined in the manifest.
- No `maskable` icon variant.
- Lighthouse PWA score below 100.

**Phase:** Address during PWA setup; validate with Lighthouse before any public sharing.

---

### Pitfall 7: Charts Misleading With Only 1–3 Data Points

**What goes wrong:** A line chart showing trends is the goal — but new users have 1 or 2 assessments. A line between 2 points looks like a meaningful trend. A single point with no line is confusing. Many chart libraries render this poorly (e.g., NaN errors, empty SVG, overlapping axis labels for tiny datasets).

**Why it happens:** Charts are designed and tested against mock data with 10+ points. Edge cases with minimal data are discovered late.

**Consequences:** New users see broken or misleading charts. A coaching client who just took their first assessment sees a flat line or an error, not encouragement to continue.

**Prevention:**
- Render the trend chart only when >= 2 assessments exist; show a "Take your next assessment to see trends" placeholder for < 2 entries.
- Test chart rendering with 0, 1, 2, and 3 data points explicitly during development.
- Choose a chart library that handles sparse data gracefully (e.g., Chart.js with `spanGaps`, Recharts with null value handling).

**Warning signs:**
- Chart component receives mock data with 8+ entries during all development.
- No empty/minimal state design for the history/trends screen.

**Phase:** Address during charting/trends implementation. Design empty states before coding the chart.

---

### Pitfall 8: No Export Path Leaves Users Stranded

**What goes wrong:** The app stores data locally with no backend. Users who switch devices, clear their browser, or upgrade their phone lose all history with no recovery path. For a coaching tool used in professional contexts, this is a credibility-damaging failure.

**Why it happens:** Local-only is framed as a simplifying constraint, and export feels like a "later" feature. It gets deferred indefinitely.

**Consequences:** A coaching client loses 6 months of assessment history when they get a new phone. They blame the app. Word spreads in the coaching community that the app isn't reliable.

**Prevention:**
- Ship a simple JSON export (download file) in v1. This is low-effort (one `Blob` + `URL.createObjectURL` call) and gives users a recovery path.
- Mention the local-only limitation and how to export in the onboarding/first-run experience — set expectations before data loss happens.
- Consider a CSV export as well for users who want to analyze in spreadsheets (coaches especially).

**Warning signs:**
- No export function in the roadmap for the first milestone.
- No mention of the local-only storage limitation in the UI.

**Phase:** Include export in the first milestone alongside the history/save feature — not deferred.

---

## Minor Pitfalls

---

### Pitfall 9: HTTPS Not Configured — PWA Features Silently Disabled

**What goes wrong:** Service workers and PWA installability require HTTPS (or localhost). Developers test on localhost (fine), then deploy to a host that serves over HTTP or has a misconfigured certificate. All PWA features break silently.

**Prevention:** Confirm HTTPS is active and the certificate is valid before testing any PWA feature in production. Use platforms that enforce HTTPS by default (Vercel, Netlify, GitHub Pages).

---

### Pitfall 10: "display: standalone" Not Set — Installed App Shows Browser Chrome

**What goes wrong:** The manifest's `display` field defaults to `browser`. When installed, the app opens in a browser tab with the address bar visible, which breaks the "native app" feel.

**Prevention:** Set `"display": "standalone"` in the manifest. Test by installing the PWA to a home screen and opening it — no browser UI should be visible.

---

### Pitfall 11: Hard-Coded Assessment Date Uses Local Time Incorrectly

**What goes wrong:** Assessment timestamps stored as `new Date().toString()` are locale-dependent and non-sortable. History list sorted by this string fails for international users and breaks chronological ordering.

**Prevention:** Store timestamps as ISO 8601 UTC strings (`new Date().toISOString()`). Parse and display in local time for the UI. Sort and compare using the stored UTC values.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|---|---|---|
| Storage/data layer | localStorage quota + no schema versioning | Use IndexedDB + `schemaVersion` field on every record |
| Assessment form UI | Slider unusable on mobile touch | Pair slider with numeric input; test on real phone |
| PWA setup | Manifest icons incomplete; service worker update loop | Run Lighthouse; implement `skipWaiting` + update banner |
| History/trends UI | Charts broken with 1-2 entries; no export path | Design empty states; ship JSON export in v1 |
| iOS testing | Data loss, broken install flow, no splash screen | Test on real device; add iOS-specific meta tags |
| Any deployment | HTTPS missing; display mode is browser | Confirm HTTPS; set `display: standalone` |

---

## Sources

- MDN: Storage quotas and eviction criteria — https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria
- RxDB: localStorage guide and limitations — https://rxdb.info/articles/localstorage.html
- RxDB: IndexedDB max storage limit — https://rxdb.info/articles/indexeddb-max-storage-limit.html
- web.dev: PWA service worker update lifecycle — https://web.dev/learn/pwa/update
- Infinity Interactive: Taming PWA cache behavior — https://iinteractive.com/resources/blog/taming-pwa-cache-behavior
- MagicBell: PWA iOS limitations and Safari support — https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide
- Brainhub: PWA on iOS current status and limitations — https://brainhub.eu/library/pwa-on-ios
- Nielsen Norman Group: Slider design rules of thumb — https://www.nngroup.com/articles/gui-slider-controls/
- Chrome for Developers: Installable manifest requirements — https://developer.chrome.com/docs/lighthouse/pwa/installable-manifest
- DEV Community: PWA icon requirements 2025 checklist — https://dev.to/albert_nahas_cdc8469a6ae8/pwa-icon-requirements-the-complete-2025-checklist-i3g
- web.dev: PWA offline and caching guide — https://web.dev/learn/pwa/service-workers
- RudderStack: Data migration challenges — https://www.rudderstack.com/blog/data-migration-challenges/
