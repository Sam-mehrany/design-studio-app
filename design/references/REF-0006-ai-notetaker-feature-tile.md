---
type: design-ref
id: REF-0006
title: "AI notetaker feature tile: blueprint grid, notes card, glass clock render"
source: "Pinterest board 'component-design-idea' (mehrani0146)"
kind: brand
concept: component
captured: 2026-11-26
image: library/REF-0006.jpg
archetype: [J.ACQ.feature]
facets: [A.FAM.blueprint, A.ERA.current, B.HIER.colour, B.CONT.nested, C.PAL.single-accent, C.VAL.dark-first, C.SAT.vivid, D.FACE.neo-grotesque, D.WGT.single, D.SCALE.tight, E.RAD.medium, E.DEP.tonal, E.STROKE.hairline, F.IMG.render-3d, F.3D.rendered-real, F.DEP.soft, F.ICON.line, F.COST.high]
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

# REF-0006 — AI notetaker feature tile — blueprint grid, notes card, glass clock render

## Read

*Figures measured off the image with Python/PIL (median-sampled hex, WCAG 2.x ratios, ink heights in original-image pixels unless stated); type-scale ratios are derived from those ink heights; radii in px are estimated by eye.*

**Colour.** Black page, panel `#111111`, grid hairlines ≈`#202020`, notes card `#373845`. One accent, violet: glass clock glow `#6e42b7`, wedge `#634c95`, plus a violet play button. Text white with a grey tier `#b8b8b8`.

**Typography.** Lead paragraph is two-tone (white then `#b8b8b8`) at the same size and weight; card title matches the lead (both 38px cap orig). Effectively a single-size, single-weight system where colour does the ranking. Neo-grotesque.

**Layout & harmony.** Blueprint register: square grid lines with crosshair nodes framing a centred card. Kicker → two-tone lead → nested notes card with audio player → summary block.

**Shape & surface.** Medium radius (~12px) on the notes card; panel tone steps rather than shadows define depth.

**Buttons & components.** Player row: violet circular play, waveform, time. No primary CTA in the tile.

**Gradient & imagery.** A rendered glass stopwatch/clock overlaps the card corner with violet refraction — the expensive element. The tile survives without it; soft.

**Contrast.** White ≈ 21:1. Grey tier `#b8b8b8` on `#111111` = 9.52:1 and kicker `#a3a7aa` = 7.79:1 — both comfortable.

## Why the verdict

Marketing asset (brand), not product UI. Blueprint grid and colour-ranked lead are cheap and transferable; the glass render is not. Adapt.

## Notes

Original filename: `pin-component-design-idea-EtzLlADOgp9g.jpg`. Reads as a ClickUp-style AI notetaker marketing tile; brand not confirmed from the image. Waveform/player row is directional (risky under RTL).

**Related:** —
