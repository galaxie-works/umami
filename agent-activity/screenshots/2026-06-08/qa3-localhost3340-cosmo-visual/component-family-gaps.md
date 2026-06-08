# QA3 localhost:3340 Cosmo Visual Component Gaps

Date: 2026-06-08
Target: `localhost:3340`
Hash under test: `610b4ec3`

Runtime note: localhost capture used `610b4ec3` plus uncommitted local login-control changes in the working tree. QA3 did not author, stage or commit those code changes.
Classification: `completed_with_findings / cosmo_shadcn_visual_qa / no_deploy_no_mutation`

## Evidence

Manifest:

- `agent-activity/screenshots/2026-06-08/qa3-localhost3340-cosmo-visual/manifest.json`

Screenshots:

- `localhost3340-login-desktop-head610b4ec.png`
- `localhost3340-login-mobile-head610b4ec.png`
- `localhost3340-websites-desktop-auth.png`
- `localhost3340-websites-mobile-auth.png`
- `localhost3340-overview-desktop-auth.png`

Reference handling:

- PO reference images with browser chrome were used as source visual references only and were not copied into this artifact set.
- Expected style is shadcn/Cosmo visual, not old Umami visual.

## Gap Matrix By Component Family

| Gap id | Severity | Component family | Expected Cosmo/shadcn | Actual localhost:3340 | Evidence | Owner | Acceptance criteria |
|---|---:|---|---|---|---|---|---|
| QA3-3340-P2-001 | P2 | Auth login card | Centered Cosmo-branded shadcn login card with calm product copy and integrated polished footer controls. | Centered shadcn-like card now shows Cosmolytics branding. Copy still reads like legacy Umami admin tone and language/theme controls are detached below card. | QA3-3340-LOGIN-D/M | Rhea UI | Login keeps Cosmolytics/Cosmo brand mark/name, removes old admin-space copy, keeps card centered on desktop/mobile, and aligns language/theme controls with the auth composition. |
| QA3-3340-P2-002 | P2 | Shell/sidebar | Cosmo workspace shell, sidebar card brand, selected states, grouped navigation and bottom user control. | Desktop Websites and Overview mostly match Cosmo shell. Mobile top shell is compact and branded. | QA3-3340-WEBSITES-D/M, QA3-3340-OVERVIEW-D | Rhea UI | Keep current shell direction; verify all primary pages use same shell and no old Umami sidebar variants remain. |
| QA3-3340-P2-003 | P2 | Page header/actions | shadcn page headers with consistent divider, CTA placement and action density. | Websites page is close. Overview header/date/filter controls still feel inherited from Umami analytics layout rather than Cosmo legacy dashboard language. | QA3-3340-WEBSITES-D, QA3-3340-OVERVIEW-D | Rhea UI + Orion PO | PO decides whether overview should remain Umami-native analytics layout or shift further toward Cosmo legacy dashboard composition. Header/action spacing should be consistent either way. |
| QA3-3340-P2-004 | P2 | Cards/surfaces | shadcn border/radius/background, compact operational density and no heavy nested-card feel. | Desktop surfaces are mostly aligned. Mobile website rows become large cards and feel heavier than the desktop table. | QA3-3340-WEBSITES-D/M, QA3-3340-OVERVIEW-D | Rhea UI | Mobile row cards use tighter spacing, aligned action area and consistent card rhythm with desktop shadcn table. |
| QA3-3340-P2-005 | P2 | Tables/lists | Desktop table and mobile list should keep aligned labels, row actions and readable hierarchy. | Desktop websites table is close. Mobile row action icon sits in a separate row and breaks scan flow. | QA3-3340-WEBSITES-D/M | Rhea UI | Mobile row action aligns with row title or a clear trailing action zone; labels/values remain scannable without excess separators. |
| QA3-3340-P2-006 | P2 | Forms/controls | Search, inputs, language selector, theme control, filter and date controls use one shadcn token system. | Search/add/filter/date controls are close. Login input/button are shadcn-like but surrounded by non-Cosmo copy and detached controls. | QA3-3340-LOGIN-D, QA3-3340-WEBSITES-D, QA3-3340-OVERVIEW-D | Rhea UI | Auth controls, list search and dashboard controls share consistent height, radius, icon size, focus state and disabled/empty behavior. |
| QA3-3340-P2-007 | P2 | Tabs/empty states | Tabs and empty states should be quiet, balanced and Cosmo/shadcn-styled. | Overview tabs use underline styling and empty states render, but large empty panels are visually sparse. | QA3-3340-OVERVIEW-D | Rhea UI | Empty panels get consistent shadcn empty treatment with balanced vertical placement, icon/copy where approved, and no old Umami visual residue. |
| QA3-3340-P2-008 | P2 | Dashboard data visuals | Metric cards, chart, map and heatmap use Cosmo/shadcn style while preserving analytics readability. | Overview data visuals are present and closer to shadcn, but still read as Umami analytics panels more than Cosmo legacy dashboard. | QA3-3340-OVERVIEW-D | Rhea UI + Orion PO | PO confirms whether native Umami analytics panel layout is acceptable under Cosmo skin. If not, align metrics/chart/map/heatmap with Cosmo legacy card language. |
| QA3-3340-P2-009 | P2 | Responsive composition | Mobile should preserve brand, hierarchy and comfortable spacing without awkward row stacking. | Login mobile is stable. Websites mobile is functional but row cards/actions need polish. | QA3-3340-LOGIN-M, QA3-3340-WEBSITES-M | Rhea UI | Mobile login and websites capture at 390px shows no overlap, no horizontal overflow, polished row actions and consistent page rhythm. |

## QA Notes

- `/login` was captured unauthenticated on desktop and mobile.
- `/websites` redirected to `/login` until an ephemeral local visual session was created; authenticated `/websites` and website overview captures then succeeded.
- No browser chrome/address bars are included in QA3 screenshots.
- No code, deploy, restart, DB change, production change or data mutation was performed.

Final status: `completed_with_findings / auth_card_p2_copy_footer_gap / shell_mostly_aligned / no_deploy_no_mutation`.
