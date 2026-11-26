---
type: design-ref
id: REF-0041
title: "Log-in split card: black inset panel with blue light streak, pill form"
source: "Pinterest board 'login-page-design' (mehrani0146)"
kind: concept
concept: web
captured: 2026-11-26
image: library/REF-0041.png
archetype: [J.ON.signup]
facets: [A.FAM.corporate-saas, A.ERA.current, A.POS.premium, B.GRID.split, B.DEN.sparse, B.SPACE.generous, B.HIER.size, B.CONT.cards, C.VAL.light-first, C.PAL.single-accent, C.SAT.vivid, C.CON.high, D.FACE.neo-grotesque, D.CASE.title, D.SCALE.moderate, D.WGT.two-step, E.RAD.pill, E.RAD.nested-rule, E.DEP.border-only, E.STROKE.hairline, E.EDGE.framed, F.IMG.abstract-shape, F.ICON.solid, F.DEP.soft, F.COST.low, H.LEN.helper, H.TONE.neutral, K.DEV.desktop, K.INPUT.pointer]
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

# REF-0041 — Log-in split card: black inset panel with blue light streak, pill form

## Read

*Measured* with Python/PIL on the original file: hex values are region medians, contrast ratios are WCAG 2.x. Cap heights are in px of a preview scaled to ≤1400 px on the long edge; on mockups, on-screen values are as photographed/rendered.

**Colour.** Presentation ground blurs from #0e0e0e to #777777; the card is pure #ffffff with a #000000 inset panel. One accent, a saturated royal blue #0a1dcb, carries every action (Log In fill, Sign Up link); the panel's light streak peaks at #059efd, the same hue family, so decoration and action share one colour. Neutrals: #1c1c1c input text, #555555 divider label, #919191–#959595 secondary text, #ecedef social-button fill.

**Typography.** Single neo-grotesque, tightly set. Measured cap heights (preview px): panel headline ≈29, form title "Log in" 18.1, subtitle and labels 13.6, button 11.0 — steps of ≈1.6 and ≈1.33, headline-to-body ≈2.1×. Title case on the headline, sentence case elsewhere; two weights (medium headline/title, regular body).

**Layout & harmony.** A 50/50 split card: left a dark inset panel carrying the message, right a single-column form. Hierarchy is ranked by size, then by the one blue fill. Generous padding; the form stack keeps an even vertical rhythm between label/field pairs.

**Shape & surface.** Large card radius with the inset panel nested inside it at a smaller concentric radius; inputs and all buttons are full pills. Depth is border-only: hairline dark strokes on the inputs, no shadows on the card.

**Buttons & components.** Primary is a solid blue pill, the loudest thing on the card. Social sign-ins are pale grey #ecedef pills with brand marks — present but quiet. Remember-me checkbox and "Forgot Password" link sit on one row under the fields.

**Gradient & imagery.** One abstract light-streak image inside the left panel. Remove it and the panel is a plain black block with white type; the form is untouched.

**Contrast.** Measured: headline #ffffff on #000000 21:1, title 21:1, input text #1c1c1c 17.0:1, "or" divider #555555 7.46:1, button white on #0a1dcb 10.24:1. Failures: subtitle, field labels, remember-me and the footer line at #919191–#959595 on #ffffff = 3.00–3.15:1 — below 4.5:1 for small text.

## Why the verdict

Concept shot (typos "Goggle", "Forget Password", no states), so adopt is off the table. The split-card mechanism with a single blue action is transferable; the grey helper text needs darkening to pass.

## Notes

Original file: `pin-login-page-design-OyTnIFZZrIew.png`. Saved to the login board; no "log-in / sign-in" archetype exists in J — J.ON.signup is the nearest term. Proposed term for Sam: J.ON.signin (returning-user authentication, distinct from first-run sign-up). Shown floating over a blurred grey presentation ground, not on a device, so judged as flat web UI.

**Related:** —
