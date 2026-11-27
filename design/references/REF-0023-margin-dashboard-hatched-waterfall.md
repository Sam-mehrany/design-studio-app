---
type: design-ref
id: REF-0023
title: "Margin dashboard: hero percentage, hatched waterfall, insight card"
source: "Pinterest board 'dashboard-design' (mehrani0146)"
kind: concept
concept: web
captured: 2026-11-26
image: library/REF-0023.jpg
archetype: [J.DATA.home]
facets: [A.ERA.current, A.POS.premium, B.GRID.modular, B.DEN.moderate, B.HIER.size, B.CONT.cards, B.SPACE.rhythmic, B.FLOW.ltr, C.PAL.duotone, C.SEM.layered, C.VAL.light-first, C.CON.moderate, C.VIZ.accent-only, C.MAT.gradient-mesh, D.FACE.neo-grotesque, D.PAIR.single, D.SCALE.two-tier, D.HERO.display-numeral, D.CASE.sentence, E.RAD.large, E.DEP.tonal, E.ACC.icon-plus-word, E.TEX.pattern, F.IMG.data-as-image, F.ICON.line, H.TONE.neutral, H.LEN.helper, H.NUM.unit-adjacent, K.DEV.desktop, K.INPUT.pointer, K.ATT.focused, K.LOC.ltr-latin]
imagery_dep: soft
rtl: risky
cost: med
verdict: adapt
confidence: med
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
modified: Thu 2026-11-26 1:12 PM EST (UTC-05:00)
medium: flat-ui
platform: desktop
---

# REF-0023 — Margin dashboard: hero percentage, hatched waterfall, insight card

## Nature

A whole dashboard screen, flat.

*Nature backfilled by Hark, 27 Nov 2026, from the image.*

## Read

*Measured with PIL off the pin image (hex = mode of a sampled patch; text ink = strongest anti-aliased pixel in the glyph box, so small-text ratios can understate slightly; sizes are ink heights in image px, not CSS px).*

**Colour.** Light tonal ladder: frame `#dadada`, app `#f3f3f3`, cards `#f8f8f8`, active nav pill `#2a2a2c`. Two data hues with fixed jobs: blue `#1852e2` = actual/current (solid) with history as light-blue hatching `#5088e0`; pink `#e04088` = leakage (hatched waterfall steps, delta text). Brand orange `#f08820` only in the logo and badge. Status icons get tinted circles: red `#d03878`, amber `#a86028`, blue `#2858c8`; green `#10a030` for positive deltas. One decorative mesh card (navy `#16244a` → `#4e88c2` → peach `#f2b07a`).

**Typography.** Neo-grotesque, one family. Measured cap/ink heights (preview px): body 8.9, card title 12.6, `Overview` H1 27.3, hero `34.0%` 43.8 and `8.2 pts` 42.0. Hero ≈ 4.9× body; a compact UI scale (8.9→12.6, 1.42) plus a separate display tier — two-tier. Units (`pts`, `%`) set small beside the hero.

**Layout & harmony.** Sidebar + three-column card grid, with the waterfall card spanning two rows. Size ranks first (hero number), then position. Radii, icon stroke and spacing read as one family; spacing is regular.

**Shape & surface.** Large radius (~20px est.) on cards and frame, pill on the active nav and chips. Depth by tone only (`#f8f8f8` card on `#f3f3f3`); no visible shadow. Hatched fills are the one texture and they encode state (projected/lost vs actual).

**Buttons & components.** Quiet: white pill controls with hairline border (`Sep 21 to 27`, `Export`), one white CTA on the gradient card (`Review 29 jobs`, `#060606` on `#fcfcfc` = 19.8:1). Delta chips are small tinted pills with an arrow.

**Gradient & imagery.** Only the insight card carries a mesh gradient; everything else is flat. Remove it and the card still works as a dark/neutral tile — decoration, not structure.

**Contrast.** Titles `#000002` on `#f8f8f8` = 19.8:1; body `#525252` = 7.4:1. Meta/micro text `#848484` on `#f8f8f8` = 3.52:1 and axis labels `#858585` = 3.47:1 — **fail** 4.5:1. Sidebar group label 3.24:1 — fails. White body copy on the gradient's mid-tone (`#98b4c6`) ≈ 2.1:1 — **fails** badly.

## Why the verdict

Strongest mechanism in the batch (hatched = not-yet/lost, solid = actual; one hero figure per card), but concept-grade data and failing meta contrast keep it at adapt.

## Notes

Data looks plausible (long labels, odd values like `#5812 Brookside is lowest at 6.1%`), but it is a presentation shot in a rounded frame on grey, not a shipped product. The hatch-as-state device has no dedicated term (closest E.TEX.pattern); possible new term: C.VIZ or E.TEX 'hatch encodes projected/incomplete'. Propose to Sam rather than invent. Original filename: `pin-dashboard-design-FtyDy_TsgfQg.jpg`. Board is a hint only; concept judged from the image.

**Related:** —
