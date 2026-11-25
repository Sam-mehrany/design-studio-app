---
type: design-ref
id: REF-0007
title: "Smart Actions / Auto-Resolve / Agent assist — feature cards"
source: "Pinterest pin https://de.pinterest.com/pin/1024498615378073089/ — board 'Component Design Idea' (mehrani0146)"
kind: concept
captured: 2026-11-24
image: library/REF-0007.jpg
archetype: [J.ACQ.feature]
facets: [A.FAM.blueprint, A.ERA.current, B.GRID.columnar, B.DEN.moderate, B.HIER.enclosure, B.CONT.cards, B.SPACE.rhythmic, C.PAL.single-accent, C.VAL.dark-first, C.CON.high, C.SAT.vivid, D.FACE.grotesque, D.SCALE.tight, D.WGT.two-step, D.CASE.sentence, D.NUM.lining, E.RAD.small, E.DEP.border-only, E.EDGE.framed, F.ILL.technical-diagram, F.ICON.line, F.IMG.none, F.DEP.none, K.DEV.desktop, K.LOC.ltr-latin]
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

# REF-0007 — Smart Actions / Auto-Resolve / Agent assist — feature cards

## Read

Values below were **measured by sampling pixels** (hex values and WCAG ratios computed from sampled colours); type sizes are estimated by eye and labelled as such. One line of context: a marketing feature grid — three numbered cards under a performance chart strip, photographed off a phone browser, so the image itself is a screenshot of a screenshot.

**Colour.** Measured: near-black background #262626, orange lead card #F17140, cream cards #F0E8DD. One accent hue (orange) marks the first card only; the other two are neutral cream, so the accent ranks the cards rather than coding meaning. No status hues. The dotted chart strip above repeats the cream on black.

**Typography.** Estimated by eye: card titles at about 16–18 px semibold ("Smart Actions", "Auto-Resolve", "Agent assist"), index numbers 001–003 at about 9–10 px in the top-right corner, body copy at about 11–12 px, chart labels at about 9–10 px tracked caps. The scale is tight — title-to-body multiple about 1.5× — and the face is a grotesque sans with tabular-feeling lining figures in the chart strip.

**Layout & harmony.** Three equal columns with about 8–12 px gutters, estimated by eye, each card split into a title band, a diagram field and a caption band. Hierarchy is ranked by enclosure and colour: the orange card first, then the two cream cards. Spacing follows one small rhythm (roughly 8 px steps), and the corner ticks and dotted rules form one technical-drawing family across all three cards.

**Shape & surface.** Estimated radius scale, by eye: cards about 8–10 px with clipped corners (a chamfered, ticket-like edge), caption bands separated by a hairline, no shadow anywhere. Separation is by border and tone only — orange vs cream vs black — with the dotted rules as the single decorative device.

**Buttons & components.** There are no buttons; the components are the cards themselves plus the caption bands, which act as footers. The loudest element is the orange card's fill, not any control — the caption text inside it is the smallest type on the card, so the card's colour does more work than its copy.

**Gradient & imagery.** No gradient and no photography anywhere — the visuals are thin-line technical diagrams (concentric circles, a pyramid, a Venn), drawn in the same stroke weight as the rules. Nothing breaks without them except the diagrams' explanatory value; the layout, titles and captions stand on their own.

**Contrast.** Measured: black on orange #F17140 is 6.45:1 — passes. Black on cream #F0E8DD is 15.55:1 — passes. White on orange would be 2.93:1 and fails, but no white text sits on orange. The smallest measured risk is the 9–10 px chart labels in muted grey on black, estimated by eye at about #8A8A8A on #262626 (roughly 4.4:1, borderline — estimated, not measured).

## Why the verdict

Adapt: the three-card technical-diagram mechanism is cheap (vector lines, flat colour, no imagery) and mirrors cleanly, but it is a concept marketing shot with no shipped evidence, so it cannot be adopt on its own.

## Notes

Original file: browser-download-20261124T151651.857550481Z-1-ac84db789b037efe7ebbf0512f3c465b.jpg (1120x1101), from Pinterest board "Component Design Idea". The image includes phone status bar and browser chrome (i.pinimg.com) — the artefact analysed is the feature grid inside it, not the chrome.

**Related:** REF-0017 (feature cards as marketing) · REF-0009 (print-poster grid)
