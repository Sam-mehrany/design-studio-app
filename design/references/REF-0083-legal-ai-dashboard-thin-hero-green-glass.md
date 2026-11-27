---
type: design-ref
id: REF-0083
title: "Legal AI dashboard concept — thin oversized greeting, deep-green glass render, gantt timeline, assistant panel (FlowFunds)"
source: "Pinterest board 'dashboard-design' (mehrani0146)"
kind: concept
concept: web
captured: 2026-11-27
image: library/REF-0083.jpg
archetype: [J.DATA.home]
facets: [A.FAM.corporate-saas, A.ERA.current, A.POS.premium, B.GRID.modular, B.DEN.moderate, B.HIER.size, B.CONT.cards, C.VAL.light-first, C.PAL.single-accent, C.SAT.muted, C.VIZ.categorical, C.MAT.glass-frosted, D.FACE.geometric-sans, D.SCALE.dramatic, D.WGT.weight-only, D.HERO.display-numeral, D.CASE.sentence, E.RAD.medium, E.RAD.pill, E.DEP.shadow-elevation, F.IMG.render-3d, F.3D.rendered-real, F.DEP.soft, F.COST.med, K.DEV.desktop, K.LOC.ltr-latin]
imagery_dep: soft
rtl: risky
cost: med
verdict: adapt
confidence: med
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
modified: Fri 2026-11-27 12:45 PM EST (UTC-05:00)
---

# REF-0083 — Legal AI dashboard concept — thin oversized greeting, deep-green glass render, gantt timeline, assistant panel (FlowFunds)

## Read

Measured: hex values and WCAG ratios sampled from the original file with Python/PIL (median of a region for grounds, extreme-luminance pixels for text, so anti-aliasing can pull a ratio slightly low); cap heights by row profiling where stated. Anything marked *estimated* was read by eye. These pins are ~564px wide, so small UI text is only 3–6px tall in the file; its sampled ratio reads lower than the designed colour would, and is flagged where that matters.

**Colour.** Light, cool neutrals: outer `#eaeaea`, hero field `#e7ecef`, cards `#fcfbfe`. One brand hue, deep green: urgent card `#2b4e40`, timeline bars `#4e8476`, mint chip/progress `#70e2b1`. Timeline also uses a wine `#924251` and charcoal `#39393b` — three categorical hues for case types, red reserved for the "+" action.

**Typography.** Geometric sans. Hero "Today's priorities" is a thin/light weight at ~30px glyph run (measured, incl. descender) against ~12px stat numerals (*estimated*) and 3–5px labels — a dramatic, weight-only hierarchy (huge but light hero, bold numerals). Sentence case.

**Layout & harmony.** Floating nav pill bar, split hero (claim left, 3D glass ribbon right), a row of four stat cards, then a 3-column lower band: needs-attention 2×2, timeline gantt, AI assistant panel. Moderate density; size ranks. Radius ~10px and pill chips everywhere.

**Shape & surface.** Medium card radius, pill nav and chips, soft shadow elevation on the whole sheet; the nav bar is frosted.

**Buttons & components.** Black circular send button, pill tabs, green striped risk bar, avatar stacks on timeline bars. Controls stay quiet; the green card and the render are the loud items.

**Gradient & imagery.** Glossy dark-green 3D ribbon in the hero — decoration; the dashboard stands without it (soft), but it is the only thing that makes the hero more than a greeting.

**Contrast.** Hero black on `#dfe8e9` = 16.8:1; stat numerals 19.8:1. Hero sub `#717c7c` = 3.31:1, stat labels `#898989` = 3.29:1, stat words `#a2a2a2` = 2.45:1, timeline hours 2.66:1, card micro 2.30:1 — all fail. White on the urgent green `#2b4e40` = 9.3:1.

## Why the verdict

The thin-hero-plus-bold-numerals hierarchy and a restrained green brand system are worth taking; contrast of all secondary text fails and it is a three-perfect-rows concept. Adapt, med.

## Notes

Original file: `pin-dashboard-design-1024498615378162296.jpg`. Pin: https://www.pinterest.com/pin/1024498615378162296/ — outbound link: https://contra.com/p/k72sQBYq-flow-funds-legal-ai-dashboard-uiux-design. Pin description: "FlowFunds is a legal AI dashboard concept for busy law teams" (Contra project). Timeline gantt reads left-to-right in time — RTL would need the axis mirrored.

**Related:** —
