---
type: design-ref
id: REF-0015
title: "SIVRA — brand identity social profile card"
source: "Pinterest pin https://de.pinterest.com/pin/1024498615378071307/ — board 'Component Design Idea' (mehrani0146)"
kind: brand
captured: 2026-11-24
image: library/REF-0015.jpg
archetype: [J.ACQ.profile-public]
facets: [A.FAM.print-poster, A.FAM.corporate-saas, B.GRID.single-column, B.DEN.sparse, B.HIER.size, B.CONT.cards, B.SPACE.generous, C.PAL.single-accent, C.VAL.light-first, C.CON.high, C.SAT.vivid, D.FACE.grotesque, D.SCALE.dramatic, D.WGT.high-contrast, D.CASE.all-caps-display, D.NUM.proportional, E.RAD.large, E.DEP.tonal, E.EDGE.framed, F.IMG.illustration, F.DEP.soft, F.ICON.solid, K.DEV.desktop, K.LOC.ltr-latin]
imagery_dep: soft
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

# REF-0015 — SIVRA — brand identity social profile card

## Read

Values below were **measured by sampling pixels** (hex values and WCAG ratios computed from sampled colours); type sizes are estimated by eye and labelled as such. One line of context: a brand-identity presentation of a social profile card — a blue halftone 3D banner with stacked all-caps type, over a white bio panel, staged on black.

**Colour.** Measured: blue banner #5A80FD, blue logo circle #0059F2, pale blue banner field #CEDBFE (from the image palette), white bio panel #FFFFFF. One accent hue (blue) across banner, logo and verified badge. The banner's halftone dots step the blue from pale to deep, so value — not hue — carries the depth. No second hue and no status colour.

**Typography.** Estimated by eye: "SIVRA / BUSINESS / SOLUTION" at about 28–32 px bold all-caps across three lines, name "sivra" at about 18–20 px medium, handle at about 14 px grey, bio at about 16–17 px, "Follow" at about 15–16 px. Headline-to-body multiple about 1.9×. The face is a grotesque sans set in tracked all-caps for the banner, sentence case below.

**Layout & harmony.** Single column, estimated by eye: banner about 50% of the card height, circular logo overlapping the banner/panel seam, bio panel below with about 24–28 px padding. Hierarchy is ranked by size (banner headline first), then by position. Density is low, the card is centred on black with large margins, and the banner's left-aligned headline against the right-side 3D shape is the one asymmetric move.

**Shape & surface.** Estimated radius scale, by eye: card about 28–32 px, logo fully circular, "Follow" pill fully round at about 44–48 px height. Separation is tonal: white panel against the blue banner, the whole card framed by a hairline light edge on black. No shadow; the banner's halftone modelling does the depth work.

**Buttons & components.** The only button is the black "Follow" pill, right-aligned in the panel — quiet against the white, and secondary to the banner headline and the blue logo circle. The blue verified badge beside the name is the smallest component and the only other saturated element in the panel.

**Gradient & imagery.** The banner is a halftone 3D illustration — dotted blue shapes and a block form, not a photograph. Removing it would leave the stacked headline on pale blue; the card would still read, but the banner would lose the texture that makes it a brand image rather than a coloured rectangle, so the dependency is soft. No gradient on interface surfaces.

**Contrast.** Measured: black on white #FFFFFF is 18.88:1 — passes. White on blue banner #5A80FD is 3.53:1 and fails 4.5:1, but no white text sits on the banner — the headline is black on pale blue #CEDBFE, estimated by eye at about 12:1 (passes, estimated, not measured). The grey handle, estimated by eye at about #8A8A8A on white (roughly 3.9:1 estimated — fails 4.5:1 for its size, estimated, not measured).

## Why the verdict

Adapt: the stacked all-caps headline over a halftone banner is a strong, cheap-to-restage brand mechanism and the card is symmetric (RTL-clean), but it is a brand presentation, not a shipped screen, and the render is medium cost — so adapt, not adopt.

## Notes

Original file: browser-download-20261124T151916.354057378Z-9-155491e4b9ffd713b118a6e8c76b6d4f.jpg (1440x1914), from Pinterest board "Component Design Idea".

**Related:** REF-0010 · REF-0013 (social profile card cluster) — this is the blue/halftone member; REF-0010 is blue-glow, REF-0013 is monochrome.
