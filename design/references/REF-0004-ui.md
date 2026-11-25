---
type: design-ref
id: REF-0004
title: "Learning app — Today's priorities lesson card"
source: "Added from the studio inbox (via the Space)"
kind: concept
captured: 2026-11-24
image: library/REF-0004.jpeg
archetype: [J.DATA.home, J.CORE.detail]
facets: [A.FAM.swiss, B.GRID.modular, B.DEN.sparse, B.HIER.size, B.HIER.weight, B.HIER.position, B.CONT.cards, B.CONT.nested, B.SPACE.rhythmic, C.PAL.single-accent, C.VAL.light-first, C.VAL.tonal-layered, C.SAT.muted, C.MAT.gradient-subtle, D.FACE.neo-grotesque, D.SCALE.two-tier, D.NUM.lining, E.RAD.pill, E.DEP.shadow-elevation, E.ACC.badge, F.DEP.soft, F.COST.low, K.DEV.desktop, K.LOC.ltr-latin, K.A11Y.not-colour-alone]
imagery_dep: soft
rtl: risky
cost: med
verdict: adapt
confidence: med
status: reviewed
sam_reaction: like
sam_note: 
tags: [design/ref]
concept: component
---

# REF-0004 — Learning app — Today's priorities lesson card

## Read

Values below were **estimated by eye from the image** — this analysis runs inside the Space and cannot sample pixels, so treat the figures as close estimates, not measurements.

**Colour.** Estimated surface ladder, by eye: page gradient from about #8CA2B5 to #C2CDD6, outer card about #D7DEE5, inner sheet about #F4F7F9, ink about #0F1011, secondary grey about #6E7883, button black about #0A0A0B, and a single red about #E62117 in the play mark. The palette is therefore achromatic plus one cool blue-grey family: the blue-grey only steps surfaces and adds tonal depth, carrying no coded meaning, while red marks video/play. That leaves one accent hue and no status hues — no green, amber or second blue for success, warning or information — so meaning is carried by size, weight and position rather than hue.

**Typography.** Estimated scale, by eye: small labels about 12–13 px, body and footer text about 14–15 px, the '45%' figure about 14 px, and the two-line headline about 32–36 px, giving a headline-to-body multiple of about 2.3× (roughly 34 px / 15 px) and smaller steps of about 1.15–1.25×. Weights are estimated at 400 for body copy, 500 for labels, button text and the task name, and 600–650 for the headline and '45%'. The face is a neo-grotesque sans in the Helvetica/Inter lineage, with tight headline tracking of about −0.02 em and near-neutral body tracking; the numerals in '45%' and '2 hours' appear as proportional lining figures, with no tabular alignment evident in this view.

**Layout & harmony.** Estimated layout, by eye: two equal cards side by side with a gap of about 40–56 px, each about 380–430 px wide, centred on the page, with outer padding of about 20–24 px and inner-sheet padding of about 24–28 px. Density is low: title, body and button are separated by about 16–24 px, leaving large areas of unfilled surface. Hierarchy is ranked first by size and weight, then by vertical position — headline, body, button, then the muted footer — rather than by colour, since almost all text is black or grey. Spacing follows an approximate 8 px rhythm (8, 16, 24, 32 px), and radii, soft shadows and 1.5–2 px icon strokes form one rounded, low-contrast family rather than competing systems.

**Shape & surface.** Estimated radius scale, by eye: outer card about 28–32 px, inner sheet about 24–28 px, pill button effectively full-round at about 20–22 px on a 40–44 px height, and avatar, play badge and progress ring fully circular. Separation is made by tone and shadow, not by border: no 1 px outline is apparent, with the outer card stepped lighter than the page, the inner sheet stepped lighter again, and a soft diffuse shadow of roughly 0 16 px 32 px at about 10–14% dark blue-grey beneath the sheets. Elevation is therefore two-level and tonal — page, outer shell, then inner sheet — while the black button stays flat, with no additional shadow of its own.

**Buttons & components.** Estimated buttons, by eye: both use a solid black fill of about #0A0A0B, white 14–15 px text at about 500 weight, a pill shape, and a height of about 40–44 px. The left version is content-width and adds a white circular badge of about 24 px containing a red play triangle, with the '2 hours' duration set outside it in grey; the right version stretches full-width, with the same duration in muted grey inside the black fill. Relative to the surrounding data, the button is the loudest element: it is the only large solid black mass, so it anchors the bottom of each card and outweighs the grey labels, body copy and the thin 2 px progress ring, whose estimated 18 px circle is a secondary component rather than a competing action.

**Gradient & imagery.** Estimated gradients and imagery, by eye: the only substantial gradient is the page background, running from about #8CA2B5 at the top to about #C2CDD6 at the bottom, with a much weaker tonal step across the outer cards; there is no gradient inside the inner sheets, headline or buttons. Imagery is limited to a small circular avatar of about 28 px and the red play glyph, with no hero photograph or illustration. Their cost is low: flattening the background to a solid mid blue-grey of about #A9BCCB would not break the layout, text or hierarchy, though the outer card would lose some separation from the page and would need a slightly darker background or a faint border, while removing the avatar would remove only a personal identifier.

**Contrast.** Estimated contrast, by eye: black ink of about #0F1011 on the inner sheet of about #F4F7F9 is about 17:1, black on the outer card of about #D7DEE5 is about 12–13:1, and white button text on black of about #0A0A0B is about 18:1, so headline, body and primary button labels pass 4.5:1 by a wide margin. The failures are the small muted greys: 'Today's Priorities' and 'Coming Next' in about #7D868E on the pale sheets are estimated at about 3.6–4.0:1, and the left card's '2 hours' in about #7D858D on white is estimated at about 3.9:1, so both would fail 4.5:1 for 12–14 px text. The same grey inside the black right-hand button is estimated at about 6:1 and passes, because its background is dark rather than pale.

## Why the verdict

A polished concept, so it cannot be adopted as-is. Its progress, priority lesson, and next-up pattern is clear and mostly type-driven, but the frosted layered card and gradient backdrop would need flattening for a transferable implementation.

## Notes

Shows two near-duplicate variants of the same card side by side: left has a 45% Progress overview header, small avatar, and a compact Start Learning pill with 2 hours separate; right omits the progress header and avatar and uses a full-width Start Learning button with 2 hours inside. No status bar, navigation, or edge-case data — a polished concept/mockup, not a shipped screen. To adapt: pick one variant, flatten the frosted layered card and gradient backdrop to solid surfaces, keep the avatar optional, and mirror the left-aligned hierarchy and inline 'Coming Next' label for RTL.

Created from inbox image `IMG_0416.jpeg` via the Design Studio Space.
