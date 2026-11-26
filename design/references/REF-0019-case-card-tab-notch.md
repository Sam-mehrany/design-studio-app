---
type: design-ref
id: REF-0019
title: "Case-study card: tab notch, blurred orange 3D banner, heavy navy title"
source: "Pinterest board 'component-design-idea' (mehrani0146)"
kind: concept
concept: component
captured: 2026-11-26
image: library/REF-0019.png
archetype: [J.ACQ.case-study]
facets: [A.ERA.current, B.CONT.cards, B.HIER.size, C.PAL.single-accent, C.VAL.light-first, C.SAT.vivid, C.MAT.glass-frosted, D.FACE.geometric-sans, D.SCALE.dramatic, D.WGT.high-contrast, D.CASE.title, E.RAD.large, E.RAD.asymmetric, E.DEP.flat, F.IMG.render-3d, F.3D.rendered-real, F.DEP.soft, E.ENV.tonal-field]
imagery_dep: soft
rtl: risky
cost: high
verdict: adapt
confidence: med
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
modified: Thu 2026-11-26 1:45 PM EST (UTC-05:00)
---

# REF-0019 — Case-study card — tab notch, blurred orange 3D banner, heavy navy title

## Read

*Figures measured off the image with Python/PIL (median-sampled hex, WCAG 2.x ratios, ink heights in original-image pixels unless stated); type-scale ratios are derived from those ink heights; radii in px are estimated by eye.*

**Colour.** White card on `#1a1a1a`; banner a blurred orange render `#ff4d26` → `#ff7455`; text navy `#091431`; secondary `#a3a9b7`. Chip tint `#f9dbd5` with orange text `#e45d3f`. Single accent.

**Typography.** Heavy, large navy heading (multi-line) against light small grey support — high weight contrast and a dramatic scale; '01' index in `#6d758d`. Geometric sans.

**Layout & harmony.** Banner top with a frosted chip and 'CASE 01' tab; title block; supporting line. Asymmetric folder-tab notch top-right.

**Shape & surface.** Large radius with an asymmetric tab cut-out; frosted chip over the render. Flat card.

**Buttons & components.** No button; chip and tab act as labels.

**Gradient & imagery.** 3D render, heavily blurred, as the banner — decoration, soft, but costly.

**Contrast.** Title 18.2:1. Secondary `#a3a9b7` on white = 2.36:1 — **fails**. Chip text `#e45d3f` on `#f9dbd5` = 2.72:1 — **fails**. White on banner `#ff4d26` = 3.31:1.

## Why the verdict

Concept; two contrast failures and a costly render. The tab-notch + heavy title mechanism is worth adapting.

## Notes

Original filename: `pin-component-design-idea-phdA8PzuOCTQ.png`. Tab notch recurs in REF-0004.

**Related:** —
