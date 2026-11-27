---
type: design-ref
id: REF-0064
title: "Over-the-shoulder monitor mockup — credit-score dashboard, bento cards over blurred colour blob, dark lower half"
source: "Pinterest board 'mockup-idea' (mehrani0146)"
kind: concept
concept: mockup
captured: 2026-11-26
image: library/REF-0064.jpg
archetype: [J.DATA.home]
facets: [A.FAM.glassmorphism, A.ERA.current, A.POS.premium, B.GRID.bento, B.DEN.moderate, B.HIER.size, B.CONT.cards, C.PAL.neutral-only, C.SEM.loose, C.MAT.gradient-mesh, C.MAT.glass-frosted, D.FACE.geometric-sans, D.HERO.display-numeral, D.WGT.two-step, D.NUM.proportional, E.RAD.large, E.RAD.pill, E.DEP.tonal, E.DEP.live-blur, F.ICON.line, F.IMG.data-as-image, F.IMG.photography, F.DEP.soft, F.COST.high, E.ENV.staged, K.DEV.desktop, K.INPUT.pointer, K.ATT.glance]
imagery_dep: soft
rtl: risky
cost: high
verdict: adapt
confidence: low
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
modified: Thu 2026-11-26 1:40 PM EST (UTC-05:00)
medium: photo
platform: desktop
---

# REF-0064 — Over-the-shoulder monitor mockup — credit-score dashboard, bento cards over blurred colour blob, dark lower half

## Nature

Over-the-shoulder monitor with a person in frame → photographed.

*Nature backfilled by Hark, 27 Nov 2026, from the image.*

## Read

Measured: hex values and WCAG ratios sampled from the original file with Python/PIL (median of a region for grounds, extreme-luminance pixels for text, so anti-aliasing can pull a ratio slightly low); cap heights by row profiling where stated. Anything marked *estimated* was read by eye.

**Colour.** Upper half light: field `#dfe1e2`, cards `#ffffff`, black controls `#0e0e0e`; a blurred orange/blue blob (`#cda149` core) sits behind the card grid and tints the first card. Lower half flips to `#0d0d0d` with frosted offer cards picking up hue from what is behind them (`#5c7065`). A red notification dot is the only semantic colour. Colour is decoration more than meaning.

**Typography.** Geometric sans throughout. Measured cap heights on the 1024px original: hero "832" 28px, "Health Karma" heading 15px, card label 6px — hero-to-heading 1.9×, hero-to-label 4.7×. Card values (9, 100, 0, 4, 12) are the second tier, set large with a small unit beside them. Proportional numerals (*estimated*).

**Layout & harmony.** Left column hero score + gauge + two summary cards; right a 3×2 bento of equal tiles each with icon, label, value and a micro-chart; pill tab group centred in the header. Moderate density; size ranks. Radii and the black circular arrow buttons repeat on every tile, so it reads as one family.

**Shape & surface.** Large card radius (~20px, *estimated*), pill tabs and chips, circular icon buttons. Depth by tone (white on light grey) plus live blur on the lower cards — no drop shadows.

**Buttons & components.** Black 20px circular "↗" button top-right of every tile (`#0e0e0e`), pill segmented tabs with a black active state. Loud relative to the data: twelve identical black dots compete with the numbers.

**Gradient & imagery.** Mesh-like blob behind glass is the signature; remove it and the grid still works (soft). Micro-charts are data-as-image.

**Contrast.** Hero `#000100` on `#dadcdc` = 15.2:1; card label `#262626` on white = 14.5:1; micro label "Excellent / Checked daily" `#a6a6a6` on `#dce0e0` = 1.83:1 — fails badly.

## Why the verdict

Bento tile anatomy (label, big value, micro-chart, one action) is a sound dashboard mechanism; the blob-behind-glass finish is high-cost and the micro labels fail contrast. Concept redesign → adapt, low confidence.

## Notes

Original file: `pin-mockup-idea-msv1R438900Q.jpg`. A redesign concept of a real brand (credit-score product), not the shipped UI. Concept vs UI: saved to a mockup board and shown with two silhouetted viewers, so filed as mockup; the UI is legible enough that it could equally be read as a dashboard reference.

**Related:** —
