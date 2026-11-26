# Facet F — Imagery & iconography

*What non-type visual material is used, and how?* The decisive question for any reference
is **imagery dependency**: remove the photograph and ask whether the composition still
stands. Most inspiration fails that test, and any product that cannot use photography —
by law, by bandwidth or by content model — must fail it on purpose.

## F.IMG — Imagery type

| ID | Term | One line | Stance |
|---|---|---|---|
| `F.IMG.photography` | Photography | Photographic subject matter carries the composition | – |
| `F.IMG.illustration` | Illustration | Drawn material, 2D | – |
| `F.IMG.render-3d` | 3D render | Modelled, lit, rendered objects | – |
| `F.IMG.abstract-shape` | Abstract shape | Geometry and gradient as visual material | – |
| `F.IMG.data-as-image` | Data as image | The chart or the numbers *are* the visual interest | – |
| `F.IMG.ui-as-image` | UI as image | Screens and components shown as the hero subject | – |
| `F.IMG.none` | None | Type, colour and structure only | – |

## F.DEP — Imagery dependency

The scoring field for every reference record.

| ID | Term | One line |
|---|---|---|
| `F.DEP.hard` | Hard | Remove the image and the design collapses |
| `F.DEP.soft` | Soft | The image is decoration; structure survives without it |
| `F.DEP.none` | None | No imagery to remove |

## F.PHOTO — Photographic treatment

| ID | Term | One line | Stance |
|---|---|---|---|
| `F.PHOTO.full-bleed` | Full bleed | Edge to edge, type overlaid | – |
| `F.PHOTO.tight-crop` | Tight crop | Subject cropped hard, detail over context | – |
| `F.PHOTO.duotone` | Duotone | Brand-locked two-tone treatment | – |
| `F.PHOTO.masked` | Masked | Clipped to a shape or type | – |
| `F.PHOTO.darkened` | Darkened overlay | Scrim so type stays legible | – |
| `F.PHOTO.none` | None | Photography not used | – |

## F.ILL — Illustration style

| ID | Term | One line | Stance |
|---|---|---|---|
| `F.ILL.line` | Line | Monoline drawing | – |
| `F.ILL.flat-vector` | Flat vector | Shape-based, no shading | – |
| `F.ILL.isometric` | Isometric | Technical axonometric scenes | – |
| `F.ILL.editorial` | Editorial | Conceptual, textured, illustrator-authored | – |
| `F.ILL.technical-diagram` | Technical diagram | Annotated, measured, explanatory | – |
| `F.ILL.silhouette` | Silhouette | Body or object outlines; the no-photo substitute | – |
| `F.ILL.mascot` | Mascot | A character carrying the brand | – |

## F.ICON — Icon style

| ID | Term | One line | Stance |
|---|---|---|---|
| `F.ICON.line` | Line | Outlined, single stroke weight | – |
| `F.ICON.solid` | Solid | Filled shapes | – |
| `F.ICON.duotone` | Duotone | Two values per icon | – |
| `F.ICON.line-plus-solid` | Line + solid pair | Line for inactive, solid for active state | – |
| `F.ICON.rounded` | Rounded terminals | Soft, friendly | – |
| `F.ICON.sharp` | Sharp terminals | Technical, precise | – |
| `F.ICON.pictogram` | Pictogram | Signage-grade, heavily reduced | – |

## F.ICON-SYS — Icon system discipline

| ID | Term | One line | Stance |
|---|---|---|---|
| `F.ICON-SYS.single-weight` | Single weight | One stroke weight across the whole set | – |
| `F.ICON-SYS.grid-drawn` | Grid-drawn | Every icon built on the same pixel grid and keylines | – |
| `F.ICON-SYS.optical-sizes` | Optical sizes | Separate drawings for small and large use | – |
| `F.ICON-SYS.mixed-sources` | Mixed sources | Icons from several libraries | – |

## F.ICON-RTL — Directionality

| ID | Term | One line | Stance |
|---|---|---|---|
| `F.ICON-RTL.flip-directional` | Flip directional | Arrows, chevrons, progress and undo mirror | – |
| `F.ICON-RTL.keep-metaphor` | Keep metaphors | Clocks, search, media transport do **not** mirror | – |

## F.3D — Render style

| ID | Term | One line | Stance |
|---|---|---|---|
| `F.3D.rendered-real` | Genuinely rendered | Modelled and path-traced; real light and material | – |
| `F.3D.faked-css` | Faked in CSS | Layered divs imitating depth | – |
| `F.3D.clay` | Clay | Matte, untextured volumes | – |
| `F.3D.product-studio` | Product studio | Studio-lit hero object, reflective floor | – |
| `F.3D.exploded-layers` | Exploded layers | Stacked planes showing a system's parts | – |

## F.COST — Render and download cost

| ID | Term | One line |
|---|---|---|
| `F.COST.low` | Low | Vector, type and colour; negligible weight |
| `F.COST.med` | Medium | Raster images, moderate; subset fonts |
| `F.COST.high` | High | Video, live blur, mesh gradients, large renders, heavy fonts |

Cost is a first-class field, not an afterthought: on constrained networks it is the
difference between a design that ships and one that is never seen.

## Open questions

- Illustration: is there any appetite for it at all, or is the instinct always photographic,
  rendered or type-only?
- Icon library preference — drawn in-house, or an established set adapted?
