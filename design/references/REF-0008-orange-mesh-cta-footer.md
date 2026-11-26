---
type: design-ref
id: REF-0008
title: "Template footer with orange grain-mesh CTA panel (Flexfolio)"
source: "Pinterest board 'component-design-idea' (mehrani0146)"
kind: concept
concept: web
captured: 2026-11-26
image: library/REF-0008.jpg
archetype: [J.ACQ.landing]
facets: [A.ERA.current, B.GRID.columnar, B.DEN.moderate, B.CONT.bare, B.CONT.tray, C.PAL.single-accent, C.VAL.light-first, C.SAT.vivid, C.MAT.gradient-mesh, C.MAT.grain, D.FACE.neo-grotesque, D.SCALE.dramatic, D.WGT.two-step, D.CASE.title, E.RAD.large, E.RAD.pill, E.DEP.flat, F.IMG.abstract-shape, F.DEP.soft, K.DEV.desktop]
imagery_dep: soft
rtl: clean
cost: med
verdict: adapt
confidence: med
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
modified: Thu 2026-11-26 1:45 PM EST (UTC-05:00)
---

# REF-0008 — Template footer with an orange grain-mesh CTA panel

## Read

*Figures measured off the image with Python/PIL (median-sampled hex, WCAG 2.x ratios, ink heights in original-image pixels unless stated); type-scale ratios are derived from those ink heights; radii in px are estimated by eye.*

**Colour.** Light page `#f5f5f5`, legal bar `#fafafa`. One accent family carried by a mesh gradient: red-orange `#fc4010`, orange `#fc6611`/`#fe8f16`, yellow `#feb523`, with grain. The Subscribe button repeats the orange.

**Typography.** CTA headline cap 45px, column heads 26px, links/sub 16px (orig px): headline 2.8× link, column head 1.6× — a dramatic scale. Neo-grotesque, white headline on the gradient, Title Case column heads.

**Layout & harmony.** CTA panel stacked over a four-column footer (brand blurb + three link columns + newsletter), then a legal tray. Moderate density, columnar grid.

**Shape & surface.** Large radius (~24px) on the CTA panel, pill button and pill input. Flat throughout.

**Buttons & components.** White pill on the gradient (black text 20.8:1) and an orange Subscribe pill inside the email field.

**Gradient & imagery.** The mesh + grain panel is the whole personality; remove it and a flat orange panel still works (soft). Raster mesh → medium cost.

**Contrast.** White on the gradient: 3.57:1 on `#fc4010`, 2.98:1 on `#fc6611`, 2.29:1 on `#fe8f16`, 1.77:1 on `#feb523` — the subhead over the yellow end **fails** badly. Legal `#939290` on `#fafafa` = 2.98:1 — **fails**. Links `#645c5a` = 5.98:1, pass.

## Why the verdict

Template with placeholder content; the CTA-over-footer structure is sound but the white-on-yellow type fails. Adapt with the text kept over the red end or darkened.

## Notes

Original filename: `pin-component-design-idea-HhcXUQ1geHcQ.jpg`. Template branding 'Flexfolio' visible.

**Related:** —
