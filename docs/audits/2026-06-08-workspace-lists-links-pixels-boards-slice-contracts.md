# Workspace Lists Links/Pixels/Boards slice contracts

Classification: `workspace_lists_slice_contract_support_active / websites_guard_in_progress / no_deploy_no_mutation`

Base: `origin/atlas/workspace-lists-p1-contract @ 54d90fab40ae2690f21a141e520c163659506e99`, which is based on `origin/vega/umami-cosmo-ui-primitives @ 141b5526daec4b38eea43af2d184e64b19a96f3f`.

Purpose: give Mira concise implementation contracts for the next Workspace Lists conveyor slices after Websites: Links, Pixels, then Boards. These contracts reuse the Websites primitive migration pattern and keep behavior/API/auth/schema out of scope unless Orion explicitly opens a backend lane.

## Shared primitive pattern

Visual-only target:
- replace list shell/table/dialog/form primitives with Vega/Cosmo equivalents
- keep current page component ownership, hooks, query keys, mutation calls, permission-gated routes, action destinations, and refetch/touch behavior
- add stable QA markers for root, search, table/card body, row actions, dialogs, empty/no-match/loading/error states, and mobile fallback

Current shared query behavior to preserve:
- `DataGrid` behavior: `allowSearch=true`, `allowPaging=true`, `autoFocus=false`
- server/query-backed search and paging through `usePagedQuery`
- query params: `page`, `pageSize`, `search`
- user scope routes: `/links`, `/pixels`, `/boards`
- team scope routes: `/teams/:teamId/links`, `/teams/:teamId/pixels`, `/teams/:teamId/boards`
- query invalidation keys: `links`, `pixels`, `boards`

Current guard behavior to preserve:
- list GET routes keep `canViewTeam` for team scope
- create routes keep `canCreateTeamWebsite` and `canCreateWebsite`
- item routes keep `canView*`, `canUpdate*`, and `canDelete*`
- destructive actions remain confirmation-gated

No-go changes in these slices:
- no endpoint/path/method/query-key/query-param changes
- no role/team/website permission changes
- no Prisma/schema/migration/package drift
- no new tracking/share/link/pixel URL generation
- no logging or artifact output of raw IDs, URL-like values, auth headers, cookies, tokens, snippets, or full destination values

## Slice 1: Links

Files in scope:
- `src/app/(main)/links/LinksPage.tsx`
- `src/app/(main)/links/LinksDataTable.tsx`
- `src/app/(main)/links/LinksTable.tsx`
- `src/app/(main)/links/LinkAddButton.tsx`
- `src/app/(main)/links/LinkEditButton.tsx`
- `src/app/(main)/links/LinkEditForm.tsx`
- `src/app/(main)/links/LinkDeleteButton.tsx`
- `src/app/(main)/links/[linkId]/LinkShareForm.tsx` only if the Links list action affordance needs share/dialog parity in the same slice

Current contract to preserve:
- list hook: `useLinksQuery({ teamId })`
- user GET: `/links`
- team GET: `/teams/:teamId/links`
- create POST: `/links` with `name`, `url`, `slug`, optional `teamId`, optional `id`
- update POST: `/links/:linkId` with optional `name`, `url`, `slug`
- delete DELETE: `/links/:linkId`
- list columns/row meaning: name navigates to `/links/:id`; slug and destination URL render as external link surfaces; created uses `createdAt`; actions expose edit/delete when `showActions`
- delete success must keep `touch('links')`, optional `onSave`, and close behavior

Visual-only requirements:
- table desktop and mobile fallback must expose name, slug/link affordance, destination affordance, created, edit, delete
- action affordances must be reachable without hover on mobile
- add/edit/delete dialogs keep focus trap, escape/close, submit loading/error, and return focus to trigger
- live UI may display product link values, but screenshots/artifacts must crop, mask, or hash URL-like values

Recommended QA markers:
- `data-workspace-list="links"`
- `data-workspace-list-search="links"`
- `data-workspace-list-row="links"`
- `data-workspace-list-action="links-edit|links-delete|links-open|links-destination"`
- `data-workspace-list-dialog="links-create|links-edit|links-delete"`
- `data-workspace-list-empty="links"`

Acceptance criteria:
- search, paging, empty/no-match/loading/error states still work from the same hook
- create/edit/delete dialogs open and cancel without mutation in read-only smoke
- destructive dialog preserves confirmation copy and disabled/loading states
- Luna diff proves no API/auth/schema/query-key drift unless separately authorized

## Slice 2: Pixels

Files in scope:
- `src/app/(main)/pixels/PixelsPage.tsx`
- `src/app/(main)/pixels/PixelsDataTable.tsx`
- `src/app/(main)/pixels/PixelsTable.tsx`
- `src/app/(main)/pixels/PixelAddButton.tsx`
- `src/app/(main)/pixels/PixelEditButton.tsx`
- `src/app/(main)/pixels/PixelEditForm.tsx`
- `src/app/(main)/pixels/PixelDeleteButton.tsx`
- `src/app/(main)/pixels/[pixelId]/PixelShareForm.tsx` only if the Pixels list action affordance needs share/dialog parity in the same slice

Current contract to preserve:
- list hook: `usePixelsQuery({ teamId })`
- user GET: `/pixels`
- team GET: `/teams/:teamId/pixels`
- create POST: `/pixels` with `name`, `slug`, optional `teamId`, optional `id`
- update POST: `/pixels/:pixelId` with optional `name`, `slug`
- delete DELETE: `/pixels/:pixelId`
- list columns/row meaning: name navigates to `/pixels/:id`; URL-like slug output uses `useSlug('pixel')`; created uses `createdAt`; actions expose edit/delete when `showActions`
- delete success must keep `touch('pixels')`, optional `onSave`, and close behavior

