---
type: design-ref
id: REF-0020
title: "\"Card UI Concept\" post: three fanned frosted cards with amber glow"
source: "Pinterest board 'component-design-idea' (mehrani0146)"
kind: concept
concept: component
captured: 2026-11-26
image: library/REF-0020.jpg
archetype: [J.ACQ.feature]
facets: [A.FAM.glassmorphism, A.ERA.current, B.CONT.cards, B.CONT.nested, C.PAL.single-accent, C.VAL.light-first, C.MAT.glass-frosted, C.SAT.muted, D.PAIR.display-text, D.FACE.neo-grotesque, D.FACE.transitional-serif, E.RAD.large, E.DEP.live-blur, F.IMG.abstract-shape, F.ICON.line, F.COST.high, E.ENV.tonal-field]
imagery_dep: soft
rtl: risky
cost: high
verdict: reject
confidence: med
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
modified: Thu 2026-11-26 1:45 PM EST (UTC-05:00)
---

# REF-0020 — 'Card UI Concept' post — three fanned frosted cards with amber glow

## Read

*Figures measured off the image with Python/PIL (median-sampled hex, WCAG 2.x ratios, ink heights in original-image pixels unless stated); type-scale ratios are derived from those ink heights; radii in px are estimated by eye.*

**Colour.** Blush page `#f1e9e7` with a peach glow `#f6ceb1`; frosted cards `#c7b4a6`/`#c8ae9d`; centre card a dark amber glow `#301002` → `#aa3f0b`; one black panel `#211c19`. Single warm accent.

**Typography.** Italic transitional serif title ('Card UI Concept') over a neo-grotesque UI — display + text pairing; card heads white, subs near-white.

**Layout & harmony.** Three cards fanned and overlapping, each with icon tile → heading → sub → nested inner panel. Presentation composition, not a layout.

**Shape & surface.** Large radii, nested inner panels, frosted glass with live blur and light rims.

**Buttons & components.** Small pill chips ('Deep Search', 'Next.js'); a 'Save for later' pill in the post chrome.

**Gradient & imagery.** Glow and blur are the whole look; costly and load-bearing for the mood.

**Contrast.** On the frosted cards text **fails** badly: white head on `#c7b4a6` = 2.00:1, sub `#eae1da` = 1.55:1, right card sub = 1.61:1. Only the dark centre card passes (sub `#ecb48f` on `#301002` = 9.57:1, falling to 3.36:1 over the glow).

## Why the verdict

Reject: legibility on the frosted cards fails at 1.5–2:1 and the effect cost is high; nothing survives once the glass is made legible except generic cards.

## Notes

Original filename: `pin-component-design-idea-t9ebkg98PeEQ.jpg`. Social-post presentation (staticmania). Could be read as a slide; filed as component because it was saved for the card treatment.

**Related:** —
