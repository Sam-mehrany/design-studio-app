---
type: design-ref
id: REF-0008
title: "Exploring Profile UI Concepts — Clean vs. Vibrant"
source: "Pinterest pin https://de.pinterest.com/pin/1024498615378073083/ — board 'Component Design Idea' (mehrani0146)"
kind: concept
captured: 2026-11-24
image: library/REF-0008.jpg
archetype: [J.ACC.profile]
facets: [A.FAM.flat, B.GRID.split, B.DEN.sparse, B.HIER.colour, B.CONT.cards, B.SPACE.generous, C.PAL.single-accent, C.VAL.light-first, C.VAL.tonal-layered, C.CON.moderate, C.SAT.vivid, C.MAT.gradient-mesh, D.FACE.geometric-sans, D.SCALE.two-tier, D.WGT.two-step, D.CASE.sentence, D.NUM.proportional, D.NUM.lining, E.RAD.large, E.DEP.shadow-elevation, E.DEP.tonal, F.IMG.none, F.ILL.flat-vector, F.DEP.soft, K.DEV.handheld, K.LOC.ltr-latin, K.INPUT.touch]
imagery_dep: soft
rtl: clean
cost: med
verdict: adapt
confidence: med
status: reviewed
sam_reaction: dislike
sam_note:
tags: [design/ref]
concept: component
---

# REF-0008 — Exploring Profile UI Concepts — Clean vs. Vibrant

## Read

Values below were **measured by sampling pixels** (hex values and WCAG ratios computed from sampled colours); type sizes are estimated by eye and labelled as such. One line of context: a side-by-side A/B concept — the same profile card rendered once on white ("Clean") and once on a green aurora wash ("Vibrant").

**Colour.** Measured: green banner sampled at #4BB257 (left card) and #6CBA66 (right card), on white cards and a near-white page. One accent family only — green — used as a banner on the left and as the whole surface on the right. The green carries no coded meaning; it is pure identity, and the stats (4.9, 125, 12.4K) are black on both versions.

**Typography.** Estimated by eye: name at about 15–16 px semibold, handle at about 12 px grey, stats at about 15–16 px bold with 11 px labels beneath, button at about 13–14 px medium. Two-tier scale, name-to-label multiple about 1.4×. The face is a rounded geometric sans; numerals are proportional lining figures, not tabular.

**Layout & harmony.** Two equal cards side by side with a gap of about 24–32 px, estimated by eye, each a single column: banner, avatar, name, stats row, button. Hierarchy is ranked by colour on the right card (white text on green) and by size and weight on the left (black on white). Density is low — generous white space inside both cards — and the two cards share one spacing rhythm, which is what makes the comparison legible.

**Shape & surface.** Estimated radius scale, by eye: cards about 20–24 px, banner about 16 px inset, avatar fully circular, "Get in Touch" button pill, "Follow" button pill. The left card separates by a soft drop shadow on white; the right card separates by tone alone (green on near-white). One rounded family throughout, no borders.

**Buttons & components.** The primary action is the full-width "Get in Touch" pill — black fill with white text on the left card, white fill with black text on the right — with a circular arrow badge at its left end. The "Follow" pill beside the name is secondary and outlined on the left, solid white on the right. Relative to the data, the button outweighs the stats row: it is the only full-width solid mass in either card.

**Gradient & imagery.** The only gradient is the green aurora mesh on the right card's banner and body — a soft multi-stop wash. No photography; the avatar is a flat-vector line illustration. Removing the wash would leave the right card identical to the left except for its white button, so the imagery dependency is soft, but the wash is the whole point of the "Vibrant" variant.

**Contrast.** Measured: white on green #4BB257 is 2.69:1 and on #6CBA66 is 2.37:1 — both fail 4.5:1, so the white name, stats and button text on the vibrant card are measured failures for their sizes. Black on white passes by a wide margin (about 18:1). The vibrant variant therefore trades the clean variant's passing contrast for its wash.

## Why the verdict

Adapt: the comparison itself is the useful artefact — same card, two finishes, one measurable contrast cost — but the vibrant finish fails contrast as measured, and the mesh gradient sits on the active brief's reject line (C.MAT.gradient-mesh), so it cannot be adopt.

## Notes

Original file: browser-download-20261124T151710.098312053Z-2-1fdfd1795c0acc5ab7644b4e5dee82fa.jpg (736x552, 736x version; originals AccessDenied), from Pinterest board "Component Design Idea".

**Related:** REF-0010 · REF-0013 · REF-0015 (social profile card cluster) — this is the only one that shows the same card in two finishes.
