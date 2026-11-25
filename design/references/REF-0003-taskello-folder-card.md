---
name: ""
metadata:
  node_type: memory
  type: design-ref
  id: REF-0003
  title: Taskello — dark folder-tab collection card
  source: "\"Taskello App Card Design\" concept shot, pasted by Sam"
  kind: concept
  captured: 2026-11-24
  image: library/REF-0003.png
  archetype:
    - J.CORE.browse
  facets:
    - B.CONT.cards
    - B.DEN.sparse
    - B.HIER.size
    - B.SPACE.generous
    - C.VAL.dark-first
    - C.PAL.neutral-only
    - C.CON.high
    - D.FACE.neo-grotesque
    - D.SCALE.two-tier
    - D.HERO.display-numeral
    - D.WGT.two-step
    - D.CASE.sentence
    - E.RAD.large
    - E.DEP.tonal
    - E.EDGE.framed
    - F.IMG.photography
    - F.PHOTO.masked
    - F.COST.med
    - H.NUM.unit-adjacent
    - H.LEN.minimal
    - K.DEV.handheld
    - K.LOC.ltr-latin
  imagery_dep: soft
  rtl: risky
  cost: med
  verdict: adapt
  confidence: med
  status: unreviewed
  tags:
    - design/ref
  modified: 2026-11-24T10:52:47.785Z
  originSessionId: 9ac498eb-4145-4d11-8650-5cc9c8cfbe60
sam_reaction: like
status: reviewed
concept: component
---

# REF-0003 — Taskello, dark folder-tab collection card

## Read

Colours, contrast and text heights below were **measured off the image** (1200×1271, read
pixel by pixel). Radii are **estimated** by eye. One component, not a screen: a single
notes-collection tile drawn as a file folder.

**Colour.** Three neutrals and a photograph. Presentation ground `#f3f3e9` (warm off-white,
not part of the component) · bezel `#000000` · card body `#1e1e1e`. The only hue is the
blurred photo strip, running from `#ab180e` deep red to `#e86d4b` orange with blown-out
near-white highlights (`#fffce6`). The UI itself carries **no accent at all**, so every
colour in the frame is decoration, not meaning — zero semantic hues.

**Typography.** A neo-grotesque (Inter lineage: flat-sided round letters, open `g`, straight
`1`). Measured heights: the counts "Doc" and "1270 Notes" are 24–25px cap height; "Daily
memo" and "Notes & Journaling" are about the same size (31–32px including descenders); the
hero numeral "05" is **51px**. That is effectively **two sizes**, a UI size and one display
size, with **hero-to-body at about 2.1×**. Two weights: semibold for the title and counts,
regular for the grey subtitle. The hero sits beside a small unit ("05 Doc"), which is the
display-numeral-with-unit pattern. It is hard to tell whether the numerals are tabular from
two values.

**Layout & harmony.** Content is pinned to the four corners: title block top-left, hero
count bottom-left, secondary count bottom-right, image label top-right. The middle is empty:
about **250px of the card's ~400px dark body has no content** (rows ~605–855), so roughly
60% of the body is empty space. Inset is consistent at ~30px from the card edge on left,
right and bottom. Hierarchy comes almost entirely from size (51 vs 25), with grey vs white
as the second signal.

**Shape & surface.** The idea is the silhouette: the dark body has a **folder tab** on the
top-left, with a soft 45° shoulder stepping down to the main top edge, so the photo shows
through above the step. Large radius on the card (est. ~40px at this export, ~20pt at 1×),
wrapped by a **~16px solid black bezel** with its own larger outer radius. Depth comes from
tone alone (`#1e1e1e` inside `#000`) and from the body overlapping the photo. No shadows
and no borders.

**Buttons & components.** None. It is a display tile; the whole card would be the tap target.

**Gradient & imagery.** A motion-blurred red/orange photograph, masked by the tab
silhouette. It is pre-blurred raster, not a CSS gradient. If it were done with a live
`backdrop-filter`, the cost would go to high. Take the photo away and the folder still works
if the strip gets a flat accent fill, because the tab shape is the idea and the photo only
gives it something to cut against. So the dependency is **soft**. On plain black, though,
the tab against the bezel is `#1e1e1e` on `#000` ≈ 1.2:1 and would nearly disappear.

**Contrast.** White on the card body `#1e1e1e` = **16.67:1**. Grey subtitle `#afafaf` on
`#1e1e1e` = **7.6:1**, passes AA and AAA. The failure is the **white label on the photo**:
against the strip's median tone `#a66056` it is 4.74:1, but behind the letterforms the strip
blows out to `#fffce6`, where it drops to **1.03:1**. Text over an uncontrolled photo has no
floor.

## Why the verdict

`adapt`, medium confidence. The mechanism worth keeping is the **folder-tab silhouette as
the container**: it makes a collection tile read as "a set of things" without an icon. The
corner-pinned hero count is worth keeping too. It is a concept shot, so it cannot be
`adopt`. The finish also clashes with BRIEF-training-athlete-pwa's reject line
(`F.IMG.photography`) and DDR-0001's ban on decorative raster, so for the health app the
strip would have to be a flat tone or the data itself. RTL is `risky`, not `breaks`: a
mirrored folder is still a folder, but the tab shoulder, the corner anchoring and the "05"
numerals all need a deliberate mirror and a numeral policy.

## Notes

`concept`, high confidence on that call. The label "Taskello App Card Design" is part of
the image, the tile sits alone on a presentation ground, the data is round and perfect, and
there are no edge cases (no long title, no zero-count state).

The empty middle is a choice to question before copying. It is generous at the size of one
hero tile and would be wasted space in a grid of them.

Proposed vocabulary gap, **not added**: there is no term for a **container silhouette as a
metaphor** (a folder tab, ticket notch, or card cut-out). `E.RAD.asymmetric` comes nearest
but describes radii, not a shaped outline. Sam to decide whether it deserves an `E.*` term.

Original filename `paste-20261124104232.png`.

**Duplicate noted 2026-11-24:** the same Taskello card ("Daily memo / Notes & Journaling", "05 Doc / 1270 Notes", red/orange blurred photo header, black panel, off-white ground) was pinned again on the Pinterest board "UI Idea" (private) as pin 1 of that board — download file browser-download-20261124T172614.142744352Z-19-939a09bb738359a9273c89a58dc8d1bd.jpg (pin https://de.pinterest.com/pin/1024498615378071269/) (1350x1430, same 0.944 aspect as this record's 1200×1271 image). Same card at a different export resolution, not a new design — no new REF was created for it; this record covers both.

**Related:** REF-0002 (dark, neutral-only, no accent, flat ~2× hero), the same restraint at
screen scale.
