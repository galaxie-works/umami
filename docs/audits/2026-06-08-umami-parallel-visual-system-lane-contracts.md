# Umami parallel visual-system lane contracts

Classification: `umami_visual_system_parallel_lane_contracts_requested / Atlas_contract_support / no_deploy_no_mutation`

Base observed for this handoff: `f1c8c7b8 fix: localize Cosmo login controls`, preserving the invite/magic-login branch lineage and the current Cosmo sidebar/primitives work.

Purpose: define source/static contracts for parallel Umami shadcn/Cosmo visual-system lanes. Cosmolytics legacy is visual reference only. Umami remains canonical for routes, APIs, auth, permissions, schema, analytics behavior, and team/global role semantics.

## Global contract

- No production deploy, restart, served target, schema migration, DB mutation, or runtime mutation is authorized by this handoff.
- Evidence must stay sanitized: no raw secrets, cookies, auth headers, invite tokens, magic-link tokens, invite links, magic-login links, full URLs, raw IDs, payload rows, replay chunks, or replay events.
- Preserve Umami global roles: `admin`, `user`, `view-only`.
- Preserve Umami team scope: `Team`, `TeamUser`, website scope, `Website.teamId`, and existing permission helpers remain source of truth.
- Preserve Umami route identity and selectors unless a lane explicitly changes them and passes Luna source/static guard.
- Preserve current auth token/session creation behavior for password login, magic login, and invite accept.

## Lane 1 - Auth: login, invite, magic-login

Scope baseline:
- Latest login visual target: `f1c8c7b8`.
- Include invite and magic-login pages under the same Cosmo legacy visual contract.

