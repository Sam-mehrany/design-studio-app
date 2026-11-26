---
type: design-ref
id: REF-0058
title: "Mars phone wallpaper — tracked caps with distance line"
source: "Pinterest board 'poster' — pin https://www.pinterest.com/pin/e1_AfqPShz_upc4Y13-jsdbEzxGd3IbIjQZ9vQKcCrlWey573dTXDlb/"
kind: concept
concept: imagery
captured: 2026-11-26
image: library/REF-0058.jpg
archetype: [J.REF.imagery]
facets: [A.FAM.luxury-minimal, A.POS.premium, C.VAL.dark-first, C.PAL.monochrome, C.SAT.muted, D.FACE.geometric-sans, D.CASE.all-caps-display, D.SET.tracked-caps, D.WGT.single, D.SCALE.two-tier, B.HIER.position, B.SPACE.generous, B.DEN.sparse, F.IMG.photography, F.PHOTO.full-bleed, F.PHOTO.darkened, H.NUM.thousands-sep, H.NUM.unit-adjacent, H.LEN.minimal, K.DEV.handheld]
imagery_dep: hard
rtl: clean
cost: high
verdict: adapt
confidence: med
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
modified: Thu 2026-11-26 1:30 PM EST (UTC-05:00)
---

# REF-0058 — Mars phone wallpaper — tracked caps with distance line

## Read

**Measured** with PIL off the source file unless a line says *estimated*.

**Colour** — one warm-red family top to bottom: near-black `#0c0a11`, maroon `#421c1e`, rust `#823521` planet, highlights to `#f4a788`. Monochrome by hue.

**Typography** — thin geometric caps, very widely tracked: "MARS" over "225,000,000 KM", both light weight. Line boxes ≈34 px vs ≈17 px on a 1138 px canvas (bounding runs, may include stray stars): roughly 2:1, two tiers. Comma thousands separators, unit adjacent.

**Layout & harmony** — centred lockup at ~1/3 height, planet rising from the bottom edge, nebula top; empty middle.

**Shape & surface** — no UI shapes.

**Gradient & imagery** — full-bleed, darkened space composite; delete it and only the lockup remains.

**Contrast** — "MARS" `#fff5f6` on `#2a141b` 16.04:1; distance line `#987d81` on `#241318` 4.71:1 (passes AA by a hair; thin strokes make it read weaker).

## Why the verdict

The lockup (thin tracked caps + one numeric fact with unit) over darkened full-bleed imagery is a reusable hero/empty-state treatment; the imagery itself is heavy and not ours.

## Notes

`kind` has no value for non-design artwork or photography; filed as `concept` so it never counts as shipped evidence.

Original file: `pin-poster-e1_AfqPShz_upc4Y13-jsdbEzxGd3IbIjQZ9vQKcCrlWey573dTXDlb.jpg`.

**Related:** REF-0050 · REF-0047
