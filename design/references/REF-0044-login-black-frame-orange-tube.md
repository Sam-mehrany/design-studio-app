---
type: design-ref
id: REF-0044
title: "Log-in: two light panels in a black frame, orange 3D tube render"
source: "Pinterest board 'login-page-design' (mehrani0146)"
kind: concept
concept: component
captured: 2026-11-26
image: library/REF-0044.jpg
archetype: [J.ON.signup]
facets: [A.FAM.corporate-saas, A.ERA.current, A.POS.premium, B.GRID.split, B.DEN.sparse, B.SPACE.generous, B.HIER.size, C.VAL.light-first, C.PAL.single-accent, C.SAT.vivid, C.MAT.gradient-subtle, D.FACE.neo-grotesque, D.CASE.title, D.SCALE.dramatic, D.WGT.two-step, D.PAIR.mono-accent, E.RAD.medium, E.DEP.tonal, E.EDGE.framed, F.IMG.render-3d, F.DEP.soft, F.COST.med, H.LEN.minimal, H.TONE.neutral, K.DEV.desktop, K.INPUT.pointer]
imagery_dep: soft
rtl: clean
cost: med
verdict: adapt
confidence: low
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
modified: Thu 2026-11-26 1:30 PM EST (UTC-05:00)
component_type: I.TYPE.auth-form
medium: flat-ui
platform: desktop
---

# REF-0044 — Log-in: two light panels in a black frame, orange 3D tube render

## Nature

Log-in panels inside a black frame.

*Nature backfilled by Hark, 27 Nov 2026, from the image.*

## Read

*Measured* with Python/PIL on the original file: hex values are region medians, contrast ratios are WCAG 2.x. Cap heights are in px of a preview scaled to ≤1400 px on the long edge; on mockups, on-screen values are as photographed/rendered.

**Colour.** A #111111 frame holds two pale panels: form side #fcfcfc grading to #ebebeb, image side #cdcdcd. Single accent, signal orange: button #ff4e02 with a lighter #fc6c0b edge, render #ff5000 → #fc753b, logo mark #f45c06. Everything else is greyscale.

**Typography.** Light-weight neo-grotesque for "Welcome Back", regular for body, plus a small mono version tag ("V1.1.2"). Measured cap heights (preview px): title 28.4, subtitle 9.6, social-button labels 9.9 — ≈3× jump, two tiers.

**Layout & harmony.** Split in a black gutter frame; form column centred in its panel, render panel to the right. Hierarchy by size; very sparse.

**Shape & surface.** Medium radius on panels, inputs and buttons — one family. Depth is tonal: the panels step down in grey inside the black frame rather than casting shadows.

**Buttons & components.** Orange gradient primary; white social buttons with brand logos. Inputs are white wells with placeholder text only (no visible labels).

**Gradient & imagery.** 3D orange tube render on the right; a subtle vertical gradient on the form panel. The render is decoration — removable.

**Contrast.** Measured: title black on #f7f7f7 19.6:1, social labels 20.7:1. Failures: subtitle #7b7b7b on #f6f6f6 3.92:1, placeholders #808080 3.95:1, version tag 3.27:1, legal line #a7a7a7 on #ececec 2.04:1, white on the #ff4e02 button 3.31:1.

## Why the verdict

Concept shot with lorem ipsum copy. Placeholder-only fields and a failing orange button make the finish non-transferable; the tonal framed split is the reusable part. Low confidence on concept — see Notes.

## Notes

Original file: `pin-login-page-design-rfTvr64oAcLA.jpg`. The black outer frame looks a little like a device bezel; judged as flat web because there is no hardware detail or environment beyond a white void with diagonal guide lines. If Sam saved it for the frame presentation, re-file as mockup.

**Related:** —
