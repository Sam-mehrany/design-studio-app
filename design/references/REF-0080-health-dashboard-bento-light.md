---
type: design-ref
id: REF-0080
title: "Health dashboard — light bento grid: workout hero, hydration, sleep, calories, weight"
source: "Pinterest board 'Health app' (private) https://de.pinterest.com/mehrani0146/health-app/ — pin https://de.pinterest.com/pin/1024498615375288340/"
kind: concept
captured: 2026-11-24
image: library/REF-0080.jpg
archetype: [J.DATA.home]
facets: [A.FAM.flat, A.POS.utilitarian, B.GRID.bento, B.DEN.moderate, B.HIER.size, B.HIER.enclosure, B.CONT.cards, B.CONT.nested, B.SPACE.rhythmic, C.PAL.polychrome, C.VAL.light-first, C.CON.high, C.SEM.layered, C.SAT.vivid, C.VIZ.sequential, C.VIZ.accent-only, C.MAT.flat, D.FACE.neo-grotesque, D.PAIR.single, D.SCALE.two-tier, D.WGT.two-step, D.NUM.tabular, D.NUM.lining, D.HERO.display-numeral, E.RAD.large, E.RAD.pill, E.DEP.border-only, E.DEP.tonal, F.IMG.photography, F.DEP.hard, F.PHOTO.full-bleed, F.ICON.line, F.ICON-SYS.single-weight, H.TONE.neutral, H.LEN.minimal, H.NUM.unit-adjacent, K.DEV.desktop, K.INPUT.pointer, K.ENV.indoor-controlled, K.ATT.interstitial, K.LOC.ltr-latin, K.A11Y.contrast]
imagery_dep: hard
rtl: clean
cost: med
verdict: adapt
confidence: med
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
concept: web
---

# REF-0080 — Health dashboard — light bento grid: workout hero, hydration, sleep, calories, weight

## Read

Values below: hex values **measured by pixel sampling** (dominant colours); type sizes estimated by eye and labelled as such. One line of context: a desktop bento dashboard on a grey page — a "Your Home Workout Starts Here!" photo hero, a blue Hydration card (2.15L/day), a Deep Sleep card, a Calories card (2.040 kCal with a segmented bar and macros), and a Weight card (82 kg with a wave chart).

**Colour.** Measured: page grey #D6D6D6, white #FFFFFF, black #000000. Each card carries its own flat colour: pale blue hero, mid-blue hydration (estimated ~#7EC8E3), white data cards, a lime "Well Done" pill (estimated ~#D9F24F). Polychrome by card, but each card is internally strict — one hue plus black/white. Colour means "which card", not status; the only status colour is the lime pill.

**Typography.** Estimated by eye: hero headline ~26 px semibold, "2.15L" ~36 px bold, "2.040" ~40 px bold tabular, "82" ~44 px bold, card titles ~15 px semibold, macro values ~14 px. Two-tier scale with a display numeral per card — five hero numbers on one screen, each in its own tile, which is the bento trade: glanceability per card, no single hero.

**Layout & harmony.** A bento grid, estimated: hero spans two columns top-left, hydration top-right, three cards in a row below (sleep, calories, weight). Inside each card the same rhythm: label row, hero numeral, viz (cup grid, segmented bar, wave chart). Hierarchy is enclosure (the grid) then size (the numerals). Density moderate; every card is a self-contained cell.

**Shape & surface.** Radius scale estimated: cards ~20–24 px, pills fully rounded, the "Start Free Trial" button a black pill with a white arrow disc. Separation is by the grey page showing between white/blue cards — tonal, no borders, no shadow. The hydration card's cup grid (24 small cup glyphs, filled vs empty) is a pictogram viz, not an icon set.

**Buttons & components.** The black "Start Free Trial" pill on the hero is the loudest control; the lime "Well Done" pill is the loudest status element. The data cards have no buttons — their components are the viz strips (cup grid, segmented calorie bar, weight wave) and the macro row (269g carbs / 164g proteins / 110g fats).

**Gradient & imagery.** No gradient. Photography is load-bearing for the hero card: the workout photo (woman in a plank with headphones) is the card's whole left half, with the headline overlaid. Delete it and the hero is a headline and a button on pale blue; the other four cards survive, so overall dependency is hard because the hero is the entry point.

**Contrast.** Computed from sampled colours: black on white #FFFFFF ≈ 21:1 — passes. Black on mid-blue ~#7EC8E3 ≈ 9:1 — passes. White on the hero photo is overlaid on a light area and is not measured — the "Explore Now" label over the photo is the riskiest text, estimated not measured. Grey secondary text (estimated ~#8A8A8A on white ≈ 3.9:1) — fails 4.5:1 for small text, estimated not measured.

## Why the verdict

Adapt: the bento grid with one hero numeral plus one viz per card is a strong, low-cost desktop-home pattern, but it is a concept render, the hero photography is load-bearing (and sits on the active brief's reject line, F.IMG.photography), and the small grey text likely fails contrast — adapt, not adopt.

## Notes

Original file: browser-download-20261124T175603.588143573Z-63-d2408cc038b3e0db2329018a1d4cf641.jpg (736x552), from Pinterest board "Health app".

**Related:** REF-0072 — the same hero-numeral-plus-viz mechanism at watch scale; REF-0071 — the same mechanism at phone scale.
