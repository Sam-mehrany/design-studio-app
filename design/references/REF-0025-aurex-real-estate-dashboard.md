---
type: design-ref
id: REF-0025
title: "Real-estate dashboard: tan progress, barcode sparklines, black pill nav"
source: "Pinterest board 'dashboard-design' (mehrani0146)"
kind: concept
concept: web
captured: 2026-11-26
image: library/REF-0025.jpg
archetype: [J.DATA.home]
facets: [A.POS.premium, A.FAM.luxury-minimal, B.CONT.cards, B.DEN.moderate, B.SPACE.generous, C.PAL.single-accent, C.SAT.muted, C.VAL.light-first, C.CON.moderate, D.FACE.neo-grotesque, D.WGT.single, D.CASE.title, H.NUM.unit-adjacent, E.RAD.large, E.RAD.pill, E.DEP.tonal, E.TEX.pattern, F.IMG.photography, F.ICON.line, K.DEV.desktop, K.LOC.ltr-latin]
imagery_dep: soft
rtl: risky
cost: low
verdict: adapt
confidence: med
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
modified: Thu 2026-11-26 1:12 PM EST (UTC-05:00)
medium: flat-ui
platform: desktop
---

# REF-0025 — Real-estate dashboard: tan progress, barcode sparklines, black pill nav

## Nature

A whole dashboard screen, flat.

*Nature backfilled by Hark, 27 Nov 2026, from the image.*

## Read

*Measured with PIL off the pin image (hex = mode of a sampled patch; text ink = strongest anti-aliased pixel in the glyph box, so small-text ratios can understate slightly; sizes are ink heights in image px, not CSS px).*

**Colour.** Near-neutral: field `#e0e0e0`, app frame `#e4e2e4`, cards `#f4f4f4`, inactive pills `#dad8da`. Black `#000000` for the active nav pill, progress bar and mini-bar tags. One muted accent, tan `#eabe92`, for the secondary progress fill, finished with a tan diagonal hatch for the remainder.

**Typography.** Neo-grotesque, single regular weight throughout — hierarchy from size and grey only. Label cap 15.0, card title 16.7, wordmark 21.9, hero value 27.0 (preview px): hero ≈ 1.8× label — a flat scale. `$` set in grey `#9e9c9d` beside the figure.

**Layout & harmony.** Two KPI blocks on a seam, then a 2×2 card grid, then a filter row and a table with photo thumbnails. Generous padding; spacing feels consistent.

**Shape & surface.** Large radii (~28px est.) on cards, full pills on nav/filters. Depth is tonal only, no shadow.

**Buttons & components.** Black pill = selected, grey pill = idle; small arrow buttons in white circles. Mini horizontal bars end in black `+10%` tags.

**Gradient & imagery.** No gradients. Property photos are small thumbnails — decoration.

**Contrast.** Values `#010000` on `#e4e0e4` = 16.1:1; labels `#525051` = 6.1:1. The grey `$` = 2.09:1 and axis numbers `#b7b7b7` = 1.82:1 — **fail**.

## Why the verdict

The neutral tonal system with one muted accent and hatch-for-remainder is transferable; concept data and failing axis contrast keep it adapt.

## Notes

Concept tell: currency formatted `$276,88.39` / `$873,42.39` (wrong grouping) — never shipped. Frame is cropped with depth-of-field blur; no device hardware, so judged as web. Original filename: `pin-dashboard-design-I9SH2M6kTmwQ.jpg`. Board is a hint only; concept judged from the image.

**Related:** —
