---
type: design-ref
id: REF-0022
title: "Dark folder-tab card with 3D render insert"
source: "Pinterest board 'component-design-idea' (mehrani0146)"
kind: concept
concept: component
captured: 2026-11-26
image: library/REF-0022.jpg
archetype: [J.CORE.browse]
facets: [C.VAL.dark-first, C.CON.high, C.PAL.single-accent, D.FACE.geometric-sans, D.HERO.display-numeral, H.NUM.unit-adjacent, D.WGT.two-step, E.RAD.large, E.DEP.tonal, E.STROKE.medium, F.IMG.render-3d, F.3D.rendered-real, A.ERA.current, K.DEV.desktop]
imagery_dep: soft
rtl: risky
cost: high
verdict: adapt
confidence: low
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
modified: Thu 2026-11-26 1:12 PM EST (UTC-05:00)
component_type: I.TYPE.card
medium: flat-ui
platform: none
---

# REF-0022 — Dark folder-tab card with 3D render insert

## Nature

One folder-tab card with a 3D render insert; the render sits inside a flat card.

*Nature backfilled by Hark, 27 Nov 2026, from the image.*

## Read

*Measured with PIL off the pin image (hex = mode of a sampled patch; text ink = strongest anti-aliased pixel in the glyph box, so small-text ratios can understate slightly; sizes are ink heights in image px, not CSS px).*

**Colour.** All-dark: scene `#000000`, card `#202020`, outer ring `#2a2a2a`. The accent is a navy 3D render (`#2e507e` highlights, `#000e4c` shadows) — one blue, decorative.

**Typography.** Geometric sans. Title cap 10px, count `05` 17px (1.7×), secondary `1254 notes` cap 9px. Numeral is set in a *light* weight against a bold title — weight inverted relative to REF-0021.

**Layout & harmony.** Same two-corner composition as REF-0021: title top-left, numeral + unit bottom-left, count bottom-right, image window in the middle.

**Shape & surface.** Large radius with folder-tab notch. Depth is tonal: a 2px-ish ring `#2a2a2a` around a `#202020` body on black — no shadow.

**Buttons & components.** None.

**Gradient & imagery.** A rendered 3D blue form fills the tab window and bleeds into the background; the card survives without it but loses its subject.

**Contrast.** Title `#ffffff` on `#202020` = 16.3:1. Subtitle `#838383` = 4.3:1 and `Doc` unit `#7e7e7e` = 4.0:1 — both just under 4.5:1 (source is only 600px wide, so these are the least reliable figures in the batch).

## Why the verdict

Same mechanism as REF-0021 with an expensive render as the finish; concept shot, and the ring-on-black tonal step is too subtle to survive a real screen.

## Notes

Near-duplicate of REF-0021 (same folder-card pattern). Low-resolution pin (600×422); all measurements approximate. Original filename: `pin-component-design-idea-yHoajaYzeFkg.jpg`. Board is a hint only; concept judged from the image.

**Related:** —
