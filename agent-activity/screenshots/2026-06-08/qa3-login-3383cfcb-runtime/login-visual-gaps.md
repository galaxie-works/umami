# QA3 Runtime Login Visual QA - 3383cfcb

Target: `origin/atlas/umami-parallel-lane-contracts @ 3383cfcb423b1fd5b5a6df03108a881703c0f21e`

Scope: `/login` desktop and mobile, light and dark themes, language dropdown, localized copy, logo theme assets, magic-link primary CTA, and password fallback.

## Result

Status: `passed_with_P2_notes`

No P1 visual blocker found for the PO corrections.

## Evidence Manifest

Manifest: `agent-activity/screenshots/2026-06-08/qa3-login-3383cfcb-runtime/manifest.json`

Screenshot root: `agent-activity/screenshots/2026-06-08/qa3-login-3383cfcb-runtime/`

## Inventory

| Component family | Expected | Actual | Status | Evidence |
| --- | --- | --- | --- | --- |
| Login layout | Cosmo legacy centered card, not split hero | Centered card is preserved on desktop and mobile in light and dark themes | Pass | `login-desktop-light-default.png`, `login-mobile-dark-default.png` |
| Auth actions | Magic-link CTA primary, password fallback discreet | Primary magic-link button and secondary password fallback remain visually correct | Pass | `login-desktop-light-default.png`, `login-desktop-dark-default.png` |
| Language dropdown | Exactly 3 options only | Menu shows exactly `Portugues do Brasil`, `English`, `Espanol` | Pass | `login-desktop-light-language-menu.png`, `login-mobile-dark-language-menu.png` |
| Native select | No browser-native select | DOM inspection found zero `select` elements | Pass | manifest inventory |
| Localized copy | Each language changes login copy, not only picker label | Portuguese, English, and Spanish each change body/action copy and selected label | Pass | `login-desktop-light-ptbr.png`, `login-desktop-light-english.png`, `login-desktop-light-es.png` |
| Dark menu | Custom dropdown remains legible in dark theme | Dark desktop and mobile menus are visually readable | Pass | `login-desktop-dark-language-menu.png`, `login-mobile-dark-language-menu.png` |
| Logo assets | Light uses light logo; dark uses dark logo | Light rendered `cosmolytics-logo-light.webp`; dark rendered `cosmolytics-logo-dark.webp` | Pass | `login-desktop-light-default.png`, `login-desktop-dark-default.png` |

## Gaps

### QA3-3383-P2-001 - Runtime Overlay Hygiene

Severity: P2

Owner suggestion: `frontend-runtime`

Expected: sanitized captures should show only the app UI where feasible.

Actual: a local issue badge is visible in the lower corner of runtime screenshots.

Evidence refs: `login-desktop-light-default.png`, `login-mobile-dark-default.png`

Acceptance criteria: disable or hide the local issue overlay for visual QA capture runs, or document it as accepted non-product overlay evidence.

### QA3-3383-P2-002 - Login Copy Tone

Severity: P2

Owner suggestion: `product-content`

Expected: localized login copy should match final Cosmo product tone if PO requires customer-facing wording.

Actual: all three language selections localize correctly, but copy remains admin/security themed.

Evidence refs: `login-desktop-light-ptbr.png`, `login-desktop-light-english.png`, `login-desktop-light-es.png`

Acceptance criteria: confirm the admin/security tone is final, or provide approved Cosmo login copy for all three supported languages.

## Sanitization Notes

Screenshots are UI-only and exclude browser chrome/address bars. Artifacts avoid credential material, payload rows, raw app IDs, and full URLs.

No deploy, restart, DB mutation, Umami mutation, or production mutation was performed.
