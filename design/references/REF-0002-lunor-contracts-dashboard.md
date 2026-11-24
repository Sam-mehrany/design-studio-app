---
name: ""
metadata:
  node_type: memory
  type: design-ref
  id: REF-0002
  title: Lunor — dark contract-management dashboard
  source: "\"Lunor\" concept shot, pasted by Sam"
  kind: concept
  captured: 2026-11-24
  image: library/REF-0002.png
  archetype:
    - J.DATA.home
  facets:
    - A.FAM.corporate-saas
    - B.GRID.split
    - B.CONT.cards
    - B.DEN.moderate
    - B.HIER.size
    - B.SPACE.rhythmic
    - C.VAL.dark-first
    - C.VAL.tonal-layered
    - C.PAL.neutral-only
    - C.CON.high
    - D.FACE.neo-grotesque
    - D.SCALE.moderate
    - D.HERO.display-numeral
    - D.WGT.two-step
    - E.RAD.medium
    - E.DEP.border-only
    - E.STROKE.hairline
    - F.IMG.data-as-image
    - F.ICON.line
    - F.PHOTO.masked
    - H.TONE.warm
    - K.DEV.desktop
    - K.LOC.ltr-latin
  imagery_dep: soft
  rtl: risky
  cost: low
  verdict: adapt
  confidence: high
  status: unreviewed
  tags:
    - design/ref
  originSessionId: 4aa757f9-312d-414c-878d-8891a21d0008
  modified: 2026-11-24T10:40:18.357Z
sam_reaction: like
status: reviewed
---

# REF-0002 — Lunor, dark contract dashboard

## Read

Measured off the image at 1200×1548, not estimated. The useful thing about this one is that
it is the **dark counterpart to REF-0001**, and it gets right what REF-0001 got wrong.

**Colour — four tones, and no hue at all.** Sidebar `#0f0f0f` · upsell card `#171719` ·
canvas and stat cards `#1b1b1d` · nested cards and icon tiles `#242426`. Note the sidebar is
*darker* than the canvas, the reverse of the usual light-mode habit, which pushes the
navigation back and brings the content forward. Each step is only **1.11:1**, so — exactly
as in REF-0001 — the tonal ladder is nearly invisible and the real separation is a hairline
border, not the tone.

There is **no accent colour anywhere**. The palette is neutral end to end; the only hue in
the whole frame is two folder icons (blue, yellow) and three avatar photographs. Even the
primary call to action, "Upgrade Now", is a neutral fill. A dashboard with no accent is a
deliberate and unusual choice — it means nothing can be emphasised by hue, so emphasis falls
entirely on size and weight.

**Typography — one grey, reused everywhere.** Cap heights: axis 12px · body and nav 15px ·
welcome heading 26px · stat numeral 34px. That is a **moderate scale, ~1.25–1.3 per step**,
with hero-to-body at only **2.3×** — far flatter than REF-0001's 4.3×, and the numbers
read as *part of* the page rather than leaping off it. The muted text is a single grey
(`#8e8e90`–`#99999b`) retuned a shade per surface rather than a new value per component.

**Contrast — this is the lesson.** Every text pair passes 4.5:1, with nothing marginal:
idle nav `#969696` 6.48:1 · stat labels `#99999b` 6.05:1 · chart axis `#919193` 5.47:1 ·
card body `#8e8e90` **4.74:1** (the floor) · all white headings 15.5–19.2:1. Dark UIs usually
fail on muted greys; this one picked greys light enough to clear the bar on every surface it
uses them on. Compare REF-0001, whose micro-labels sat at 3.47:1.

**Shape and surface.** One medium radius on cards, a slightly smaller one on buttons and
nav items, hairline `#2a2a2c`-ish borders, no shadows at all — depth is border plus tone
only, which is the cheap way to do it and the right way on dark.

**Buttons.** Ghost buttons throughout ("Share", "Edit" — icon plus label, no fill), with the
only filled button being the upsell. So the loudest control on screen is the commercial one,
which is honest about what it is but worth noticing before copying the pattern.

**Imagery.** Three small avatar photos as social proof, and a hatched area chart with a
solid actual line against a dashed comparison. Delete the avatars and nothing breaks, so the
dependency is soft rather than hard.

## Why the verdict

`adapt`. The contrast discipline is the thing to take: a single muted grey, retuned per
surface, chosen so the *worst* pair still clears 4.5:1. That is directly applicable to the
athlete PWA, where dark-first is still an open question and gym lighting makes muted greys
risky. The sidebar-darker-than-canvas inversion is also worth stealing for a dark build.

What not to take: no accent at all is too austere for a training product, where "now",
"done" and "behind" need to be separable at a glance; and a 2.3× hero is too flat for a
screen read at arm's length mid-set.

## Notes

`concept`, high confidence — "Welcome back John Doe!", stock avatars, a frame cropped at the
right edge, and a composition with no scrollbars or awkward real data.

Sitting beside REF-0001 this is the more useful of the two on accessibility and the less
useful on hierarchy, which is a clean illustration of why one reference is never evidence.

Original filename `paste-20261124102349.png`.

**Related:** REF-0001 — same archetype, opposite theme, opposite outcome on contrast.
