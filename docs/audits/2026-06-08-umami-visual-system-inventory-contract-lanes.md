# Umami visual-system inventory contract lanes

Classification: `umami_visual_system_inventory_contract_lanes_active / Atlas_contract_support / no_deploy_no_mutation`

Input: Vega visual-system inventory, including the finding that the fork still has 281 `@umami/react-zen` imports and that `components/shadcn/SettingsKit` is a CSS-module kit, not a complete visual foundation.

Relationship to prior backlog: this artifact refines `2026-06-08-umami-shadcn-cosmo-visual-system-contract-backlog.md` into source/static guard lanes. Cosmolytics remains a legacy visual reference only. Umami data, routes, permissions, and auth semantics remain canonical.

## Non-negotiable invariants

- Preserve Umami route identity, API request/response semantics, and permission checks unless Orion/PO authorizes a specific backend contract lane.
- Preserve global roles: `admin`, `user`, `view-only`.
- Preserve team scope: `Team`, `TeamUser`, `Website.teamId`, website-specific permissions, and team role behavior stay canonical.
- Preserve canonical auth/session behavior: login and magic-link verification must issue the same kind of Umami auth token/session as password login.
- Never expose raw magic-link tokens, invite tokens, invitation links, magic-login links, cookies, auth headers, full URLs, raw IDs, or secret-bearing config in API responses, UI state, logs, screenshots, validators, or artifacts.
- Do not turn Cosmolytics proxy/normalizer concepts into Umami source contracts. Cosmolytics is a visual target, not the backend source of truth.

## ZenProvider and `@umami/react-zen` boundary

The 281 `@umami/react-zen` imports make this a migration program, not a single visual patch.

P0 retention rule:
- Keep `ZenProvider` and existing Zen components in place until a lane replaces every directly affected component, page wrapper, and test/selector expectation for that surface.
- Do not remove `@umami/react-zen` globally in a foundation patch.
- Do not mix partially migrated primitives in a way that changes form submission, keyboard behavior, focus trapping, table pagination, or menu selection.

P1 migration rule:
- Migrate by surface or primitive family, with source/static guards proving imported Zen primitives for that lane are either intentionally retained or fully replaced.
- Shared wrappers may bridge Zen and shadcn during transition, but must preserve props and behavior used by existing Umami screens.

P2 cleanup rule:
- Only after the last importing surface is migrated should the program remove Zen package/provider wiring and run a broad import/dead-code cleanup.

Backend/auth/schema required: no. Zen migration is visual/component-system work unless a migrated form exposes a pre-existing backend contract issue.

## P0 foundation primitives and token contract

Goal: establish the visual foundation before broad surface rewrites.

Source/static contract:
- Define the canonical shadcn/Cosmo primitive set for buttons, inputs, labels, checkbox/switch/radio, select/combobox, tabs, dialog/sheet/popover, dropdown/menu, table, card/panel, badge/status, tooltip, toast/alert, skeleton, pagination, date/range controls, and empty/error blocks.
- Define design tokens for color, spacing, radius, border, focus ring, typography scale, table density, shell/sidebar dimensions, chart panel framing, and mobile breakpoints.
- `SettingsKit` may remain a local CSS-module kit for settings/admin lanes, but it must not be documented as the complete foundation.
- Every primitive must expose or preserve accessible names, keyboard behavior, disabled state, invalid state, focus visible state, and loading state.

Backend/auth/schema required:
- No. This is visual/component foundation only.

Luna acceptance:
- Source scan lists all new foundation files and confirms no API/schema/migration/auth files changed.
- Validator or grep proof that no raw token/link terminology appears outside safety-policy text or auth-specific files.
- Build/typecheck must pass before any served visual QA lane.

Owner:
- Mira for primitive implementation.
- Atlas for source/static contract and validators.
- Luna for source/static guard.

## P0/P1 common wrappers and input contract

Goal: prevent each screen from inventing its own form/table/dialog behavior.

Source/static contract:
- Common wrappers must standardize page header, section header, toolbar, filter row, action group, form field, inline validation, confirmation dialog, destructive action, empty state, and error state.
- Inputs must preserve native submit behavior, `name`/payload semantics, validation error placement, autocomplete attributes, and disabled/loading state.
- Selects, tabs, comboboxes, dialogs, and dropdowns must be keyboard reachable and screen-reader named.
- Tables must preserve sorting, pagination, row action affordances, selected row state, and mobile overflow behavior.

Backend/auth/schema required:
- No for wrapper changes.
- Yes only if a wrapper changes payload shape, endpoint, query key, mutation method, or role/team guard.

Acceptance markers:
- `data-visual-system="shadcn-cosmo"` on migrated surface root.
- `data-form-contract` on complex forms that should be guarded by source/static validators.
- `data-table-contract` on migrated tables where sorting/pagination/actions are expected.

Owner:
- Mira for implementation.
- Atlas for contract tests/validators when payload or selector preservation matters.

## P1 auth contract: login, magic-link, password fallback

Goal: make branded login feel Cosmo-native while preserving Umami auth invariants.

Source/static contract:
- Magic link may be the primary CTA visually, but password login must remain available as fallback unless PO explicitly removes it.
- Magic-link request remains enumeration-safe: same successful envelope for known and unknown users, with only safe configuration status such as `emailConfigured`.
- Magic-link verify remains existing-user only, expiry checked, single-use, and uses normal Umami auth session creation.
- Invite accept must clearly separate new-user password creation from existing-user invitation acceptance.
- Token/link values must be accepted only from the intended request body/query path and never rendered into admin tables or logs.

Backend/auth/schema required:
- Required for lifecycle semantics: single-use, expiry, token hash only, invite accept atomicity, revoke/resend state, existing-user acceptance, or session creation.
- Not required for logo, layout, copy hierarchy, tabs, button styling, responsive shell, or visual error blocks.

