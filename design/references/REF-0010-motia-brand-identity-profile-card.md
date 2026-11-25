---
type: design-ref
id: REF-0010
title: "Motia — brand identity social profile card"
source: "Pinterest pin https://de.pinterest.com/pin/1024498615378071321/ — board 'Component Design Idea' (mehrani0146)"
kind: brand
captured: 2026-11-24
image: library/REF-0010.jpg
archetype: [J.ACQ.profile-public]
facets: [A.FAM.spatial-3d, A.FAM.fluent, B.GRID.single-column, B.DEN.sparse, B.HIER.size, B.CONT.cards, B.SPACE.generous, C.PAL.single-accent, C.VAL.dark-first, C.VAL.tonal-layered, C.CON.high, C.SAT.vivid, C.MAT.gradient-subtle, D.FACE.grotesque, D.SCALE.two-tier, D.WGT.two-step, D.CASE.sentence, D.NUM.proportional, E.RAD.large, E.DEP.tonal, E.DEP.shadow-elevation, F.IMG.none, F.DEP.none, F.ICON.solid, K.DEV.desktop, K.LOC.ltr-latin]
imagery_dep: none
rtl: clean
cost: med
verdict: adapt
confidence: med
status: reviewed
sam_reaction: like
sam_note:
tags: [design/ref]
concept: component
---

# REF-0010 — Motia — brand identity social profile card

## Read

Values below were **measured by sampling pixels** (hex values and WCAG ratios computed from sampled colours); type sizes are estimated by eye and labelled as such. One line of context: a brand-identity presentation of a social profile card — a blue glowing banner over a white bio panel, staged on a dark blue field.

**Colour.** Measured: deep blue field #060918, blue glow #091233, white bio panel #FFFFFF, with a saturated blue logo tile. One accent hue (blue) in several tonal steps — the glow, the banner and the logo are the same family at different values. No second hue and no status colour; meaning is carried by size and position.

**Typography.** Estimated by eye: wordmark "motia" at about 28–32 px light weight in the banner, name "Motia" at about 20–22 px bold in the panel, handle and bio at about 13–14 px, follower counts at about 13 px semibold. Name-to-body multiple about 1.6× — a quiet two-tier scale. The face is a grotesque sans with a light display weight for the wordmark.

**Layout & harmony.** Single column, estimated by eye: banner about 40% of the card height, logo tile overlapping the banner/panel seam, bio panel below with about 20–24 px padding. Hierarchy is ranked by size (wordmark, then name, then bio), and the card is centred on the field with generous margins on all sides. One spacing rhythm, no competing alignments.

**Shape & surface.** Estimated radius scale, by eye: card about 24–28 px, logo tile about 16 px, "Follow" pill fully round. Separation is tonal and luminous: the banner glows against the dark field, the white panel steps hard against the banner, and a soft shadow lifts the whole card off the field. No border anywhere.

**Buttons & components.** The only button is the white "Follow" pill in the banner's bottom row, beside the X / LinkedIn / butterfly icons — small, quiet, and the only white element on blue. Relative to the data it is secondary: the wordmark and the name outweigh it. The logo tile is the loudest component by area and saturation.

**Gradient & imagery.** The banner is a radial blue glow — a subtle gradient from near-black blue at the edges to a brighter blue behind the wordmark. No photography, no illustration. The glow is decorative: flatten it to solid #0A112D and the card still reads, but it loses the depth that makes the white panel feel like it is floating.

**Contrast.** Measured: white on deep blue #060918 is 19.81:1 — passes. Black on white #FFFFFF is 18.88:1 — passes. The blue link "motia.dev", estimated by eye at about #2B6CB0 on white (roughly 5:1 estimated — passes, but it is the weakest pair on the card).

## Why the verdict

Adapt: the glow-banner-over-white-panel mechanism is clean, symmetric (RTL-clean) and cheap to restage, but it is a brand presentation, not a shipped screen, and the glow is a render effect with medium cost — so adapt, not adopt. Note: the glow is a radial gradient, not live blur, so it does not hit the brief's live-blur reject line.

## Notes

Original file: browser-download-20261124T151748.267216282Z-4-292f772541f24df2722cd5392a95080e.jpg (736x920, 736x version), from Pinterest board "Component Design Idea".

**Related:** REF-0013 · REF-0015 (social profile card cluster) — this is the blue-glow member; REF-0013 is monochrome, REF-0015 is blue/halftone.
