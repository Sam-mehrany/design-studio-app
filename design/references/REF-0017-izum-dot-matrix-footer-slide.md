---
type: design-ref
id: REF-0017
title: "Case-study slide: IZUM.STUDY footer with red LED dot-matrix"
source: "Pinterest board 'component-design-idea' (mehrani0146)"
kind: concept
concept: slide
captured: 2026-11-26
image: library/REF-0017.png
archetype: [J.PRES.slide, J.ACQ.landing]
facets: [A.FAM.retro-terminal, A.ERA.current, B.GRID.columnar, B.DEN.moderate, C.PAL.single-accent, C.VAL.dark-first, C.SAT.vivid, C.MAT.glass-frosted, D.FACE.mono, D.PAIR.single, D.CASE.all-caps-label, D.SET.tracked-caps, E.RAD.small, E.DEP.live-blur, E.TEX.pattern, F.IMG.abstract-shape, F.DEP.soft, K.DEV.desktop]
imagery_dep: soft
rtl: risky
cost: med
verdict: adapt
confidence: low
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
modified: Thu 2026-11-26 1:45 PM EST (UTC-05:00)
---

# REF-0017 — Case-study slide — IZUM.STUDY footer with a red LED dot-matrix

## Read

*Figures measured off the image with Python/PIL (median-sampled hex, WCAG 2.x ratios, ink heights in original-image pixels unless stated); type-scale ratios are derived from those ink heights; radii in px are estimated by eye.*

**Colour.** Board `#0d0d0d`; footer lit by a red gradient (`#97402b` → `#d93b15`) and a field of red LED dots (`#bf2c16`). One accent, red; everything else white and grey `#999999`.

**Typography.** Monospace throughout, all caps, tracked — board labels '[Р:] / ДЕСКТОП', nav, footer links. Single family; hierarchy only by white vs grey.

**Layout & harmony.** Slide frame: corner labels, centred browser window. Inside, footer columns: tagline + two link columns, centre CTA, right contacts, bottom legal row.

**Shape & surface.** Small radii (~4px) on the frosted footer panel and buttons. The footer panel is translucent over the dot field.

**Buttons & components.** White rectangular 'ЗАПИСАТЬСЯ' button with a square icon companion — tiny, high contrast.

**Gradient & imagery.** LED dot-matrix pattern + red glow is the whole idea; footer text sits on a frosted layer above it (soft dependence).

**Contrast.** Board labels `#999999` on `#0d0d0d` = 6.82:1. Footer link text `#dabbb4` on the red `#97402b` = 3.81:1 — **fails** at its small size; white on `#d93b15` = 4.58:1.

## Why the verdict

Portfolio slide, concept. Mono dot-matrix footer is distinctive and cheap as CSS; contrast on the red end needs care. Low confidence on whether Sam saved it for the slide or the footer.

## Notes

Original filename: `pin-component-design-idea-nEnUNM95kBhg.png`. Concept ambiguity: a presentation board (page 25 of a deck) showing a web footer in browser chrome. Filed as slide per the rule; the subject is a landing footer. Cyrillic (Russian) copy — **missing distinction:** K.LOC has no LTR-Cyrillic term; recorded no locale term.

**Related:** —
