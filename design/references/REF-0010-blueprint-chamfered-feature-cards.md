---
type: design-ref
id: REF-0010
title: "Landing feature row: chamfered cream and orange cards with line diagrams"
source: "Pinterest board 'component-design-idea' (mehrani0146)"
kind: concept
concept: web
captured: 2026-11-26
image: library/REF-0010.jpg
archetype: [J.ACQ.feature]
facets: [A.FAM.blueprint, A.ERA.current, B.GRID.columnar, B.DEN.moderate, B.CONT.cards, C.PAL.single-accent, C.VAL.tonal-layered, C.SAT.vivid, D.FACE.neo-grotesque, D.PAIR.mono-accent, D.CASE.all-caps-label, D.SET.tracked-caps, E.RAD.sharp, E.STROKE.hairline, E.TEX.pattern, F.IMG.illustration, F.ILL.technical-diagram, F.ILL.line]
imagery_dep: soft
rtl: risky
cost: low
verdict: adapt
confidence: low
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
modified: Thu 2026-11-26 1:45 PM EST (UTC-05:00)
---

# REF-0010 — Landing feature row — chamfered cream and orange cards with line diagrams

## Read

*Figures measured off the image with Python/PIL (median-sampled hex, WCAG 2.x ratios, ink heights in original-image pixels unless stated); type-scale ratios are derived from those ink heights; radii in px are estimated by eye.*

**Colour.** Dark page `#262626`; cards cream `#f0e6dc` (inner panel `#ebe1d5`) and one active card orange `#fd7239`/`#de5d37` at its foot. Single accent; cream is a warm neutral, not a second hue.

**Typography.** Card title cap 19px vs footnote cap 9px (preview px) — ~2×. Sans titles with a monospace tracked-caps label layer (index numbers, micro-labels). Low-resolution source — size figures are approximate.

**Layout & harmony.** Three-up columnar card row under a dark band; each card: mono label → line diagram → title → footnote. Blueprint/technical register.

**Shape & surface.** Corners are **chamfered** (cut at 45°), not rounded — closest term `E.RAD.sharp`. Hairline line-art, dot-pattern fills inside diagrams.

**Buttons & components.** No buttons visible; the active state is the orange fill.

**Gradient & imagery.** Technical line diagrams carry meaning per card; without them the cards are bare text (soft).

**Contrast.** Dark text on cream = 14.1:1. Black on orange `#fd7239` ≈ 6.3:1, on `#de5d37` ≈ 4.75:1 (nominal). Index numerals and month ticks measured 1.4–1.8:1 — decorative, **fail** if they carry information.

## Why the verdict

Concept; mechanism (chamfer + mono labels + one hot card) is cheap and distinctive. Low confidence: the source is a blurred phone screenshot, so contrast readings are lower bounds.

## Notes

Original filename: `pin-component-design-idea-S2OPxW1Yjj9g.jpg`. Captured as a phone screenshot of a Pinterest pin (status bar visible) — judged as flat web UI, not a mockup. **Missing distinction:** no radius term for chamfered/cut corners; propose `E.RAD.chamfer` to Sam.

**Related:** —
