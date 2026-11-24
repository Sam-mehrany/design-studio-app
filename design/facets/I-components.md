# Facet I — Components

*The object inventory.* This facet is not a style axis; it is the checklist that facets
A–H get applied to. Its value is coverage: a component missing from a system does not
announce itself, it just gets improvised differently on every screen.

## I.STATE — The state matrix

No component is done until every row that applies to it is designed. This is the single
most common source of handoff rework.

| ID | State | Applies to |
|---|---|---|
| `I.STATE.default` | Default | all |
| `I.STATE.hover` | Hover | pointer only |
| `I.STATE.focus` | Focus-visible | all — keyboard reachable, visibly ringed |
| `I.STATE.active` | Active / pressed | all interactive |
| `I.STATE.selected` | Selected | selectable |
| `I.STATE.disabled` | Disabled | with a reason exposed somewhere |
| `I.STATE.loading` | Loading | anything async |
| `I.STATE.error` | Error | anything validated |
| `I.STATE.empty` | Empty | anything that holds a collection |
| `I.STATE.stale` | Stale | anything synced |
| `I.STATE.offline` | Offline | anything synced |
| `I.STATE.long-content` | Long content | anything holding user or translated text |
| `I.STATE.rtl` | RTL mirror | all |

## I.FORM — Input & form

`text-field` · `textarea` · `numeric-stepper` · `slider` · `select` · `combobox` ·
`multi-select` · `checkbox` · `radio` · `switch` · `segmented-control` · `date-picker`
(Jalali-aware) · `time-picker` · `duration-picker` · `search-field` · `file-drop` ·
`otp-input` · `field-group` · `inline-validation` · `form-footer`

**Needs its own spec:** `numeric-stepper` — the primary data-entry control in a logger.
Tap targets, hold-to-repeat, sane increments per unit, no keyboard required, no precision
drag (`G.GEST.stepper`).

## I.ACT — Action

`button` (primary / secondary / tertiary / destructive / icon-only) · `button-group` ·
`fab` · `link` · `menu` · `context-menu` · `dropdown` · `toolbar` · `pagination`

Icon-only buttons carry an accessible name and, outside toolbars, a visible label —
`E.ACC.icon-plus-word`.

## I.DISP — Display & data

`card` · `list-row` · `table` · `data-grid` · `key-value-pair` · `stat-tile` ·
`hero-metric` · `badge` · `chip` · `tag` · `avatar` · `progress-bar` · `progress-ring` ·
`gauge` · `sparkline` · `trend-chart` · `bar-chart` · `heat-grid` · `calendar-grid` ·
`timeline` · `rating` · `divider` · `tooltip` · `popover`

**Needs its own spec:** `hero-metric` (the `D.HERO` token, not a reused heading) ·
`table` with `D.NUM.tabular` and fixed precision · `heat-grid` for adherence patterns.

## I.NAV — Navigation

`app-bar` · `bottom-nav` · `tab-bar` · `side-nav` · `breadcrumb` · `stepper-progress` ·
`back-affordance` · `scroll-anchor-nav`

Directional elements mirror under RTL (`F.ICON-RTL.flip-directional`); bottom-nav sits
inside the reach zone (`B.REACH.bottom-primary`).

## I.FEED — Feedback & system

`toast` · `inline-alert` · `tinted-note` · `banner` · `modal` · `sheet` · `drawer` ·
`confirm-dialog` · `skeleton` · `spinner` · `empty-state` · `error-state` ·
`offline-banner` · `sync-indicator` · `conflict-resolver` · `undo-snackbar`

**Needs its own spec:** `conflict-resolver` and `sync-indicator` — these only exist in
offline-first products and are never in a reference board, so they get designed last and
badly unless they are on this list.

## I.DOM — Domain components

Project-specific, listed so they are not mistaken for generic ones. The current set,
from the training product:

`set-row` · `rest-timer` · `exercise-card` · `exercise-picker` · `program-row` ·
`program-builder-canvas` · `adherence-dot` · `client-card` · `check-in-form` ·
`measurement-input` · `pack-card` · `receipt` · `trainer-profile-header`

**`set-row` is component number one** in that product. It is the densest, most repeated,
most hostile-context object in the system — and it is the one no reference board contains.

## I.DISC — System discipline

| ID | Term | One line | Stance |
|---|---|---|---|
| `I.DISC.pattern-exists-first` | Pattern exists first | A new visual treatment must already exist in the system, or it does not go in | ✓ PREF-0002 |
| `I.DISC.one-concept-one-component` | One concept, one component | No two components doing the same job | req |
| `I.DISC.tokens-not-values` | Tokens, never raw values | Components reference tokens only | req |
| `I.DISC.composition-over-variants` | Composition over variants | Compose small parts rather than multiply props | – |
| `I.DISC.sync-both-sides` | Sync both sides | A change lands in the code *and* the design file in the same pass | ✓ PREF-0013 |

## Open questions

- Variant explosion versus composition — no stated position yet.
- Whether domain components should be promoted into a shared library across projects or
  stay per-product.
