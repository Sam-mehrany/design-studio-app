---
type: design-ref
id: REF-0045
title: "Sign-in card on full-bleed sky photo, cyan-to-white card gradient"
source: "Pinterest board 'login-page-design' (mehrani0146)"
kind: concept
concept: web
captured: 2026-11-26
image: library/REF-0045.jpg
archetype: [J.ON.signup]
facets: [A.FAM.soft-wellness, A.ERA.current, B.GRID.single-column, B.DEN.sparse, B.SPACE.generous, B.HIER.size, B.CONT.cards, C.VAL.light-first, C.PAL.neutral-only, C.SAT.pastel, C.MAT.gradient-subtle, C.CON.moderate, D.FACE.neo-grotesque, D.CASE.sentence, D.SCALE.moderate, D.WGT.two-step, E.RAD.large, E.RAD.medium, E.DEP.tonal, E.EDGE.bleed, F.IMG.photography, F.PHOTO.full-bleed, F.ICON.line, F.DEP.soft, F.COST.med, H.LEN.helper, H.TONE.warm, K.DEV.desktop, K.INPUT.pointer]
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

# REF-0045 — Sign-in card on full-bleed sky photo, cyan-to-white card gradient

## Read

*Measured* with Python/PIL on the original file: hex values are region medians, contrast ratios are WCAG 2.x. Cap heights are in px of a preview scaled to ≤1400 px on the long edge; on mockups, on-screen values are as photographed/rendered.

**Colour.** Full-bleed sky photo #98cfee → #d0eaf7 with clouds #f2f5fa. The card fades from cyan #c7f2fb at the top to near-white #fdfffe. Inputs are tinted wells #eff2f7. The only dark is the primary button, #34343e → #161620. No accent hue: the photo supplies all the colour.

**Typography.** Neo-grotesque (Inter class). Measured cap heights (px): title "Sign in with email" 17.0, subtitle 11.0, placeholder 10.0 — ≈1.55× title-to-body, a compact two-step scale.

**Layout & harmony.** One centred card on a full-bleed image; a single column of icon tile, title, subtitle, two fields, link, button, divider, three social buttons. Even rhythm, symmetrical — mirrors cleanly.

**Shape & surface.** Large card radius, medium radius on fields and buttons, a rounded icon tile on top. Depth is tonal: filled wells instead of borders, card separated from the sky by its own lightness.

**Buttons & components.** Dark gradient primary (white text) is the one heavy object; three white social buttons are icon-only. Leading line icons in the fields (mail, lock) and a trailing eye toggle.

**Gradient & imagery.** Sky photo and card gradient set the mood; delete the photo and a white card on a flat field still works.

**Contrast.** Measured: title on #e8f6f9 18.85:1, "Forgot password?" 15.1:1, button white on #262630 14.97:1. Failures: subtitle #797e84 on #f3f8fc 3.83:1, placeholders #80858b on #eff2f7 3.31:1, "or sign in with" #808185 3.63:1.

## Why the verdict

Concept shot (generic copy that contradicts its title). The calm single-column card with tonal wells is adaptable; grey helper text needs darkening.

## Notes

Original file: `pin-login-page-design-vbkczZgUsJaA.jpg`. Native 1200×900, measured at full resolution.

**Related:** —
