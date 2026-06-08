# Umami shadcn/Cosmo visual-system program contract backlog

Classification: `umami_full_shadcn_cosmo_visual_system_program_active / Atlas_contract_backlog_owner / cosmolytics_legacy_reference_only / no_deploy_no_mutation`

Target base: `feature/cosmolytics-shadcn-invite-magic-login` at the time of this handoff.

## Purpose

This backlog defines the lane contract for bringing the Umami fork into the Cosmolytics shadcn/Cosmo visual system while preserving Umami as the data, route, permission, and source-of-truth application.

Cosmolytics is a visual reference only. It can inform layout density, shadcn styling, branded login tone, empty/error presentation, and QA markers. It must not replace Umami analytics contracts, routing identity, permissions, report semantics, token handling, or team/global role invariants.

## Hard constraints

- Preserve canonical Umami route/data contracts unless an explicit backend lane is authorized.
- Preserve Umami auth primitives: bearer token/login session creation must remain compatible with existing `saveAuth`/JWT behavior.
- Preserve global role invariants: Umami global roles remain `admin`, `user`, `view-only`.
- Preserve team scope invariants: team access and website visibility must flow through `Team`, `TeamUser`, `Website.teamId`, and existing permission helpers.
- Never expose raw magic-link tokens, invite tokens, invite URLs, cookies, auth headers, full URLs, or raw IDs in API responses, UI tables, logs, screenshots, validator output, or agent artifacts.
- No deploy, serve, restart, schema migration, DB mutation, or production smoke is implied by this backlog.
- Runtime evidence, when later authorized, should use statuses, body keys, counts, booleans, hashed IDs, and sanitized marker checks only.

## Lane 0 - Program guardrail validators

Scope: source/static only.

Backend/auth/schema required: no, unless a validator exposes an existing contract bug.

Acceptance criteria:
- Add or extend source validators that assert no raw invite link/token exposure in admin UI/API code.
- Assert login/magic-link routes do not print tokens or full URLs.
- Assert shadcn visual work does not delete existing Umami API routes, permission checks, or role constants.
- Assert release branches preserve current invite/magic-login lineage and closed analytics/replay lineage.

Guard expectations:
- `git diff --check`
- Type/build checks already used by the Umami fork lane.
- Dedicated validator for shadcn/Cosmo visual-system invariants before Luna review.

Owner recommendation: Atlas for validator contract, Luna for source/static guard.

## Lane 1 - Login, magic link, invite accept

Scope: visual plus auth-contract hardening.

