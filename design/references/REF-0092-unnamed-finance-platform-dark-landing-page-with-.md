---
type: design-ref
id: REF-0092
title: "Unnamed finance platform — Dark landing page with budget card and green data tiles"
source: "Uploaded screenshot Screenshot_2026-11-25_045220.png — analysed by Muse"
kind: concept
captured: 2026-11-25
image: library/REF-0092.png
archetype: [J.ACQ.landing]
facets: [A.FAM.editorial, B.GRID.columnar, B.HIER.size, B.HIER.enclosure, B.CONT.cards, B.SPACE.generous, B.FLOW.z, C.PAL.monochrome, C.VAL.dark-first, C.VAL.tonal-layered, C.CON.high, C.SAT.muted, C.VIZ.sequential, D.FACE.neo-grotesque, D.SCALE.two-tier, D.HERO.display-numeral, D.NUM.lining, E.RAD.small, E.DEP.tonal, F.IMG.photography, F.IMG.data-as-image, F.IMG.ui-as-image, H.NUM.thousands-sep, K.DEV.desktop]
imagery_dep: soft
rtl: risky
cost: med
verdict: adapt
confidence: med
status: unreviewed
sam_reaction: 
sam_note: 
tags: [design/ref]
concept: web
---

# REF-0092 — Unnamed finance platform — Dark landing page with budget card and green data tiles

## Read

**Colour.** Field is near-black #010101 across the page, with three raised tones — #0e0e0e testimonial cards, olive #2e3d13 and mid-green #225222 data tiles — doing all the depth work; the only hue is green, in a single-hue value range, used as large flat fills rather than as an accent or a semantic signal. The page is a finance-platform landing. White type on the field measures 19.3:1; white on olive 11.71:1, on green 9.14:1.

**Typography.** One neutral neo-grotesque sans throughout, single family, regular body against semibold display numerals. Headline lines measure ~28px tall against ~13px body at the 907px image width, a display-to-body multiple of about 2× with a separate compact UI scale — a two-tier scale. Numerals are lining Latin figures with thousands separators ($50,734, $60,764) and fixed two-decimal precision in the data tiles ($45,676.90).

**Layout & harmony.** Columnar grid: full-bleed satellite-map hero, then a two-column split (headline left, budget card right), then two equal green tiles, then a three-column testimonial row. Hierarchy is carried by size first and by enclosure second — the headline dominates, everything else sits inside a card or tile. Generous black voids separate the sections; the reading flow is a left-to-right Z-pattern.

**Shape & surface.** Small radius throughout, about 4px on cards and tiles. Depth is tonal, not shadow: surfaces step up in lightness (#010101 → #0e0e0e → #2e3d13 → #225222) with hairline borders on the dark budget card; no drop shadows and no elevation system beyond tone. Surfaces are flat, with no texture.

**Buttons & components.** No primary call-to-action is visible in the crop. The only controls are circular white icon-only arrow buttons sitting on the budget and customization cards — carousel controls, dark arrow on a white disc. The component inventory is display-led: a budget-usage card with a segmented Unused/Used/Reserved bar and a transaction table with avatars, two data tiles with charts, and three testimonial cards.

**Gradients & imagery.** No gradients; every surface is a flat fill. Imagery is a full-bleed satellite photograph as the hero and small avatar photographs in the transaction table and testimonials. The charts are the visual interest inside the tiles: a single-hue dot-matrix waffle in the olive card and a white bar chart on the green card. Removing the satellite photo leaves a black hero band, but the type, cards and charts still stand.

**Contrast.** Measured pairs all pass 4.5:1: headline grey #808080 on #010101 is 5.29:1, body #9a9a9a on #010101 is 7.42:1, white on olive 11.71:1, white on green 9.14:1, white on #0e0e0e 19.3:1. The smallest micro-labels (legend and table captions) cannot be measured reliably from this capture, so their exact ratios cannot be determined.

## Why the verdict

Concept, not shipped: the data is placeholder — $45,676.90 repeats identically for two categories and $1,072.98 twice in the transaction table — so adopt is out. The dark tonal system and the embedded-dashboard-card landing mechanism transfer, while the satellite hero is decorative (soft imagery dependency) and the arrows, charts and table need RTL rework, so the verdict is adapt.

## Notes

A 'Muse finished' notification toast sits at top right — an artifact of the screen capture, not part of the design. $45,676.90 appears identically for Rent & Utilities and Groceries, and $1,072.98 twice in the transaction table, marking the data as placeholder. No vocabulary term exists for a capture-artifact overlay; nothing else in the vocabulary was missing.
