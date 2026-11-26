---
type: design-ref
id: REF-0011
title: "Insight card: thin 89% hero numeral over corner glow"
source: "Pinterest board 'component-design-idea' (mehrani0146)"
kind: concept
concept: component
captured: 2026-11-26
image: library/REF-0011.jpg
archetype: [J.DATA.home]
facets: [A.ERA.current, B.HIER.size, B.HIER.colour, B.DEN.sparse, C.VAL.dark-first, C.MAT.gradient-mesh, C.SAT.muted, D.FACE.neo-grotesque, D.HERO.display-numeral, D.SCALE.dramatic, D.WGT.two-step, D.CASE.sentence, E.RAD.large, E.RAD.pill, E.DEP.flat, F.IMG.abstract-shape, K.ATT.glance]
imagery_dep: none
rtl: risky
cost: med
verdict: adapt
confidence: med
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
modified: Thu 2026-11-26 1:45 PM EST (UTC-05:00)
---

# REF-0011 — Insight card — thin 89% hero numeral over a corner glow

## Read

*Figures measured off the image with Python/PIL (median-sampled hex, WCAG 2.x ratios, ink heights in original-image pixels unless stated); type-scale ratios are derived from those ink heights; radii in px are estimated by eye.*

**Colour.** Card `#181818` on a pale page `#ecebe9`, with a mesh glow in the top-left: green `#439158` and amber `#a06f47`. The glow decorates; green also tints the up-arrow and the Insight icon area. No semantic red/green pair.

**Typography.** Hero numeral 73px tall vs body cap 11px (orig px) — about 6.6×, a dramatic two-tier with a light-weight display numeral. Lead sentence is two-tone at one size: white then `#89898b`. Neo-grotesque.

**Layout & harmony.** Header row (icon + label, period dropdown pill, overflow circle) → hero → lead → note → story-style progress segments. Sparse, glanceable.

**Shape & surface.** Large radius (~28px), pill dropdown, circular overflow button, both outlined. Flat.

**Buttons & components.** Outline pill and circle — very quiet; the number is the interface.

**Gradient & imagery.** Corner mesh glow only; removing it leaves a plain dark card that still reads.

**Contrast.** Hero and lead white ≥ 14:1. Grey lead-in `#89898b` on `#181818` = 5.09:1, passes; footnote `#777777` = 3.97:1 — **fails**. Inactive progress segments `#454545` = 1.85:1 (non-text, below 3:1).

## Why the verdict

Concept. The hero-numeral-plus-sentence mechanism is strong and cheap; the glow and footnote contrast are the parts to drop or fix.

## Notes

Original filename: `pin-component-design-idea-TXeEFXAM1ZdA.jpg`. Copy has a typo ('recieve'). Up-right arrow and progress order are directional (risky).

**Related:** —