Current source anchors:
- `src/app/login/LoginPage.tsx`
- `src/app/login/LoginForm.tsx`
- `src/app/magic-login/page.tsx`
- `src/app/invite/page.tsx`
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/magic-link/request/route.ts`
- `src/app/api/auth/magic-link/verify/route.ts`
- `src/app/api/auth/invitations/accept/route.ts`
- `src/lib/auth-session.ts`
- `src/lib/auth-tokens.ts`
- `src/lib/cosmolytics-auth-email.ts`

Visual contract:
- Branded Cosmolytics login shell may use logo, shadcn card/form/button primitives, responsive split/brand panel, and clear password versus magic-link modes.
- User-facing copy must avoid implying magic links create accounts; magic link is login for existing users only.
- Invite accept must clearly distinguish new-user password creation from existing-user invite acceptance.
- Mobile layout must keep the form first and avoid hidden primary actions.

Backend/auth/schema required:
- Required if Luna/Iris finds token lifecycle, invite accept, or session semantics drift.
- Not required for pure layout, copy, spacing, primitive replacement, or brand asset work.

P0 acceptance criteria:
- Magic-link request returns the same successful envelope for known and unknown accounts, with an honest `emailConfigured` flag.
- Magic-link verify is single-use, expiry-checked, existing-user only, and creates a normal Umami auth session.
- Invite accept requires a password only for new user creation, preserves Umami `User.password`, and logs in through the normal Umami auth session.
- Existing-user invite accept behavior is explicit: either no password is requested, or any password field is clearly not changing/verifying the existing password.
- Invite tokens are hash-only at rest and never returned to UI/API.
- No token or full URL is logged or rendered outside the intended email transport payload.

P1 acceptance criteria:
- Token hash is retired on accepted/revoked invite if the lifecycle contract chooses Cosmolytics parity over timestamp-only invalidation.
- Invite accept user creation and invite claim happen atomically.
- Invalid/expired/revoked/used invite states have distinct safe UI copy without exposing token details.

P2 acceptance criteria:
- Locale/theme/brand preference propagation through invite/magic-link flows.
- Email template copy polish and webhook delivery diagnostics.

Owner recommendation:
- Atlas for auth contract fixes/validators.
- Mira for visual login/invite UI.
- DM/Iris for controlled served smoke only after Luna PASS and explicit authorization.

## Lane 2 - Shell, sidebar, topbar

Scope: visual-only unless route/navigation identity changes.

Current source anchors:
- `src/app/(main)/App.tsx`
- `src/app/(main)/SideNav.tsx`
- `src/app/(main)/MobileNav.tsx`
- `src/app/(main)/Nav.tsx`
- `src/app/(main)/settings/SettingsLayout.tsx`
- shadcn/sidebar components already introduced in current branch lineage.

Visual contract:
- Use Cosmo-like density, sidebar rhythm, active states, topbar treatment, and mobile drawer behavior.
- Preserve Umami route grouping and `renderUrl` navigation behavior.
- Keep admin, teams, websites, reports, settings, and website-specific route contexts discoverable.
- Do not hide a route because Cosmolytics legacy did not have it.

Backend/auth/schema required: no.

Acceptance criteria:
- Current user/team context remains visible.
- Team switch and website navigation continue to respect Umami `teamId` route context.
- Admin nav remains admin-only.
- Mobile nav exposes equivalent destinations without requiring hover.
- No route removals or permission bypasses.

Owner recommendation: Mira for UI, Atlas only for route/permission contract review.

## Lane 3 - Primitives and form system

Scope: visual/component-system.

Current source anchors:
- `src/components/input/*`
- `src/components/layout/*`
- `src/components/common/*`
- `src/components/shadcn/*`
- `src/app/(main)/**/Form*.tsx`
- `src/app/(main)/**/DataTable*.tsx`

Visual contract:
- Standardize buttons, inputs, selects, tabs, dialogs, tables, cards, badges, pagination, empty states, and error banners with shadcn/Cosmo styling.
- Preserve existing form submission behavior, validation schemas, hook usage, and API payloads.
- Cards must not become nested decorative shells that obscure data density.
- Tables must preserve sorting, pagination, row actions, and accessible labels.

Backend/auth/schema required: no.

Acceptance criteria:
- Same submitted payloads before/after visual migration.
- Same query hooks and mutation endpoints.
- Keyboard and screen-reader semantics retained for dialogs, selects, tabs, and table actions.
- Loading/empty/error states use consistent status copy without masking authorization or unavailable states.

Owner recommendation: Mira for UI primitives, Luna for static guard, Iris for browser/mobile QA.

## Lane 4 - Admin, settings, team, user, invite flows

Scope: visual plus targeted auth-contract guard.

Current source anchors:
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
- Cosmo settings/user-access screens can inform page layout, invite panel layout, badges, tables, and empty states.
- Umami admin remains the authority for users, teams, websites, and roles.
- Team invite and website scoping UI must map to `TeamUser.websiteIds`/team role behavior in the fork where present.

Backend/auth/schema required:
- Required for invite lifecycle edge fixes, team invite scope fixes, last-admin/self-lockout fixes, or API response contract changes.
- Not required for table/card/form restyling.

P0 acceptance criteria:
- Admin-only user/invite routes remain admin guarded.
- Invite list never returns tokenHash, raw token, or accept URL.
- Invite create/resend/revoke enforce accepted/revoked/expired semantics consistently.
- Existing `User.password` requirement is preserved for new accounts.
- Global role selection is limited to Umami `userRoleParam` roles.
- Team role/website scope cannot escalate a non-admin into global admin behavior.

P1 acceptance criteria:
- Last-admin/self-delete/self-demote lockout is explicit and validated if included in this fork lane.
- Revoking/deleting/deactivating users invalidates active sessions where supported.
- Revoke/resend/accept statuses are independently QA-able with disposable fixtures.

P2 acceptance criteria:
- Admin audit event polish.
- Richer timestamps and invite delivery diagnostics.
- Team-scoped manager UX if PO approves it separately.

Owner recommendation:
- Atlas for backend/auth contract.
- Mira for settings/admin UI.
- Dario if role/team semantics need product arbitration.
- DM/Iris only with disposable fixtures or explicit non-mutating smoke gates.

## Lane 5 - Website analytics surfaces

Scope: mostly visual-system migration.

Current source anchors:
- `src/app/(main)/websites/[websiteId]/*`
- `src/app/(main)/websites/[websiteId]/(reports)/*`
- `src/app/(main)/websites/[websiteId]/WebsitePage.tsx`
- `src/app/(main)/websites/[websiteId]/WebsiteControls.tsx`
- `src/app/(main)/websites/[websiteId]/WebsiteMetricsBar.tsx`
- `src/app/(main)/websites/[websiteId]/WebsiteChart.tsx`
- `src/app/(main)/websites/[websiteId]/WebsitePanels.tsx`
- `src/app/(main)/websites/[websiteId]/ExpandedViewModal.tsx`
- `src/components/hooks/queries/useWebsite*`
- `src/app/api/websites/[websiteId]/*`
- `src/app/api/reports/*`

Visual contract:
- Preserve native Umami website analytics contracts: stats, pageviews, metrics, expanded metrics, sessions, events, realtime, reports, segments, cohorts, revenue, attribution, retention, funnel, journey, performance, goal, UTM, share, settings, and tracking-code flows.
- Cosmo visual reference can inform spacing, tabs, cards, chart containers, mobile stacking, and status treatments.
- Do not replace Umami website APIs with Cosmolytics proxy semantics.

Backend/auth/schema required:
- Required only if a visual lane exposes a real missing endpoint, status collapse, route mismatch, or permission drift.
- Not required for chart/table/card/tabs visual restyling.

Acceptance criteria:
- `canViewWebsite`, `canUpdateWebsite`, team membership, and admin guards remain before protected data/mutation.
- Query params for date range, timezone, unit, filters, compare, page, pageSize, and report bodies are preserved.
- No raw event payloads, replay chunks/events, full URLs, cookies, headers, or raw IDs in artifacts.
- Empty/error/unavailable states distinguish no data from auth/scope/backend failure.

Owner recommendation:
- Mira for visual surfaces.
- Atlas for backend contract if route/status drift is found.
- Iris/Rhea for runtime visual QA after source/static PASS.

## Lane 6 - Runtime visual QA expectations

Scope: read-only QA and screenshot evidence after guarded patches.

Backend/auth/schema required: no, unless runtime evidence proves contract drift.

Minimum QA matrix:
- Desktop and mobile login: password mode, magic-link mode, configured/unconfigured email state.
- Invite accept page: missing token, invalid/expired/revoked/used token, new-user password path, existing-user path if authorized.
- Shell/sidebar/topbar: desktop expanded/collapsed, mobile drawer, admin-only nav, team/website route context.
- Admin/settings: users, invites, teams, websites, preferences, profile/password.
- Analytics: Overview, realtime, sessions, events, replays, segments/cohorts, revenue/attribution, reports, settings.
- State coverage: loading, empty, available, error, unauthorized, forbidden.

Evidence rules:
- Screenshots may show UI copy, counts, and safe names.
- Do not capture raw tokens, invite/magic URLs, cookies, auth headers, raw IDs, full URLs, event rows, replay chunks, or payload bodies.
- API evidence should report status codes, body keys, row counts, booleans, and hashed IDs only.

Owner recommendation: Iris/Rhea visual/runtime QA, DM served/deploy gates only after Luna PASS and explicit Orion/PO authorization.

## Recommended implementation order

1. P0 validator guardrails for auth/link safety and route preservation.
2. Login/magic-link/invite accept visual lane plus lifecycle edge hardening if still open.
3. Shell/sidebar/topbar visual lane.
4. shadcn primitive/form/table/dialog standardization.
5. Admin/settings/team/user/invite visual lane.
6. Website analytics surfaces, starting with native Overview and Replays because PO has already marked those as high sensitivity.
7. Remaining reports and specialized surfaces.

## First Luna acceptance package

Suggested first package classification:
`umami_shadcn_cosmo_visual_system_backlog_delivered / source_static_lane_contract_ready / no_deploy_no_mutation`

Suggested files:
- This backlog artifact.
- Optional validator-only patch in a follow-up lane, not bundled unless Orion authorizes implementation.

Suggested guard:
- Docs-only diff from current feature lineage.
- `git diff --check`.
- `pnpm agent:validate` only if this repo's agent artifacts are touched; otherwise not required for docs-only backlog.
- Source scan confirming the backlog contains no raw tokens, cookies, full URLs, invite links, raw IDs, payload rows, replay chunks, or secrets.

