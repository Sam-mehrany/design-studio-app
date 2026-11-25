---
type: design-ref
id: REF-0071
title: "Running stats — three-phone dark set, lime gauges and route map"
source: "Pinterest board 'Health app' (private) https://de.pinterest.com/mehrani0146/health-app/ — pin https://de.pinterest.com/pin/1024498615375290496/"
kind: concept
captured: 2026-11-24
image: library/REF-0071.jpg
archetype: [J.DATA.trend, J.DATA.home]
facets: [A.FAM.dark-athletic, A.POS.performance, B.GRID.split, B.DEN.dense, B.HIER.size, B.HIER.enclosure, B.CONT.seams, B.SPACE.tight, C.PAL.single-accent, C.VAL.dark-first, C.CON.high, C.SEM.strict, C.SAT.vivid, C.MAT.flat, D.FACE.neo-grotesque, D.PAIR.single, D.SCALE.two-tier, D.WGT.two-step, D.NUM.tabular, D.HERO.display-numeral, D.HERO.in-gauge, E.RAD.large, E.RAD.pill, E.DEP.tonal, E.DEP.border-only, F.IMG.photography, F.DEP.soft, F.PHOTO.full-bleed, F.ICON.line, H.TONE.terse, H.LEN.minimal, H.NUM.unit-adjacent, K.DEV.handheld, K.INPUT.touch, K.ENV.gym, K.ATT.glance, K.LOC.ltr-latin, K.A11Y.contrast]
imagery_dep: soft
rtl: clean
cost: low
verdict: adapt
confidence: med
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
concept: mockup
---

# REF-0071 — Running stats — three-phone dark set, lime gauges and route map

## Read

Values below: hex values **measured by pixel sampling** (dominant colours); type sizes estimated by eye and labelled as such. One line of context: three phones side by side — a "Morning, Steve" cover over a running photo, a "Current State" gauge screen (75, 220, 40, 10,58, 80), and a route-map screen with a 40:28:02 timer.

**Colour.** Measured: near-black field #0C0C0C, mid greys #3F3F3F–#5A5A5A, lime accent (estimated ~#B8E62E, the gauge arc and route line). One accent only: it draws the gauge arc, the route polyline, the play button and the bottom progress bar. Everything else is monochrome grey on black.

**Typography.** Estimated by eye: "Morning, Steve" ~28 px light, gauge numeral "75" ~40 px, stat numerals ~16–18 px tabular, timer "40:28:02" ~30 px tabular. Two-tier scale — one display numeral per phone, the rest a single dense tier. Numerals are tabular; the timer is the clearest tabular case in this batch.

**Layout & harmony.** Three phones in a row, each a single column. Left: photo top, title and two lime pill buttons bottom. Middle: gauge top, a 2×3 stat grid, a segmented bar row, a bottom control row. Right: map top (~55% of the screen), timer and a 3-stat row, play button. Hierarchy is size (the one big numeral) then position; density is the highest of the fitness pins here.

**Shape & surface.** Radius scale estimated: phone frames ~40 px, pills fully rounded, gauge arc ~8 px stroke. Separation is tonal and by hairline only; no shadow, no borders on the stat cells. The route map is a lime polyline on black — data as image.

**Buttons & components.** The lime circular play button on the right phone is the loudest control; the two lime pills on the left phone ("Start" style) are the loudest there. The middle phone's bottom row is a set of small circular icon buttons, quieter than the data — the data, not the controls, leads on that screen.

**Gradient & imagery.** No gradient. One full-bleed running photo on the left phone (with a dark scrim for the title) — delete it and that phone is a title plus two buttons, so the photo is decorative-but-structural there; the other two phones survive without imagery, so overall dependency is soft. The route polyline and gauge are vector data, not imagery.

**Contrast.** Computed from sampled colours: white on black #0C0C0C ≈ 19.3:1 — passes. Lime ~#B8E62E on black ≈ 13:1 — passes. Small grey stat labels (estimated ~#8F8F8F on #0C0C0C ≈ 6:1) — pass, estimated not measured.

## Why the verdict

Adapt: the one-numeral-per-screen gauge/trend system with tabular figures is exactly the glanceable mechanism worth stealing, but this is a staged three-phone concept shot with a photo-led cover phone, so adapt, not adopt.

## Notes

Original file: browser-download-20261124T175019.977605990Z-54-929996ce4f3cf928a6114899bd6aa324.jpg (400x300 — low resolution; type sizes and the small stat values are estimated, not measured), from Pinterest board "Health app".

**Related:** REF-0069 · REF-0070 · REF-0073 — dark-first lime-accent fitness screens in this batch.