Source anchors:
- `src/app/login/LoginPage.tsx`
- `src/app/login/LoginForm.tsx`
- `src/app/login/CosmolyticsAuth.module.css`
- `src/app/invite/page.tsx`
- `src/app/magic-login/page.tsx`
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/magic-link/request/route.ts`
- `src/app/api/auth/magic-link/verify/route.ts`
- `src/app/api/auth/invitations/accept/route.ts`
- `src/lib/auth-session.ts`
- `src/lib/auth-tokens.ts`
- `src/lib/cosmolytics-auth-email.ts`

Visual contract:
- Magic link is allowed to be the primary visible login path, with password login retained as fallback unless PO explicitly removes it.
- Login, invite accept, and magic-login verification should share the Cosmo brand language, spacing, responsive behavior, and accessible form patterns.
- Invite accept copy must distinguish new account password setup from existing account invite acceptance.
- Error and pending states must be visible, keyboard reachable, and mobile safe.

Backend/auth/schema required:
- Required for token lifecycle changes, invite accept semantics, magic-link enumeration behavior, session creation changes, email transport behavior, or schema fields.
- Not required for copy localization, layout, shadcn styling, buttons, tabs, logo placement, spacing, or responsive polish.

Acceptance criteria:
- Magic-link request returns a same-shape success response for known and unknown identifiers, with only safe email-configuration status.
- Magic-link verification is existing-user only, expiry checked, single-use, and creates the same auth session shape as password login.
- Invite accept preserves Umami `User.password` for new users.
- Invite and magic-link tokens are hash-only at rest and are not returned to API/UI.
- UI and logs must not emit token values or full invitation/magic-login URLs.
- Password fallback remains testable through existing Umami login behavior.

Guard expectations:
- Source/static scan for forbidden token/link exposure.
- Validator coverage for magic-link request/verify and invite accept route semantics if backend/auth code changes.
- Browser QA covers password login, magic-link request configured/unconfigured state, magic-login invalid/missing state, invite missing/invalid state, and mobile layout.

## Lane 2 - Foundation primitives

Scope:
- Button, Input, Select/Combobox, Dialog/Sheet/Popover, Table, Card/Panel, Tabs, Dropdown/Menu, Badge/Status, Skeleton, Empty/Error state.

Source anchors:
- `src/components/shadcn/*`
- `src/components/input/*`
- `src/components/common/*`
- `src/components/layout/*`
- existing `@umami/react-zen` imports across app/components.

ZenProvider retention boundary:
- `ZenProvider` and `@umami/react-zen` remain retained until a dedicated cleanup lane proves every dependent surface has been migrated.
- Do not remove Zen globally in the foundation lane.
- Do not mix Zen and shadcn replacements in a single form/table if it changes keyboard behavior, focus order, submission payload, or controlled value semantics.
- Foundation validators should track import count/diff and classify retained Zen usage as intentional until a surface-specific lane removes it.

Visual/accessibility contract:
- Buttons expose disabled, loading, icon-only, destructive, primary, secondary, and ghost variants with visible focus.
- Inputs preserve `name`, autocomplete, invalid state, label association, helper text, and keyboard submission.
- Selects/dropdowns/dialogs preserve keyboard open/close, arrow navigation, escape behavior, focus trap, aria names, and disabled item behavior.
- Tables preserve header labels, sort affordances, pagination, row action menus, and mobile overflow.
- Empty states distinguish empty, unavailable, unauthorized, and error.

Backend/auth/schema required:
- No for foundation primitives.
- Required only if a primitive migration changes form payload shape, endpoint path, query params, or mutation method.

Guard expectations:
- Source scan proving foundation lane does not touch `src/app/api`, `prisma`, migrations, auth token helpers, or permission helpers unless explicitly authorized.
- Keyboard/focus QA for each primitive family before broad adoption.

## Lane 3 - Admin/settings/team/user/invite

Scope:
- Teams, users, invites, settings profile/preferences, team settings, website settings.

Source anchors:
- `src/app/(main)/admin/users/*`
- `src/app/(main)/admin/teams/*`
- `src/app/(main)/admin/websites/*`
- `src/app/(main)/settings/*`
- `src/app/(main)/teams/*`
- `src/app/api/admin/users/route.ts`
- `src/app/api/admin/invitations/*`
- `src/app/api/teams/*`
- `src/app/api/users/*`

Visual contract:
- Preserve hierarchy: Settings shell > profile/preferences/websites/teams/admin surfaces.
- Admin user/invite surfaces may use Cosmo density, badge/status styling, shadcn tables, and compact action menus.
- Team/user/invite scope controls must remain visible and not hide permission-sensitive fields behind ambiguous labels.
- Tables should support dense rows, clear primary/secondary actions, visible status badges, and mobile-safe action menus.

Permission contract:
- Global admin management remains admin-only.
- Global role choices must not exceed Umami `admin`, `user`, `view-only`.
- Team roles and website scopes must not grant global admin behavior.
- Invite lifecycle states must stay distinct: pending, sent, accepted, revoked, expired.

Backend/auth/schema required:
- Required for invite lifecycle fixes, role/team/website scope changes, self/last-admin lockout behavior, session invalidation, or API envelope changes.
- Not required for layout, density, table styling, badges, dialogs, copy, or empty/error presentation.

Acceptance criteria:
- No admin/invite API response includes token hashes, raw tokens, invite URLs, or magic-login URLs.
- Revoke/resend/accept actions preserve lifecycle semantics and safe disabled states.
- Existing route guards remain intact before any mutation.
- Non-admin and team-scoped users cannot reach global admin mutation paths.

Guard expectations:
- Validator asserts no token/link exposure in admin users/invite UI and API.
- Runtime QA for mutation paths requires disposable fixture or explicit mutation plan; otherwise read-only affordance QA only.

## Lane 4 - Workspace lists

Scope:
- Websites, Links, Pixels, Boards, and similar workspace list/table pages.

Source anchors:
- `src/app/(main)/websites/*`
- `src/app/(main)/links/*`
- `src/app/(main)/pixels/*`
- `src/app/(main)/boards/*`
- `src/components/hooks/queries/useWebsitesQuery.ts`
- `src/components/hooks/queries/useUserWebsitesQuery.ts`
- `src/components/hooks/queries/useUserLinksQuery.ts` if present
- `src/components/hooks/queries/useUserPixelsQuery.ts` if present
- `src/components/hooks/queries/useUserBoardsQuery.ts` if present

Visual contract:
- Lists use common search/filter/action/table wrappers without changing endpoint paths or query shape.
- Row actions remain discoverable on desktop and mobile.
- Search/no-match, empty, loading, forbidden, and error states are explicit.
- Tables preserve density, pagination, sorting where present, and safe row action affordances.

Backend/auth/schema required:
- No for visual table/list migration.
- Required only if adding a missing search/filter endpoint, changing query params, changing pagination, or changing row action mutation semantics.

Acceptance criteria:
- Existing hooks keep the same route names and params.
- Existing permission checks continue to filter data by current Umami user/team context.
- QA evidence reports statuses, body keys, row counts, and booleans only.

Guard expectations:
- Source/static scan for route string preservation on migrated list hooks.
- Browser QA for empty, populated, search no-match, pagination/action menu, and mobile overflow.

## Lane 5 - Shell/sidebar

Scope:
- Accepted Cosmo sidebar/topbar baseline fed by Umami routes and permissions.

Source anchors:
- `src/app/(main)/App.tsx`
- `src/app/(main)/SideNav.tsx`
- `src/app/(main)/MobileNav.tsx`
- `src/app/(main)/Nav.tsx`
- `src/app/(main)/settings/SettingsLayout.tsx`
- sidebar shadcn primitives introduced in current lineage.

Visual contract:
- Cosmo sidebar baseline may define spacing, icon treatment, active row style, collapsed behavior, and mobile drawer behavior.
- Umami route tree remains canonical: do not remove or rename product routes solely to match Cosmolytics legacy.
- Admin routes remain hidden or blocked for non-admin users.
- Team and website context must remain visible/recoverable.
- Topbar/sidebar controls must be keyboard reachable and mobile safe.

Backend/auth/schema required:
- No for shell/sidebar visual work.
- Required only if nav data comes from a new backend route or permission model changes.

Acceptance criteria:
- Authenticated admin, normal user, view-only user, team-scoped user, and no-team contexts render appropriate nav availability.
- Mobile drawer exposes equivalent route access.
- Route changes preserve `renderUrl`/teamId/websiteId behavior.
- Visual QA includes collapsed/expanded desktop and mobile drawer.

Guard expectations:
- Source scan confirms no protected route guard removal.
- Runtime visual QA checks route clickability without raw URL capture.

## Parallel lane sequencing

These lanes may proceed in parallel if each keeps its boundary:

1. Auth lane may continue on `f1c8c7b8` lineage with Luna auth/token guard.
2. Foundation primitives lane may proceed as visual-only, retaining ZenProvider.
3. Shell/sidebar lane may proceed as visual-only against Umami route/permission selectors.
4. Admin/settings lane should wait for any open invite lifecycle contract fixes before mutation QA, but visual/read-only affordance work can proceed.
5. Workspace list lane can proceed visual-only once primitives/table wrappers pass guard.

Suggested next source/static packages:

- `umami_auth_cosmo_login_invite_magic_contract_guard`: auth/token validators and read-only QA markers.
- `umami_foundation_primitives_contract_guard`: shadcn primitive accessibility and Zen retention validators.
- `umami_shell_sidebar_route_permission_guard`: route/permission preservation validator.
- `umami_admin_settings_invite_scope_guard`: admin/invite lifecycle and role/team-scope validator.
- `umami_workspace_lists_table_contract_guard`: list/table query preservation validator.

