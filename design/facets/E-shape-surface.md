# Facet E — Shape & surface

*Radius, border, depth, texture — how do surfaces behave?* The facet where consistency
matters more than choice: one surface treated differently from the rest reads as a
different system, which is the substance of PREF-0002.

## E.RAD — Radius language

| ID | Term | One line | Stance |
|---|---|---|---|
| `E.RAD.sharp` | Sharp (0) | No rounding; technical, severe | – |
| `E.RAD.small` | Small (2–6px) | Barely softened; dense interfaces | – |
| `E.RAD.medium` | Medium (8–12px) | The modern default | – |
| `E.RAD.large` | Large (16–24px) | Soft, friendly, consumer | – |
| `E.RAD.pill` | Pill | Fully rounded ends on controls | – |
| `E.RAD.nested-rule` | Nested rule | Inner radius = outer minus padding, computed not guessed | – |
| `E.RAD.mixed` | Mixed | Different radii by component class | – |
| `E.RAD.asymmetric` | Asymmetric | One or two corners rounded | – |

## E.DEP — Depth model

| ID | Term | One line | Stance |
|---|---|---|---|
| `E.DEP.flat` | Flat | No depth cue at all | – |
| `E.DEP.border-only` | Border only | Hairline borders separate; cheapest to render | – |
| `E.DEP.shadow-elevation` | Shadow elevation | Shadow encodes height; Material lineage | – |
| `E.DEP.border-plus-shadow` | Border + shadow | One border weight *and* one shadow, applied uniformly | – |
| `E.DEP.tonal` | Tonal | Surface lightness encodes depth; no shadow | – |
| `E.DEP.live-blur` | Live blur | Runtime backdrop blur | – |
| `E.DEP.extruded` | Extruded | Real geometric extrusion, rendered | – |
| `E.DEP.inset` | Inset | Recessed surfaces; wells and tracks | – |

## E.ACC — Accent treatment on surfaces

| ID | Term | One line | Stance |
|---|---|---|---|
| `E.ACC.badge` | Badge | Status in a labelled pill | – |
| `E.ACC.tinted-note` | Tinted note | Status as a tinted block with icon and word | – |
| `E.ACC.icon-plus-word` | Icon + word | Never icon alone for status | – |
| `E.ACC.side-stripe` | Side stripe | Thick coloured border on one edge of a card | – |
| `E.ACC.full-tint` | Full tint | Whole surface tinted by status | – |
| `E.ACC.outline-colour` | Coloured outline | Border hue carries status | – |

## E.STROKE — Stroke weight

| ID | Term | One line | Stance |
|---|---|---|---|
| `E.STROKE.hairline` | Hairline (1px/0.5pt) | Quiet separation | – |
| `E.STROKE.medium` | Medium (2px) | Visible structure | – |
| `E.STROKE.heavy` | Heavy (3px+) | Structure as expression; neo-brutalist | – |
| `E.STROKE.uniform` | Uniform rule | One stroke weight across the whole system | – |

## E.TEX — Texture

| ID | Term | One line | Stance |
|---|---|---|---|
| `E.TEX.none` | None | Clean surfaces | – |
| `E.TEX.grain` | Grain | Fine noise over colour | – |
| `E.TEX.paper` | Paper | Fibre or tooth | – |
| `E.TEX.brushed-metal` | Brushed metal | Directional anisotropic sheen | – |
| `E.TEX.polished` | Polished | Specular, mirror-like | – |
| `E.TEX.terrazzo` | Terrazzo | Aggregate speckle | – |
| `E.TEX.pattern` | Pattern | Repeating motif | – |

## E.EDGE — Edge and frame

| ID | Term | One line | Stance |
|---|---|---|---|
| `E.EDGE.framed` | Framed | Content inset within a visible margin | – |
| `E.EDGE.bleed` | Full bleed | Content runs to the edge | – |
| `E.EDGE.safe-inset` | Safe inset | Respects notch, home bar and rounded display corners | – |

## E.ENV — Environment

Whether the composition sits in a space or on nothing. A brand-graphic concern mostly, but
it decides whether renders read as objects or as stickers.

| ID | Term | One line | Stance |
|---|---|---|---|
| `E.ENV.staged` | Staged | A lit environment with ground, falloff and reflection | – |
| `E.ENV.tonal-field` | Tonal field | A graded field standing in for a space | – |
| `E.ENV.white-void` | White void | Object floating on flat white | – |
| `E.ENV.cutout` | Cutout | Object with no environment, placed as a sticker | – |

## Open questions

- Default radius step across projects — never stated; derived per brand so far.
- Does the `E.DEP.border-plus-shadow` preference hold on dark surfaces, where shadow
  mostly disappears and tonal depth is the real tool?
