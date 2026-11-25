---
type: design-ref
id: REF-0013
title: "Superbrand — social profile card"
source: "Pinterest pin https://de.pinterest.com/pin/1024498615378071310/ — board 'Component Design Idea' (mehrani0146)"
kind: brand
captured: 2026-11-24
image: library/REF-0013.jpg
archetype: [J.ACQ.profile-public]
facets: [A.FAM.luxury-minimal, B.GRID.single-column, B.DEN.sparse, B.HIER.size, B.CONT.cards, B.SPACE.generous, C.PAL.monochrome, C.VAL.dark-first, C.VAL.tonal-layered, C.CON.high, C.SAT.muted, C.MAT.gradient-subtle, D.FACE.grotesque, D.SCALE.two-tier, D.WGT.two-step, D.CASE.sentence, D.NUM.proportional, E.RAD.large, E.DEP.tonal, F.IMG.none, F.DEP.none, F.ICON.solid, K.DEV.desktop, K.LOC.ltr-latin]
imagery_dep: none
rtl: clean
cost: low
verdict: adapt
confidence: med
status: reviewed
sam_reaction: like
sam_note:
tags: [design/ref]
concept: component
---

# REF-0013 — Superbrand — social profile card

## Read

Values below were **measured by sampling pixels** (hex values and WCAG ratios computed from sampled colours); type sizes are estimated by eye and labelled as such. One line of context: a brand-identity presentation of a social profile card — a silver gradient banner over a black bio panel, staged on a near-black field.

**Colour.** Measured: grey banner #D3D3D3, black card #000000, dark backdrop #020202. Strictly monochrome — no hue at all. The banner's silver gradient is the only tonal event, and it carries no meaning; hierarchy is made by value steps (silver, black, grey text) rather than by colour.

**Typography.** Estimated by eye: name "Superbrand" at about 20–22 px bold, handle at about 12–13 px grey, bio at about 13–14 px in two lines, counts at about 13 px semibold with grey labels, link at about 12–13 px. Two-tier scale, name-to-body multiple about 1.6×. The face is a grotesque sans; the star logo mark is the only non-type graphic.

**Layout & harmony.** Single column, estimated by eye: banner about 45% of the card height, logo tile overlapping the banner/panel seam, bio panel below with about 20–24 px padding. Hierarchy is ranked by size and value (white name on black first, grey bio second). Density is low, spacing is one rhythm, and the card is centred with large margins — the restraint is the point.

**Shape & surface.** Estimated radius scale, by eye: card about 20–24 px, logo tile about 16 px with a black star mark, "Follow" pill fully round. Separation is tonal: black panel on a near-black field, distinguished by the silver banner and a faint edge. No border, no shadow; the banner gradient does the lifting.

**Buttons & components.** The only button is the light-grey "Follow" pill in the banner's bottom row, beside the X / LinkedIn / Instagram icons — quiet, and the only light element on the black panel's top edge. Relative to the data it is secondary: the name and the logo tile outweigh it. The star logo is the loudest component by contrast.

**Gradient & imagery.** The banner is a soft silver radial gradient (light centre, darker edges) — the only gradient in the frame. No photography, no illustration. Removing it would leave a flat grey banner; the card would still read, but the banner would lose the light that makes the black panel feel staged rather than flat.

**Contrast.** Measured: black on grey banner #D3D3D3 is 12.61:1 — passes. White on black #000000 is 21:1 — passes. The grey bio and counts, estimated by eye at about #9A9A9A on black (roughly 7:1 estimated — passes, but estimated, not measured).

## Why the verdict

Adapt: the monochrome banner-over-panel mechanism is the cheapest in this batch (flat colour, one subtle gradient, no imagery) and mirrors cleanly, but it is a brand presentation, not a shipped screen — so adapt, not adopt.

## Notes

Original file: browser-download-20261124T151837.710820249Z-7-1f6f880f736849a1c61a0ad2319410ae.jpg (736x1104, 736x version), from Pinterest board "Component Design Idea".

**Related:** REF-0010 · REF-0015 (social profile card cluster) — this is the monochrome member; REF-0010 is blue-glow, REF-0015 is blue/halftone.
