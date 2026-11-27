---
type: design-ref
id: REF-0081
title: "Agency pricing section — nested white-in-grey plan cards, black full-width CTA, black partnership band"
source: "Pinterest board 'component-design-idea' (mehrani0146)"
kind: concept
concept: web
captured: 2026-11-27
image: library/REF-0081.jpg
archetype: [J.ACQ.pricing]
facets: [A.FAM.corporate-saas, A.ERA.current, B.GRID.columnar, B.DEN.moderate, B.HIER.size, B.CONT.nested, B.CONT.tray, C.VAL.light-first, C.PAL.neutral-only, C.MAT.gradient-subtle, D.FACE.neo-grotesque, D.PAIR.single, D.CASE.sentence, D.HERO.inline, D.WGT.two-step, E.RAD.large, E.RAD.nested-rule, E.DEP.tonal, F.ICON.solid, F.IMG.none, F.DEP.none, F.COST.low, K.DEV.desktop, K.INPUT.pointer, K.LOC.ltr-latin]
imagery_dep: none
rtl: clean
cost: low
verdict: adapt
confidence: med
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
modified: Fri 2026-11-27 12:45 PM EST (UTC-05:00)
---

# REF-0081 — Agency pricing section — nested white-in-grey plan cards, black full-width CTA, black partnership band

## Read

Measured: hex values and WCAG ratios sampled from the original file with Python/PIL (median of a region for grounds, extreme-luminance pixels for text, so anti-aliasing can pull a ratio slightly low); cap heights by row profiling where stated. Anything marked *estimated* was read by eye. These pins are ~564px wide, so small UI text is only 3–6px tall in the file; its sampled ratio reads lower than the designed colour would, and is flagged where that matters.

**Colour.** Neutral only: page `#fafafa`, outer tray cards `#f3f3f3`, inner cards `#ffffff`, a full-width dark band `#212121`, buttons `#060612`. The only hue is decorative: a faint pink glow `#fae8f4` inside the second plan and a pale-green availability dot `#94c68b` on the dark band.

**Typography.** Neo-grotesque, sentence case, medium-weight headline. Measured glyph runs: headline line 18px incl. descenders, plan title 11px, price numerals 11px cap height, list 5px x-height. Price is set inline with a small grey "/fixed" unit. Two weights.

**Layout & harmony.** Header block left-aligned with a three-way segmented filter beneath; two equal plan columns, then a full-width third plan on black. Each plan = grey tray holding a white inner card (name, blurb, price, CTA) above a two-column checklist. Same anatomy repeated, so it reads as one system.

**Shape & surface.** Large outer radius (~14px) with a smaller inner radius — nested-radius rule kept. Depth by tone (white on grey), no shadows.

**Buttons & components.** Full-width black "Book a call" with a calendar glyph in every light card; the dark band inverts to a white button. Filled black check circles in the lists. Segmented control and a small toggle ("Fast delivery").

**Gradient & imagery.** Only the faint pink glow, removable without loss.

**Contrast.** Headline black on `#fafafa` = 20.1:1; price 19.4:1; button label 11.8:1. Subtitle `#909090` = 3.06:1 — fails; inner blurb `#a9a9a9` = 2.29:1 — fails; toggle label 2.27:1 — fails; dark-band blurb `#6c6c6c` on `#212121` = 2.96:1 — fails. Hierarchy leans on grey too light to read.

## Why the verdict

Tray-and-inner-card anatomy and the dark "premium" band are cheap, mirror cleanly and transfer; the secondary grey text fails AA throughout. Concept → adapt, med.

## Notes

Original file: `pin-component-design-idea-1024498615378161050.jpg`. Pin: https://www.pinterest.com/pin/1024498615378161050/. No outbound link or description on the pin. Near REF-0005 (light and dark card nested in a white tray) in mechanism.

**Related:** REF-0005 · REF-0012
