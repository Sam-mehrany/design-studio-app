# Nature — what a reference is, before what it looks like

The first question about any reference is not "is it nice" but **what kind of thing is
this picture**. A footer, a full landing page, and a laptop render showing that landing page
are three different references even when the pixels on the screen are identical. Filing them
together is how the library stops being searchable.

Four fields answer it, in this order. They live in each REF's frontmatter. The in-app
analyser (`tools/analyse.js`) and the `design-ingest` skill both read this file, so a rule
changed here changes both.

```
concept         what artefact is depicted      web | mobile | component | slide | imagery | mockup
component_type  which component, if one        an I.TYPE term — only when concept is component
medium          how the image was made         flat-ui | 3d-render | photo | composite | ai-generated | illustration
platform        what the UI is designed for    desktop | mobile | tablet | watch | multi | none
```

## 1. `concept` — the decision tree

Walk it top to bottom; the first branch that matches wins.

1. **Is a physical device shown — bezel, keyboard, stand, hands, a desk, a rock, a room?**
   → `mockup`. The image was saved for the presentation of the device, not the UI on its
   screen. A laptop showing a landing page is a mockup, not web. A floating phone in a
   gradient is a mockup, not mobile. *Exception:* a device frame drawn flat as part of a
   UI layout (a phone outline on a marketing page) does not make it a mockup — the page is.
2. **Is there no UI at all** — a photograph, a 3D object, a mood image, a blank gradient?
   → `imagery`.
3. **Is it a presentation slide or a deck** (slide frame, page numbers, a deck layout, even
   when a slide shows a dashboard)? → `slide`.
4. **Does the shot show one component or one page section, not a whole screen?**
   → `component`, and set `component_type`. This includes page sections: a footer, a navbar,
   a hero on its own, a pricing section, a sign-in card. The test: *could this be dropped into
   a different page unchanged?* If yes, it is a component.
5. **A whole phone or watch screen**, shown flat → `mobile`.
6. **A whole desktop page or app screen** (landing, dashboard, settings), shown flat → `web`.

When two branches fit, say so in `## Nature` and pick the one the image was saved for.

## 2. `component_type`

Only when `concept: component`. One term from the `I.TYPE` table in
[facets/I-components.md](facets/I-components.md), each with its recognition cue. Rules:

- **The outermost thing wins.** Three plan cards in a row is `I.TYPE.pricing-section`;
  one plan card is `I.TYPE.pricing-card`.
- **The specific beats the generic.** A card showing one big metric is `I.TYPE.stat-card`,
  not `I.TYPE.card`. Use `I.TYPE.card` only when no specific type fits.
- **Mobile widgets are `I.TYPE.widget`** with `platform: mobile` (or `watch`). A dashboard
  tile is `I.TYPE.widget` only when it stands alone; inside a full dashboard it is part of a
  `web` screen.
- **A login or sign-up split panel is `I.TYPE.auth-form`**, even when it fills the frame,
  because it is the sign-in component of a product, not a page with navigation.
- If nothing in the table fits, use the closest one and propose a new term in `## Notes`.
  Do not invent an ID — an unknown term is refused.

## 3. `medium` — how the image was made

This is what separates *a design* from *a mockup idea drafted in 3D software*.

| Value | Means | Tells |
|---|---|---|
| `flat-ui` | UI pixels as exported from a design tool or screenshotted | Pixel-perfect edges, no lens, no light falloff, no environment |
| `3d-render` | Modelled and lit in 3D software — Blender, Cinema 4D, Spline, KeyShot | Perfect geometry, physically-based light and soft shadows, no sensor noise, impossibly clean studio sets, caustics on glass |
| `photo` | Photographed with a camera | Sensor noise, real depth of field, real-world grime and imperfection, believable clutter |
| `composite` | A flat UI laid over a photo or render, with no device | Pixel-perfect UI panels floating on a photographic or rendered backdrop |
| `ai-generated` | Made by an image model | Garbled or nonsense text, melted or inconsistent geometry, details that do not repeat consistently |
| `illustration` | Drawn, 2D | Visible strokes, flat fills, no UI chrome |

Notes:

- **For a mockup, medium is how the scene was made.** The screen content is always placed
  in afterwards; that alone does not make it `composite`. A laptop on a rock lit like a
  studio product shot is `3d-render`; a laptop on a real desk with real grain is `photo`;
  an image-model scene is `ai-generated`. A mockup that is `flat-ui` is a device frame drawn
  flat — re-check branch 1.
- `composite` is for a flat UI laid over a photo or render **with no device**: a dashboard
  floating over a meadow, a footer card set on a rendered landscape.
- A UI that *contains* a 3D render (a hero with a glass blob) is still `flat-ui`: medium
  describes the image as a whole, `F.IMG.render-3d` describes the imagery inside the UI.
- When render and photo cannot be told apart at this resolution, pick the likelier one and
  drop `confidence` to `low`.

## 4. `platform`

What the UI is designed for, not what it is shown on. A dashboard shown on an iPad mockup is
`tablet` if it is laid out for touch at that size, `desktop` if it is a desktop layout placed
on a tablet for effect.

`desktop` · `mobile` · `tablet` · `watch` · `multi` (the shot shows the same product on more
than one) · `none` (imagery, or a component with no platform signal).

## 5. The `## Nature` section

Every record opens its body with a short `## Nature` section: one line stating the four
fields in words, then the visual evidence that decided each one. "Laptop bezel and keyboard
visible, set on a rock under a hard spotlight → mockup. Screen content is perspective-warped
but perfectly sharp while the rock shows sensor-like grain → composite." That sentence is what
makes a classification checkable — and correctable — later.
