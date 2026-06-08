# Auth and Workspace official shadcn contracts

Classification: `no_pending_source_static_official_shadcn_settings_team_migration / surface_contracts_continue / no_deploy_no_mutation`

Base: `origin/orion/shadcn-settings-team @ 186421c55c2c662be42f885bb5b6b476fd639587`

Foundation: `origin/orion/official-shadcn-foundation @ b9169c6e685640ea1e940bd46e155fbaea44139b`

Purpose: continue official-shadcn contract support after Settings/Team source/static PASS. Next surfaces are Auth/Magic/Invite and Workspace Lists. Both must use generated `@/components/ui/*` primitives and preserve Umami routes, data hooks, payloads, permissions, and safety invariants.

## Foundation invariants

Required primitive source:
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
- `@/lib/utils` for `cn`

Do not add new product-surface imports from:
- `@/components/shadcn/SettingsKit`
- handmade Vega primitive roots
- new local primitive roots outside `src/components/ui`

Zen migration boundary:
- `@umami/react-zen` may remain in untouched surfaces and providers
- new migrated Auth/Workspace code should not introduce new Zen usage
- removing Zen globally is out of scope

Backend/auth/schema boundary:
- no `src/app/api`, auth helper, permission helper, Prisma, migration, or package drift in these visual lanes unless Orion opens an explicit backend contract

## Lane A: Auth / Magic / Invite

Target files:
- `src/app/login/LoginPage.tsx`
- `src/app/login/LoginForm.tsx`
- `src/app/login/CosmolyticsAuth.module.css`
- `src/app/invite/page.tsx`
- `src/app/magic-login/page.tsx`

Current source status:
- `LoginForm.tsx` already uses official `Button`, `Card`, and `Input`
- `LoginPage.tsx` uses official `Button`, but still uses Zen `Loading` and `useTheme`
- `InvitePage` and `MagicLoginPage` use raw HTML elements and CSS-module button/card/message styling instead of generated shadcn primitives

Required visual migration:
- migrate Invite/Magic pages to official `Card`, `Button`, `Input`, `Label`, and `Skeleton` or explicit loading affordance
- login language/theme controls can keep official `Button`; dropdown behavior should move to generated `DropdownMenu` if the lane touches that area
- keep Cosmolytics brand layout/copy hierarchy, but do not add new custom primitive components
- use visible focus rings and keyboard order from generated primitives
- keep mobile-safe layout without overflow or card nesting

Auth contracts to preserve:
- password login: `POST /auth/login`
- magic-link request: `POST /auth/magic-link/request`
- magic-link verify: `POST /auth/magic-link/verify`
- invite accept: `POST /auth/invitations/accept`
- successful auth still calls `setClientAuthToken`, `setUser`, and redirects to `/`
- invite accept still requires token plus password for new-user acceptance
- magic-link request keeps enumeration-safe visible response semantics and honest email-configured state
- missing/invalid token states stay honest without exposing token values

Luna guard expectations:
- no auth endpoint, payload, session, token storage, or redirect drift
- no raw token/link/cookie/header logging
- no new API/auth/schema files changed
- official shadcn imports in touched UI controls
- if Zen `useTheme` remains, it is documented as provider/theme boundary and not a new primitive dependency

DM/Iris smoke, only if authorized:
- request/verify flows use safe QA material only
- screenshots redact tokens, magic links, invite links, cookies, and full URLs
- report only statuses, body keys, booleans, and visible state labels

## Lane B: Workspace Lists

Target order:
1. Websites
2. Links
3. Pixels
4. Boards

Target files by slice:
- Websites: `src/app/(main)/websites/WebsitesPage.tsx`, `WebsitesDataTable.tsx`, `WebsitesTable.tsx`, `WebsiteAddButton.tsx`, `WebsiteAddForm.tsx`
- Links: `src/app/(main)/links/LinksPage.tsx`, `LinksDataTable.tsx`, `LinksTable.tsx`, `LinkAddButton.tsx`, `LinkEditButton.tsx`, `LinkEditForm.tsx`, `LinkDeleteButton.tsx`
- Pixels: `src/app/(main)/pixels/PixelsPage.tsx`, `PixelsDataTable.tsx`, `PixelsTable.tsx`, `PixelAddButton.tsx`, `PixelEditButton.tsx`, `PixelEditForm.tsx`, `PixelDeleteButton.tsx`
- Boards: `src/app/(main)/boards/BoardsPage.tsx`, `BoardsDataTable.tsx`, `BoardsTable.tsx`, `BoardAddButton.tsx`, `BoardEditButton.tsx`, `BoardDesignButton.tsx`, `BoardEditForm.tsx`, `BoardDeleteButton.tsx`

