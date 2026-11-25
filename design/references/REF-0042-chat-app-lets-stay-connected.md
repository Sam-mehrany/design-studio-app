---
type: design-ref
id: REF-0042
title: "Chat app — 'Let's Stay Connected' list on iPhone (@nina skrbic)"
source: "Pinterest board 'UI Idea' (mehrani0146, private), https://de.pinterest.com/mehrani0146/ui-idea/ — pin https://de.pinterest.com/pin/1024498615375464350/"
kind: concept
captured: 2026-11-24
image: library/REF-0042.jpg
archetype: [J.OPS.messaging]
facets: [A.FAM.flat, A.FAM.corporate-saas, B.GRID.single-column, B.DEN.moderate, B.HIER.size, B.HIER.position, B.CONT.cards, B.SPACE.rhythmic, C.PAL.duotone, C.VAL.tonal-layered, C.CON.high, C.SAT.muted, C.MAT.gradient-subtle, D.FACE.grotesque, D.SCALE.two-tier, D.WGT.two-step, D.NUM.lining, D.HERO.inline, D.CASE.sentence, D.PAIR.single, E.RAD.large, E.DEP.tonal, E.EDGE.framed, E.ENV.staged, F.IMG.photography, F.PHOTO.tight-crop, F.DEP.soft, F.COST.low, H.LEN.minimal, H.TONE.neutral, K.DEV.handheld, K.LOC.ltr-latin, K.INPUT.touch, K.ATT.glance]
imagery_dep: soft
rtl: risky
cost: low
verdict: adapt
confidence: med
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
modified: 2026-11-24T18:45:00Z
concept: mockup
---

# REF-0042 — Chat app — "Let's Stay Connected" list on iPhone (@nina skrbic)

## Read

Values below are **estimated by eye** — pixel samples landed on the grey-purple staging background, not the screen, so no hex is claimed as measured. One line of context: a chat app on an iPhone — a lavender gradient card on top with "Let's Stay Connected", a row of story avatars, and a black chat list below (Adison Lubin, James Vetrovs, Ashlynn Mango).

**Colour.** Estimated by eye: a lavender-to-teal gradient card (about #A8A8D8 to about #7FB8A8) on top, a black list (about #0A0A0A) below, white type throughout, green online dots (about #22C55E) on the avatars. Two tones — the gradient card and the black list — with green as the only semantic hue (online presence).

**Typography.** Estimated by eye: "Let's Stay Connected" in a grotesque at about 28–32 px bold, chat names at about 15–16 px semibold, message previews at about 13–14 px grey, timestamps at about 11–12 px grey. Two-tier scale — the card title is the display size, the list is one quiet tier — with the names as the only semibold weight in the list.

**Layout & harmony.** Single column, estimated by eye: search pill and chevron top, the gradient card (title + avatar row, half-cut at the right edge to signal more), then the black list of chat rows (avatar, name, preview, timestamp). Hierarchy is ranked by size (card title first), then by tone (the black list reads as a second, quieter surface). Density is moderate — one card and three full chat rows visible.

**Shape & surface.** Estimated radius scale, by eye: the gradient card at about 24–28 px radius, avatars as full circles, the search pill at full pill radius. Separation is by tone — the gradient card against the black list — with no borders and no shadows. The avatar row's dashed "Add" circle is the one outline element.

**Buttons & components.** The components are the search pill, the story avatar row (Add, Adison, Charlie, James, Ka…), the chat rows with green online dots, and a bookmark icon bottom-right of the frame (outside the phone). The loudest control is the "Add" avatar — a dashed circle with a "+" — which reads as the compose action.

**Gradient & imagery.** A soft lavender-to-teal gradient backs the top card; the avatars are small photographs. Delete the gradient and the card is white type on black — it still reads, but it loses the warmth that separates the stories from the list — so the dependency is soft. The avatars are content (people), not decoration.

**Contrast.** Estimated by eye: white on black is about 19:1 — passes. White on the lavender gradient, estimated at about #A8A8D8 (about 2.5:1 estimated — fails for the card title, estimated, not measured). The grey message previews, estimated at about #9A9A9A on black (about 7:1 estimated — passes, estimated, not measured).

## Why the verdict

Adapt: the gradient stories card over a black chat list is a transferable, low-cost messaging-home mechanism, but it is a staged concept mockup with perfect data and the card title fails contrast on its gradient, so adapt, not adopt.

## Notes

Original file: browser-download-20261124T172959.943394225Z-25-efbc690b709380e1493a597ed48ce38d.jpg (1440x1920), from Pinterest board "UI Idea" (private). Individual pin URL: https://de.pinterest.com/pin/1024498615375464350/ The frame is labelled "CHAT APP / DESIGN EXPLORATION / 02 UI PRACTICE" with a lime "02 UI PRACTICE" tag and credited "@nina skrbic" bottom-left. The avatar row is cut at the right edge ("Ka…") and the list is cut at the bottom ("Ashlynn Mango" row incomplete).

**Related:** REF-0041 (same phone-staged concept presentation) · REF-0043 (same mobile card-and-list pattern).
