# Facet I — Components

*The object inventory.* This facet is not a style axis; it is the checklist that facets
A–H get applied to. Its value is coverage: a component missing from a system does not
announce itself, it just gets improvised differently on every screen.

## I.TYPE — Component type

What a `concept: component` reference *is*. Exactly one per record, in the record's
`component_type:` field, so the library can answer "show me every footer" without reading
titles. Pick the type of the **outermost** thing in the shot: a pricing section holding three
cards is `pricing-section`, not `card`. A record that shows a whole screen has no component
type. The recognition cue is what the classifier looks for; see [nature](../nature.md).

| ID | Term | How to recognise it | Stance |
|---|---|---|---|
| `I.TYPE.navbar` | Navigation bar / header | Horizontal strip across the top of a page: logo, nav links, a CTA; the content below is cropped or absent | – |
| `I.TYPE.sidebar` | Sidebar navigation | Vertical rail of grouped nav items, usually app chrome beside an empty or cropped canvas | – |
| `I.TYPE.tab-bar` | Mobile tab bar | Bottom bar of 3–5 icon+label destinations on a phone frame | – |
| `I.TYPE.hero` | Hero section | The first viewport of a page shown on its own: headline, sub, CTA, visual; nothing below the fold | – |
| `I.TYPE.feature-section` | Feature section | A row or grid of feature tiles under a section heading, cropped from a longer page | – |
| `I.TYPE.bento-grid` | Bento grid | Irregular grid of tiles of different spans that reads as one composition | – |
| `I.TYPE.pricing-section` | Pricing section | Two or more plans side by side for comparison, with prices and a CTA each | – |
| `I.TYPE.testimonial` | Testimonial / social proof | Quote, avatar, name and role; or a wall of them; or a logo cloud | – |
| `I.TYPE.cta-banner` | CTA banner | A single band whose only job is one call to action, between sections or above a footer | – |
| `I.TYPE.footer` | Footer | Bottom of a page: link columns, legal/copyright row, often a sign-off CTA or giant wordmark | – |
| `I.TYPE.card` | Card (generic) | One bounded surface holding content, not a more specific card type below | – |
| `I.TYPE.profile-card` | Profile card | A person or brand: avatar or banner, name, handle/bio, follow or contact action | – |
| `I.TYPE.pricing-card` | Pricing card | One plan on its own: price numeral, period, feature list or perforation, one CTA | – |
| `I.TYPE.stat-card` | Stat / KPI card | One metric is the subject: hero numeral, label, delta or sparkline | – |
| `I.TYPE.listing-card` | Listing / item card | One item in a collection: job, product, property, file — title, meta, an action | – |
| `I.TYPE.media-card` | Media / feature tile | Image or render leads, short caption; the visual is the content | – |
| `I.TYPE.widget` | Widget | A glanceable OS or dashboard widget — iOS/Android home-screen, lock-screen, watch complication, or a dashboard tile with live data and no page around it | – |
| `I.TYPE.chart` | Chart / data viz | The visualisation itself is the subject, axes and legend included | – |
| `I.TYPE.table` | Table / data grid | Rows and columns of records with a header row | – |
| `I.TYPE.list` | List | Repeating rows (settings, messages, tracks) without a table header | – |
| `I.TYPE.auth-form` | Auth form | Sign-in, sign-up, OTP or reset: credential fields plus one submit, often a split panel | – |
| `I.TYPE.form` | Form | Any other data-entry form: fields, labels, validation, submit | – |
| `I.TYPE.input-control` | Input control | One control in isolation: field, select, slider, stepper, toggle, date picker | – |
| `I.TYPE.button` | Button set | Buttons or CTAs as the subject, often showing variants or states | – |
| `I.TYPE.menu` | Menu / dropdown | Floating list of actions or options anchored to a trigger; command palette | – |
| `I.TYPE.modal` | Modal / dialog | Centred overlay with a scrim, title, body and actions | – |
| `I.TYPE.sheet` | Bottom sheet / drawer | Panel sliding from an edge, with a grab handle or edge anchoring | – |
| `I.TYPE.notification` | Toast / notification | Small transient message, banner or push-style alert | – |
| `I.TYPE.chat` | Chat / assistant panel | Message bubbles or AI answer blocks with a composer | – |
| `I.TYPE.media-player` | Media player | Transport controls, scrubber, artwork | – |
| `I.TYPE.calendar` | Calendar / scheduler | Day, week or month grid; time slots; date ranges | – |
| `I.TYPE.empty-state` | Empty / error state | Illustration or icon, one explanatory line, one recovery action | – |
| `I.TYPE.onboarding-step` | Onboarding step | One step of a flow: progress dots or stepper, one ask, next/skip | – |
| `I.TYPE.ui-kit` | UI kit / component sheet | Many unrelated components laid out as a sheet or style guide | – |

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
| `I.DISC.pattern-exists-first` | Pattern exists first | A new visual treatment must already exist in the system, or it does not go in | – |
| `I.DISC.one-concept-one-component` | One concept, one component | No two components doing the same job | – |
| `I.DISC.tokens-not-values` | Tokens, never raw values | Components reference tokens only | – |
| `I.DISC.composition-over-variants` | Composition over variants | Compose small parts rather than multiply props | – |
| `I.DISC.sync-both-sides` | Sync both sides | A change lands in the code *and* the design file in the same pass | – |

## Open questions

- Variant explosion versus composition — no stated position yet.
- Whether domain components should be promoted into a shared library across projects or
  stay per-product.
