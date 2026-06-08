# Workspace Links list Vega/Cosmo contract

Classification: `links_list_workspace_contract_requested / websites_pattern_green / no_deploy_no_mutation`

Base: `origin/atlas/workspace-lists-slice-contracts @ faaf481b64620f5ac8b509cb4c04e88312032ff1`

Reference pattern: Websites source/static PASS pattern from `vega/umami-workspace-websites-list`, especially the move away from Zen `DataGrid`, `DataTable`, and `DialogButton` toward `components/ui` table/input/button/dialog primitives while preserving Umami route/query/navigation semantics.

Purpose: give Mira and Luna a concise Links slice implementation contract. Pixels and Boards remain next slices after Links.

## Files in scope

Primary slice:
- `src/app/(main)/links/LinksPage.tsx`
- `src/app/(main)/links/LinksDataTable.tsx`
- `src/app/(main)/links/LinksTable.tsx`
- `src/app/(main)/links/LinkAddButton.tsx`
- `src/app/(main)/links/LinkEditButton.tsx`
- `src/app/(main)/links/LinkEditForm.tsx`
- `src/app/(main)/links/LinkDeleteButton.tsx`

Optional only if the row/share affordance is included in the same patch:
- `src/app/(main)/links/[linkId]/LinkShareForm.tsx`

Out of scope unless explicitly routed:
- `src/app/api/**`
- Prisma/schema/migration/auth/permission helpers
- link tracking, slug generation semantics, redirect behavior, share URL generation
- Pixels and Boards implementation

## Contract to preserve

Query/list behavior:
- keep `useLinksQuery({ teamId })`
- keep `usePagedQuery` semantics from the hook
- preserve query key shape: `['links', { teamId, modified, ...params }]`
- preserve server/query-backed `page`, `pageSize`, and `search`
- preserve `allowSearch=true`, `allowPaging=true`, `autoFocus=false` behavior from the current `LinksDataTable`
- search submit should update route/query params in the same product-visible way as Websites, not become client-only filtering

Routes/API:
- user list: `GET /links`
- team list: `GET /teams/:teamId/links`
- create: `POST /links`
- update: `POST /links/:linkId`
- delete: `DELETE /links/:linkId`
- item fetch for edit: `GET /links/:linkId`

Payload semantics:
- create payload remains `name`, `url`, `slug`, optional `teamId`, optional `id`
- update payload remains optional `name`, `url`, `slug`
- URL validation remains `isValidUrl`
- default slug generation remains `getRandomChars(9)`
- cloud mode hidden slug behavior remains unchanged
- read-only generated link preview remains a UI display/copy affordance, not a changed API contract

Permissions:
- list routes keep current user/team visibility rules
- team list keeps `canViewTeam`
- create keeps `canCreateTeamWebsite` and `canCreateWebsite`
- item routes keep `canViewLink`, `canUpdateLink`, and `canDeleteLink`
- no visual patch may broaden link visibility or expose disabled/hidden actions as callable

Navigation/actions:
- row name still navigates through `renderUrl('/links/:id')`
- slug/generated-link and destination URL remain external-link affordances
- edit action opens the existing edit contract
- delete action remains confirmation-gated
- delete success keeps `touch('links')`, optional `onSave`, and close behavior
- edit/create success keeps `toast(saved)`, `touch('links')`, `touch('link/:linkId')` for edit, optional `onSave`, and close behavior

## Visual-only implementation allowance

Allowed in this slice:
- replace Zen table/list shell with Vega/Cosmo `Table`, `Input`, `Button`, `Empty`, `Loading`, and related primitives
- replace `DialogButton` with explicit Vega/Cosmo button plus dialog state if focus, close, escape, labels, and save/cancel behavior are preserved
- replace Zen `Form`, `TextField`, `Button`, `Grid`, `Row`, `Column`, `Label`, and `Loading` in the Links dialog only if submitted data and validation stay identical
- add stable QA markers
- add mobile card/table fallback so actions are reachable without hover

Recommended QA markers:
- `data-workspace-list="links"`
- `data-workspace-list-search="links"`
- `data-workspace-list-row="links"`
- `data-workspace-list-action="links-open|links-generated-link|links-destination|links-edit|links-delete"`
- `data-workspace-list-dialog="links-create|links-edit|links-delete"`
- `data-workspace-list-empty="links"`
- `data-workspace-list-error="links"`

## URL-like evidence redaction

Live product UI may show generated links and destination URLs, but QA artifacts must not preserve raw URL-like values.

Evidence rules:
- screenshots should crop, mask, blur, or otherwise redact generated-link and destination URL columns when values are visible
- logs/artifacts may report body keys, counts, status codes, booleans, hashed IDs, and whether URL affordances exist
- logs/artifacts must not include raw destination URLs, generated short links, full URLs, raw slugs, share URLs, auth headers, cookies, tokens, or secret-bearing config
- source code must not add new logging for link URL values, slug values, request bodies, or response rows

## Breaking changes to reject

Luna should classify as blocker unless explicitly authorized:
- changed endpoint path, method, query key, query param, payload field, or response assumption
- client-only search replacing existing server/query-backed search
- removed paging behavior or changed page reset on search
- changed permission helper or API route guard
- changed slug generation length/source
- changed URL validation behavior
- changed create/edit/delete mutation side effects or query invalidation
- changed external-link/open navigation semantics
- changed share/link generation semantics
- any `src/app/api`, Prisma, schema, migration, auth, permission, or package change in this visual-only slice
- any raw URL-like evidence/logging addition

## Guard and QA expectations

Luna source/static:
- diff is Links-only plus optional shared style/primitives already used by Websites
- Websites pattern lineage is preserved
- no API/auth/schema/package drift
- current hooks/routes/mutations remain present
- Zen removal is limited to Links slice files, with intentional residuals documented
- evidence scan has no raw URL-like values beyond policy text

DM controlled served target, only if authorized:
- no production mutation
- exercise read-only Links list/search/paging
- create/edit/delete dialogs may open and cancel only unless disposable mutation fixture is authorized
- report statuses/body keys/counts/booleans/hashed IDs only

Iris visual QA:
- desktop and mobile Links list
- search, no-match, empty, loading, error affordances
- row open/generated-link/destination/edit/delete affordances
- create/edit/delete dialogs keyboard/focus/cancel behavior
- URL-like values redacted in screenshots and summaries
