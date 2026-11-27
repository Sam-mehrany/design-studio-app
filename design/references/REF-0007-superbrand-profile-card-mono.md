---
type: design-ref
id: REF-0007
title: "Superbrand profile card, monochrome grey-on-black"
source: "Pinterest board 'component-design-idea' (mehrani0146)"
kind: concept
concept: component
captured: 2026-11-26
image: library/REF-0007.png
archetype: [J.ACQ.profile-public]
facets: [A.ERA.current, B.CONT.cards, C.PAL.monochrome, C.VAL.dark-first, C.MAT.gradient-subtle, D.FACE.neo-grotesque, D.WGT.two-step, D.SCALE.two-tier, E.RAD.large, E.RAD.pill, E.DEP.flat, E.ENV.tonal-field, F.IMG.none, F.ICON.solid]
imagery_dep: none
rtl: clean
cost: low
verdict: adapt
confidence: med
status: reviewed
sam_reaction: like
sam_note:
tags: [design/ref]
modified: Thu 2026-11-26 1:45 PM EST (UTC-05:00)
---

# REF-0007 — Superbrand profile card — monochrome grey-on-black

## Read

*Figures measured off the image with Python/PIL (median-sampled hex, WCAG 2.x ratios, ink heights in original-image pixels unless stated); type-scale ratios are derived from those ink heights; radii in px are estimated by eye.*

**Colour.** Strict monochrome: page gradient `#020202` → `#333333`, banner grey gradient `#cacaca` → `#e3e3e3`, body `#000000`, Follow pill ≈`#bcbcbc`. No hue at all.

**Typography.** Name cap 26px vs bio cap 14px (orig px) — 1.86×. Two weights. Secondary text in two greys: handle/labels `#7c7c82`, bio `#b4b4ba`.

**Layout & harmony.** Same X-profile anatomy as REF-0002/0016: banner, overlapping logo tile, Follow right, name/handle/bio/stats.

**Shape & surface.** Large card radius, rounded-square logo tile, pill button. Flat — no border or shadow; the card separates by value from the gradient page.

**Buttons & components.** Light-grey Follow pill with black text (≈11:1); the only light object below the banner, so it reads first.

**Gradient & imagery.** Two subtle linear gradients (page and banner). No imagery.

**Contrast.** Name/numbers white 21:1; bio `#b4b4ba` = 10.2:1; handle `#7c7c82` on black = 5.06:1, passes.

## Why the verdict

Concept; monochrome version of a shipped anatomy. Cheap and legible; adapt.

## Notes

Original filename: `pin-component-design-idea-FILAxlBribAg.png`. Series with REF-0002 and REF-0016.

**Related:** —
