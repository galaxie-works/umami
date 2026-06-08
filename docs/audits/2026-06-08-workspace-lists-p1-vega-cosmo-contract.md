# Workspace Lists P1 Vega/Cosmo implementation contract

Classification: `workspace_lists_p1_contract_support_requested / vega_primitives_ready_141b5526 / no_deploy_no_mutation`

Base: `origin/vega/umami-cosmo-ui-primitives @ 141b5526daec4b38eea43af2d184e64b19a96f3f`

Purpose: provide Mira a concise implementation contract for migrating Umami workspace list surfaces to Vega/Cosmo primitives while preserving Umami query behavior, permissions, search, paging, and actions.

## Target surfaces

Primary P1 surfaces:
- Websites: `src/app/(main)/websites/WebsitesPage.tsx`, `WebsitesDataTable.tsx`, `WebsitesTable.tsx`, `WebsitesHeader.tsx`
- Links: `src/app/(main)/links/LinksPage.tsx`, `LinksDataTable.tsx`, `LinksTable.tsx`
- Pixels: `src/app/(main)/pixels/PixelsPage.tsx`, `PixelsDataTable.tsx`, `PixelsTable.tsx`
- Boards: `src/app/(main)/boards/BoardsPage.tsx`, `BoardsDataTable.tsx`, `BoardsTable.tsx`

Related list/share surfaces to avoid regressing:
- Board shares: `src/app/(main)/boards/[boardId]/BoardSharesTable.tsx`, `BoardShareDialog.tsx`, `BoardShareCreateForm.tsx`
- Link/pixel shares: `src/app/(main)/links/[linkId]/LinkShareForm.tsx`, `src/app/(main)/pixels/[pixelId]/PixelShareForm.tsx`
- Settings website list: `src/app/(main)/settings/websites/WebsitesSettingsPage.tsx`
- Team website list: `src/app/(main)/teams/[teamId]/TeamWebsitesDataTable.tsx`, `TeamWebsitesTable.tsx`

Known legacy dependencies from QA5:
- `@umami/react-zen` `DataGrid`, `DataTable`, `DialogButton`, `Form`, `TextField`, `Select`
- partial screenshot coverage only, so runtime visual QA must include the missing surfaces and mobile fallbacks
- pixel URL-like values need redaction discipline in artifacts
- mobile fallback/actions/dialog affordances need explicit checks

## Preserve contract

Queries:
- Preserve current hooks and route shapes: `useWebsitesQuery`, `useUserWebsitesQuery`, `useLinksQuery`, `usePixelsQuery`, `useBoardsQuery`, and share/list hooks used by the target surfaces.
- Preserve `page`, `pageSize`, `search`, sort/order params where already supported.
- Preserve query keys and modified/refetch behavior unless a lane explicitly updates it and validates invalidation.

Permissions:
- Websites must still honor user/team website visibility and admin/team context.
- Links, pixels, and boards must still use existing user/team ownership and permission gates.
- Add/edit/delete/share actions must keep their existing guarded API routes and confirmation behavior.
- No list visual migration may broaden visibility or make hidden row actions callable.

Actions:
- Preserve existing create, edit, delete, view/open, share, copy/tracking-code, and row action destinations.
- Destructive actions must remain confirm-gated.
- Dialog close/save/refetch behavior must remain the same.

Search/paging:
- Search must continue to use the existing query-backed search behavior, not client-only filtering unless the current surface already did that.
- Paging must remain server/query-backed where currently server/query-backed.
- Empty search/no-match must be visually distinct from no configured records and load/error states.

Evidence:
- QA/artifacts may report status, body keys, row counts, booleans, and hashed IDs.
- Do not emit raw IDs, full URLs, pixel URLs, share URLs, tracking snippets, cookies, auth headers, tokens, or secret-bearing config.

## Visual-only implementation scope

Allowed without backend/auth/schema work:
- Replace Zen `DataGrid`/`DataTable` wrappers with Vega/Cosmo table wrappers if the query props, paging, search, row actions, and empty/error semantics are preserved.
- Replace `DialogButton` with Vega/Cosmo dialog trigger and dialog content if focus trap, escape/close behavior, labels, submit state, and refetch-on-save are preserved.
- Replace `Form`, `TextField`, and `Select` in list dialogs if submitted payloads and validation stay identical.
- Replace cards/toolbars/headers/badges/skeletons/empty states with Vega/Cosmo primitives.
- Add data markers for QA, such as `data-workspace-list="websites|links|pixels|boards"`, `data-workspace-search`, `data-workspace-row-action`, and `data-workspace-empty`.

