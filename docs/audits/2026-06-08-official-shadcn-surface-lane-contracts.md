# Official shadcn surface lane contracts

Classification: `surface_lane_contracts_unblocked_on_official_shadcn_p0 / no_deploy_no_mutation`

Accepted foundation: `origin/orion/official-shadcn-foundation @ b9169c6e685640ea1e940bd46e155fbaea44139b`

Purpose: update the Auth/Magic/Invite, Settings/Team, and Workspace Lists contracts to depend on the official shadcn foundation instead of handmade Vega primitives. These lanes must preserve Umami routes, data hooks, permission invariants, payload semantics, and evidence safety.

## Foundation contract all lanes must use

Use generated official primitives from `src/components/ui/*`:
- `badge.tsx`
- `button.tsx`
- `card.tsx`
- `checkbox.tsx`
- `dialog.tsx`
- `dropdown-menu.tsx`
- `input.tsx`
- `label.tsx`
- `select.tsx`
- `skeleton.tsx`
- `table.tsx`
- `tabs.tsx`

Use shared foundation helpers/config:
- `components.json`
- `tailwind.config.ts`
- `src/app/global.css`
- `src/lib/utils.ts` `cn(...)`
- dependencies accepted in `package.json`, including `radix-ui`, `class-variance-authority`, `clsx`, `tailwind-merge`, `tailwindcss`, `@tailwindcss/postcss`, `tailwindcss-animate`, `tw-animate-css`, and `lucide-react`

Allowed imports:
- `@/components/ui/button`
- `@/components/ui/card`
- `@/components/ui/input`
- `@/components/ui/label`
- `@/components/ui/dialog`
- `@/components/ui/select`
- `@/components/ui/checkbox`
- `@/components/ui/dropdown-menu`
- `@/components/ui/table`
- `@/components/ui/tabs`
- `@/components/ui/badge`
- `@/components/ui/skeleton`
- `@/lib/utils`
- existing Umami hooks, queries, constants, permissions, navigation, and API helpers

Disallowed for new surface work:
- `@/components/shadcn/SettingsKit`
- handmade Vega primitive imports as implementation foundation
- new primitive roots outside `src/components/ui`
- backend/auth/schema/Prisma/API changes in a visual lane unless Orion explicitly scopes them
- raw token/link/URL/id/payload logging or artifacts

Vega status:
- Vega/Cosmo branches may remain visual reference for density, tone, copy hierarchy, screenshots, and QA marker ideas
- Vega handmade primitives are superseded for product foundation
- do not start or continue product surface migrations against handmade Vega primitives after this contract

## Lane 1: Auth / Magic / Invite

Target files:
- `src/app/login/LoginPage.tsx`
- `src/app/login/LoginForm.tsx`
- `src/app/login/CosmolyticsAuth.module.css`
- `src/app/invite/page.tsx`
- `src/app/magic-login/page.tsx`
- related auth API routes only if a separate backend/auth contract is explicitly opened

Current foundation state:
- `LoginForm.tsx` already imports official `Button`, `Card`, and `Input`
- invite and magic-login pages still use raw HTML controls and CSS-module card/button classes
- all three pages still depend on existing Umami auth routes and client auth token flow

Required visual migration:
- login, invite accept, and magic verify pages use official `Button`, `Card`, `Input`, `Label`, `Skeleton` or loading state, and dialog/alert-like patterns only if generated/accepted
- keep Cosmo visual hierarchy and brand assets as reference, but do not introduce a second primitive system
- keep keyboard order, visible focus, disabled/loading states, and mobile-safe layout

Behavior/auth invariants:
- password login keeps `POST /auth/login`
- magic link request keeps `POST /auth/magic-link/request`
- magic link verify keeps `POST /auth/magic-link/verify`
- invitation accept keeps `POST /auth/invitations/accept`
- successful auth keeps `setClientAuthToken`, `setUser`, and redirect behavior
- magic-link request remains enumeration-safe in visible response semantics
- invite accept does not expose token/link values in UI/logs/artifacts
- backend/auth/schema changes are not allowed unless explicitly routed

Evidence limits:
- no raw tokens, invite links, magic links, cookies, auth headers, raw IDs, or full URLs
- QA may report statuses, body keys, booleans, visible state labels, and redacted screenshots

Luna acceptance:
- official UI imports only for migrated primitives
- no `SettingsKit` or Vega primitive dependency
- no auth route/payload/session drift
- no raw token/link leak in source/log artifacts

## Lane 2: Settings / Admin / Team

Target files:
- `src/app/(main)/teams/[teamId]/TeamSettings.tsx`
- `src/app/(main)/teams/[teamId]/TeamEditForm.tsx`
- `src/app/(main)/teams/[teamId]/TeamInvitePanel.tsx`
- `src/app/(main)/teams/[teamId]/TeamMembersDataTable.tsx`
- `src/app/(main)/teams/[teamId]/TeamWebsitesDataTable.tsx`
- wrapper settings/admin routes such as `src/app/(main)/settings/**`, `src/app/(main)/admin/**`, and team settings shells only when directly needed by this lane

