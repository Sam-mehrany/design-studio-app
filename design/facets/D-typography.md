# Facet D — Typography

*How does type carry hierarchy, data and voice?* For data products this facet matters more
than colour: a numeral that misaligns or a weight that does not separate costs more
legibility than any palette choice. Persian work adds constraints that cannot be
retrofitted — see `D.FA`.

## D.FACE — Face character

| ID | Term | One line | Stance |
|---|---|---|---|
| `D.FACE.geometric-sans` | Geometric sans | Circular forms, even weight; Futura/Poppins lineage | – |
| `D.FACE.neo-grotesque` | Neo-grotesque | Neutral, tight apertures; Helvetica/Inter lineage | – |
| `D.FACE.grotesque` | Grotesque | Earlier, quirkier, more character than neutral | – |
| `D.FACE.humanist-sans` | Humanist sans | Calligraphic skeleton, open apertures; warmer | – |
| `D.FACE.transitional-serif` | Transitional serif | Editorial workhorse serif | – |
| `D.FACE.didone` | Didone | Extreme thick-thin; fashion register | – |
| `D.FACE.slab` | Slab | Blocky serifs; sturdy, technical | – |
| `D.FACE.mono` | Monospace | Fixed pitch; code and data register | – |
| `D.FACE.display` | Display | For one size only; not a text face | – |
| `D.FACE.variable` | Variable font | One file, continuous axes | – |

## D.PAIR — Pairing logic

| ID | Term | One line | Stance |
|---|---|---|---|
| `D.PAIR.single` | Single family | One face, weights only; the safest system | – |
| `D.PAIR.sans-serif` | Sans + serif | Serif for reading, sans for interface | – |
| `D.PAIR.display-text` | Display + text | Expressive headline face, neutral text face | – |
| `D.PAIR.mono-accent` | Mono accent | Monospace for data, sans for everything else | – |

## D.SCALE — Scale ratio

| ID | Term | One line | Stance |
|---|---|---|---|
| `D.SCALE.tight` | Tight (1.125–1.2) | Many close steps; dense interfaces | – |
| `D.SCALE.moderate` | Moderate (1.25) | The default modular scale | – |
| `D.SCALE.dramatic` | Dramatic (1.5+) | Few steps, big jumps; editorial | – |
| `D.SCALE.two-tier` | Two-tier | A compact UI scale plus a separate display scale | – |

## D.WGT — Weight strategy

| ID | Term | One line | Stance |
|---|---|---|---|
| `D.WGT.single` | Single weight | One weight; hierarchy from size and colour only | – |
| `D.WGT.two-step` | Two-step | Regular plus one bold | – |
| `D.WGT.high-contrast` | High contrast | Light body against heavy display | – |
| `D.WGT.weight-only` | Weight-only hierarchy | Same size throughout, weight ranks | – |

## D.CASE — Case usage

| ID | Term | One line | Stance |
|---|---|---|---|
| `D.CASE.sentence` | Sentence case | Default for labels and buttons | – |
| `D.CASE.title` | Title Case | Headings and nav | – |
| `D.CASE.all-caps-label` | ALL-CAPS micro-label | Tracked caps for small category labels | – |
| `D.CASE.all-caps-display` | ALL-CAPS display | Caps at large size as the statement | – |
| `D.CASE.lowercase` | all lowercase | Deliberate informality | – |

## D.NUM — Numeral treatment

The most under-specified part of most design systems, and the one that breaks data screens.

| ID | Term | One line | Stance |
|---|---|---|---|
| `D.NUM.tabular` | Tabular (monospaced) | Fixed-width figures; columns align, values stop jittering | – |
| `D.NUM.proportional` | Proportional | Natural spacing; fine in prose, wrong in tables | – |
| `D.NUM.lining` | Lining | Cap-height figures | – |
| `D.NUM.oldstyle` | Oldstyle | Figures with ascenders and descenders; text-like | – |
| `D.NUM.latin` | Latin digits (1234) | Western digits in any locale | – |
| `D.NUM.persian` | Persian digits (۱۲۳۴) | Eastern Arabic-Indic digits | – |
| `D.NUM.mixed-policy` | Mixed policy | Locale digits in prose, Latin in data entry and IDs | – |

A **single policy** must be chosen per product and written down: which digits appear in
prose, in inputs, in charts, in prices, in dates, in phone numbers. Inconsistency here reads
as a broken product rather than a design choice.

## D.HERO — Hero-number treatment

The one value a screen exists to show. It is its own token, not a heading reused.

| ID | Term | One line | Stance |
|---|---|---|---|
| `D.HERO.display-numeral` | Display numeral | Very large, tight tracking, unit set small beside it | – |
| `D.HERO.unit-stacked` | Unit stacked | Unit below or above the figure | – |
| `D.HERO.in-gauge` | In-gauge | Figure sits inside a ring or bar | – |
| `D.HERO.inline` | Inline | No special treatment; the value sits in the text flow | – |

## D.SET — Setting character

| ID | Term | One line | Stance |
|---|---|---|---|
| `D.SET.tight-display` | Tight display | Negative tracking at large sizes | – |
| `D.SET.open-body` | Open body | Comfortable leading for reading | – |
| `D.SET.compact-ui` | Compact UI | Short leading for dense rows | – |
| `D.SET.tracked-caps` | Tracked caps | Positive tracking on small caps labels | – |

## D.FA — Persian / RTL typography

Constraints, not preferences. Each one has broken a real layout.

| ID | Term | One line | Stance |
|---|---|---|---|
| `D.FA.weight-range` | Real weight range | The Persian face must ship the weights the scale needs; many ship two | – |
| `D.FA.no-italic` | No italic | Persian has no italic; emphasis comes from weight or colour | – |
| `D.FA.no-smallcaps` | No small caps | The all-caps micro-label pattern has no Persian equivalent | – |
| `D.FA.taller-leading` | Taller leading | Persian needs more line height than Latin at the same size | – |
| `D.FA.subset-selfhost` | Subset and self-host | Persian faces are heavy; subset and host domestically | – |
| `D.FA.latin-fallback` | Latin fallback pairing | A Latin face chosen to sit with the Persian one, not defaulted | – |
| `D.FA.iransans-class` | IRANSans-class | The established neutral Persian UI face family | – |

## Open questions

- Latin fallback face of choice to pair with IRANSans — never specified.
- Persian or Latin digits as the default in interface chrome? Open per product.
- Monospace for values: wanted, or does tabular-figure sans suffice?
