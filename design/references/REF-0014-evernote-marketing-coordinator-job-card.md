---
type: design-ref
id: REF-0014
title: "Evernote — Marketing Coordinator job listing card"
source: "Pinterest pin https://de.pinterest.com/pin/1024498615378071309/ — board 'Component Design Idea' (mehrani0146)"
kind: concept
captured: 2026-11-24
image: library/REF-0014.jpg
archetype: [J.COM.catalogue]
facets: [A.FAM.corporate-saas, B.GRID.single-column, B.DEN.moderate, B.HIER.size, B.HIER.colour, B.CONT.cards, B.SPACE.rhythmic, C.PAL.single-accent, C.VAL.dark-first, C.CON.high, C.SAT.vivid, D.FACE.grotesque, D.SCALE.dramatic, D.WGT.high-contrast, D.CASE.title, D.NUM.proportional, E.RAD.large, E.DEP.tonal, E.DEP.shadow-elevation, E.ACC.badge, F.IMG.none, F.ICON.solid, F.DEP.none, K.DEV.desktop, K.LOC.ltr-latin]
imagery_dep: none
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

# REF-0014 — Evernote — Marketing Coordinator job listing card

## Read

Values below were **measured by sampling pixels** (hex values and WCAG ratios computed from sampled colours); type sizes are estimated by eye and labelled as such. One line of context: a job listing card concept — a dark folder-shaped card with a "MARKETING" tab, three meta columns, a description, and a salary row with an Apply button — staged on a light grid.

**Colour.** Measured: black card #141817, light page #F1F2F4, with a green Evernote tile and a green-to-mint gradient "Apply Now" pill. One accent hue (green) used twice — the brand tile and the action pill — so green means both "whose job" and "what to do". No other hue and no status colour.

**Typography.** Estimated by eye: job title "Marketing Coordinator" at about 36–40 px semibold, meta labels at about 14–15 px grey with values at about 17–18 px, description at about 17–18 px grey, salary "85K - 120k USD" at about 30–32 px bold. Title-to-body multiple about 2.2× — a dramatic scale. The face is a grotesque sans; the salary figures are proportional lining, not tabular.

**Layout & harmony.** Single column, estimated by eye: header row (logo + name + verified badge), title, a three-column meta row divided by hairlines, description, then a bottom band with salary left and button right. Hierarchy is ranked by size (title, then salary, then description) and by colour (the green pill last). Spacing is one rhythm (about 20–28 px), and the folder-tab silhouette (raised tab at top-right) is the card's only structural quirk.

**Shape & surface.** Estimated radius scale, by eye: card about 32–40 px, logo tile about 16 px, "Apply Now" pill fully round at about 56–64 px height. Separation is tonal and shadowed: the black card floats on the light grid with a soft drop shadow, and the bottom band is one tonal step lighter than the card body. No border.

**Buttons & components.** The "Apply Now" pill is the loudest control — the only saturated element in the lower half, about 200 px wide — and it is also the only button. The "MARKETING" tab badge (dark pill, yellow icon, tracked caps) is secondary and acts as a category label rather than an action. Relative to the data, the button outweighs the description but is quieter than the title and salary, which is the right order for a listing.

**Gradient & imagery.** The only gradient is inside the "Apply Now" pill (green to mint, left to right) — a small, local wash. No photography and no illustration beyond the Evernote logo tile. Removing the gradient would leave a flat green pill; nothing structural breaks, and the card's hierarchy survives unchanged.

**Contrast.** Measured: white on black card #141817 is 17.91:1 — passes. The grey description text, estimated by eye at about #8E8E8E on #141817 (roughly 6:1 estimated — passes, but estimated, not measured). Black on the green gradient pill is estimated by eye at about #4ADE80 (roughly 8:1 estimated — passes, estimated, not measured).

## Why the verdict

Adapt: the listing-card mechanism — title, hairline-divided meta row, salary-plus-action band — is transferable at low cost with no imagery dependency, but it is a concept shot with a three-column meta row and a salary-left/button-right band that would need RTL rework, so adapt, not adopt.

## Notes

Original file: browser-download-20261124T151902.630024901Z-8-7d775557a77e23f6a7b03d8b21711e7f.jpg (2424x2424), from Pinterest board "Component Design Idea".

**Related:** REF-0012 · REF-0018 (folder-tab card silhouette) — this card uses the same raised-tab shape as the folder cards, applied to a job listing.
