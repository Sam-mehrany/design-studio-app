---
type: design-ref
id: REF-0097
title: "Mobile building-plan screen — isometric 3D floor plan render, frosted progress card with thin 67%, dark bottom sheet (RON Design)"
source: "Pinterest board 'mockup-idea' (mehrani0146)"
kind: concept
concept: mobile
captured: 2026-11-27
image: library/REF-0097.jpg
archetype: [J.CORE.detail]
facets: [A.FAM.spatial-3d, A.ERA.current, B.GRID.single-column, B.DEN.sparse, B.HIER.size, C.VAL.light-first, C.SEM.loose, C.SAT.vivid, C.MAT.glass-frosted, C.MAT.gradient-subtle, D.FACE.geometric-sans, D.HERO.display-numeral, D.WGT.two-step, E.RAD.large, E.RAD.pill, E.DEP.live-blur, E.ENV.tonal-field, F.IMG.render-3d, F.ILL.isometric, F.3D.rendered-real, F.DEP.hard, F.COST.high, K.DEV.handheld, K.INPUT.touch, K.LOC.ltr-latin]
imagery_dep: hard
rtl: risky
cost: high
verdict: adapt
confidence: med
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
modified: Fri 2026-11-27 12:45 PM EST (UTC-05:00)
medium: flat-ui
platform: mobile
---

# REF-0097 — Mobile building-plan screen — isometric 3D floor plan render, frosted progress card with thin 67%, dark bottom sheet (RON Design)

## Nature

A whole phone screen, flat, with a 3D floor plan inside the UI.

*Nature backfilled by Hark, 27 Nov 2026, from the image.*

## Read

Measured: hex values and WCAG ratios sampled from the original file with Python/PIL (median of a region for grounds, extreme-luminance pixels for text, so anti-aliasing can pull a ratio slightly low); cap heights by row profiling where stated. Anything marked *estimated* was read by eye. These pins are ~564px wide, so small UI text is only 3–6px tall in the file; its sampled ratio reads lower than the designed colour would, and is flagged where that matters.

**Colour.** Light: phone screen `#f0f0f0`, chips `#f7f7f7`, frosted card `#e4e3e1`. Two warm accents: orange `#ff5001` (status dot, Furnishing tab) and amber `#febf00` (Finishing tab), plus a peach-to-orange gradient at the screen foot (`#e5dcc3`). Dark sheet `#2e2e2e`. Wood tones `#725239` come from the render.

**Typography.** Geometric sans. Measured: "67%" glyph run 17px in a thin weight, title 11px, chip and card labels ~5–8px. Thin display numeral against regular labels — weight and size both rank.

**Layout & harmony.** Single column: nav (back / title / more), two chips, a full-bleed isometric plan with one floating frosted card, a dark bottom sheet with stage tabs. Sparse; size ranks.

**Shape & surface.** Large radii on card and sheet, pill chips; frosted glass over the render (live blur).

**Buttons & components.** Arrow affordances on card and sheet; stage tabs as coloured segments.

**Gradient & imagery.** The 3D plan is the content and the screen's reason to exist (hard), and expensive to render.

**Contrast.** "67%" `#3d3d3d` on `#f1f1f1` = 9.60:1; title 6.19:1; card label 4.25:1 — fails narrowly; card date `#ababaa` = 1.98:1 — fails; chip text 2.80:1 — fails; sheet micro 3.12:1 — fails. White on the orange would be 3.28:1.

## Why the verdict

Thin hero numeral on a frosted card over a 3D model is a striking detail screen, but it lives or dies on the render. Concept (date typo "20204") → adapt, med.

## Notes

Original file: `pin-mockup-idea-1024498615378162277.jpg`. Pin: https://www.pinterest.com/pin/1024498615378162277/ — outbound link: https://rondesignlab.com/. Pin description: Formify mobile interface — interactive 3D building plans with project updates (RON Design Lab). Phone shown flat on plain grey with no environment, saved for the UI, so `mobile` rather than mockup. Same studio as REF-0069.

**Related:** REF-0069
