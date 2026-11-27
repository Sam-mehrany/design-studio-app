---
type: design-ref
id: REF-0004
title: "Dark job-listing card with folder-tab notch and gradient Apply pill"
source: "Pinterest board 'component-design-idea' (mehrani0146)"
kind: concept
concept: component
captured: 2026-11-26
image: library/REF-0004.jpg
archetype: [J.CORE.browse]
facets: [A.ERA.current, B.CONT.cards, B.CONT.tray, B.HIER.size, C.PAL.single-accent, C.VAL.dark-first, C.SAT.vivid, C.MAT.gradient-subtle, D.FACE.geometric-sans, D.WGT.two-step, D.SCALE.dramatic, E.RAD.large, E.RAD.asymmetric, E.RAD.pill, E.DEP.shadow-elevation, E.ACC.badge, E.STROKE.hairline, E.ENV.tonal-field, F.IMG.none, F.ICON.line]
imagery_dep: none
rtl: clean
cost: low
verdict: adapt
confidence: med
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
modified: Thu 2026-11-26 1:45 PM EST (UTC-05:00)
component_type: I.TYPE.listing-card
medium: flat-ui
platform: none
---

# REF-0004 — Dark job-listing card with folder-tab notch and green→lime Apply pill

## Nature

One job in a collection: title, meta, Apply action — a listing card.

*Nature backfilled by Hark, 27 Nov 2026, from the image.*

## Read

*Figures measured off the image with Python/PIL (median-sampled hex, WCAG 2.x ratios, ink heights in original-image pixels unless stated); type-scale ratios are derived from those ink heights; radii in px are estimated by eye.*

**Colour.** Card `#111312` with a faint green wash at the top (`#223d34`), footer tray `#222423`, on a light gridded page `#f1f2f4`. One accent, a green→lime gradient (`#75fcd1` → `#b3fe7e`) on the CTA, echoed by the green logo `#2dbe61`. Chip `#323232`.

**Typography.** Title cap 55px vs description cap 25px (orig px) — 2.2×; the salary figure is title-sized (57px), so title and money share the top tier. Labels sit at body size in grey `#7e8784` with white values beneath. Geometric sans, two weights.

**Layout & harmony.** Header (logo + tab chip) → title → three-column meta row with hairline vertical dividers (`#c9cdcc` sampled at the rule) → description → footer tray with salary left and CTA right. The tray separates decision from description.

**Shape & surface.** Large radius (~24px) with an asymmetric folder-tab notch top-right holding the category chip. Soft drop shadow lifts the card off the gridded page.

**Buttons & components.** The gradient pill is the loudest thing on the card and the only colour — correct ranking for a CTA. Black text on lime = 17.4:1.

**Gradient & imagery.** Gradient limited to the CTA plus a faint top wash; no imagery. Cheap to build.

**Contrast.** Title/value white ≈ 17.7:1. Labels `#7e8784` on `#111312` = 5.05:1, passes. Description `#858585` ≈ 5.2:1.

## Why the verdict

Concept with ideal data, so adapt. The tray-split card and single-gradient CTA are the transferable mechanism; the notch is decoration.

## Notes

Original filename: `pin-component-design-idea-7kEP5fQB3Slg.jpg`. Notch mirrors trivially under RTL; salary/currency string order would need a locale check.

**Related:** —
