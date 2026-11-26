---
type: design-ref
id: REF-0003
title: "Phone wallpaper: black upper void, greyscale mountain range below"
source: "Pinterest board 'artistic-wallpaper' — pin https://www.pinterest.com/pin/e1_AfqPShwSyihR2wT0rpJb8J96HZ1fpK7YQ5p1bIsKeWPPNRTM24Id/"
kind: concept
concept: imagery
captured: 2026-11-26
image: library/REF-0003.jpg
archetype: [J.REF.imagery]
facets: [C.VAL.dark-first, C.CON.high, C.PAL.neutral-only, B.DEN.sparse, B.SPACE.generous, E.EDGE.bleed, F.IMG.photography, F.PHOTO.full-bleed, F.DEP.hard, F.COST.med, K.DEV.handheld]
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

# REF-0003 — Phone wallpaper: black upper void, greyscale mountain range below

## Read

_Measured: colours are k-means clusters and region medians sampled off the image with Python/PIL; contrast ratios are WCAG 2.x computed from those measured hexes._

**Colour** — same structure as REF-0002 with all hue removed: top 57% of rows #010101 (64% of pixels), mountains in a grey ladder #212121 → #4d4d4d → #8a8a8a → #d1d1d1.

**Typography** — none.

**Layout & harmony** — black void over the upper half, image band anchored to the bottom; sparse and bottom-weighted.

**Shape & surface** — full-bleed raster with spatter texture in the image band.

**Gradient & imagery** — the photo is the only material.

**Contrast** — #d1d1d1 on #010101 = 13.67:1; #4d4d4d on black only 2.47:1, so the lower greys read as shadow.

## Why the verdict

Same mechanism as REF-0002 (reserved black UI zone, imagery in the bottom third), neutral-only version.

## Notes

Original filename: `pin-artistic-wallpaper-e1_AfqPShwSyihR2wT0rpJb8J96HZ1fpK7YQ5p1bIsKeWPPNRTM24Id.jpg`. Near-duplicate of REF-0002 — kept as its own record because the batch pre-assigned the ID; the coordinator may fold it into REF-0002. `kind` has no value for standalone artwork/photography; `concept` is used here to mean "not a shipped product UI" — vocabulary gap to raise with Sam.

**Related:** —
