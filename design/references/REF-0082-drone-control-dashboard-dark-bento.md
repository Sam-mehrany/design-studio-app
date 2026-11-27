---
type: design-ref
id: REF-0082
title: "Drone control dashboard concept — dark bento around a live camera feed with HUD overlays, pale-yellow values"
source: "Pinterest board 'dashboard-design' (mehrani0146)"
kind: concept
concept: web
captured: 2026-11-27
image: library/REF-0082.jpg
archetype: [J.CORE.capture]
facets: [A.ERA.current, A.POS.performance, B.GRID.bento, B.DEN.dense, B.HIER.size, B.CONT.cards, C.VAL.dark-first, C.PAL.single-accent, C.SEM.loose, D.FACE.geometric-sans, D.SCALE.tight, E.RAD.large, E.RAD.pill, E.DEP.tonal, F.ICON.line, F.IMG.photography, F.IMG.data-as-image, F.DEP.soft, F.COST.med, K.DEV.tablet, K.ENV.sunlight, K.LOC.ltr-latin]
imagery_dep: soft
rtl: risky
cost: med
verdict: adapt
confidence: low
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
modified: Fri 2026-11-27 12:45 PM EST (UTC-05:00)
medium: flat-ui
platform: desktop
---

# REF-0082 — Drone control dashboard concept — dark bento around a live camera feed with HUD overlays, pale-yellow values

## Nature

A whole control dashboard, flat.

*Nature backfilled by Hark, 27 Nov 2026, from the image.*

## Read

Measured: hex values and WCAG ratios sampled from the original file with Python/PIL (median of a region for grounds, extreme-luminance pixels for text, so anti-aliasing can pull a ratio slightly low); cap heights by row profiling where stated. Anything marked *estimated* was read by eye. These pins are ~564px wide, so small UI text is only 3–6px tall in the file; its sampled ratio reads lower than the designed colour would, and is flagged where that matters.

**Colour.** Dark-first, one surface: panel and cards both `#1c1c1e`, separated by gaps rather than tone. Accent pale yellow (`#c7c690` sampled; JPEG desaturates it) on "4K", battery % and focus box; a blue `#428bbc` heading chip on the compass; a red `#c90a0d` record dot. Green/sky colour comes from the camera feed and blurred backdrop photo.

**Typography.** Geometric sans, small and flat: title and big values ~6px cap height in the file, telemetry labels 3px. Measured scale is tight — values separate from labels by brightness more than size. Numerals proportional (*estimated*).

**Layout & harmony.** Bento: icon rail left, big camera feed top-centre with HUD chips, drone-status card right, map + telemetry grid + d-pad + compass across the bottom. Dense; position ranks. Radii and icon weights consistent across tiles.

**Shape & surface.** Large outer radius (~16px), large tile radii, pill chips and circular buttons (*estimated*). Flat; no shadows inside the panel.

**Buttons & components.** Round dark icon buttons, a circular joystick pad, segmented video/photo toggle. Controls are as quiet as the data — nothing is loud except the yellow values.

**Gradient & imagery.** The feed is content, not decoration; the blurred hills behind the panel are presentation only (soft).

**Contrast.** Title `#fcfcfe` on `#1d1d1f` = 16.4:1; telemetry values `#a6a6a8` = 7.0:1; sub-labels `#717173` = 3.40:1 — fails; telemetry labels `#4b4b4d` = 1.95:1 — fails; coordinates `#3b3b3d` = 1.49:1 — fails badly.

## Why the verdict

Bento around a live feed is a sound control-surface pattern, but a drone controller is used outdoors (K.ENV.sunlight) where these 1.5–3.4:1 labels vanish. Concept → adapt, low.

## Notes

Original file: `pin-dashboard-design-1024498615378162280.jpg`. Pin: https://www.pinterest.com/pin/1024498615378162280/ — outbound link: https://dribbble.com/shots/21839502-DJI-Mavic-pro-Interface-concept. Pin links to the Dribbble shot "DJI Mavic pro Interface concept". Concept doubt: no device hardware — a UI panel floating over a blurred landscape photo — so judged as the UI (`web`), though it would run on a tablet/controller. Archetype J.CORE.capture (camera control); there is no term for a live remote-control surface.

**Related:** —
