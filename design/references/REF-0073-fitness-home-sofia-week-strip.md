---
type: design-ref
id: REF-0073
title: "Fitness home — 'Hi, Sofia', week strip, steps chart, trending workouts"
source: "Pinterest board 'Health app' (private) https://de.pinterest.com/mehrani0146/health-app/ — pin https://de.pinterest.com/pin/1024498615375290474/"
kind: concept
captured: 2026-11-24
image: library/REF-0073.jpg
archetype: [J.DATA.home]
facets: [A.FAM.dark-athletic, A.POS.performance, B.GRID.single-column, B.DEN.moderate, B.HIER.size, B.HIER.enclosure, B.CONT.cards, B.CONT.nested, B.SPACE.rhythmic, B.REACH.bottom-primary, C.PAL.single-accent, C.VAL.dark-first, C.CON.high, C.SEM.layered, C.SAT.vivid, C.MAT.flat, D.FACE.neo-grotesque, D.PAIR.single, D.SCALE.two-tier, D.WGT.two-step, D.NUM.tabular, D.NUM.lining, D.HERO.display-numeral, E.RAD.large, E.RAD.pill, E.DEP.tonal, E.DEP.border-only, F.IMG.photography, F.DEP.soft, F.PHOTO.full-bleed, F.ICON.line, F.ICON-SYS.single-weight, H.TONE.warm, H.LEN.minimal, H.NUM.unit-adjacent, K.DEV.handheld, K.INPUT.touch, K.INPUT.one-hand, K.ENV.gym, K.ATT.interstitial, K.LOC.ltr-latin, K.A11Y.contrast]
imagery_dep: soft
rtl: risky
cost: low
verdict: adapt
confidence: med
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
concept: mobile
---

# REF-0073 — Fitness home — "Hi, Sofia", week strip, steps chart, trending workouts

## Read

Values below: hex values **measured by pixel sampling** (dominant colours); type sizes estimated by eye and labelled as such. One line of context: a phone home screen — greeting with avatar and bell, a Mon–Sun strip with Fri 12 highlighted, a "Recent Activity" steps card with a lime bar chart, Calories/Durations ring cards, and two "Trending Workout" photo cards over a tab bar.

**Colour.** Measured: black field #0E0C0F, card surface #28282A, page #FAFAFA outside the phone, lime accent (estimated ~#D9F24F). Lime means "today / active / progress": the Fri 12 day cell, the steps bars, the Home tab. Two small secondary hues break the single-accent rule — an orange flame for Calories and a blue ring for Durations — so semantics are layered, not strict.

**Typography.** Estimated by eye: greeting ~18 px semibold, section titles ~18 px semibold, "3246 steps" ~16 px semibold, day numerals ~15 px, tab labels ~12 px. Two-tier scale but a flat one — no display numeral; the steps bar chart, not a number, is the hero. Numerals are tabular in the day strip and lining in the values.

**Layout & harmony.** Single column, estimated: ~18 px side padding, cards ~16 px radius, ~14 px gaps. Hierarchy is enclosure (the steps card is the biggest container) then size. The week strip is a 7-cell row with the active day as a lime pill; the Calories/Durations pair is a 2-up nested row inside the same flow. Density moderate.

**Shape & surface.** Radius scale estimated: cards ~16–20 px, the day pill fully rounded, rings ~3 px stroke. Separation is tonal (card #28282A on field #0E0C0F) with no shadow. The bottom tab bar is a darker tonal strip with a lime active state — icon plus label, never icon alone.

**Buttons & components.** No primary CTA on this screen; the loudest elements are the lime steps bars and the active-day pill. The two photo cards at the bottom are browse objects with no visible action. The chevrons on each activity card signal drill-in, quietly.

**Gradient & imagery.** No gradient. Two workout photos anchor the bottom of the screen; delete them and the home still reads (greeting, strip, activity cards all survive), so dependency is soft — but the photos are the only warm material on an otherwise black-and-lime screen.

**Contrast.** Computed from sampled colours: white on black #0E0C0F ≈ 19.1:1 — passes. Lime ~#D9F24F on black ≈ 15:1 — passes. Grey secondary text (estimated ~#8A8A8A on #0E0C0F ≈ 5.5:1) — passes, estimated not measured. The orange flame and blue ring are small icons, not text, so their contrast is not a text failure.

## Why the verdict

Adapt: the week-strip-plus-activity-cards home is a solid, low-cost, glanceable pattern, but it is a staged concept phone render, the two extra status hues (orange, blue) dilute the single-accent discipline, and the Mon–Sun strip reads left-to-right so RTL is risky — adapt, not adopt.

## Notes

Original file: browser-download-20261124T175142.756714868Z-56-071dc430223a88f8732cca48879b5d7c.jpg (800x1202), from Pinterest board "Health app".

**Related:** REF-0069 · REF-0070 · REF-0071 — dark-first lime-accent fitness screens in this batch.
