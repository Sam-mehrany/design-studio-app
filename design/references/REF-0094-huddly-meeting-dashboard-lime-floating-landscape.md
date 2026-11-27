---
type: design-ref
id: REF-0094
title: "Meeting dashboard concept floating over a meadow photo — light cards, neon-lime highlight, coloured row stripes (huddly)"
source: "Pinterest board 'mockup-idea' (mehrani0146)"
kind: concept
concept: web
captured: 2026-11-27
image: library/REF-0094.jpg
archetype: [J.DATA.home]
facets: [A.FAM.corporate-saas, A.ERA.current, B.GRID.modular, B.DEN.moderate, B.HIER.colour, B.CONT.cards, B.CONT.tray, C.VAL.light-first, C.PAL.single-accent, C.SAT.neon, C.MAT.gradient-subtle, D.FACE.geometric-sans, D.SCALE.moderate, E.RAD.large, E.RAD.pill, E.ACC.side-stripe, E.ACC.badge, F.ICON.line, F.IMG.photography, F.DEP.soft, F.COST.med, K.DEV.desktop, K.INPUT.pointer, K.LOC.ltr-latin]
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
medium: composite
platform: desktop
---

# REF-0094 — Meeting dashboard concept floating over a meadow photo — light cards, neon-lime highlight, coloured row stripes (huddly)

## Nature

A flat dashboard floating over a meadow photo, no device → composite.

*Nature backfilled by Hark, 27 Nov 2026, from the image.*

## Read

Measured: hex values and WCAG ratios sampled from the original file with Python/PIL (median of a region for grounds, extreme-luminance pixels for text, so anti-aliasing can pull a ratio slightly low); cap heights by row profiling where stated. Anything marked *estimated* was read by eye. These pins are ~564px wide, so small UI text is only 3–6px tall in the file; its sampled ratio reads lower than the designed colour would, and is flagged where that matters.

**Colour.** Light: frame/page `#ededed`, cards `#fefefe`. One accent, neon lime `#dbff41`, used for the primary action, the current schedule row and the delta chips; a pale-blue gradient `#a8d6fe` washes the "Up next" card and the AI input. Row stripes add lavender, sand and rose at low saturation. Black `#2a2e2d` for the secondary CTA and active nav pill. Backdrop: sky `#97b4c5`, grass `#96993f`.

**Typography.** Geometric sans, sentence case. Greeting cap height ~11px, stat numerals 10px (measured), labels ~2–3px x-height: a moderate scale where the greeting and stats sit close in size.

**Layout & harmony.** Tray of cards inside a large rounded frame: greeting row, featured "Up next" card, three stat cards, schedule list; right column of highlights, action items and an AI prompt. Moderate density; colour (lime) ranks the "now" items.

**Shape & surface.** Large frame and card radii, pill chips and buttons; tonal separation, no heavy shadows.

**Buttons & components.** Lime "Join & record", black "New meeting", outline "Join with link". Schedule rows carry a coloured left stripe per meeting type.

**Gradient & imagery.** The meadow is presentation (soft); the blue wash is subtle CSS.

**Contrast.** Greeting `#3e3e3e` = 8.97:1; stat numerals 10.5:1. Sub-lines `#a5a5a5` = 1.93:1, stat labels 2.19:1, highlight text `#949494` = 3.03:1 — fail. Lime button label sampled 3.66:1 (dark text on `#dbff41` would be 16.5:1 if set in true near-black).

## Why the verdict

"Lime marks now" is a clear, cheap highlight rule and the card anatomy is sound; grey secondary text fails throughout. Concept → adapt, med.

## Notes

Original file: `pin-mockup-idea-1024498615378162267.jpg`. Pin: https://www.pinterest.com/pin/1024498615378162267/ — outbound link: https://dribbble.com/shots/27847321-AI-Meeting-Dashboard-Design-Meeting-Notes-Task-Tracking. Pin links to the Dribbble shot "AI Meeting Dashboard Design". Concept doubt: no device hardware — a UI panel floating over a landscape photo — so judged as the UI (`web`). Close in system to REF-0083.

**Related:** REF-0083 · REF-0080