Current source notes:
- `TeamInvitePanel.tsx` currently imports `SettingsKit`; this must be replaced with official shadcn primitives
- team member and website access tables currently use `DataGrid` and Zen tables downstream
- `TeamSettings.tsx` computes `canEdit` from team owner/manager/global admin/view-only/selected website scope invariants; this logic is a hard boundary

Required visual migration:
- use `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardAction` for grouped settings sections
- use `Input`, `Label`, `Select`, `Checkbox`, `Button`, `Badge`, `Dialog`, `DropdownMenu`, `Table`, `Tabs`, and `Skeleton` where appropriate
- group fields into: basic team identity, invitation/access, members, websites, advanced/debug
- place Team ID/access code in Advanced/debug, not in primary editable fields
- keep dense but scannable table rows; mobile uses cards or stacked rows with actions visible without hover
- website access multiselect must be keyboard reachable and must not hide selected/partial scope state

Permission/data invariants:
- preserve `canEdit` logic and team-scoped permission invariants
- preserve `ROLES.teamOwner`, `teamManager`, `teamMember`, `teamViewOnly`, global admin, and view-only behavior
- selected website scope continues to prevent manager-level broad edit behavior
- preserve `useTeamMembersQuery(teamId)` and `useTeamWebsitesQuery(teamId)`
- preserve `GET /teams/:teamId/websites` and existing invitation/admin routes
- invite create keeps `email`, `role`, `teamId`, `teamRole`, and optional `websiteIds`
- resend/revoke keep existing routes and refetch/touch behavior
- no team/user/invite schema changes in this visual lane

Invite flow requirements:
- pending/sent/accepted/revoked/expired states must remain honest if exposed
- resend/revoke actions remain explicit and disabled while pending
- no API/UI exposure of raw invite token/link
- email transport configuration must be represented as state/copy only, not logged secret material

Evidence limits:
- no raw team IDs, access codes, invite IDs, invite links, tokens, emails where not needed, full URLs, cookies, or auth headers in artifacts
- website names/domains in screenshots should be redacted/cropped if sensitive

Luna acceptance:
- `SettingsKit` removed from active migrated files
- official shadcn imports replace card/button/input/select/table/dialog needs
- `canEdit` and team scope logic preserved
- no API/auth/schema/permission helper drift
- validators or static checks cover Team ID/access code advanced placement, invite token non-exposure, website access multiselect semantics, and mobile action affordances

## Lane 3: Workspace Lists

Target surfaces:
- Websites
- Links
- Pixels
- Boards

Primary file groups:
- `src/app/(main)/websites/**`
- `src/app/(main)/links/**`
- `src/app/(main)/pixels/**`
- `src/app/(main)/boards/**`
- related share/list surfaces only when explicitly included in a slice

Required visual migration:
- use official shadcn `Table`, `Input`, `Button`, `Dialog`, `DropdownMenu`, `Badge`, `Card`, `Skeleton`, and `Checkbox` where needed
- replace Zen/handmade table shells with official table/card/mobile fallback
- row actions must be reachable on desktop and mobile without hover-only behavior
- loading, empty, no-match, unavailable/error states must be visibly distinct
- destructive actions remain confirmation-gated

Query/data invariants:
- preserve existing hooks such as `useWebsitesQuery`, `useUserWebsitesQuery`, `useLinksQuery`, `usePixelsQuery`, and `useBoardsQuery`
- preserve user/team route split
- preserve `page`, `pageSize`, `search`, existing query keys, and modified/touch invalidation behavior
- preserve create/edit/delete payloads and route methods
- preserve navigation destinations for row open/settings/design/share actions
- no backend/auth/schema changes unless a separate contract lane is opened

Surface-specific evidence:
- Links artifacts redact generated links, destination URLs, raw slugs, and share URLs
- Pixels artifacts redact pixel URLs, raw slugs, tracking/config snippets, and full generated values
- Websites artifacts redact full domains/URLs if captured
- Boards artifacts avoid raw board/share IDs and avoid dumping board parameters

Luna acceptance:
- migrated files import official `src/components/ui/*`
- no new `SettingsKit` or Vega primitive imports
- no API/auth/schema/permission drift
- no raw URL/token/id logging
- search/paging/actions/navigation are preserved

## Shared guard and runtime expectations

Source/static guard:
- each lane is narrowly scoped to its files
- official foundation lineage `b9169c6e` is preserved
- no handmade Vega primitive dependency in new migrated code
- no broad Zen removal outside active lane
- generated shadcn files are not edited casually; if edited, the diff explains why and preserves accessibility behavior

Controlled served target, only if authorized:
- no production mutation
- auth flows may be smoke-tested with safe QA path only
- settings/team and workspace mutation dialogs may open/cancel; actual mutation requires disposable fixture authorization
- evidence limited to statuses, body keys, counts, booleans, hashed IDs, and redacted screenshots

Implementation order:
1. Auth/Magic/Invite: finish official shadcn usage on invite/magic pages and keep login aligned.
2. Settings/Admin/Team: replace `SettingsKit` and Zen layout/table/form pieces with official primitives.
3. Workspace Lists: migrate Websites/Links/Pixels/Boards slices using official shadcn table/card/dialog patterns.

If any lane discovers a real backend/auth/schema need, stop the visual migration and route a separate Atlas/Orion contract before implementation.
