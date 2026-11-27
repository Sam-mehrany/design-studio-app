---
type: design-ref
id: REF-0026
title: "Dark neutral CRM dashboard (Radix/Lucide template)"
source: "Pinterest board 'dashboard-design' (mehrani0146)"
kind: concept
concept: web
captured: 2026-11-26
image: library/REF-0026.jpg
archetype: [J.DATA.home]
facets: [A.POS.utilitarian, A.ERA.current, B.GRID.split, B.CONT.cards, B.DEN.moderate, C.PAL.neutral-only, C.SEM.strict, C.VAL.dark-first, C.VAL.tonal-layered, C.CON.high, C.MAT.gradient-subtle, D.FACE.neo-grotesque, D.PAIR.single, D.SCALE.moderate, D.WGT.two-step, D.CASE.sentence, E.DEP.tonal, E.RAD.medium, E.STROKE.hairline, E.ACC.badge, F.ICON.line, F.ICON-SYS.single-weight, K.DEV.desktop, K.INPUT.pointer, K.INPUT.keyboard, K.LOC.ltr-latin]
imagery_dep: none
rtl: risky
cost: low
verdict: adapt
confidence: high
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
modified: Thu 2026-11-26 1:12 PM EST (UTC-05:00)
medium: flat-ui
platform: desktop
---

# REF-0026 — Dark neutral CRM dashboard (Radix/Lucide template)

## Nature

A whole dashboard screen, flat.

*Nature backfilled by Hark, 27 Nov 2026, from the image.*

## Read

*Measured with PIL off the pin image (hex = mode of a sampled patch; text ink = strongest anti-aliased pixel in the glyph box, so small-text ratios can understate slightly; sizes are ink heights in image px, not CSS px).*

**Colour.** Neutral-only dark ladder, four steps: sidebar `#0a0a0a`, main `#101010`, KPI cards `#161616`, chart card `#1e1e1e`; outer field `#2a2a30`. Hue appears only for meaning: green `#08b878` up, red `#f02830` down, in small dot-badges. The chart is grey on grey.

**Typography.** Neo-grotesque (Geist/Inter class), one family, regular + semibold. Label cap 9, H1 14, KPI 19, revenue hero 24 (px): steps ~1.3–1.5, hero 2.7× label. Sentence case throughout.

**Layout & harmony.** Sidebar + content split; three KPI cards, a full-width area chart, then two half cards. Moderate density, even gutters, one radius and one icon weight (Lucide line).

**Shape & surface.** Medium radius (~12px), hairline borders on inner tiles, depth purely tonal. A white pill marks the selected x-axis date.

**Buttons & components.** Restrained: ⌘K search field, chips, tabs with an underline indicator; no loud primary button on the screen.

**Gradient & imagery.** One subtle grey area-fill gradient under the chart line; nothing breaks without it.

**Contrast.** Values `#ffffff` on `#141414` = 18.4:1; muted labels `#a9a9a9` = 7.8:1; nav `#a8a8a8` = 8.8:1; green delta `#08b878` on `#181818` = 6.9:1. Red `#f02830` on `#161616` = 4.35:1 — just under 4.5:1 for small text.

## Why the verdict

Cleanest dark tonal system in the batch and contrast nearly all passes; still a template/concept, so adapt rather than adopt.

## Notes

Footer credit reads 'Customizer — Radix UI, Lucide', i.e. a coded shadcn-style template; could be argued `shipped` as a template product. Kept `concept` because the data is demo data. Original filename: `pin-dashboard-design-MLcqCLW52c7Q.jpg`. Board is a hint only; concept judged from the image.

**Related:** —