Visual acceptance:
- Desktop table density matches Vega/Cosmo primitives and keeps primary actions visible.
- Mobile uses card/table fallback that exposes the same actions without hover.
- Loading skeletons keep stable row/card dimensions.
- Empty states identify no data vs no search results vs unavailable/error.
- Dialogs are keyboard reachable and return focus to their trigger.

## Behavior changes requiring explicit authorization

Backend/auth/schema or behavior lane required if any implementation:
- changes an endpoint path, HTTP method, query param, query key, mutation payload, or response expectation
- changes permission checks or role/team/website scope
- adds a new search/filter API
- changes share/tracking-code URL generation
- changes board layout persistence
- changes create/edit/delete/share semantics
- stores new fields or modifies Prisma/schema/migrations
- logs or surfaces raw URL-like evidence

If any of these are needed, pause visual implementation and route Atlas/Orion for a backend contract lane before Luna guard.

## Surface-specific requirements

### Websites

Must preserve:
- My websites/team websites distinction.
- Team context route behavior.
- Add website action visibility.
- Row actions for open/settings/edit/delete/share/tracking where present.
- Existing `WebsitesDataTable` query behavior.

Visual-only notes:
- Header/action area can move to Vega toolbar.
- Table/card rows can show domain-like values in UI, but screenshots/artifacts must redact or crop if they include full URL-like evidence.

QA:
- Admin/global user, normal user, team-scoped user.
- Empty, populated, search no-match, mobile card fallback, row actions, delete confirmation.

### Links

Must preserve:
- Existing links query and row destinations.
- Create/edit/delete/share flow.
- External/open action semantics.

Visual-only notes:
- Link URLs may appear in live UI as product data, but artifacts must not include full URL values.
- Use masked/truncated display in screenshots when possible.

QA:
- Search, paging, open action, edit dialog, delete confirmation, mobile action affordance.

### Pixels

Must preserve:
- Existing pixels query and row actions.
- Pixel destination/config values must not leak into artifacts.
- Share/config dialogs keep current submit payload.

Visual-only notes:
- Treat pixel URL-like/config values as sensitive visual evidence. Prefer labels, statuses, masked values, or cropped screenshots.

QA:
- Search/paging, create/edit dialog, copy/config action without copying raw value to artifacts, mobile fallback.

### Boards

Must preserve:
- Boards list query and board open/edit/design/share actions.
- Board entity/team/website context.
- Board share dialog behavior.
- Board layout persistence is out of scope for this list lane.

Visual-only notes:
- Board rows can become Vega cards on mobile if open/edit/share actions remain present.

QA:
- Open board, edit/design links, share dialog, empty/no-match, mobile row actions.

## Zen migration boundary

For this P1 lane, Zen imports may be removed only from the directly migrated list/dialog/form files. Do not remove `ZenProvider`, package dependencies, or unrelated Zen usages.

Guard expectation:
- Source/static diff should list every removed `@umami/react-zen` import and the replacement Vega/Cosmo primitive.
- Any retained Zen import in the target files must be marked as intentional residual scope.
- No broad Zen cleanup in this lane.

## Recommended validators

Add or extend a source/static validator for this lane that checks:
- target files no longer import forbidden Zen primitives once migrated, or explicitly allow listed residuals
- target files still call the expected hooks/routes
- target files include QA markers for Websites/Links/Pixels/Boards roots, search, rows/actions, empty/error states, and dialogs
- no target code introduces raw URL/token logging
- no `src/app/api`, `prisma`, migration, auth, or permission helper files changed in a visual-only patch

## Luna/DM/Iris handoff

Luna source/static guard:
- visual-only delta unless an explicit backend lane is attached
- no schema/migration/auth/permission drift
- query/hook/path preservation
- Zen migration boundary respected
- evidence-safety scan for URL-like/token/raw ID output

DM controlled served smoke, only if authorized:
- no production mutation
- exercise read-only list/search/paging where possible
- mutation dialogs may be opened/cancelled; actual create/update/delete/share mutation requires explicit disposable fixture plan

Iris visual QA:
- desktop and mobile screenshots for Websites, Links, Pixels, Boards
- action menus/dialog affordances visible
- empty/no-match/error/loading markers checked
- sensitive URL-like values redacted/cropped from artifacts
