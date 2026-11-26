---
type: design-ref
id: REF-0033
title: "Fleet dashboard with cut-out truck photo and frosted detail card"
source: "Pinterest board 'dashboard-design' (mehrani0146)"
kind: concept
concept: web
captured: 2026-11-26
image: library/REF-0033.jpg
archetype: [J.DATA.home]
facets: [F.IMG.photography, E.ENV.cutout, C.PAL.single-accent, C.SAT.vivid, C.VAL.light-first, C.MAT.glass-frosted, E.DEP.live-blur, E.RAD.large, D.HERO.display-numeral, H.NUM.unit-adjacent, D.PAIR.display-text, B.CONT.cards, B.CONT.nested, K.DEV.desktop, K.LOC.ltr-latin]
imagery_dep: hard
rtl: risky
cost: high
verdict: adapt
confidence: med
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
modified: Thu 2026-11-26 1:12 PM EST (UTC-05:00)
---

# REF-0033 — Fleet dashboard with cut-out truck photo and frosted detail card

## Read

*Measured with PIL off the pin image (hex = mode of a sampled patch; text ink = strongest anti-aliased pixel in the glyph box, so small-text ratios can understate slightly; sizes are ink heights in image px, not CSS px).*

**Colour.** Light: field `#e0e0e0`, app `#eeeeee`, cards `#fefefe`. One vivid orange `#f86000` shared by the logo, the photographed container and the delay line — the accent was chosen to match the photo. Green `#30a048` for the positive chip.

**Typography.** A wide display grotesk for headings and numerals with a neutral sans for labels (display + text). Label cap 10.9, H1 22.9, stat `18` 23.9 (px). Units set small and grey beside numerals: `18/24`, `25%`, `4°C`, `40.32gal`.

**Layout & harmony.** Header, KPI tiles top-right, a large photo stage with an overlaid detail card, a vehicle carousel, then a 2×2 stat grid beside an efficiency card. Containers nest inside a framed panel.

**Shape & surface.** Large radii throughout. The Container Details card is translucent over the photo (`#feeee8` tinted by the orange behind it) — a frosted/blurred panel.

**Buttons & components.** Black pill active nav; white zoom buttons; a dark square '+' hotspot on the photo.

**Gradient & imagery.** A cut-out truck photograph is the hero; remove it and the top half of the screen is empty. Translucent card over it adds live-blur cost.

**Contrast.** Values `#000000` on white = 20.5:1; row labels `#5b5b5b` = 6.4:1. Welcome line `#818181` on `#ececec` = 3.3:1, tile labels 3.8:1, avg-delay 3.3:1, green chip text `#1a9f34` on `#e4f4e4` = 3.0:1 — **fail**.

## Why the verdict

Imagery dependency is hard and blur adds cost; the unit-adjacent stat tiles are the portable part.

## Notes

Cropped presentation frame with no device hardware → judged as web. Original filename: `pin-dashboard-design-uIYUcrvL2hQg.jpg`. Board is a hint only; concept judged from the image.

**Related:** —
