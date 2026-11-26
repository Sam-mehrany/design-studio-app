---
type: design-ref
id: REF-0031
title: "Finance dashboard cards: orange accent, black pill CTA, dark goals card"
source: "Pinterest board 'dashboard-design' (mehrani0146)"
kind: concept
concept: web
captured: 2026-11-26
image: library/REF-0031.jpg
archetype: [J.DATA.home]
facets: [B.GRID.bento, B.CONT.cards, B.DEN.moderate, C.PAL.single-accent, C.SEM.loose, C.SAT.vivid, C.VAL.light-first, C.VIZ.accent-only, C.MAT.gradient-subtle, C.MAT.glass-frosted, D.FACE.neo-grotesque, D.HERO.display-numeral, D.SCALE.two-tier, D.CASE.title, E.RAD.large, E.RAD.pill, E.DEP.tonal, F.ICON.line, K.DEV.desktop, K.LOC.ltr-latin]
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
---

# REF-0031 — Finance dashboard cards: orange accent, black pill CTA, dark goals card

## Read

*Measured with PIL off the pin image (hex = mode of a sampled patch; text ink = strongest anti-aliased pixel in the glyph box, so small-text ratios can understate slightly; sizes are ink heights in image px, not CSS px).*

**Colour.** Field `#e8e8ec`, white cards `#fefefe`, one dark card (`#282828` rows on near-black). Vivid orange `#f06000` does several jobs at once: brand card fill, progress bars, highlighted chart bar (`#f8d8c0` fade), and *positive* deltas — while red `#f82828` marks negative and green `#509878` marks savings. Orange is accent and semantic at once.

**Typography.** Neo-grotesque, regular weights. Month labels 8.8, card title 11.8, secondary values 23.6, hero `$128,430.50` 39.8 (px ink, incl. `$`): compact UI tier plus display tier; hero ≈ 3.4× title. Title Case labels.

**Layout & harmony.** Bento: one wide balance card, two small KPI cards, a tall chart card, an orange report tile and a dark list card. Even gutters; one radius family.

**Shape & surface.** Large radius (~20px) on cards; pills on buttons and chips. Depth tonal (white on `#e8e8ec`), no shadow. The orange tile holds faked frosted 'report' cards.

**Buttons & components.** Primary black pill `#202020` with white label + icon; secondary grey pills `#f4f4f4`. Progress bars are thick capsules.

**Gradient & imagery.** Subtle vertical fades on chart bars and the orange tile; stacked translucent cards as decoration. Nothing structural depends on them.

**Contrast.** Titles `#0c0c0c` on white = 19.1:1; 'vs Last Week' `#565656` = 6.9:1; months `#717171` = 4.8:1. Orange delta `#f06000` on `#f8f8f8` = 3.1:1, white on orange tile ≈ 3.0–3.3:1, `48%` labels 3.4:1 — **fail**.

## Why the verdict

Bento card set and pill hierarchy are portable; orange carrying both 'brand' and 'up' plus failing orange-text contrast means adapt, not adopt.

## Notes

A dashboard fragment (cards only, no shell) — between web and component; filed web because it is a composed card grid, not one component. Concept tell: 'Total Expences' typo. Original filename: `pin-dashboard-design-pEyFXTZ6lnfA.jpg`. Board is a hint only; concept judged from the image.

**Related:** —
