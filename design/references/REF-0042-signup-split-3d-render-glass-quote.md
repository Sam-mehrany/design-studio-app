---
type: design-ref
id: REF-0042
title: "Sign-up split card with blue 3D render, frosted testimonial and notched corner"
source: "Pinterest board 'login-page-design' (mehrani0146)"
kind: concept
concept: web
captured: 2026-11-26
image: library/REF-0042.jpg
archetype: [J.ON.signup]
facets: [A.FAM.corporate-saas, A.FAM.glassmorphism, A.ERA.current, B.GRID.split, B.DEN.sparse, B.SPACE.generous, B.HIER.size, B.CONT.cards, C.VAL.light-first, C.PAL.single-accent, C.SAT.pastel, C.MAT.glass-frosted, D.FACE.neo-grotesque, D.CASE.sentence, D.SCALE.moderate, D.WGT.two-step, E.RAD.mixed, E.DEP.live-blur, E.STROKE.hairline, E.EDGE.framed, F.IMG.render-3d, F.DEP.soft, F.COST.med, H.LEN.helper, H.TONE.warm, K.DEV.desktop, K.INPUT.pointer]
imagery_dep: soft
rtl: clean
cost: med
verdict: adapt
confidence: med
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
modified: Thu 2026-11-26 1:30 PM EST (UTC-05:00)
---

# REF-0042 — Sign-up split card with blue 3D render, frosted testimonial and notched corner

## Read

*Measured* with Python/PIL on the original file: hex values are region medians, contrast ratios are WCAG 2.x. Cap heights are in px of a preview scaled to ≤1400 px on the long edge; on mockups, on-screen values are as photographed/rendered.

**Colour.** Pastel blue ground #a0c6ed, white card #ffffff. The right panel runs from near-black indigo #0a022b into a mid blue render #4b79b5; the testimonial glass reads #1a1b30–#2c3f69. Primary button is near-black navy #0a1020 → #000211 (top to bottom). Blue is the only hue; it lives in the decoration and the ground, not in the controls.

**Typography.** One neo-grotesque. Measured cap heights (preview px): title "Create an account" 23.9, testimonial quote 21.0, field labels 10.5, subtitle 9.9, button 10.5. Title-to-label ≈2.3×; the quote is set almost at title size, so the right panel competes with the form for first read.

**Layout & harmony.** Split card, form left and image right (≈45/55). Form fields stack two-up for first/last name, then full width. Even field rhythm; hierarchy by size and the dark button.

**Shape & surface.** Mixed radii: large card corners, medium-radius inputs with a #b3b3b3 1px border, medium button. The image panel has an inverted-corner notch cut out of its bottom-right that holds the carousel arrows — the one distinctive shape idea here. The testimonial is a frosted glass card over the render.

**Buttons & components.** Primary is a dark navy gradient fill with a soft drop shadow — the heaviest element on the left. Google/Apple social buttons are white outline buttons. Carousel arrows are white circles seated in the notch.

**Gradient & imagery.** 3D blue render plus live-blur glass card carry the right half. Removing them leaves a working form beside an empty panel, so the dependency is soft; the cost is the blur and the render asset.

**Contrast.** Measured: title #000009 on white 20.9:1, labels 20.5:1, button text on #0a1020 18.96:1, quote white on #2c3f69 10.4:1. Failures: subtitle, placeholders and the "or" divider at #939393–#969696 on #ffffff = 2.96–3.02:1.

## Why the verdict

Concept shot (perfect testimonial, no states). The notched-corner image panel and the quiet single-hue palette are worth adapting; the frosted glass is a cost item and the grey helper text fails.

## Notes

Original file: `pin-login-page-design-UndMZnWkbq6Q.jpg`. Notched inverted corner holding controls has no term in E.RAD — E.RAD.asymmetric is the nearest but does not describe a cut-out. Possible new term for Sam: E.RAD.inverted-notch.

**Related:** —
