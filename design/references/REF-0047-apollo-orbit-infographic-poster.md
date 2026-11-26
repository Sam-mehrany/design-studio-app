---
type: design-ref
id: REF-0047
title: "Apollo programme infographic poster, gold hairline orbits on black"
source: "Pinterest board 'poster' — pin https://www.pinterest.com/pin/e1_AfqPShyMUsRUsEuYwMwUOpYf6rLfBKvdNtvS-K4akH2rfASgfdzG/"
kind: print
concept: imagery
captured: 2026-11-26
image: library/REF-0047.png
archetype: [J.REF.imagery]
facets: [A.FAM.print-poster, A.FAM.swiss, A.POS.premium, A.ERA.current, B.GRID.canvas, B.HIER.size, B.SPACE.generous, B.DEN.moderate, C.VAL.dark-first, C.PAL.single-accent, C.SAT.muted, C.CON.high, C.MAT.flat, D.FACE.geometric-sans, D.CASE.all-caps-display, D.CASE.all-caps-label, D.SET.tracked-caps, D.SCALE.dramatic, E.STROKE.hairline, E.DEP.flat, E.TEX.none, F.IMG.data-as-image, F.IMG.photography, F.ILL.technical-diagram, F.ICON.line, H.LEN.minimal, H.TONE.technical, H.VOCAB.domain-real, K.DEV.print]
imagery_dep: soft
rtl: risky
cost: low
verdict: adapt
confidence: med
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
modified: Thu 2026-11-26 1:30 PM EST (UTC-05:00)
---

# REF-0047 — Apollo programme infographic poster, gold hairline orbits on black

## Read

**Measured** with PIL off the source file unless a line says *estimated*.

**Colour** — ground is pure `#000000` (74% of the frame); the only accent is a warm gold `#fccc85` used for every orbit path, the title and the side icons. Secondary text is near-white `#fcf4f4`. One hue, no semantic colours: gold means "the subject", white means "the data".

**Typography** — geometric sans (Futura/Avenir lineage, *estimated* from the letterforms), all caps, widely tracked. Title "APOLLO" cap height 70 px against 11 px timeline labels on a 4176 px canvas: a ≈6.4× jump with nothing in between, a two-level scale.

**Layout & harmony** — vertical symmetry: Moon top, Earth bottom, figure-eight trajectories between them, mission lists flanking left and right, a dense timeline table across the foot. Hierarchy comes from size and position, not colour.

**Shape & surface** — all hairline strokes (≈1–2 px at source), flat, no fills or shadows; the trajectory curves and the icon strokes are one weight family.

**Gradient & imagery** — two small planet photographs are the only raster; everything else is vector line work. Delete the photos and the diagram still reads.

**Contrast** — gold `#fccc85` on black 14.11:1; timeline text `#fcf4f4` on black 19.39:1. No failures; the risk is the 11 px label size, not the ratio.

## Why the verdict

Hairline-gold-on-black data drawing is a transferable dark-theme data-viz finish and costs nothing to render; it is a print piece with no interaction states, so `adapt`, not `adopt`.

## Notes

Saved for the trajectory-as-graphic treatment. The timeline reads left-to-right chronologically, which is why `rtl: risky` despite the symmetric centre.

Closest siblings in this batch: REF-0051 (orbits as data on black).

Original file: `pin-poster-e1_AfqPShyMUsRUsEuYwMwUOpYf6rLfBKvdNtvS-K4akH2rfASgfdzG.png`.

**Related:** REF-0051 · REF-0058
