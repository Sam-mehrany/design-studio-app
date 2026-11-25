---
type: design-ref
id: REF-0017
title: "Card UI Concept — glass feature cards (Nexsas)"
source: "Pinterest pin https://de.pinterest.com/pin/1024498615378071294/ — board 'Component Design Idea' (mehrani0146)"
kind: concept
captured: 2026-11-24
image: library/REF-0017.jpg
archetype: [J.ACQ.feature]
facets: [A.FAM.glassmorphism, A.FAM.fluent, B.GRID.modular, B.DEN.moderate, B.HIER.position, B.CONT.cards, B.CONT.nested, B.SPACE.generous, C.PAL.single-accent, C.VAL.light-first, C.VAL.tonal-layered, C.CON.moderate, C.SAT.vivid, C.MAT.gradient-subtle, D.FACE.transitional-serif, D.PAIR.display-text, D.SCALE.dramatic, D.WGT.two-step, D.CASE.title, D.NUM.proportional, E.RAD.large, E.DEP.live-blur, E.DEP.tonal, F.IMG.none, F.DEP.none, F.ICON.line, K.DEV.desktop, K.LOC.ltr-latin]
imagery_dep: none
rtl: risky
cost: high
verdict: adapt
confidence: med
status: reviewed
sam_reaction: like
sam_note:
tags: [design/ref]
concept: component
---

# REF-0017 — Card UI Concept — glass feature cards (Nexsas)

## Read

Values below were **measured by sampling pixels** (hex values and WCAG ratios computed from sampled colours); type sizes are estimated by eye and labelled as such. One line of context: a marketing shot for a card UI — three tilted, overlapping glass feature cards (plus a phone mock) on a peach-cream page, under an italic serif "Card UI Concept" title.

**Colour.** Measured: cream page #F1ECE9, orange glow sampled at #CF5C23. One accent family (orange) inside the dark centre card's glow; the outer cards are frosted grey-beige, and the page is warm cream. The orange carries emphasis, not status; there is no second hue and no semantic colour.

**Typography.** Estimated by eye: title "Card UI Concept" at about 72–84 px italic transitional serif, card headlines at about 22–26 px medium ("Native sync. zero friction.", "Work where you are."), card body at about 15–17 px, pills at about 13–14 px. Title-to-body multiple about 4.5× — the most dramatic scale in this batch. The serif display face is paired with a grotesque sans for card copy (a display-text pairing).

**Layout & harmony.** Three overlapping cards tilted at roughly −8°, 0° and +10°, estimated by eye, fanned across the centre with the title above and generous cream margins around. Hierarchy is ranked by position and overlap (the dark centre card first, the frosted cards behind it), not by size — the title is largest but the centre card is the subject. Spacing is loose; the overlap is the composition.

**Shape & surface.** Estimated radius scale, by eye: cards about 28–36 px, icon tiles about 12–16 px with rounded squares, pills fully round. Separation is by live blur and tone: frosted translucent panels over the cream page and over each other, with a light edge highlight on the top card. No border, no drop shadow — the blur is the depth cue.

**Buttons & components.** The only controls are small pills ("Deep Search", "Add More details") and white icon tiles (cloud-sync, laptop, network glyphs) — all quiet, all secondary to the card headlines. Relative to the data, the icon tiles outweigh the pills: the tiles are the visual anchors of each card, while the pills read as captions.

**Gradient & imagery.** The dark centre card carries an orange-to-black gradient glow, and the page has a faint peach wash; the frosted cards have no gradient of their own. No photography and no illustration beyond the line icons. Removing the glow would flatten the centre card into a dark rectangle, but the cards, titles and pills would still read — the imagery dependency is none, the gradient is decorative.

**Contrast.** Measured: black on cream #F1ECE9 is 16.11:1 — passes. White on orange #CF5C23 is 4.03:1 — fails 4.5:1, and white card text does sit on orange-glow areas of the centre card, so this is a measured failure for small white copy. The white text on the frosted cards, estimated by eye against a mid-beige frost of about #C9B8AE (roughly 2.5:1 estimated — fails, estimated, not measured), is the weakest pair in the frame.

## Why the verdict

Adapt: the fanned glass-card composition is the transferable idea, but the cost is high (live blur, gradients, rotation), the frosted white text fails contrast, and both glassmorphism and live blur sit on the active brief's reject line (DDR-0001 rules live blur out on constrained targets) — so adapt, never adopt as-is.

## Notes

Original file: browser-download-20261124T151958.779789746Z-11-36627df7070e73c418c398b041bb6fd5.jpg (3240x4050), from Pinterest board "Component Design Idea". Pin title: "Framer, Astro & Next.js Templates — Pixels71"; image credit "staticmania" in the corner.

**Related:** REF-0007 (feature cards as marketing) — this is the glass/tilted member; REF-0007 is the flat/technical member.
