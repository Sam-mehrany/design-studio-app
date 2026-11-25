---
type: design-ref
id: REF-0076
title: "Calendar — June month view with AI tips banner + event detail"
source: "Pinterest board 'Health app' (private) https://de.pinterest.com/mehrani0146/health-app/ — pin https://de.pinterest.com/pin/1024498615375290333/"
kind: concept
captured: 2026-11-24
image: library/REF-0076.jpg
archetype: [J.DATA.home, J.CORE.detail]
facets: [A.FAM.flat, A.POS.utilitarian, B.GRID.split, B.DEN.moderate, B.HIER.size, B.HIER.enclosure, B.CONT.cards, B.SPACE.rhythmic, C.PAL.polychrome, C.VAL.light-first, C.CON.high, C.SEM.layered, C.SAT.vivid, C.MAT.gradient-subtle, D.FACE.neo-grotesque, D.PAIR.single, D.SCALE.two-tier, D.WGT.two-step, D.NUM.tabular, D.NUM.lining, E.RAD.large, E.RAD.pill, E.DEP.tonal, E.DEP.border-only, E.DEP.shadow-elevation, F.IMG.none, F.DEP.none, F.ICON.line, H.TONE.neutral, H.LEN.minimal, K.DEV.handheld, K.INPUT.touch, K.LOC.ltr-latin, K.ATT.interstitial, K.A11Y.contrast]
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

# REF-0076 — Calendar — June month view with AI tips banner + event detail

## Read

Values below: hex values **measured by pixel sampling** (dominant colours); type sizes estimated by eye and labelled as such. One line of context: two phones on a dark backdrop — left, a June calendar with a teal-to-pink gradient header and a magenta AI-tips banner over an event list; right, a "Product Design Demo" event detail sheet with attendees, time, Zoom link and location.

**Colour.** Measured: dark backdrop #252B37, light card #F5F4F2, black #000000. The header is a teal→pink gradient (estimated teal ~#2A9D8F to pink ~#E85D9E) and the AI banner is a magenta gradient (estimated ~#D6339C→#B04FE0). Accent discipline is layered: pink marks the selected day (9) and the AI banner, teal marks the header and the "Work" tag, black marks the active "All" filter. Three hues, each with a job, but the gradients are decorative.

**Typography.** Estimated by eye: "Jun" ~24 px semibold, "Product Design Demo" ~26 px semibold, event names ~16 px semibold, times ~14 px tabular, body ~13 px. Two-tier scale — the month/event titles are the display tier, the list is one quiet tier. Day numerals are tabular in the week row.

**Layout & harmony.** Two phones side by side. Left: gradient header with month + week strip, AI banner pill, filter pills ("All" black / "New (3)" white), "Earlier today" list with two events. Right: detail sheet — close/edit icons, green "Work" tag, centred title, avatar stack with "35+", time row, Zoom row with Join pill, location row, "Accepted" pill. Hierarchy is enclosure (banner, cards) then size; density moderate.

**Shape & surface.** Radius scale estimated: phones ~40 px, cards ~24 px, banner and filter pills fully rounded. Separation is tonal (light card on dark backdrop) with a soft shadow under each phone. The gradient header is a flat colour field with a subtle value shift, not a mesh.

**Buttons & components.** The loudest element is the magenta AI banner ("Here are your AI-based time optimization tips, Max!"). The black "All" filter pill and the black "Accepted" pill are the secondary loud controls; the "Join" Zoom pill is quiet by comparison. The avatar stack with "+35" is a compact social-proof component.

**Gradient & imagery.** Two gradients: the header (teal→pink) and the AI banner (magenta). Both are decorative — remove them and the calendar and the banner still read as flat colour blocks. No photography anywhere in either phone.

**Contrast.** Computed from sampled colours: black on light card #F5F4F2 ≈ 18.5:1 — passes. White on teal ~#2A9D8F ≈ 3.3:1 — fails for text, but no text sits on the teal except the white "Jun" over the gradient's darker edge (estimated, not measured). White on the magenta banner (estimated ~#D6339C ≈ 4.0:1) — borderline fail for small text, estimated not measured; the banner copy is the riskiest text here.

## Why the verdict

Adapt: the gradient-header calendar with an AI-tips banner and a clean event-detail sheet is a coherent, low-cost pattern, but it is a staged two-phone concept (calendar, not health, despite the board), the gradients are decorative rather than semantic, and the banner text contrast is borderline — adapt, not adopt.

## Notes

Original file: browser-download-20261124T175323.679763886Z-59-ef73a9faa22c3d21d8fc2dcee223ffb8.jpg (736x552), from Pinterest board "Health app". Calendar/productivity content, not health — filed here because that is the board it came from.

**Related:** REF-0074 · REF-0075 — the other productivity concepts in this batch.
