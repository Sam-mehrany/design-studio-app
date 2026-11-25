---
type: design-ref
id: REF-0018
title: "Folder/Album UI in dark mode — Designs collection card"
source: "Pinterest pin https://de.pinterest.com/pin/1024498615378071284/ — board 'Component Design Idea' (mehrani0146)"
kind: concept
captured: 2026-11-24
image: library/REF-0018.jpg
archetype: [J.CORE.browse]
facets: [A.FAM.flat, B.GRID.single-column, B.DEN.sparse, B.HIER.size, B.CONT.cards, B.SPACE.generous, C.PAL.polychrome, C.VAL.dark-first, C.CON.high, C.SAT.vivid, C.MAT.gradient-mesh, D.FACE.grotesque, D.SCALE.two-tier, D.WGT.two-step, D.NUM.lining, D.HERO.display-numeral, E.RAD.large, E.DEP.tonal, E.DEP.border-only, E.STROKE.heavy, F.IMG.none, F.DEP.none, K.DEV.desktop, K.LOC.ltr-latin]
imagery_dep: none
rtl: clean
cost: med
verdict: adapt
confidence: med
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
concept: component
---

# REF-0018 — Folder/Album UI in dark mode — Designs collection card

## Read

Values below were **measured by sampling pixels** (hex values and WCAG ratios computed from sampled colours); type sizes are estimated by eye and labelled as such. One line of context: a folder/album collection card — a mesh-gradient header (orange to pink to magenta) over a black panel with title and counts — staged small on a light diamond-grid page.

**Colour.** Measured: black card #222222, orange gradient #EE8A66, magenta gradient #E658DE, light page #FAFAFA. The header is polychrome — orange, pink and magenta in one mesh — while the panel is monochrome black and white. The gradient carries identity, not meaning; there is no status hue.

**Typography.** Estimated by eye: title "Designs" at about 22–24 px semibold, subtitle "Web & App Designs" at about 15–16 px grey, display numeral "04" at about 32–36 px extrabold with "Tags" at about 14 px, "1012 Shots" at about 14–15 px. Two-tier scale: the "04" numeral is the hero, everything else is one quiet tier. Numerals are lining.

**Layout & harmony.** Single column, estimated by eye: gradient header about 40% of the card height, black panel below with about 20–24 px padding, counts pinned to the bottom row. Hierarchy is ranked by size ("04" first), then by position. Density is low — the card is small in a large empty grid page — and the panel's top edge is notched with a tab cut where it meets the header.

**Shape & surface.** Estimated radius scale, by eye: card about 28–32 px with a heavy black frame (about 6–8 px stroke), the panel's tab notch cut at an angle. Separation is by border and tone: the heavy black frame outlines the card against the light page, and the black panel steps against the gradient header. No shadow.

**Buttons & components.** There are no buttons; the components are the card, the gradient header and the count row. The loudest element is the "04" numeral, not any control — the card is a browse object, and its counts ("04 Tags", "1012 Shots") are the content, set quieter than the numeral but louder than the subtitle.

**Gradient & imagery.** The header is a mesh gradient (orange → pink → magenta) — the card's whole visual identity. No photography, no illustration. Removing it would leave a black card with white text on a white page; the card would still read, but it would lose the colour that distinguishes this collection from any other, so the gradient is decorative but load-bearing for identity.

**Contrast.** Measured: white on black card #222222 is 15.91:1 — passes. White on orange gradient #EE8A66 is 2.48:1 and fails, but no white text sits on the gradient — the title is on black. The grey subtitle, estimated by eye at about #9A9A9A on #222222 (roughly 7:1 estimated — passes, estimated, not measured).

## Why the verdict

Adapt: the folder card with a mesh-gradient header and a hero count is a clean browse mechanism at medium cost, but it is a concept shot and the mesh gradient sits on the active brief's reject line (C.MAT.gradient-mesh) — so adapt, not adopt.

## Notes

Original file: browser-download-20261124T152015.750932543Z-12-03f8995f888adc29629c9871da99763f.jpg (2160x2160), from Pinterest board "Component Design Idea".

**Related:** REF-0003 (Taskello folder-tab card) · REF-0012 (2050 Properties folder card) — three folder-tab cards now in the library; see the proposed term in the ingest report. No folder-card component term exists in facet I — proposed, not invented.
