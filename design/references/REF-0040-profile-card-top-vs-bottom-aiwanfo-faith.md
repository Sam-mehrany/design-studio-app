---
type: design-ref
id: REF-0040
title: "Profile card Top vs Bottom — Aiwanfo Faith, product designer (@Saint_Jamesux)"
source: "Pinterest board 'UI Idea' (mehrani0146, private), https://de.pinterest.com/mehrani0146/ui-idea/ — pin https://de.pinterest.com/pin/1024498615375464362/"
kind: concept
captured: 2026-11-24
image: library/REF-0040.jpg
archetype: [J.ACC.profile, J.ACQ.profile-public]
facets: [A.FAM.flat, A.FAM.corporate-saas, B.GRID.single-column, B.DEN.moderate, B.HIER.size, B.HIER.position, B.CONT.cards, B.SPACE.rhythmic, C.PAL.monochrome, C.VAL.light-first, C.CON.high, C.SAT.muted, C.MAT.flat, D.FACE.grotesque, D.SCALE.two-tier, D.WGT.two-step, D.NUM.tabular, D.HERO.inline, D.CASE.sentence, D.PAIR.single, E.RAD.large, E.DEP.tonal, E.DEP.shadow-elevation, E.EDGE.framed, E.ENV.staged, F.IMG.photography, F.PHOTO.full-bleed, F.DEP.soft, F.COST.low, H.LEN.minimal, H.NUM.unit-adjacent, H.TONE.neutral, K.DEV.desktop, K.LOC.ltr-latin, K.INPUT.pointer]
imagery_dep: soft
rtl: risky
cost: low
verdict: adapt
confidence: med
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
modified: 2026-11-24T18:45:00Z
concept: component
---

# REF-0040 — Profile card Top vs Bottom — Aiwanfo Faith, product designer (@Saint_Jamesux)

## Read

Values below are **estimated by eye** — the image is a two-variant comparison sheet, so pixel samples are not meaningful per variant; type sizes are estimated by eye and labelled as such. One line of context: a designer profile card shown in two variants — "Top" (mountain cover photo on top, avatar overlapping, stats row, black "Get in touch" pill) and "Bottom" (same content split left-text / right-photo).

**Colour.** Estimated by eye: white cards (about #FFFFFF) on a pale lavender ground (about #E8E6F0), black type and black CTA in the Top variant, white CTA in the Bottom variant, green mountain photograph. Monochrome UI with the photograph as the only colour — the two variants differ only in where the photo sits, not in palette.

**Typography.** Estimated by eye: name "Aiwanfo Faith" at about 20–22 px semibold, tagline at about 13–14 px, meta lines at about 12–13 px, stats ("4.6", "7 days", "$44/hr") at about 16–18 px semibold with 11–12 px grey labels beneath. Two-tier scale — the name and stats are one tier, the rest another — with tabular numerals in the stats.

**Layout & harmony.** Single column per variant, estimated by eye. Top: cover photo (~45% of card height), avatar overlapping the photo's bottom edge, name and tagline, a three-stat row divided by hairlines, tools row and black pill CTA. Bottom: text column left (~55%), photo right (~45%), same stats row, tools row and white pill CTA. Hierarchy is ranked by size (name first), then by the photograph's weight. Density is moderate — five content blocks per card.

**Shape & surface.** Estimated radius scale, by eye: cards at about 20–24 px radius, avatar as a full circle, CTA pills at full pill radius. Separation is by tone and soft shadow — white cards on a lavender ground — with no borders. The avatar's white ring is the one deliberate edge.

**Buttons & components.** One pill CTA per variant ("Get in touch" — black in Top, white in Bottom), a round white bookmark button top-right of each photo, a tools row (Notion, Webflow, WordPress, Figma icons + "Tools"), and the three-stat row (rating / duration / rate). The CTA is the loudest control in Top; in Bottom the photograph is louder than the white CTA, which is the comparison's point.

**Gradient & imagery.** No gradient. One mountain photograph is the cover in both variants; the avatar is a 3D-rendered portrait. Delete the photograph and both cards still read — name, stats, tools, CTA survive — so the dependency is soft; the photo adds atmosphere, not structure.

**Contrast.** Estimated by eye: black on white is about 17:1 — passes. White on the black CTA is about 17:1 — passes; black on the white CTA in Bottom is about 17:1 — passes. The grey stat labels, estimated at about #8A8A8A on white (about 3.5:1 estimated — fails, estimated, not measured). The bookmark icon on the photograph is the least legible element.

## Why the verdict

Adapt: the cover-photo profile card with a three-stat row (rating / duration / rate) and a tools row is a transferable, low-cost profile mechanism, and the Top-vs-Bottom comparison itself is the useful artefact — Top reads better because the black CTA holds against the photo — but it is a concept comparison shot, so adapt, not adopt.

## Notes

Original file: browser-download-20261124T172840.206931067Z-23-d03a125ed29c43eff4e0aa2d0daad3c5.jpg (3612x4096), from Pinterest board "UI Idea" (private). Individual pin URL: https://de.pinterest.com/pin/1024498615375464362/ The sheet is labelled "Top" and "Bottom" and credited "@Saint_Jamesux" at the foot. Both variants carry identical content (Aiwanfo Faith, "Designing for clarity & usability", Product designer, "In the feedback loop.", 4.6 rating, 7 days, $44/hr); only the photo placement and the CTA fill change.

**Related:** REF-0010 (Motia brand identity profile card) · REF-0013 (Superbrand social profile card) · REF-0015 (SIVRA profile card) — same profile-card cluster, this one adds the variant comparison.
