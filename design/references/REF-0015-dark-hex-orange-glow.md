---
type: design-ref
id: REF-0015
title: "Abstract: near-black hex grid with an orange glowing cluster"
source: "Pinterest board 'honey' — pin https://www.pinterest.com/pin/e1_AfqPShyak_PfrJq5rNSE_g8jGlLRf4bOe0iwEAAmpqWjVDJpbbRR/"
kind: concept
concept: imagery
captured: 2026-11-26
image: library/REF-0015.jpg
archetype: [J.REF.imagery]
facets: [C.VAL.dark-first, C.PAL.single-accent, C.SAT.neon, C.VAL.tonal-layered, E.TEX.pattern, F.IMG.abstract-shape, F.DEP.hard, F.COST.med]
imagery_dep: hard
rtl: clean
cost: med
verdict: adapt
confidence: med
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
modified: Thu 2026-11-26 1:30 PM EST (UTC-05:00)
---

# REF-0015 — Abstract: near-black hex grid with an orange glowing cluster

## Read

_Measured: colours are k-means clusters and region medians sampled off the image with Python/PIL; contrast ratios are WCAG 2.x computed from those measured hexes._

**Colour** — four near-black steps make the field: #070707, #171616, #28292a, #3c3c3d (≈92% combined); one hot accent, orange #e6771a / #bd481d, peaking at #f78b13 in the glow.

**Typography** — none.

**Layout & harmony** — uniform hexagonal tessellation; the accent clusters in one region and fades out.

**Shape & surface** — bevelled hex cells read as tonal steps, no borders.

**Gradient & imagery** — a radial glow inside the accent cells; reproducible as SVG + gradient rather than a raster.

**Contrast** — orange #e6771a on #171616 6.04:1; glow #f78b13 on #070707 8.30:1.

## Why the verdict

A clean dark surface ladder (four measured steps) plus one luminous accent — directly transferable as a dark theme's token logic.

## Notes

Original filename: `pin-honey-e1_AfqPShyak_PfrJq5rNSE_g8jGlLRf4bOe0iwEAAmpqWjVDJpbbRR.jpg`. `kind` has no value for standalone artwork/photography; `concept` is used here to mean "not a shipped product UI" — vocabulary gap to raise with Sam.

**Related:** —
