---
type: design-ref
id: REF-0084
title: "Footer — black CTA band with top radial glow, white link card, giant ghost wordmark behind (Graphy)"
source: "Pinterest board 'footer-design' (mehrani0146)"
kind: concept
concept: web
captured: 2026-11-27
image: library/REF-0084.jpg
archetype: [J.ACQ.landing]
facets: [A.FAM.corporate-saas, A.ERA.current, B.GRID.columnar, B.DEN.sparse, B.HIER.size, B.CONT.cards, C.VAL.tonal-layered, C.PAL.neutral-only, C.MAT.gradient-subtle, D.FACE.geometric-sans, D.PAIR.single, D.CASE.sentence, D.SCALE.two-tier, E.RAD.large, E.DEP.shadow-elevation, F.ICON.solid, F.IMG.none, F.DEP.none, F.COST.low, K.DEV.desktop, K.LOC.ltr-latin]
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

# REF-0084 — Footer — black CTA band with top radial glow, white link card, giant ghost wordmark behind (Graphy)

## Read

Measured: hex values and WCAG ratios sampled from the original file with Python/PIL (median of a region for grounds, extreme-luminance pixels for text, so anti-aliasing can pull a ratio slightly low); cap heights by row profiling where stated. Anything marked *estimated* was read by eye. These pins are ~564px wide, so small UI text is only 3–6px tall in the file; its sampled ratio reads lower than the designed colour would, and is flagged where that matters.

**Colour.** Neutral only. CTA band `#000000` with a radial grey glow peaking at `#7f7f7f` at the top edge; page `#e5e5e7`; footer card `#ffffff`. No accent — the black band is the only emphasis.

**Typography.** Geometric sans, sentence case. CTA headline 11px glyph run (measured) in white; link headers medium `#545454`, links regular grey. The ghost wordmark spans a 40px-tall run (measured) at `#f0f0f0` — 4× the headline, but nearly invisible.

**Layout & harmony.** Two stacked blocks: centred CTA (headline, sub, white button) on black, then a white card with brand blurb + socials left and three link columns right, hairline divider, legal row. The wordmark watermark sits behind the bottom edge, cropped. Sparse, symmetric where it matters.

**Shape & surface.** Large radius (~16px) on the black band's lower corners and on the white card; the card floats on a soft shadow.

**Buttons & components.** One small white button on black; social icons as solid glyphs; legal links underlined.

**Gradient & imagery.** A single radial glow on the black band — cheap CSS, removable without loss.

**Contrast.** CTA headline white on the glow `#383838` = 11.7:1; button label 6.8:1; column headers 7.2:1. CTA sub `#444649` on black = 2.12:1 — fails; links `#b2b2b2` on white = 2.07:1 — fails; blurb 2.06:1 and copyright 2.13:1 — fail. Watermark 1.13:1 by design.

## Why the verdict

Cheap, symmetric and RTL-safe footer anatomy; every secondary text colour fails AA. Concept → adapt, med.

## Notes

Original file: `pin-footer-design-1024498615378160497.jpg`. Pin: https://www.pinterest.com/pin/1024498615378160497/. No outbound link or description on the pin. Filed `web` / J.ACQ.landing like the other footer references (REF-0008, REF-0035). Same giant-ghost-wordmark device as REF-0093's backdrop.

**Related:** REF-0008 · REF-0013 · REF-0015 · REF-0037
