---
type: design-ref
id: REF-0016
title: "Motia profile card, white body on blue radial field"
source: "Pinterest board 'component-design-idea' (mehrani0146)"
kind: concept
concept: component
captured: 2026-11-26
image: library/REF-0016.png
archetype: [J.ACQ.profile-public]
facets: [A.ERA.current, B.CONT.cards, C.PAL.single-accent, C.VAL.light-first, C.SAT.vivid, D.FACE.neo-grotesque, D.WGT.two-step, D.SCALE.two-tier, E.RAD.large, E.RAD.pill, E.DEP.flat, E.ENV.tonal-field, F.IMG.none, F.ICON.line]
imagery_dep: none
rtl: clean
cost: low
verdict: adapt
confidence: med
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
modified: Thu 2026-11-26 1:45 PM EST (UTC-05:00)
component_type: I.TYPE.profile-card
medium: flat-ui
platform: none
---

# REF-0016 — Motia profile card — white body on a blue radial field

## Nature

One profile card on a blue radial field.

*Nature backfilled by Hark, 27 Nov 2026, from the image.*

## Read

*Figures measured off the image with Python/PIL (median-sampled hex, WCAG 2.x ratios, ink heights in original-image pixels unless stated); type-scale ratios are derived from those ink heights; radii in px are estimated by eye.*

**Colour.** Single accent blue: field `#0f1942` → `#1c3691`, banner `#172764` → `#2846b9`, logo tile `#213da2`; body pure white. Secondary grey `#71767a` and link `#1d9bf0` are X's own tokens.

**Typography.** Name bold black (21:1), handle and meta `#71767a`. Two weights, compact; neo-grotesque.

**Layout & harmony.** X-profile anatomy again (cf. REF-0002, REF-0007): banner, logo tile overlapping left, Follow right, name/handle/bio/link/stats.

**Shape & surface.** Large radius card, rounded-square logo tile, black pill Follow. Flat; floats on a tonal radial field.

**Buttons & components.** Black Follow pill — the darkest block on the card.

**Gradient & imagery.** Radial gradient field and banner gradient; no imagery.

**Contrast.** Handle `#71767a` on white = 4.59:1, just passes. Link `#1d9bf0` on white = 3.00:1 — **fails** for body-size text.

## Why the verdict

Concept, cheap, legible except the link blue. Adapt.

## Notes

Original filename: `pin-component-design-idea-n0ZmMK4k03Wg.png`. Series with REF-0002, REF-0007.

**Related:** —