Current source status:
- list shells still use `DataGrid`
- tables still use Zen `DataTable`/`DataColumn`
- dialogs still use `DialogButton`/Zen form wrappers
- Settings/Team shadcn PASS can serve as a local pattern for shadcn cards/tables/actions and mobile affordances

Required visual migration:
- replace list shell/table/dialog/form controls with official `Table`, `Input`, `Button`, `Dialog`, `DropdownMenu`, `Card`, `Badge`, `Skeleton`, and `Checkbox` where appropriate
- keep desktop table density and mobile card/action fallback
- expose row actions without hover-only interaction
- preserve loading, empty, search no-match, unavailable/error, and pending mutation states
- destructive actions remain confirmation-gated

Query contracts to preserve:
- `useWebsitesQuery` / `useUserWebsitesQuery`
- `useLinksQuery`
- `usePixelsQuery`
- `useBoardsQuery`
- `page`, `pageSize`, `search`
- existing query keys and `modified`/`touch` invalidation
- user/team route split

Route/payload contracts to preserve:
- Websites: `/websites`, `/teams/:teamId/websites`, website add/edit/delete/settings/share/tracking behavior
- Links: `/links`, `/teams/:teamId/links`, `/links/:linkId`, `name`, `url`, `slug`, optional `teamId`/`id`
- Pixels: `/pixels`, `/teams/:teamId/pixels`, `/pixels/:pixelId`, `name`, `slug`, optional `teamId`/`id`
- Boards: `/boards`, `/teams/:teamId/boards`, `/boards/:boardId`, board `type`, `name`, `description`, `parameters`
- no endpoint/path/method/query-key/payload drift without separate backend contract

Permission contracts to preserve:
- user/team visibility stays unchanged
- team list routes keep `canViewTeam`
- create routes keep current create permissions
- item routes keep current view/update/delete permissions
- visual changes must not broaden visibility or make hidden actions callable

Evidence redaction:
- Websites: redact/crop full domains and URL-like values in artifacts
- Links: redact generated links, destination URLs, raw slugs, and share URLs
- Pixels: stricter redaction for pixel URLs, raw slugs, generated pixel links, tracking/config snippets
- Boards: avoid raw board/share IDs and parameter dumps

Recommended QA markers:
- `data-workspace-list="websites|links|pixels|boards"`
- `data-workspace-list-search`
- `data-workspace-list-row`
- `data-workspace-list-action`
- `data-workspace-list-dialog`
- `data-workspace-list-empty`
- `data-workspace-list-error`
- for Pixels, add `data-evidence-redaction="pixel-url-like"` or equivalent marker in artifacts/QA plan

Luna guard expectations:
- each slice is narrow and preserves `186421c` Settings/Team lineage
- official shadcn imports are used for migrated controls
- no new `SettingsKit`/Vega primitive dependencies
- no API/auth/schema/permission/package drift
- no raw URL/token/id logging
- retained Zen imports in active files are either removed or explicitly justified as residual scope

DM/Iris smoke, only if authorized:
- no production mutation
- read-only list/search/paging smoke for active slice
- create/edit/delete/share dialogs may open/cancel only unless disposable mutation fixture is authorized
- evidence is sanitized to statuses, body keys, counts, booleans, hashed IDs, and redacted screenshots

## Recommended next actions

1. Auth/Magic/Invite: finish official shadcn primitive usage on Invite and Magic pages; keep Login route/auth behavior stable.
2. Workspace Websites: migrate list/table/add dialog against official shadcn, using Settings/Team source/static PASS as local pattern.
3. Workspace Links.
4. Workspace Pixels, with stricter URL-like redaction.
5. Workspace Boards.

If a shared primitive gap appears, stop the surface slice and route a narrow foundation follow-up before continuing.
