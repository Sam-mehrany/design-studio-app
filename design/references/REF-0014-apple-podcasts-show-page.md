---
type: design-ref
id: REF-0014
title: "Apple Podcasts show page, artwork-tinted list (iOS)"
source: "Pinterest board 'component-design-idea' (mehrani0146)"
kind: shipped
concept: mobile
captured: 2026-11-26
image: library/REF-0014.jpg
archetype: [J.CORE.detail]
facets: [A.FAM.fluent, A.ERA.current, B.GRID.single-column, B.DEN.moderate, B.CONT.seams, B.HIER.size, C.PAL.brand-locked, C.VAL.dark-first, C.SAT.vivid, C.MAT.glass-frosted, D.FACE.neo-grotesque, D.SCALE.moderate, D.WGT.two-step, D.CASE.sentence, E.RAD.pill, E.DEP.live-blur, F.IMG.photography, F.PHOTO.tight-crop, F.DEP.soft, F.ICON.line, K.DEV.handheld, K.INPUT.touch, K.DIST.app-store]
imagery_dep: soft
rtl: clean
cost: high
verdict: adapt
confidence: high
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
modified: Thu 2026-11-26 1:45 PM EST (UTC-05:00)
medium: flat-ui
platform: mobile
---

# REF-0014 — Apple Podcasts show page — whole screen tinted from the artwork

## Nature

A whole iOS screen, screenshotted flat.

*Nature backfilled by Hark, 27 Nov 2026, from the image.*

## Read

*Figures measured off the image with Python/PIL (median-sampled hex, WCAG 2.x ratios, ink heights in original-image pixels unless stated); type-scale ratios are derived from those ink heights; radii in px are estimated by eye.*

**Colour.** Brand-locked to the show artwork: art `#fb4722`, the list ground a deep derived red-brown `#54180d`, glass buttons `#714747`, line work `#ffc6ae`. The palette is computed from the content, not designed per screen.

**Typography.** Show title cap 30px, episode title 19px (orig px) ≈1.6×; dates/descriptions smaller in a tinted grey. SF Pro (neo-grotesque), two weights, sentence case.

**Layout & harmony.** Single column: artwork as header → title row with two circular actions → episode rows separated by hairline seams, each with thumbnail right and a duration pill. Floating mini-player at the bottom.

**Shape & surface.** Pills and circles everywhere; Liquid Glass chrome (nav buttons, mini-player) with live blur over content. Thumbnails ~8px radius.

**Buttons & components.** Glass circles for nav/actions, a tinted '▶ 40m' pill per row. Controls are quieter than titles.

**Gradient & imagery.** Episode photos are tight crops; the artwork drives colour. Remove photos and the list still works (soft). Live blur is the cost.

**Contrast.** Title `#fff4ed` on `#54180d` = 12.8:1; secondary `#e0a096` = 6.37:1; black artwork type on `#fb4722` = 6.03:1. All pass.

## Why the verdict

Shipped and well-built; adapt rather than adopt because the finish (Liquid Glass) is platform-specific while the mechanism — artwork-derived tinting of a whole page — is the transferable idea.

## Notes

Original filename: `pin-component-design-idea-donTKu7_T7-Q.jpg`. Shown as a rounded screenshot with a drop shadow on a grey `#495058` field, no device hardware — judged as flat mobile UI rather than mockup.

**Related:** —
