# Facet B — Structure & layout

*How is space organised, and how is hierarchy produced?* This is the facet that decides
whether a design works; A decides whether it is liked. Most "I don't know what's wrong
with it" problems are B problems.

## B.GRID — Grid system

| ID | Term | One line | Stance |
|---|---|---|---|
| `B.GRID.columnar` | Columnar | Classic 12/16-column with gutters | – |
| `B.GRID.modular` | Modular | Rows and columns both fixed; a true module matrix | – |
| `B.GRID.bento` | Bento | Unequal tiles in a tight mosaic, each a self-contained cell | ✓ PREF-0004 (Gemini tile grid) |
| `B.GRID.single-column` | Single column | One stream; mobile-native, list-led | – |
| `B.GRID.split` | Split / pane | Two or three persistent regions, independently scrolled | – |
| `B.GRID.asymmetric` | Asymmetric | Deliberate imbalance as the composition | – |
| `B.GRID.broken` | Broken grid | Overlap and bleed across the structure | – |
| `B.GRID.canvas` | Canvas | Free 2D space, pan and zoom, no page flow | – |

## B.DEN — Density

| ID | Term | One line | Stance |
|---|---|---|---|
| `B.DEN.sparse` | Sparse | One idea per screen; space is the message | – |
| `B.DEN.moderate` | Moderate | Comfortable default; most consumer apps | – |
| `B.DEN.dense` | Dense | Many values visible at once, deliberately | req for loggers, rosters, panels |
| `B.DEN.compressed` | Compressed | Operator-grade; maximum data per pixel | – |

Density is a **requirement of the job**, not a style choice (see facet J). A dense screen
rendered sparse is a worse design, not a cleaner one.

## B.HIER — Hierarchy mechanism

Which signal does the heavy lifting. Naming it prevents the common failure of using all
five at once, which produces no hierarchy at all.

| ID | Term | One line | Stance |
|---|---|---|---|
| `B.HIER.size` | Size | Scale contrast ranks elements | – |
| `B.HIER.weight` | Weight | Type weight ranks elements | – |
| `B.HIER.colour` | Colour | Hue or intensity ranks elements | – only when colour is otherwise semantic |
| `B.HIER.position` | Position | Reading order and anchoring rank elements | – |
| `B.HIER.enclosure` | Enclosure | Containers group and rank | – |
| `B.HIER.space` | Space | Proximity alone groups; no containers | – |

## B.CONT — Containment strategy

| ID | Term | One line | Stance |
|---|---|---|---|
| `B.CONT.cards` | Cards | Everything in bordered or raised containers | – |
| `B.CONT.seams` | Seams | Hairline dividers, no containers | – |
| `B.CONT.bare` | Bare | Grouping by space alone | – |
| `B.CONT.tray` | Tray / panel | Persistent surfaces holding transient content | – |
| `B.CONT.nested` | Nested | Containers inside containers | – card-in-card reads as a different system |

## B.SPACE — Whitespace strategy

| ID | Term | One line | Stance |
|---|---|---|---|
| `B.SPACE.tight` | Tight | Minimum to separate; content-forward | ✓ PREF-0003 |
| `B.SPACE.rhythmic` | Rhythmic | A strict scale, repeated; space is the grid | – |
| `B.SPACE.generous` | Generous | Space as the luxury signal | – |
| `B.SPACE.scattered` | Scattered | Large gaps without system; "room left over" | ✗ PREF-0003 |

`B.SPACE.scattered` is a named failure mode, not a style: it is what generous space becomes
when the composition does not fill its frame on purpose.

## B.FLOW — Reading flow

| ID | Term | One line | Stance |
|---|---|---|---|
| `B.FLOW.ltr` | LTR primary | Designed left-to-right, mirrored later if ever | – only for non-Persian work |
| `B.FLOW.rtl` | RTL primary | Designed right-to-left first; LTR is the mirror | ✓ PREF-0007 |
| `B.FLOW.bidi` | True bidirectional | Both are first-class; numerals and units handled explicitly | ✓ PREF-0007 |
| `B.FLOW.z` | Z-pattern | Marketing flow across alternating sides | – |
| `B.FLOW.f` | F-pattern | Scanning flow for text-heavy pages | – |

## B.REACH — Thumb & reach zones

Only applies on handheld (see `K.INPUT`). A primary action outside the reach zone is a
defect, not a taste question.

| ID | Term | One line | Stance |
|---|---|---|---|
| `B.REACH.bottom-primary` | Bottom primary | Actions in the lower third, inside thumb arc | – |
| `B.REACH.top-primary` | Top primary | Actions in the header; needs a second hand | – |
| `B.REACH.edge-rail` | Edge rail | Persistent side rail for one-handed reach | – |

## Open questions

- Preferred default: `B.CONT.cards` or `B.CONT.seams`? The Markito evidence (PREF-0002)
  implies cards-with-one-border, but seams were never tested.
- Does the bento liking (PREF-0004) extend to product UI, or only to brand and docs surfaces?
