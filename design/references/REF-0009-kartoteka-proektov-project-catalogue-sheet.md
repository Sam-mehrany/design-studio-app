---
type: design-ref
id: REF-0009
title: "Картотека проектов — project catalogue sheet"
source: "Pinterest pin https://de.pinterest.com/pin/1024498615378073082/ — board 'Component Design Idea' (mehrani0146)"
kind: print
captured: 2026-11-24
image: library/REF-0009.jpg
archetype: [J.CORE.browse]
facets: [A.FAM.print-poster, A.FAM.neo-brutalist, B.GRID.modular, B.DEN.dense, B.HIER.enclosure, B.HIER.size, B.CONT.cards, B.SPACE.tight, C.PAL.triad, C.VAL.light-first, C.CON.high, C.SAT.vivid, D.FACE.grotesque, D.SCALE.moderate, D.WGT.high-contrast, D.CASE.sentence, D.NUM.lining, E.RAD.medium, E.DEP.flat, E.EDGE.framed, F.ILL.flat-vector, F.IMG.illustration, F.DEP.soft, K.DEV.print, K.LOC.bilingual]
imagery_dep: soft
rtl: risky
cost: low
verdict: adapt
confidence: med
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
concept: component
---

# REF-0009 — Картотека проектов — project catalogue sheet

## Read

Values below were **measured by sampling pixels** (hex values and WCAG ratios computed from sampled colours); type sizes are estimated by eye and labelled as such. One line of context: a printed info sheet (Russian, "Картотека проектов" — project card index) presenting five project cards in a staggered grid, with a small diagram and a pixel motif filling the gaps.

**Colour.** Measured: cream page #FFF7EA, near-black panels #232321 (from the image palette), mint pattern field #96E9B3 sampled at centre. Three hues share the work — orange and mint pattern the card headers, black carries the text panels — a triad with no fourth hue. Colour codes the card, not status: each card's header pattern is decorative, and all text panels are the same black.

**Typography.** Estimated by eye: sheet title at about 28–32 px bold across two lines, card titles at about 14–16 px bold, body copy at about 9–10 px, the "03 / 24" diagram numerals at about 12–14 px. Title-to-body multiple about 3×. The face is a grotesque sans; the Cyrillic and the one English card ("Business Camp") share the same face, and numerals are lining.

**Layout & harmony.** A staggered modular grid, estimated by eye: two columns with five cards at uneven vertical offsets, gaps of about 16–20 px, a small diagram and a pixel cluster used as spacers rather than left as empty space. Hierarchy is ranked by enclosure first (black panel = the card's content), then by size (title over body). Density is high — almost no unfilled surface — yet the cream gutters keep the cards separable.

**Shape & surface.** Estimated radius scale, by eye: cards about 12–16 px, header pattern bands flush to the card top, circular arrow buttons about 28–32 px. Separation is flat and tonal: black panel against cream page, no border, no shadow. The pattern headers (grid lines, arcs, nodes, dots) are the only texture, and each card gets a different one.

**Buttons & components.** The only repeated control is the small white circular button with a black chevron/arrow at each card's bottom-right — quiet, identical on all five cards, and clearly secondary to the card title. There is no primary action on the sheet; the cards themselves are the content, not controls.

**Gradient & imagery.** No gradient anywhere. Imagery is flat-vector pattern work inside the header bands (line grids, contour arcs, node diagrams) plus one small line diagram between cards. Removing the patterns would leave black title panels on cream — the sheet would still read, but the cards would lose the visual cue that distinguishes one project from another.

**Contrast.** Measured: black #232321 on cream #FFF7EA is about 15:1 — passes. White on black #232321 is about 15:1 — passes. The measured risk is the smallest body copy, estimated by eye at 9–10 px in grey on black (roughly #9A9A9A on #232321, about 6:1 estimated — passes 4.5:1, but the size leaves no margin).

## Why the verdict

Adapt: the staggered card grid with a distinct pattern per card is a transferable browse mechanism at low cost (flat colour, vector pattern, no imagery), but it is a print sheet, not a shipped screen, and its dense LTR grid would need rework for RTL — so adapt, not adopt.

## Notes

Original file: browser-download-20261124T151732.114991197Z-3-cbde96f4a36735b8db9e6eba6c799e6f.jpg (735x590, 736x version), from Pinterest board "Component Design Idea". Text is Russian with one English card ("Business Camp: лето твоей карьеры").

**Related:** REF-0007 (print-poster grid) · REF-0016 (case-study card)
