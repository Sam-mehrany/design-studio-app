---
type: design-ref
id: REF-0012
title: "2050 Properties — folder card (Daily memo)"
source: "Pinterest pin https://de.pinterest.com/pin/1024498615378071312/ — board 'Component Design Idea' (mehrani0146)"
kind: concept
captured: 2026-11-24
image: library/REF-0012.jpg
archetype: [J.CORE.browse]
facets: [A.FAM.spatial-3d, B.GRID.single-column, B.DEN.sparse, B.HIER.size, B.CONT.cards, B.SPACE.generous, C.PAL.single-accent, C.VAL.dark-first, C.CON.high, C.SAT.muted, D.FACE.grotesque, D.SCALE.two-tier, D.WGT.two-step, D.NUM.lining, D.HERO.display-numeral, E.RAD.large, E.DEP.tonal, E.EDGE.framed, F.IMG.render-3d, F.DEP.soft, K.DEV.desktop, K.LOC.ltr-latin]
imagery_dep: soft
rtl: risky
cost: med
verdict: adapt
confidence: med
status: reviewed
sam_reaction: like
sam_note:
tags: [design/ref]
concept: component
---

# REF-0012 — 2050 Properties — folder card (Daily memo)

## Read

Values below were **measured by sampling pixels** (hex values and WCAG ratios computed from sampled colours); type sizes are estimated by eye and labelled as such. One line of context: a folder-tab collection card — a blue 3D render on top, a dark panel below with title and counts — staged small on a black field with a diagonal blue glow.

**Colour.** Measured: dark card #212121, deep blue render #000C22, black field #000000. One accent family (blue) in the render only; the panel is neutral dark grey, and all text is white or muted grey. The blue carries identity, not meaning — there is no second hue and no status colour.

**Typography.** Estimated by eye: title "Daily memo" at about 13–14 px medium, subtitle "Contract and Notes" at about 11–12 px grey, display numeral "05" at about 20–22 px bold with "Doc" at about 11 px beside it, "1254 Notes" at about 11–12 px. Two-tier scale: the numeral is the hero, everything else is one quiet tier. Numerals are lining.

**Layout & harmony.** Single column, estimated by eye: render band about 45% of the card height, panel below with about 16–20 px padding, counts pinned to the bottom row. Hierarchy is ranked by size (the "05" numeral first), then by position. Density is low — the card is small in the frame and mostly empty dark surface — and the notch cut into the panel's top edge is the one directional detail.

**Shape & surface.** Estimated radius scale, by eye: card about 20–24 px, render band flush to the top with the card's radius, the panel's top edge notched with an angled tab cut. Separation is tonal: dark panel on black field, distinguished by a faint hairline frame and by the render's blue. No shadow, no border weight beyond the frame.

**Buttons & components.** There are no buttons; the components are the card, the render band and the count row. The loudest element is the "05" numeral, not any control — the card is a browse object, and its counts ("05 Doc", "1254 Notes") are the content, set quieter than the numeral but louder than the subtitle.

**Gradient & imagery.** The imagery is a 3D render of blue folded surfaces — the whole top band. Removing it would leave a plain dark card with a title and two counts; the card would still read, but it would lose the identity that distinguishes this folder from any other, so the dependency is soft. No gradient on interface surfaces; the render's own shading is the only tonal modelling.

**Contrast.** Measured: white on dark card #212121 is 16.1:1 — passes. The muted grey subtitle and "1254 Notes", estimated by eye at about #9A9A9A on #212121 (roughly 7:1 estimated — passes, but estimated, not measured). The small "2050 folder design" caption in the render, white on dark blue #000C22, is about 19.5:1 measured — passes.

## Why the verdict

Adapt: the folder-tab card with a render band and a hero count is a clean browse mechanism, but it is a concept shot, its render is medium cost, and the notched tab is left-anchored — so adapt, not adopt.

## Notes

Original file: browser-download-20261124T151819.584727587Z-6-f3d0422daa835429331224be2805cd70.jpg (600x422), from Pinterest board "Component Design Idea".

**Related:** REF-0003 (Taskello folder-tab card) · REF-0018 (Folder/Album dark-mode card) — three folder-tab cards now in the library; see the proposed term in the ingest report. No folder-card component term exists in facet I — proposed, not invented.
