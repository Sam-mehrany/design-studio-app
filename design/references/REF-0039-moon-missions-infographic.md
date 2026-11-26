---
type: design-ref
id: REF-0039
title: "'MOON' — lunar missions timeline infographic poster (OMG Space)"
source: "Pinterest board 'poster' — pin https://www.pinterest.com/pin/e1_AfqPShwam-kvMQlvCcYBpb8ZyuDAeu3_Mii0RbrJj-y5kDrnQAgF/"
kind: print
concept: imagery
captured: 2026-11-26
image: library/REF-0039.jpg
archetype: [J.REF.imagery, J.DATA.trend]
facets: [A.FAM.print-poster, A.FAM.blueprint, F.IMG.data-as-image, F.IMG.photography, C.VAL.dark-first, C.PAL.neutral-only, C.VIZ.categorical, C.CON.high, D.FACE.display, D.CASE.all-caps-display, D.SCALE.dramatic, D.WGT.high-contrast, B.DEN.dense, B.HIER.size, E.STROKE.hairline, H.LEN.explanatory, H.VOCAB.domain-real]
imagery_dep: soft
rtl: risky
cost: low
verdict: adapt
confidence: med
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
modified: Thu 2026-11-26 12:49 PM EST (UTC-05:00)
---

# REF-0039 — "MOON" — lunar missions timeline infographic poster (OMG Space)

## Read

*All hex values and contrast ratios below are **measured** with Python/PIL off the image (region medians, median-cut clusters, or darkest/lightest-5% glyph samples; WCAG 2.x formula). Type sizes and ratios are estimated by eye.*

**Colour.** Dark-first neutral: starfield `#1a1a1a` / `#1b1b1b` / `#222222`, white for all type and lines, mid grey `#929190` for the moon. The only hues are country flags on the mission labels (red `#bf1b1e` etc.) — colour carries category, nothing decorates.

**Typography.** Dramatic two-tier scale: "MOON" in a thin condensed display face at roughly 10–12× the label size; three stat lines in small caps under it; mission labels in a bold/regular pair ("**Luna 16** September 1970"). Thin display vs bold labels gives high weight contrast.

**Layout & harmony.** Mirrored timeline: decades 1970–1990 on the left rail, 2000–FUTURE on the right; each mission label routes via hairline leader lines (circuit-board style, 45° bends) into concentric orbit rings around the moon, ending in a status glyph. Bottom band: legend (success/failure/planned/ongoing) and a planet size-scale row.

**Shape & surface.** All structure is one white hairline stroke; label chips are white bars; no shadows.

**Gradient & imagery.** Moon photo and starfield are decoration — remove them and the diagram still reads (soft).

**Contrast.** "MOON" white on `#1a1a1a` = 17.4:1; mission labels dark on white chips ≈20:1; body paragraph `#b4b3b3` on `#1a1a1a` = 8.32:1; planet-scale captions `#8e8e8e` = 5.31:1 (pass AA, but tiny).

## Why the verdict

Strong, mostly vector data-graphic mechanism (hairline leader routing, status glyph legend, dark-first with colour only for category) that adapts to a timeline/report view; poster density and chronology direction need rework for RTL and screens.

## Notes

Concept is imagery (a print infographic, no UI) but J.DATA.trend is added as the subject archetype, mirroring the slide rule. RTL risky: decade rails would need to swap sides and leader lines re-route. Highest-value reference in this batch for data visualisation.

Original filename: `pin-poster-e1_AfqPShwam-kvMQlvCcYBpb8ZyuDAeu3_Mii0RbrJj-y5kDrnQAgF.jpg`

**Related:** —
