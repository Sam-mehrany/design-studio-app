---
type: design-ref
id: REF-0063
title: "Monitor-on-rock mockup — dark agentic-AI landing with mint action accent and orange light-streak"
source: "Pinterest board 'mockup-idea' (mehrani0146)"
kind: concept
concept: mockup
captured: 2026-11-26
image: library/REF-0063.jpg
archetype: [J.ACQ.landing]
facets: [A.ERA.current, A.POS.premium, B.GRID.asymmetric, B.DEN.moderate, B.HIER.size, B.CONT.seams, C.VAL.dark-first, C.PAL.single-accent, C.SEM.layered, C.SAT.vivid, D.FACE.neo-grotesque, D.FACE.mono, D.PAIR.mono-accent, D.CASE.all-caps-display, D.CASE.all-caps-label, D.SET.tracked-caps, E.RAD.sharp, E.DEP.border-only, E.STROKE.hairline, E.ENV.tonal-field, F.IMG.abstract-shape, F.IMG.photography, F.IMG.ui-as-image, F.DEP.soft, F.COST.high, K.DEV.desktop, K.LOC.ltr-latin]
imagery_dep: soft
rtl: risky
cost: high
verdict: adapt
confidence: med
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
modified: Thu 2026-11-26 1:40 PM EST (UTC-05:00)
---

# REF-0063 — Monitor-on-rock mockup — dark agentic-AI landing with mint action accent and orange light-streak

## Read

Measured: hex values and WCAG ratios sampled from the original file with Python/PIL (median of a region for grounds, extreme-luminance pixels for text, so anti-aliasing can pull a ratio slightly low); cap heights by row profiling where stated. Anything marked *estimated* was read by eye.

**Colour.** Screen is pure black `#000000`; the action accent is mint (`CONTACT US` button `#77f4c7`, italic "AGENTIC AI", arrow links); a separate orange light-streak (`#ba5b14`) decorates the hero. Mint means act, orange means mood — two roles, kept apart. The environment is a sky gradient from sea-green grey `#b5c7c3` to orange `#c6733b`, which picks up both screen hues.

**Typography.** ALL-CAPS light-weight neo-grotesque hero across two lines with a third line in mint italic; micro labels are tracked mono caps (nav `#888888`, dates "01.01.2025 / EVENTS"). Hero-to-micro around 5× (*estimated*). Single sans + mono accent.

**Layout & harmony.** Asymmetric two-zone hero: claim left, two hairline-bordered article cards right, a logo strip of partners below a hairline. Moderate density; size ranks, seams group.

**Shape & surface.** Square corners throughout, 1px hairlines, no shadows — the only depth is the glow.

**Buttons & components.** One filled mint button top-right; "PLAY VIDEO" / "REQUEST A MEETING →" are text links. Article cards are photo + mono meta + two-line title + mono "READ ARTICLE →".

**Gradient & imagery.** Light-streak is decoration (soft dependency): delete it and the layout holds on type alone. Article thumbnails are photography.

**Contrast.** Headline white on `#0f0603` = 19.9:1; mono nav `#888888` on black = 5.92:1; body `#e1c8ab` where it crosses the streak (`#8c6633`) = 3.21:1 — fails. Mint `#77f4c7` on black = 15.5:1.

## Why the verdict

Mechanism (one action hue, a separate decorative hue, everything else type and hairlines) transfers cleanly; the rock-and-sky staging is high-cost. Concept shot → adapt.

## Notes

Original file: `pin-mockup-idea-iI_q0ZfWDW-w.jpg`. The streak sits under the body copy and breaks its contrast — the fix is to keep decoration out from under text.

**Related:** —
