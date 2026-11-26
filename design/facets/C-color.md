# Facet C — Colour

*What is the palette architecture, and what does colour mean?* The central discipline here
is the split between colour as **meaning** and colour as **decoration**. A palette that
decorates has no capacity left to signal, which is why colourful dashboards are unreadable.

## C.PAL — Palette architecture

| ID | Term | One line | Stance |
|---|---|---|---|
| `C.PAL.monochrome` | Monochrome | One hue, value range only | – |
| `C.PAL.neutral-only` | Neutral only | Greys plus black and white; no hue at all | – |
| `C.PAL.single-accent` | Single accent | Neutral field, one accent that always means "act" or "now" | – |
| `C.PAL.duotone` | Duotone | Two hues in fixed relationship | – |
| `C.PAL.triad` | Triad | Three hues, balanced roles | – |
| `C.PAL.polychrome` | Polychrome | Many hues; categorical by design | – |
| `C.PAL.brand-locked` | Brand-locked | Palette inherited from a brand, not chosen | – |

## C.VAL — Value strategy

| ID | Term | One line | Stance |
|---|---|---|---|
| `C.VAL.light-first` | Light-first | Light is the designed default; dark derived | – |
| `C.VAL.dark-first` | Dark-first | Dark is the designed default; light derived | – |
| `C.VAL.true-dual` | True dual | Both designed, neither derived; tokens carry both | – |
| `C.VAL.tonal-layered` | Tonal layered | Several surface tones establish depth without shadow | – |
| `C.VAL.white-void` | White void | Content floats on flat white with no environment | – |

## C.CON — Contrast level

| ID | Term | One line | Stance |
|---|---|---|---|
| `C.CON.high` | High | Hard separation; legible in sun and glare | – |
| `C.CON.moderate` | Moderate | WCAG-compliant without severity | – |
| `C.CON.low` | Low | Soft, close values; calm but fragile | – |

Contrast is verified **at token level**, in both themes, before any screen is built:
4.5:1 body, 3:1 large text and UI boundaries. A palette that passes per-screen but not
per-token will drift back out of compliance on the next screen.

## C.SEM — Semantic discipline

| ID | Term | One line | Stance |
|---|---|---|---|
| `C.SEM.strict` | Strict | Every hue has exactly one job; none decorates | – |
| `C.SEM.layered` | Layered | Semantic set plus a separate decorative set | – |
| `C.SEM.loose` | Loose | Colour chosen per composition | – |

Minimum semantic set, named as roles rather than values:
`surface` · `surface-raised` · `on-surface` · `on-surface-muted` · `border` · `accent` ·
`on-accent` · `success` · `warn` · `danger` · `info` · `track` (the unfilled part of any
gauge) · `focus`.

## C.SAT — Saturation character

| ID | Term | One line | Stance |
|---|---|---|---|
| `C.SAT.muted` | Muted | Desaturated throughout; accent included | – |
| `C.SAT.vivid` | Vivid | Saturated accent against neutral field | – |
| `C.SAT.neon` | Neon | Luminous accent, dark field, glow implied | – |
| `C.SAT.pastel` | Pastel | High value, low saturation | – |
| `C.SAT.candy` | Candy | Sweet, confectionery palette | – |

## C.VIZ — Data-visualisation ramp

Charts need their own colour decision, made once, or every analytics screen reinvents it.

| ID | Term | One line | Stance |
|---|---|---|---|
| `C.VIZ.sequential` | Sequential | Single-hue ramp for magnitude | – |
| `C.VIZ.diverging` | Diverging | Two-ended ramp around a midpoint | – |
| `C.VIZ.categorical` | Categorical | Distinguishable set for unordered series | – |
| `C.VIZ.accent-only` | Accent only | One series in accent, everything else neutral | – |
| `C.VIZ.status-mapped` | Status-mapped | Ramp bound to success/warn/danger meaning | – |

Categorical ramps must stay distinguishable in both themes and under the common colour
deficiencies; never rely on hue alone to separate series.

## C.MAT — Material and finish

| ID | Term | One line | Stance |
|---|---|---|---|
| `C.MAT.flat` | Flat | Colour is colour; no material implied | – |
| `C.MAT.gradient-subtle` | Subtle gradient | Slight value shift for depth | – |
| `C.MAT.gradient-mesh` | Mesh gradient | Multi-point colour field as imagery | – |
| `C.MAT.metallic` | Metallic | Brushed or polished metal response | – |
| `C.MAT.glass-frosted` | Frosted glass | Translucent diffusion | – |
| `C.MAT.velvet` | Velvet / fabric | Soft directional sheen | – |
| `C.MAT.grain` | Grain / noise | Film grain or texture over flat colour | – |

## Open questions

- Dark-first or light-first as the *personal* default when no constraint decides it?
- Is there an accent hue Sam gravitates to across projects, or is it always brand-derived?
- Persian/Iranian colour connotations worth encoding (e.g. green, turquoise) — unexamined.
