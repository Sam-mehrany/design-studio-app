---
type: design-ref
id: REF-0061
title: "Dark staged laptop mockup — bio-concrete landing, orange-gradient screen echoed by rim light"
source: "Pinterest board 'mockup-idea' (mehrani0146)"
kind: concept
concept: mockup
captured: 2026-11-26
image: library/REF-0061.png
archetype: [J.ACQ.landing]
facets: [A.FAM.spatial-3d, A.ERA.current, A.POS.premium, B.GRID.asymmetric, B.DEN.sparse, B.HIER.size, C.VAL.dark-first, C.PAL.single-accent, C.SAT.vivid, D.FACE.grotesque, D.FACE.mono, D.PAIR.mono-accent, D.CASE.all-caps-display, D.SET.tight-display, E.EDGE.bleed, E.ENV.staged, F.IMG.render-3d, F.IMG.ui-as-image, F.3D.rendered-real, F.DEP.hard, F.COST.high, K.DEV.desktop, K.LOC.ltr-latin]
imagery_dep: hard
rtl: breaks
cost: high
verdict: adapt
confidence: med
status: reviewed
sam_reaction: like
sam_note: industrial environment
tags: [design/ref]
modified: Thu 2026-11-26 1:40 PM EST (UTC-05:00)
---

# REF-0061 — Dark staged laptop mockup — bio-concrete landing, orange-gradient screen echoed by rim light

## Read

Measured: hex values and WCAG ratios sampled from the original file with Python/PIL (median of a region for grounds, extreme-luminance pixels for text, so anti-aliasing can pull a ratio slightly low); cap heights by row profiling where stated. Anything marked *estimated* was read by eye.

**Colour.** Scene is near-black (`#0e0e0e` field, `#060506` top of screen); the screen runs a vertical black → red-orange gradient (`#3c0e09` mid, headline ground `#bf4018`) and the plinth's fluted slats carry the same hue as rim light (`#c92d1b`). One hue does every job: screen accent, environment light and brand. No second hue anywhere.

**Typography.** Hero is a 4-line ALL-CAPS white grotesque, tight leading (the 4 lines span ~120px on a 1400px original, so leading ≈ cap height), set flush-left bottom. Micro copy is tiny monospaced caps (nav, timestamp, "SCROLL TO EXPLORE"). Hero-to-micro roughly 6× (*estimated*). Two families: display grotesque + mono.

**Layout & harmony.** Asymmetric: headline anchored bottom-left, 3D render of two blocks floating top-centre, a short spec paragraph and a small light form card at right. Sparse; size alone ranks it. The props in the scene are the same branded blocks as on screen, so the set dressing repeats the UI's subject.

**Shape & surface.** Screen UI is essentially flat with one small rounded light card (≈4px, *estimated*). The depth is all in the scene: hard-lit concrete, fluted metal plinth, reflective laptop deck.

**Buttons & components.** No real CTA — a bracketed text link "[ SCROLL TO EXPLORE ]" and a ghost form card. Buttons are deliberately quiet against the render.

**Gradient & imagery.** The gradient and the 3D block render carry the screen; delete them and only a caption-sized layout is left. The mockup itself is a full staged 3D render.

**Contrast.** Headline `#e1eaec` on `#bf4018` = 4.34:1 (passes as large text, would fail at body size); mono micro `#e1e5e6` on `#af3114` = 5.06:1. Upper half of the screen is black-on-black around the render — anything placed there would need white.

## Why the verdict

Saved for the staging: the environment is lit in the screen's accent and dressed with the product itself, so device and UI read as one piece. Hard imagery dependency and high render cost keep it at adapt; the mechanism (accent-keyed rim light, product-as-prop) transfers, the finish does not.

## Notes

Original file: `pin-mockup-idea-cAVjZ_tugG9w.png`. Copy has typos ("HIGHT", "MANUFACTRER") — a portfolio concept, not a shipped site. A strong linear two-stop gradient has no exact C.MAT term (`gradient-subtle` is too weak, `gradient-mesh` is multi-point); proposed `C.MAT.gradient-linear` for Sam to consider. A 1-row light strip at the bottom edge is a pin artefact.

**Related:** —
