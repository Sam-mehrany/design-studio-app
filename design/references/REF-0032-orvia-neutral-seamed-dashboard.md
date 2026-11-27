---
type: design-ref
id: REF-0032
title: "Neutral greyscale admin dashboard with seamed tiles and gauges"
source: "Pinterest board 'dashboard-design' (mehrani0146)"
kind: concept
concept: web
captured: 2026-11-26
image: library/REF-0032.png
archetype: [J.DATA.home]
facets: [C.PAL.neutral-only, C.SEM.strict, C.CON.low, C.VAL.light-first, B.CONT.seams, B.GRID.modular, B.DEN.dense, E.STROKE.hairline, E.DEP.border-only, E.ACC.badge, E.TEX.pattern, D.FACE.neo-grotesque, D.HERO.in-gauge, F.ICON.line, F.IMG.photography, K.DEV.desktop, K.LOC.ltr-latin]
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

# REF-0032 — Neutral greyscale admin dashboard with seamed tiles and gauges

## Nature

A whole admin dashboard, flat.

*Nature backfilled by Hark, 27 Nov 2026, from the image.*

## Read

*Measured with PIL off the pin image (hex = mode of a sampled patch; text ink = strongest anti-aliased pixel in the glyph box, so small-text ratios can understate slightly; sizes are ink heights in image px, not CSS px).*

**Colour.** Near-neutral blue-grey ladder: field `#f4f6f8`, app `#f8f8f8`, tiles `#f4f4f4`, hatched chart area `#e8ecf0`; black `#000000` only for the active nav item and chart marks. Hue appears only in status badges: green `#207058` Delivered, blue `#2040a8` Shipped, amber `#d09068` Processing.

**Typography.** Neo-grotesque, small. Nav cap 6, tile label 9, gauge value 19 (px): value ≈ 2.1× label. Values sit under gauge arcs.

**Layout & harmony.** Sidebar + seamed modular grid: four KPI tiles divided by hairlines, two chart tiles, two list tiles. Dense, little padding; seams rather than cards.

**Shape & surface.** Hairline borders do all the separating; minimal radius on the frame; pills on status badges and 'View All'.

**Buttons & components.** Almost no buttons; status as tinted pill badges with coloured text (`#386759` on `#d8ece8` = 5.3:1).

**Gradient & imagery.** Diagonal hatching in the revenue chart; avatars and product photos as small thumbnails.

**Contrast.** Values `#000000` on `#f0f4f4` = 19.0:1; meta `#515352` = 7.0:1. Nav `#747474` = 4.4:1, axis `#707372` = 4.3:1, table heads 4.2:1 — all just **under** 4.5:1; chart lines are paler still.

## Why the verdict

Seams-over-cards and status-only hue are clear mechanisms; the whole thing runs a notch too pale, so adapt.

## Notes

Concept tell: 'Dashbaord' typo in nav. Credited 'Juice Lab'. Original filename: `pin-dashboard-design-r1yxDiEoPuag.png`. Board is a hint only; concept judged from the image.

**Related:** —