Stricter evidence requirements:
- Pixel URL-like values, generated pixel links, config/tracking values, and share/config snippets are sensitive in artifacts
- screenshots should use masked values, cropped columns, redacted overlays, or status-only evidence
- logs/artifacts may report status, body keys, counts, booleans, hashed IDs, and whether an affordance exists; they must not include full pixel URLs, raw slugs, tracking snippets, or config payloads

Visual-only requirements:
- table desktop and mobile fallback must expose name, URL/status affordance, created, edit, delete
- if an action copies or opens a pixel URL/config value, visual QA should verify the affordance by label/state only, not by captured value
- add/edit/delete dialogs keep current payload shape and validation behavior
- no new preview/copy behavior unless scoped as a separate behavior contract

Recommended QA markers:
- `data-workspace-list="pixels"`
- `data-workspace-list-search="pixels"`
- `data-workspace-list-row="pixels"`
- `data-workspace-list-action="pixels-edit|pixels-delete|pixels-open|pixels-url"`
- `data-workspace-list-dialog="pixels-create|pixels-edit|pixels-delete"`
- `data-workspace-list-empty="pixels"`
- `data-evidence-redaction="pixel-url-like"`

Acceptance criteria:
- search, paging, empty/no-match/loading/error states still work from the same hook
- pixel URL-like UI is visible enough for product use but redacted in artifacts
- create/edit/delete dialogs open and cancel without mutation in read-only smoke
- Luna scan has no URL-like evidence or new raw value logging in code/artifacts

## Slice 3: Boards

Files in scope:
- `src/app/(main)/boards/BoardsPage.tsx`
- `src/app/(main)/boards/BoardsDataTable.tsx`
- `src/app/(main)/boards/BoardsTable.tsx`
- `src/app/(main)/boards/BoardAddButton.tsx`
- `src/app/(main)/boards/BoardEditButton.tsx`
- `src/app/(main)/boards/BoardDesignButton.tsx`
- `src/app/(main)/boards/BoardEditForm.tsx`
- `src/app/(main)/boards/BoardDeleteButton.tsx`
- `src/app/(main)/boards/[boardId]/BoardSharesTable.tsx`, `BoardShareDialog.tsx`, `BoardShareCreateForm.tsx` only if board share affordance is pulled into this slice

Current contract to preserve:
- list hook: `useBoardsQuery({ teamId })`
- user GET: `/boards`
- team GET: `/teams/:teamId/boards`
- create POST: `/boards` with `type`, `name`, optional `description`, optional `userId`, optional `teamId`, optional `parameters`
- update POST: `/boards/:boardId` with optional `type`, `name`, `description`, `parameters`
- delete DELETE: `/boards/:boardId`
- list columns/row meaning: name navigates to `/boards/:id`; description is shown; created uses `createdAt`; actions expose design, edit, delete
- add success must preserve redirect to `/boards/:id/design`
- delete success must keep `touch('boards')`, optional `onSave`, and close behavior

Visual-only requirements:
- desktop table and mobile card fallback must expose open, design, edit, delete affordances
- add/edit forms keep board type, entity selector, name, description, and parameter payload semantics unchanged
- board design/layout persistence is out of scope for the list migration; do not alter board component definitions or layout save semantics
- if shares are included, share dialogs keep existing paging/search and mutation/cancel behavior

Recommended QA markers:
- `data-workspace-list="boards"`
- `data-workspace-list-search="boards"`
- `data-workspace-list-row="boards"`
- `data-workspace-list-action="boards-open|boards-design|boards-edit|boards-delete|boards-share"`
- `data-workspace-list-dialog="boards-create|boards-edit|boards-delete|boards-share"`
- `data-workspace-list-empty="boards"`

Acceptance criteria:
- search, paging, empty/no-match/loading/error states still work from the same hook
- add dialog cancel is safe; add success redirect contract is preserved in source/static proof
- design/edit/delete actions remain visible and keyboard reachable
- no board persistence or board renderer drift is present in the diff

## Recommended conveyor order

1. Links: lowest special evidence risk, validates table/dialog/action pattern after Websites.
2. Pixels: same pattern plus strict URL-like evidence redaction.
3. Boards: broader dialog/entity/design affordances; run after Links/Pixels primitives prove stable.

If a shared primitive P1 emerges during Websites guard, pause these independent slices and patch the shared primitive first. Resume the conveyor only after Luna accepts that shared fix.

## Luna/DM/Iris expectations

Luna source/static guard:
- docs/source target preserves Vega primitive branch lineage and Websites accepted pattern
- no API/auth/schema/migration/package drift for visual-only slices
- target slice still imports/calls the same hooks/routes/mutations
- forbidden evidence/logging patterns absent, with stricter Pixel URL-like scan
- Zen import removals are limited to the active slice files; residual Zen imports are documented

DM controlled served smoke, only if authorized:
- no production mutation
- read-only list/search/paging smoke for the active slice
- dialogs may open/cancel; create/update/delete/share mutations require disposable fixture authorization
- evidence sanitized to statuses, body keys, counts, booleans, hashed IDs, and redacted screenshots

Iris visual QA:
- desktop and mobile screenshots for the active slice
- search, empty/no-match/loading/error, row actions, dialogs, keyboard/focus, and mobile non-hover actions checked
- Pixels evidence uses masked/cropped URL-like values only
