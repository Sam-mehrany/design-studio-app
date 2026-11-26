---
type: design-ref
id: REF-0027
title: "Cassette tape, hairline technical vector"
source: "Pinterest board 'music-magezine' — pin https://www.pinterest.com/pin/e1_AfqPShwFTae2eSpMj-X2sSP7iLuVdQOBhEW_xHeIv-n3nU0LkJIx/"
kind: print
concept: imagery
captured: 2026-11-26
image: library/REF-0027.png
archetype: [J.REF.imagery]
facets: [F.IMG.illustration, F.ILL.technical-diagram, F.ILL.line, E.STROKE.hairline, C.PAL.neutral-only, C.VAL.light-first, C.SAT.muted, D.FACE.grotesque, D.CASE.all-caps-display, D.CASE.lowercase, D.WGT.two-step, A.FAM.blueprint, A.ERA.revival, E.TEX.grain, F.DEP.none, F.COST.low]
imagery_dep: none
rtl: clean
cost: low
verdict: adapt
confidence: med
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
modified: Thu 2026-11-26 12:49 PM EST (UTC-05:00)
---

# REF-0027 — Cassette tape, hairline technical vector

## Read

*All hex values and contrast ratios below are **measured** with Python/PIL off the image (region medians, median-cut clusters, or darkest/lightest-5% glyph samples; WCAG 2.x formula). Type sizes and ratios are estimated by eye.*

**Colour.** Neutral-only: warm paper ground `#d8d5ce`, ink `#2e2e2e`, mid greys `#a6a5a1` / `#9a9a9a`, light fills `#e3e1dd`. The one dark mass is the tape pack, filled solid ink; no hue anywhere.

**Typography.** Two-tier: "THIS WAY UP" in bold grey caps (DIN-like grotesque) stacked over a lowercase regular "stereo cassette tape" at roughly 0.6× cap size, both left-aligned in the shell's top-left corner.

**Layout & harmony.** Exploded-diagram fidelity: screws, reel teeth, tape path and window drawn at one hairline weight; the right reel's tape pack is drawn overlapping with ghosted outlines, giving depth without shading.

**Shape & surface.** One stroke weight (hairline) plus solid fills; rounded-rect shell with small corner radius; very faint grain on the ground.

**Gradient & imagery.** Pure vector, no gradient — survives any scale and is cheap.

**Contrast.** Ink `#2e2e2e` on paper `#d8d5ce` = 9.27:1. The grey "THIS WAY UP" caps `#9a9a9a` on `#d8d5ce` = 1.92:1 — **fails** even large-text AA (3:1). Lowercase label (dark ink) = ~14:1 on its local ground.

## Why the verdict

No photography, vector, low cost: the hairline technical-drawing language is reusable for empty states / onboarding illustration, but the grey display caps fail contrast and would need darkening.

## Notes

Good candidate if a brief wants a "technical drawing" illustration language. Shares the cassette subject with REF-0031/0033/0034 but is a different artefact (vector, not photo).

Original filename: `pin-music-magezine-e1_AfqPShwFTae2eSpMj-X2sSP7iLuVdQOBhEW_xHeIv-n3nU0LkJIx.png`

**Related:** REF-0033 · REF-0034 · REF-0031
