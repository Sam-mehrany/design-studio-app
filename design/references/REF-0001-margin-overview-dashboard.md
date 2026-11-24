---
name: ""
metadata:
  node_type: memory
  type: design-ref
  id: REF-0001
  title: Margin — Overview dashboard for a trades business
  source: "\"margin\" — product unknown, pasted by Sam"
  kind: concept
  captured: 2026-11-24
  image: library/REF-0001.png
  archetype:
    - J.DATA.home
    - J.DATA.trend
  facets:
    - A.FAM.clinical-data
    - B.GRID.bento
    - B.GRID.split
    - B.CONT.cards
    - B.DEN.moderate
    - B.HIER.size
    - B.SPACE.rhythmic
    - C.VAL.light-first
    - C.VAL.tonal-layered
    - C.SEM.strict
    - C.CON.moderate
    - C.VIZ.status-mapped
    - C.MAT.gradient-mesh
    - D.HERO.display-numeral
    - D.FACE.neo-grotesque
    - D.NUM.tabular
    - D.SCALE.dramatic
    - D.WGT.high-contrast
    - E.RAD.large
    - E.DEP.shadow-elevation
    - F.IMG.data-as-image
    - F.ICON.line
    - H.LEN.helper
    - H.TONE.technical
    - K.DEV.desktop
    - K.LOC.ltr-latin
  imagery_dep: none
  rtl: risky
  cost: low
  verdict: adapt
  confidence: low
  status: unreviewed
  tags:
    - design/ref
  originSessionId: 4aa757f9-312d-414c-878d-8891a21d0008
  modified: 2026-11-24T10:12:34.771Z
sam_reaction: like
status: reviewed
---

# REF-0001 — Margin, Overview dashboard

## Read

Measured off the image at 1199×892, not estimated.

**Colour — a four-step tonal ladder that barely steps.** Page `#dadada` → app shell `#f2f2f2`
→ card `#f8f8f8` → inner pills `#ffffff`. But card-on-shell is only **1.05:1** and
shell-on-page **1.25:1**, so the surfaces are nearly the same value and the separation is
really carried by a soft shadow, not by tone. There is no card border — a scan across the
card edge goes `#f2f2f2 · #eee · #e8e8e8 · #f9f9f9`, a diffuse shadow with no crisp line.

**Semantic discipline is total.** Every hue means something: magenta `#a34672` for a loss,
green for a gain, blue `#1c5aed` for actual-vs-target, hatched grey for target. Nothing is
tinted for decoration. The one exception is the feature card.

**Typography — a dramatic scale, roughly ×1.5 per step.** Measured cap heights: micro-label
6px · body 9px · card title 13px · page title 24px · hero numeral 39px. Hero-to-body is
**4.3×**, which is what lets `34.0%` read from across a room while the card still carries
four rows of supporting text. A neo-grotesque throughout, figures tabular so the right-hand
value column aligns. Weight does the ranking as much as size: near-black `#000` numerals
against `#5a5a5a` body.

**Shape and surface.** One large radius (~14–16px) on every card, a smaller one on pills and
buttons, no mixing. Buttons are low-contrast neutral chips — `#ebebeb` fill, icon plus label,
chevron for menus — deliberately quiet so nothing competes with the data. The sidebar's
active item inverts to a near-black `#2b2b2d` chip, the only heavy fill in the layout.

**Harmony.** Three columns on one baseline rhythm, every card ending flush at the same
bottom edge; one icon family at one stroke weight; one radius family; one shadow. The
composition is tight with no scattered space.

**Contrast — two real failures.** Body `#5a5a5a` on `#f8f8f8` = 6.49:1 ✅, row labels 6.11:1
✅, magenta negatives 5.38:1 ✅, hero 19.77:1 ✅. But the **micro-labels `#858585` = 3.47:1 ❌**
fail the 4.5:1 floor, and the gradient feature card is worse: its white headline over the
light part of the gradient is **2.09:1 ❌** and its body text **3.35:1 ❌**.

**The gradient.** A mesh running deep navy `#151e45` → `#1f2f60` → blue `#6994be` → sand
`#d5d1b8` → cream `#f4dab9` → orange `#e8965e`. It is the only decorative surface in the
design, and it is also the only place the type becomes illegible — the value gradient runs
underneath the text instead of behind a controlled band.

**Imagery.** None. No photography anywhere; the charts and numerals are the visual interest.

## Why the verdict

`adapt`. What transfers: the semantic-only colour discipline, the ×1.5 type scale with a
4.3× hero, tabular figures, one radius and one shadow, and quiet neutral buttons that let
data hold the contrast. What does not: light-first finish, and a gradient that breaks its own
text — if a feature card is wanted, the type needs a solid band behind it, not raw gradient.

Two things to steal outright and two to avoid, which is a good ratio for one reference.

## Notes

**Shipped or concept is unresolved**, so it is filed as `concept`, which fails safe — a
concept cannot reach `adopt` alone. Shipped tells: truncated account name, a disabled
comparison chip, a "1 of 3" pager. Concept tells: every card ends flush, the composition is
too balanced, it floats on a grey backdrop.

Corrected on re-analysis: tagged `E.DEP.border-plus-shadow` and `E.STROKE.hairline` on the
first pass, but the pixels show no border at all — it is `E.DEP.shadow-elevation`. The type
scale is `D.SCALE.dramatic`, not moderate.

Original filename `paste-20261124093301.png`.

**Related:** first record in the library.
