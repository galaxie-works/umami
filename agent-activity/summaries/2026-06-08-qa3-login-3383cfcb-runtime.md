# QA3 Runtime Login Visual QA - Summary

Target: `origin/atlas/umami-parallel-lane-contracts @ 3383cfcb423b1fd5b5a6df03108a881703c0f21e`

Route: `/login`

Status: `passed_with_P2_notes`

## Completed

- Captured desktop and mobile in light and dark themes.
- Captured default login card, language menu open, Portuguese, English, and Spanish selected states.
- Confirmed custom language dropdown has exactly 3 options: `Portugues do Brasil`, `English`, `Espanol`.
- Confirmed no browser-native `select` element is present.
- Confirmed selecting each language changes login copy, not only picker label.
- Confirmed light theme renders `cosmolytics-logo-light.webp` and dark theme renders `cosmolytics-logo-dark.webp`.
- Confirmed magic-link CTA remains primary and password fallback remains discreet.

## Remaining Notes

- P2: Local runtime issue badge appears in captures. Treated as local runtime overlay evidence, not a product login delta.
- P2: Login copy localizes correctly, but remains admin/security themed. Product/content should confirm whether this tone is final.

## Artifacts

- Manifest and inventory: `agent-activity/screenshots/2026-06-08/qa3-login-3383cfcb-runtime/manifest.json`
- Gap backlog: `agent-activity/screenshots/2026-06-08/qa3-login-3383cfcb-runtime/login-visual-gaps.md`
- Agent activity: `agent-activity/runs/2026-06-08/20260608-011935-qa3-login-3383cfcb-runtime.jsonl`
- Screenshot root: `agent-activity/screenshots/2026-06-08/qa3-login-3383cfcb-runtime/`

No deploy, restart, DB mutation, Umami mutation, or production mutation was performed.