Guard:
- Validator confirms no admin/API response exposes `tokenHash`, token, invite URL, or magic-login URL.
- Runtime QA, when authorized, uses only status/body keys/booleans and redacted browser screenshots.

Owner:
- Atlas for auth contract gaps.
- Mira for visual implementation.
- Iris/DM for controlled non-prod smoke only after Luna PASS.

## P1 shell/nav contract

Goal: migrate shell/sidebar/topbar without breaking Umami navigation and permissions.

Source/static contract:
- Preserve current route identity and navigation helpers for dashboard, websites, reports, settings, teams, admin, and website-specific pages.
- Preserve admin-only nav visibility and team/website context routing.
- Sidebar and mobile nav may adopt Cosmo visual rhythm, but must not hide Umami routes because legacy Cosmolytics lacked them.
- Topbar must keep current user/team/website context recoverable on desktop and mobile.

Backend/auth/schema required:
- No. Required only if route permissions or nav data APIs are changed.

Guard:
- Source scan proving no API route files changed for shell-only lanes.
- Visual QA covers desktop expanded/collapsed, mobile drawer, admin user, non-admin user, team-scoped context, and website-scoped context.

Owner:
- Mira primary.
- Atlas support if route/permission selectors are ambiguous.

## P1 admin/settings/team/user/invite contract

Goal: visually align admin/settings while preserving Umami user/team authority.

Source/static contract:
- Admin users, teams, websites, settings, profile, preferences, and invitation panels may use Cosmo layout density and shadcn primitives.
- Umami global user roles stay constrained to `admin`, `user`, `view-only`.
- Team membership stays constrained to Umami team roles and website-scope fields already present in this fork.
- Invite list must display lifecycle status, safe timestamps, role, team/website scope summary, delivery state, and allowed actions without exposing token/link material.

Backend/auth/schema required:
- Required for invite lifecycle fixes, team/website scope mutations, last-admin/self-lockout, session revocation, or API response changes.
- Not required for visual restyling of tables, badges, dialogs, settings cards, or empty states.

P1 acceptance:
- Admin-only routes remain guarded by existing permission helpers.
- Non-admin cannot access global admin user/invite management.
- Team-scoped invite UI cannot grant global admin.
- Revoke/resend/accept states remain semantically distinct and QA-able.
- Destructive actions use confirmation and preserve existing mutation method/endpoint.

Owner:
- Mira UI.
- Atlas backend/auth contract if lifecycle or role/scope gaps appear.
- Dario if PO semantics for team-scoped managers conflict with Umami role model.

## P1 workspace list/table contract

Goal: align high-frequency lists with the visual system.

Surfaces:
- Website list/settings.
- Team list/settings.
- User list/admin.
- Invitation list/admin.
- Reports/boards/link/pixel lists where present.

Source/static contract:
- Preserve query hooks, endpoint paths, pagination params, sorting, search, row action menus, and empty/error states.
- Shadcn table visuals must not collapse action discoverability on mobile.
- Loading states must not shift table geometry unexpectedly.
- Row identifiers used by API calls must never be shown in artifacts except as hashed IDs in QA.

Backend/auth/schema required:
- No for table visuals.
- Yes only if pagination/sort/search query shape or row action endpoints change.

Guard:
- Validator checks query path strings for migrated lists when practical.
- Visual QA covers empty, non-empty, search/no-match, pagination, row action menu, and mobile overflow.

Owner:
- Mira implementation.
- Atlas contract support for query shape preservation.

## P2 analytics surface contract

Goal: migrate visual system over analytics without altering Umami analytics semantics.

Source/static contract:
- Analytics pages must preserve native Umami endpoints and hooks for website stats, pageviews, metrics, expanded metrics, realtime, sessions, events, reports, segments/cohorts, revenue, attribution, retention, funnel, journey, performance, goals, UTM, shares, settings, and tracking code.
- Cosmo styling may influence panels, cards, tabs, charts, tables, and mobile stacking only.
- Empty/error/unavailable states must distinguish no data, no access, upstream/data failure, and loading.

Backend/auth/schema required:
- No for visual migration.
- Yes only for missing native endpoint, route mismatch, status/reason collapse, permission drift, or new report contract.

Guard:
- Source scan confirms protected routes retain `canViewWebsite`/team permission checks where applicable.
- Runtime QA is read-only unless a specific disposable mutation lab is authorized.
- Evidence contains statuses/body keys/counts/booleans/hashed IDs only.

Owner:
- Mira for visual surfaces.
- Atlas for backend contract issues.
- Iris/Rhea for runtime visual QA.

## Suggested lane sequencing

1. P0 foundation primitives and token contract.
2. P0/P1 wrappers/input contract.
3. P1 auth login/magic-link/password fallback.
4. P1 shell/nav.
5. P1 admin/settings/team/user/invite.
6. P1 workspace list/table.
7. P2 analytics surfaces.
8. Final Zen cleanup only after import count reaches zero through guarded lanes.

## First implementable next slice

Recommended next Atlas-owned slice:
`umami_visual_system_foundation_contract_validator_authorized`

Scope:
- Add source/static validator only.
- Assert `@umami/react-zen` is still allowed globally but cannot be removed without a dedicated cleanup lane.
- Assert new shadcn foundation files do not touch API/schema/migration/auth.
- Assert auth-sensitive strings are not introduced into visual artifacts.
- Assert login/magic-link/invite UI lanes keep token/link safety selectors.

Non-goals:
- No UI implementation.
- No backend/auth/schema changes.
- No package/provider removal.
- No deploy, serve, runtime mutation, or production smoke.
