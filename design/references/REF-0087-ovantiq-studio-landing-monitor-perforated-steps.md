---
type: design-ref
id: REF-0087
title: "Studio display on perforated steps — white studio landing, heavy ALL-CAPS statement, black 3D-ribbon panel (Ovantiq)"
source: "Pinterest board 'mockup-idea' (mehrani0146)"
kind: shipped
concept: mockup
captured: 2026-11-27
image: library/REF-0087.jpg
archetype: [J.ACQ.landing]
facets: [A.FAM.swiss, A.ERA.current, B.GRID.columnar, B.DEN.moderate, B.HIER.size, C.VAL.light-first, C.PAL.single-accent, D.FACE.grotesque, D.CASE.all-caps-display, D.SET.tight-display, D.SCALE.dramatic, E.RAD.small, E.ENV.staged, E.TEX.pattern, F.IMG.render-3d, F.IMG.abstract-shape, F.DEP.soft, F.COST.med, K.DEV.large-display, K.LOC.ltr-latin]
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

# REF-0087 — Studio display on perforated steps — white studio landing, heavy ALL-CAPS statement, black 3D-ribbon panel (Ovantiq)

## Read

Measured: hex values and WCAG ratios sampled from the original file with Python/PIL (median of a region for grounds, extreme-luminance pixels for text, so anti-aliasing can pull a ratio slightly low); cap heights by row profiling where stated. Anything marked *estimated* was read by eye. These pins are ~564px wide, so small UI text is only 3–6px tall in the file; its sampled ratio reads lower than the designed colour would, and is flagged where that matters.

**Colour.** Monochrome UI: page `#fefefe`, type `#000000`, panel `#060604`, greys `#676767`–`#8c8c8c`. One tiny accent: lime dots `#d1df87` on the numbered service list. Scene in greyscale: `#323232` room, `#acacae` perforated metal.

**Typography.** Heavy ALL-CAPS grotesque statement over two lines, tight — "MAKE" cap height 17px (measured) vs ~5–6px body (*estimated* from a 4px x-height run): roughly 3×. Small tag chip in caps; numbered list "01 / 02".

**Layout & harmony.** Columnar: tag, statement, a full-width black render panel with a small overlaid people card, then body left and numbered list right on a shared baseline. Moderate density, size ranks.

**Shape & surface.** Small radii (~6px panel, chip), flat, no shadows except the overlay card.

**Buttons & components.** One black button with a square icon in the nav ("Start a conversation"); everything else text.

**Gradient & imagery.** B/W 3D ribbon render fills the panel — atmosphere only (soft).

**Contrast.** Statement black on `#f8f8f8` = 19.8:1; nav `#676767` = 5.47:1; list 12.2:1; body `#8c8c8c` = 3.31:1 — fails; list numerals `#848484` = 3.55:1 — fails.

## Why the verdict

Real Framer template (shipped). Monochrome Swiss mechanism with a single micro-accent transfers cheaply; body grey fails. Adapt, med.

## Notes

Original file: `pin-mockup-idea-1024498615378106149.jpg`. Pin: https://www.pinterest.com/pin/1024498615378106149/ — outbound link: https://store.muz.li/p/ovantiq-by-minhas-jamil-f6d0932b9955d9f97725d76d7512e779. Pin links to Muzli store "Ovantiq" free Framer template. Staging (display on perforated black steps) is the mockup subject.

**Related:** REF-0048 · REF-0066
