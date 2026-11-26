---
type: design-ref
id: REF-0051
title: "'Missions to inner solar system' data-viz poster — orbit lines by agency"
source: "Pinterest board 'poster' — pin https://www.pinterest.com/pin/e1_AfqPShydaWxh1vWqftKGbWIDacs2Krfjd4dGQSHNcb-HwVPP0PdZ/"
kind: print
concept: imagery
captured: 2026-11-26
image: library/REF-0051.jpg
archetype: [J.REF.imagery]
facets: [F.IMG.data-as-image, C.VIZ.categorical, C.VIZ.status-mapped, C.VAL.dark-first, C.PAL.polychrome, C.SAT.vivid, C.CON.high, D.FACE.grotesque, D.CASE.all-caps-label, D.WGT.two-step, B.GRID.canvas, B.HIER.size, B.DEN.dense, E.STROKE.uniform, E.STROKE.medium, H.TONE.technical, H.VOCAB.domain-real, H.LEN.minimal, K.DEV.print]
imagery_dep: soft
rtl: risky
cost: low
verdict: adapt
confidence: med
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
modified: Thu 2026-11-26 1:30 PM EST (UTC-05:00)
---

# REF-0051 — 'Missions to inner solar system' data-viz poster — orbit lines by agency

## Read

**Measured** with PIL off the source file unless a line says *estimated*.

**Colour** — black `#000000` ground (≈40%); one hue per space agency, sampled off the legend: USSR/Russia red `#973337`, ESA teal `#35b3a0`, China lime `#c1e48a`, India blue `#267c97`, NASA gold-orange `#c79b67` (Japan's purple too thin to sample reliably). Success vs. failure is the same hue at lower lightness (ESA `#35b3a0` → `#037b69`, India `#267c97` → `#005068`).

**Typography** — bold condensed grotesque caps for the legend title and planet names, regular for labels: two weights. Year labels sit on the orbit axis.

**Layout & harmony** — canvas, no grid: concentric rings per destination (Moon 72, Mars 38 missions), each ring one mission, sorted by year outward. Density is very high; ring size encodes count.

**Shape & surface** — uniform medium stroke for every line; two tiny planet photos as the ring centres.

**Gradient & imagery** — no gradients; the data is the image.

**Contrast** — legend title `#fbfbfb` on black 20.19:1; legend labels `#a9ada4` 9.16:1. **Fails as an encoding:** success/failure pairs within a hue differ by only 1.71:1 (USSR), 2.01:1 (ESA), 1.88:1 (India); China 4.65:1 is the only clearly separable pair. The darker failure lines sit at 2.35–2.84:1 against black.

## Why the verdict

Hue = category, lightness = status is a useful dark-theme data encoding and costs nothing to draw, but the measured status separation is too weak to adopt as-is; it would need a second channel (dash, weight).

## Notes

Print infographic; a second archetype (e.g. J.DATA.report) was not added because the brief says imagery takes J.REF.imagery. Candidate distinction missing from C.VIZ: 'lightness-within-hue for status' — propose to Sam if it recurs.

Original file: `pin-poster-e1_AfqPShydaWxh1vWqftKGbWIDacs2Krfjd4dGQSHNcb-HwVPP0PdZ.jpg`.

**Related:** REF-0047
