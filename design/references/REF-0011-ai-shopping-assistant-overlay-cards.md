---
type: design-ref
id: REF-0011
title: "AI shopping assistant — overlay result cards on product photo"
source: "Pinterest pin https://de.pinterest.com/pin/1024498615378071319/ — board 'Component Design Idea' (mehrani0146)"
kind: concept
captured: 2026-11-24
image: library/REF-0011.jpg
archetype: [J.CORE.search, J.OPS.messaging]
facets: [A.FAM.fashion-editorial, A.FAM.flat, B.GRID.single-column, B.DEN.moderate, B.HIER.size, B.HIER.position, B.CONT.cards, B.CONT.nested, B.SPACE.rhythmic, C.PAL.monochrome, C.VAL.dark-first, C.CON.high, C.SAT.vivid, D.FACE.neo-grotesque, D.SCALE.dramatic, D.WGT.high-contrast, D.CASE.sentence, D.NUM.proportional, E.RAD.large, E.DEP.tonal, E.DEP.flat, F.IMG.photography, F.PHOTO.full-bleed, F.DEP.hard, H.LEN.helper, H.TONE.neutral, K.DEV.desktop, K.LOC.ltr-latin]
imagery_dep: hard
rtl: risky
cost: low
verdict: adapt
confidence: med
status: reviewed
sam_reaction: like
sam_note:
tags: [design/ref]
concept: component
---

# REF-0011 — AI shopping assistant — overlay result cards on product photo

## Read

Values below were **measured by sampling pixels** (hex values and WCAG ratios computed from sampled colours); type sizes are estimated by eye and labelled as such. One line of context: a concept for an AI shopping assistant — three black result cards stacked over a full-bleed photo of a red jacket, answering where to buy it and at what size, shipping time and price.

**Colour.** Measured: black cards #110F10, red jacket #ED4947, grey pill #717171, off-white page #F6F6F6. The interface itself is monochrome — black cards, white text, grey pills — and the only saturated colour is the photograph. Colour therefore does not code anything in the UI; the red is content, not interface.

**Typography.** Estimated by eye: retailer names at about 40–48 px medium ("Moncler.com", "Farfetch.com"), assistant body at about 20–22 px, the result line "2-3 days (DHL express)" at about 36–40 px with the key tokens ("XL", "Ssence.com") at semibold, pills at about 18–20 px. Retailer-name-to-body multiple about 2.2× — a dramatic scale in which the list of shops is the headline. The face is a neo-grotesque sans; numerals are proportional lining.

**Layout & harmony.** Single column of three stacked cards, estimated by eye, each about 24–32 px apart, offset to the right so the jacket stays visible on the left. Hierarchy is ranked by size (retailer names first), then by position (the answer card last, at the bottom). Spacing inside the cards is one rhythm (about 16–24 px), and all three cards share the same radius and padding.

**Shape & surface.** Estimated radius scale, by eye: cards about 28–32 px, pills ("Open chat", "Size", "Show more (2)", "Buy now") fully round at about 20–24 px height. Separation is tonal: black cards on the red photo and white page, with no border and no shadow — the cards read because black against red and white is a maximum-value step.

**Buttons & components.** The loudest controls are the white "Open chat" pill (top-right of the first card) and the grey-green "Buy now" pill (bottom of the last card); the "Size" dropdown and "Show more (2)" pills are quieter grey. Relative to the data, the buttons are secondary — the retailer names at 40+ px outweigh every control — which is correct for a results list but leaves the primary action ("Buy now") visually smaller than the content above it.

**Gradient & imagery.** No gradient. The imagery is a full-bleed product photograph that fills the left two-thirds of the frame, and the composition collapses without it: the black cards would float on a white page with nothing to anchor them, and the "from your picture" premise would have no referent. Imagery dependency is hard.

**Contrast.** Measured: white on black #110F10 is 19.1:1 — passes. White on grey pill #717171 is about 4.9:1 — passes 4.5:1, with little margin for its size. White on red #ED4947 would be 3.72:1 and fails, but no white text sits on the red. Black on the white "Open chat" pill passes at about 18:1.

## Why the verdict

Adapt: the stacked black result-card mechanism over a photo is cheap (flat colour, type, no blur) and the type scale is the transferable idea, but the composition is hard-dependent on photography and the cards are left-anchored to the photo, so it is RTL-risky and cannot be adopt as a pattern.

## Notes

Original file: browser-download-20261124T151803.104908733Z-5-8319db989faa224ff457c22880824573.jpg (2149x2400), from Pinterest board "Component Design Idea". Pin title is an Are.na image reference ("2fba8c3c9caf101caecf63.webp | Are.na").

**Related:** REF-0006 (photo-led shipped screen) — contrast: here the photo is load-bearing, there it is decorative.
