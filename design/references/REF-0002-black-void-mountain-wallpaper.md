---
type: design-ref
id: REF-0002
title: "Phone wallpaper: black upper void, icy false-colour mountain range below"
source: "Pinterest board 'artistic-wallpaper' — pin https://www.pinterest.com/pin/e1_AfqPShwOPP5RsNlvyxHFedw-e5thpv-pm4WMmmMaAUw1xJdE_ZtV/"
kind: concept
concept: imagery
captured: 2026-11-26
image: library/REF-0002.jpg
archetype: [J.REF.imagery]
facets: [C.VAL.dark-first, C.CON.high, C.PAL.duotone, C.SAT.muted, B.DEN.sparse, B.SPACE.generous, E.EDGE.bleed, F.IMG.photography, F.PHOTO.full-bleed, F.DEP.hard, F.COST.med, K.DEV.handheld]
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

# REF-0002 — Phone wallpaper: black upper void, icy false-colour mountain range below

## Read

_Measured: colours are k-means clusters and region medians sampled off the image with Python/PIL; contrast ratios are WCAG 2.x computed from those measured hexes._

**Colour** — upper 57% of rows is flat #040404–#040405 (63.5% of pixels); the image band runs an icy blue ramp #132648 → #45566f → #8798a7 → #dadbdd with small rust-red flecks. Effectively black plus one cold ramp.

**Typography** — none.

**Layout & harmony** — vertical split: an empty black field reserves the top half (where a lock-screen clock and widgets would sit) and the mountains are anchored to the bottom ~43%. Space is the composition.

**Shape & surface** — full-bleed raster, ink-spatter texture inside the mountain band only.

**Gradient & imagery** — the processed (inverted / false-colour) photo is the content; removing it leaves a black screen.

**Contrast** — snow #dadbdd on black 14.79:1, mid ice #8798a7 6.91:1; anything placed in the void has the full black ground.

## Why the verdict

Mechanism worth adapting: a dark-first background that keeps the UI zone pure black and pushes imagery to the bottom third. The image itself is not reusable.

## Notes

Original filename: `pin-artistic-wallpaper-e1_AfqPShwOPP5RsNlvyxHFedw-e5thpv-pm4WMmmMaAUw1xJdE_ZtV.jpg`. Near-duplicate of REF-0003 (same mountain, greyscale treatment). Saved on a phone-ratio canvas (736×1308). `kind` has no value for standalone artwork/photography; `concept` is used here to mean "not a shipped product UI" — vocabulary gap to raise with Sam.

**Related:** —
