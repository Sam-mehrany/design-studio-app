---
type: design-ref
id: REF-0069
title: "Hand-held iPad mockup — dark document app with a perspective 3D fan of glass folders and a green frosted panel"
source: "Pinterest board 'mockup-idea' (mehrani0146)"
kind: concept
concept: mockup
captured: 2026-11-26
image: library/REF-0069.jpg
archetype: [J.CORE.browse]
facets: [A.FAM.glassmorphism, A.FAM.spatial-3d, A.ERA.current, B.GRID.split, B.DEN.moderate, B.HIER.colour, C.VAL.dark-first, C.PAL.single-accent, C.SAT.muted, C.MAT.glass-frosted, D.FACE.geometric-sans, E.RAD.large, E.RAD.pill, E.DEP.live-blur, F.3D.exploded-layers, F.IMG.ui-as-image, F.DEP.none, F.COST.high, E.ENV.tonal-field, K.DEV.tablet, K.INPUT.touch, K.LOC.ltr-latin]
imagery_dep: none
rtl: risky
cost: high
verdict: adapt
confidence: low
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
modified: Thu 2026-11-26 1:40 PM EST (UTC-05:00)
---

# REF-0069 — Hand-held iPad mockup — dark document app with a perspective 3D fan of glass folders and a green frosted panel

## Read

Measured: hex values and WCAG ratios sampled from the original file with Python/PIL (median of a region for grounds, extreme-luminance pixels for text, so anti-aliasing can pull a ratio slightly low); cap heights by row profiling where stated. Anything marked *estimated* was read by eye.

**Colour.** Dark-first: screen `#070707`, table rows `#1f1f1f`/`#171616`, text `#979797`–`#9b9898`. Single accent green: selected folder and frosted panel `#479d66`, dark green top pill `#264931`. Grey void `#b5b5b5` around the device.

**Typography.** Geometric sans, small and light throughout; hierarchy is carried by the green, not by size. Labels in sentence/title case, no caps micro-labels.

**Layout & harmony.** Split: a 3D carousel of translucent folder cards fanned in perspective across the top half, a "Key Dates" table bottom-left, a frosted green compliance panel bottom-right overlapping it. Colour ranks, not size.

**Shape & surface.** Large radius on panels and folders, pill chips (Folders (14), Tags (44)); depth from translucency and live blur, not shadow.

**Buttons & components.** Pill filter chips and circular icon buttons in dark grey; the selected folder is the loudest object on screen.

**Gradient & imagery.** No photography; the 3D fan is the visual interest (rendered UI, so imagery dependency none, but cost high).

**Contrast.** Table text `#979797` on `#1f1f1f` = 5.7:1; "Key Dates" `#9b9898` on `#171616` = 6.3:1; light-green text `#c0fdd5` on the green panel `#419560` = 3.21:1 — fails for body text.

## Why the verdict

The 3D folder fan is a striking browse metaphor but costly (live blur, perspective transforms) and only plausible as a hero moment. Concept → adapt, low.

## Notes

Original file: `pin-mockup-idea-xznNN22SE5vQ.jpg`. Carries a Xiaohongshu watermark (gang2929) and a "RON" studio mark — reposted.

**Related:** —
