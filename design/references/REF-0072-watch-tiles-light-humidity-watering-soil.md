---
type: design-ref
id: REF-0072
title: "Watch tiles — Light / Humidity / Watering / Soil, dark with segmented bars"
source: "Pinterest board 'Health app' (private) https://de.pinterest.com/mehrani0146/health-app/ — pin https://de.pinterest.com/pin/1024498615375290489/"
kind: concept
captured: 2026-11-24
image: library/REF-0072.jpg
archetype: [J.DATA.home]
facets: [A.FAM.clinical-data, A.POS.utilitarian, B.GRID.modular, B.DEN.moderate, B.HIER.size, B.HIER.enclosure, B.CONT.cards, B.SPACE.rhythmic, C.PAL.polychrome, C.VAL.dark-first, C.CON.high, C.SEM.layered, C.SAT.vivid, C.VIZ.sequential, C.MAT.flat, D.FACE.neo-grotesque, D.PAIR.single, D.SCALE.two-tier, D.WGT.two-step, D.NUM.tabular, D.NUM.lining, D.HERO.display-numeral, E.RAD.large, E.DEP.tonal, E.DEP.border-only, E.STROKE.medium, F.IMG.none, F.DEP.none, F.ICON.line, H.TONE.terse, H.LEN.minimal, H.NUM.unit-adjacent, K.DEV.wearable, K.INPUT.touch, K.ENV.indoor-controlled, K.ATT.glance, K.LOC.ltr-latin, K.A11Y.contrast]
imagery_dep: none
rtl: clean
cost: low
verdict: adapt
confidence: med
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
concept: mobile
---

# REF-0072 — Watch tiles — Light / Humidity / Watering / Soil, dark with segmented bars

## Read

Values below: hex values **measured by pixel sampling** (dominant colours); type sizes estimated by eye and labelled as such. One line of context: four square watch tiles in a 2×2 grid on a light-grey page — Light 3490 Lux, Humidity 62%, Watering 12 days ago, Soil 6.0 → 8.0 — each with a segmented bar or dot strip and a range scale. Note: the content is plant care, not human health, despite the board it was pinned to.

**Colour.** Measured: tile field #282320 (warm near-black), page #E1E1E1, white text. Each tile carries its own sequential ramp — orange→yellow for Light, green bars for Humidity, teal→yellow blocks for Watering, a green→blue dot scale for Soil — so the palette is polychrome by design, but each ramp is single-hue sequential within its tile; colour means magnitude, not category.

**Typography.** Estimated by eye: tile titles ~26 px semibold, subtitles ~14 px grey, display numerals ~40–44 px bold tabular ("3490", "62", "12", "6.0 → 8.0"). Two-tier scale with a display-numeral hero per tile; the unit sits small beside the figure ("Lux", "%", "days ago").

**Layout & harmony.** A strict 2×2 module matrix with equal gutters on a light page. Inside each tile the same rhythm repeats: title + icon top, subtitle, hero numeral, segmented viz, range labels (3000/4000, 40/80, Day 7/Day 14, 3–11). Hierarchy is size (numeral first), then the viz bar. The repetition is the system — four tiles, one template.

**Shape & surface.** Radius scale estimated: tiles ~28 px with a ~4 px black frame stroke, inner segments are small rounded bars and dots. Separation is tonal (dark tile on light page) plus the heavy frame. No shadow. The segmented bars are the surface interest — no imagery at all.

**Buttons & components.** There are no buttons; the components are the tiles themselves and their viz strips. The loudest element per tile is the hero numeral, then the coloured bar. The small icon in a dark pill at each tile's top right is the quietest element.

**Gradient & imagery.** No gradient and no photography — the viz strips (segmented bars, dot scale) are the visual material. Nothing breaks without imagery because there is none; this is the only pin in the batch with imagery dependency none.

**Contrast.** Computed from sampled colours: white on tile #282320 ≈ 15.9:1 — passes. Grey subtitles (estimated ~#858585 on #282320 ≈ 4.6:1) — borderline pass, estimated not measured. The small range labels at the bar ends are the smallest text and the most likely failure if the grey is lighter than sampled.

## Why the verdict

Adapt: the one-template-four-tiles system with a hero numeral plus a segmented magnitude bar per tile is a clean, low-cost, RTL-clean glanceable mechanism, but it is a concept render of watch tiles (not a shipped watch screen) and the content is plant care, so adapt, not adopt.

## Notes

Original file: browser-download-20261124T175101.094019846Z-55-188d7fec9049b9fcdc0d487b868ef5e3.jpg (736x734), from Pinterest board "Health app". Content is plant care (light/humidity/watering/soil), not human health — filed here because that is the board it came from.

**Related:** REF-0071 — same hero-numeral-plus-viz mechanism at phone scale.
