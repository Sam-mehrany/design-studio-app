---
type: design-ref
id: REF-0043
title: "Sign-up card: grainy black panel with orange fluted-glass glow"
source: "Pinterest board 'login-page-design' (mehrani0146)"
kind: concept
concept: web
captured: 2026-11-26
image: library/REF-0043.jpg
archetype: [J.ON.signup]
facets: [A.FAM.corporate-saas, A.ERA.current, A.POS.premium, B.GRID.split, B.DEN.sparse, B.SPACE.generous, B.HIER.size, C.VAL.light-first, C.PAL.single-accent, C.SAT.vivid, C.MAT.grain, D.FACE.geometric-sans, D.CASE.title, D.SCALE.dramatic, D.WGT.two-step, E.RAD.medium, E.DEP.border-only, E.STROKE.hairline, E.ACC.outline-colour, E.TEX.grain, E.EDGE.framed, F.IMG.abstract-shape, F.DEP.soft, F.COST.low, H.LEN.helper, H.TONE.neutral, K.DEV.desktop, K.INPUT.pointer]
imagery_dep: soft
rtl: clean
cost: low
verdict: adapt
confidence: med
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
modified: Thu 2026-11-26 1:30 PM EST (UTC-05:00)
---

# REF-0043 — Sign-up card: grainy black panel with orange fluted-glass glow

## Read

*Measured* with Python/PIL on the original file: hex values are region medians, contrast ratios are WCAG 2.x. Cap heights are in px of a preview scaled to ≤1400 px on the long edge; on mockups, on-screen values are as photographed/rendered.

**Colour.** Warm near-black brown ground #3b1900, white card #ffffff, left panel #060606 with a grain texture and an orange glow peaking #c94d07 → #f3d8c5. One accent, orange #eb6601 (button, logo #f56a0d, focused-field ring #f9cda6). Input borders #eeeeee. Two hues total: orange and its brown ground.

**Typography.** Geometric sans throughout. Measured cap heights (preview px): panel headline and form title both ≈34.9, subtitle and labels 12.3 — a two-step scale with a ≈2.8× jump and nothing between. Title case on both display lines.

**Layout & harmony.** Split card, dark message panel left, form right. Hierarchy by size, then by the single orange. Field rhythm is even; there is a lot of air above the form.

**Shape & surface.** Medium radius on card, panel and inputs — one family. Depth is border-only (hairline #eeeeee field borders). The focused field is marked by an orange outline, not a fill.

**Buttons & components.** Solid orange full-width button, the only filled control. Show/hide password eye icon in field.

**Gradient & imagery.** The fluted-glass glow and film grain are a static raster in the left panel. Removing them leaves a black panel with white headline; the form is untouched.

**Contrast.** Measured: headline #ffffff on #090909 19.9:1, title black on #fdfdfd 20.65:1, input text 19.95:1. Failures: subtitle, labels and "Already have an account" at #8f8f8f–#919191 on #fcfcfc = 3.07–3.15:1; white button text on #eb6601 = 3.26:1, below 4.5:1 for its small label.

## Why the verdict

Concept shot. Orange on white fails at button-label size and the grey helper text fails; the single-accent split structure and the grain-panel finish are adaptable once the orange is darkened.

## Notes

Original file: `pin-login-page-design-eh-Al5cTsCEg.jpg`.

**Related:** —
