# Official shadcn foundation P0 contract

Classification: `official_shadcn_foundation_p0_contract_requested / custom_primitive_contract_superseded / no_deploy_no_mutation`

Base: `origin/atlas/umami-shadcn-cosmo-visual-system-backlog @ 7b7a5255879672c15572ce37f2b4d143a8a96d60`

Purpose: replace the prior handmade Vega primitive contract with an official shadcn foundation contract for the Umami fork. Cosmo legacy remains the visual reference, but the implementation foundation must be generated/configured through official shadcn conventions before Login, Settings, and Workspace surfaces are migrated.

## Current source truth

Observed locally on this base:
- no root `components.json`
- no official generated `src/components/ui` directory
- no `src/lib/utils.ts` `cn` helper
- no Tailwind dependency/config present in `package.json`
- `lucide-react` is already present
- `src/components/shadcn/SettingsKit.tsx` exists, but it is a small CSS-module kit, not an official shadcn foundation
- many surfaces still import `@umami/react-zen`; `ZenProvider` is still active in providers/layout paths

Official shadcn docs used as contract source:
- `components.json` controls CLI generation, aliases, Tailwind CSS file, CSS variables, RSC, TSX, and icon library
- Tailwind v4 projects leave `tailwind.config` blank in `components.json`
- CSS variables are the recommended theming mode
- aliases in `components.json` must match TypeScript/runtime import aliases
- monorepo/multi-workspace setups require correct `components.json` per workspace

## P0 foundation deliverable

Required files/config:
- root `components.json`
- `src/lib/utils.ts` exporting `cn`
- official generated component files under `src/components/ui`
- Tailwind global CSS entry wired into the existing Next app global style path
- package dependencies required by selected generated components

Recommended `components.json` contract:
- `$schema`: official shadcn schema
- `style`: `new-york`
- `rsc`: `true`
- `tsx`: `true`
- `tailwind.config`: empty string if Tailwind v4 is used
- `tailwind.css`: the actual global CSS file imported by the app
- `tailwind.baseColor`: `neutral` unless Luna/PO approves a different Cosmo token base
- `tailwind.cssVariables`: `true`
- `iconLibrary`: `lucide`
- `aliases.components`: `@/components`
- `aliases.ui`: `@/components/ui`
- `aliases.lib`: `@/lib`
- `aliases.utils`: `@/lib/utils`
- `aliases.hooks`: `@/components/hooks` unless a new `src/hooks` root is explicitly introduced

Tailwind/Radix/CVA/cn requirements:
- install Tailwind only as part of the explicit foundation lane, not inside unrelated surface migrations
- install Radix packages only through the official generated component requirements or explicit `shadcn add` output
- install `class-variance-authority`, `clsx`, and `tailwind-merge` with the foundation
- keep `lucide-react` as the icon library; do not introduce a second icon stack
- define `cn(...inputs)` using `clsx` plus `tailwind-merge`
- generated components must use `cn` from `@/lib/utils`
- generated components must live in `src/components/ui`; no second hand-written primitive root

Allowed import patterns:
- surfaces import official primitives from `@/components/ui/<component>` or a documented `@/components/ui` barrel if the generated component set supports it consistently
- shared app logic/hooks keep existing Umami imports such as `@/components/hooks`, `@/lib/*`, and current route/query helpers
- icons come from `lucide-react` or `@/components/icons` only if that local wrapper continues to re-export lucide consistently

Disallowed import patterns after foundation acceptance:
- new surface code importing `src/components/shadcn/SettingsKit`
- new surface code importing a handmade Vega primitive as the source of truth
- new aliases that bypass `components.json`
- generated component edits that remove shadcn/Radix accessibility behavior without a guarded reason
- replacing Umami data/auth/query helpers with visual-only utilities

## Token/theme contract

Cosmo legacy is reference-only for visual mapping. The official foundation owns the token surface.

Map Cosmo colors into shadcn semantic CSS variables:
- page/app: `--background`, `--foreground`
- panels: `--card`, `--card-foreground`, `--popover`, `--popover-foreground`
- brand/action: `--primary`, `--primary-foreground`
- low-emphasis actions: `--secondary`, `--secondary-foreground`
- quiet UI: `--muted`, `--muted-foreground`
- hover/selection: `--accent`, `--accent-foreground`
- danger: `--destructive`, `--destructive-foreground`
- form/table borders: `--border`, `--input`, `--ring`
- charts and analytics accents: `--chart-1` through `--chart-5`
- shell/sidebar if generated: `--sidebar`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-accent`, `--sidebar-border`, `--sidebar-ring`

Acceptance:
- light and dark themes both define the same semantic variable names
- no screen hardcodes Cosmo hex values when a semantic token exists
- one-off CSS modules may remain only as surface layout glue, not as a replacement primitive system
- focus rings use shadcn `ring` semantics and meet keyboard-visible expectations

## Prior Vega/SettingsKit status

May remain as reference only:
- visual density, spacing, border radius, and tone from the Vega/Cosmo branches
- copy/layout lessons from Login, Websites, and SettingsKit experiments
- QA marker conventions and evidence-redaction practices

Must be regenerated/replaced for official foundation:
- Button/Input/Select/Dialog/Table/Card/Tabs/Dropdown/Badge/Skeleton/Empty primitives
- SettingsKit card/input/select/button abstractions if used as implementation primitives
- any handmade `components/ui` equivalents that were not generated from or aligned with official shadcn contracts

May temporarily remain until each surface lane migrates:
- `ZenProvider`
- existing `@umami/react-zen` imports in untouched surfaces
- current CSS modules that only style page-specific layout

Hard boundary:
- do not remove Zen globally in the foundation lane
- do not mix new surfaces between handmade Vega primitives and official shadcn primitives

## Migration acceptance by surface

### Login/Auth

Visual target:
- magic-link primary path and password fallback can follow Cosmo visual hierarchy
- form controls, buttons, alerts, loading, and empty/error states use official shadcn primitives
- keyboard focus order and visible focus rings are preserved

Behavior to preserve:
- existing Umami login routes/session/auth token behavior
- magic link and invite flows from the accepted implementation lane, including no token/link leak
- enumeration-safe responses and honest email-configured state if present

Backend/auth/schema:
- no backend/auth/schema changes unless Orion opens a specific auth contract patch

### Settings/Admin/Team

Visual target:
- settings/admin pages use shadcn cards, forms, inputs, selects, dialogs, tabs, badges, and tables
- field groups are explicit: profile/basic, access/roles, invitations, website access, advanced/debug
- tables use dense but scannable rows, sticky/clear actions where needed, mobile cards when width is constrained
- Team ID/access code belongs in Advanced/debug placement, not primary form hierarchy

Behavior to preserve:
- Umami `User`, `Team`, `TeamUser`, role, and website-scope invariants
- team-scoped permissions and admin/global role checks
- invite lifecycle semantics, resend/revoke/accept states, token hash-only, no link exposure
- website access multiselect semantics and existing permission constraints

Backend/auth/schema:
- only required if a surface lacks an accepted endpoint/field/state. Otherwise visual-only.

### Workspace lists

Visual target:
- Websites/Links/Pixels/Boards use official shadcn table/card/dialog/form primitives
- search/paging/actions stay visible on desktop and mobile
- URL-like values, especially Links/Pixels, are redacted in artifacts

Behavior to preserve:
- existing Umami query hooks, routes, `page/pageSize/search`, mutation payloads, navigation, and permissions
- no backend/auth/schema drift in visual migration slices

## Foundation validators

Add or extend source/static validators to prove:
- `components.json` exists and aliases match project paths
- `src/lib/utils.ts` exports `cn`
- required official dependency set is present
- generated components are under `src/components/ui`
- new migrated surfaces import official shadcn primitives, not `SettingsKit` or handmade Vega primitives
- untouched Zen imports are allowed only outside the active slice
- no `src/app/api`, Prisma, schema, migration, auth, or permission drift in visual-only lanes
- no raw tokens, invite links, magic links, cookies, URL-like evidence, raw IDs, or secret-bearing config in code/log artifacts

## Runtime QA expectations

Luna source/static:
- foundation files and dependency changes are explicit and narrow
- generated component paths match `components.json`
- token CSS maps Cosmo visual reference into shadcn variables
- no backend/auth/schema drift unless separately authorized

DM controlled served target, only after explicit authorization:
- no production mutation
- smoke Login, Settings/Admin/Team, and Workspace surfaces only for the active lane
- report statuses, body keys, counts, booleans, and redacted screenshots only

Iris visual QA:
- keyboard/focus pass for forms/dialogs/dropdowns/tabs/tables
- mobile layout pass for shell, login, settings/team, and workspace lists
- dark/light token pass if both themes are enabled
- screenshot evidence redacts tokens, links, URL-like values, raw IDs, and secret-like content

## Recommended implementation order

1. P0 foundation: `components.json`, Tailwind/CSS variable setup, `cn`, official generated primitives, validators.
2. P1 Login/Auth polish rebase onto official primitives.
3. P1 Settings/Admin/Team migration using official cards/forms/tables/dialogs.
4. P1 Workspace lists migration using official table/card/dialog/form primitives.
5. P2 analytics/report surface migrations.

Do not start surface migrations against handmade Vega primitives after this contract is accepted. Vega remains a visual reference, not the implementation foundation.
