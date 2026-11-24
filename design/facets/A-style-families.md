# Facet A — Style families

*Which aesthetic lineage does this descend from?* Lineage is the coarsest facet and the
most often misused: naming it is a starting point, never a specification. Two designs in
the same family can differ on every other facet. Always pair A with B–E.

Stance marks: `✓` likes · `✗` rejects · `~` conditional · `–` unknown. See [00-model](../00-model.md) §4.

## A.FAM — Lineage

| ID | Family | One line | Stance |
|---|---|---|---|
| `A.FAM.swiss` | Swiss / International | Objective grid, flush-left sans, white space as structure, no ornament | – |
| `A.FAM.bauhaus` | Bauhaus modernist | Primary colour, geometric primitives, form follows function | – |
| `A.FAM.print-poster` | Print / poster grid | Editorial poster logic brought to screen; scale contrast as the event | – |
| `A.FAM.editorial` | Editorial typographic | Type carries the hierarchy; little chrome, long-form rhythm | – fits marketing and profile surfaces |
| `A.FAM.flat` | Flat 2D | No depth cues, colour-blocked, 2013-era iOS 7 lineage | – |
| `A.FAM.material` | Material | Shadow-as-elevation, ink-and-paper metaphor, motion as continuity | – |
| `A.FAM.fluent` | Fluent / tonal depth | Layered tonal surfaces, acrylic, real material rendering, environment light | ✓ PREF-0004 |
| `A.FAM.skeuomorphic` | Skeuomorphic | Real-world material imitation as affordance | – |
| `A.FAM.glassmorphism` | Glassmorphism | Translucent blurred panels over colour | req DDR-0001 — `K.BUDGET.effects` rules it out on constrained targets |
| `A.FAM.neumorphism` | Neumorphism | Extruded same-colour surfaces, dual soft shadow | – low contrast, poor affordance |
| `A.FAM.brutalist-web` | Brutalist web | Raw HTML energy, system fonts, visible structure, deliberate crudeness | – |
| `A.FAM.neo-brutalist` | Neo-brutalist | Hard black borders, flat offset shadow, loud flat colour | – |
| `A.FAM.brutalist-utility` | Brutalist utility | Dense, fast, table-led, unglamorous; function with no apology | – the right lineage for loggers and panels |
| `A.FAM.clinical-data` | Clinical data-first | Restrained light surface, chart-led, medical-instrument sobriety | – fits operator panels |
| `A.FAM.dark-athletic` | Dark athletic | Near-black, one hot accent, oversized numerals, performance register | – fits athlete surfaces |
| `A.FAM.corporate-saas` | Corporate SaaS default | The safe B2B look: indigo accent, rounded cards, friendly sans | – |
| `A.FAM.luxury-minimal` | Luxury minimal | Extreme restraint, generous space, thin type, muted palette | – |
| `A.FAM.fashion-editorial` | Fashion editorial | Image-led, asymmetric, oversized display type, high-contrast crops | – |
| `A.FAM.soft-wellness` | Soft wellness | Pastel, rounded, low contrast, calming register | – fails in bright and gym light |
| `A.FAM.maximalist` | Maximalist | Density as expression; pattern, layer and colour piled deliberately | – |
| `A.FAM.anti-design` | Anti-design / Y2K | Deliberate clash, chrome, blur, nostalgia-as-irony | – |
| `A.FAM.retro-terminal` | Retro terminal | Monospace, scanline, phosphor palette, CLI nostalgia | – |
| `A.FAM.blueprint` | Blueprint / technical | Measured, annotated, wireframe lines, engineering-drawing register | – |
| `A.FAM.spatial-3d` | Spatial 3D | Real rendered objects and depth as the primary visual material | ✓ PREF-0004, PREF-0006 |
| `A.FAM.claymorphic` | Claymorphic | Soft matte 3D, rounded clay volumes, toy-like lighting | – as a render base, not as the finish |
| `A.FAM.organic` | Organic / biomorphic | Blobs, curves, hand-drawn irregularity | – |

## A.ERA — Period signature

| ID | Term | One line | Stance |
|---|---|---|---|
| `A.ERA.timeless` | Timeless | Reads undated; grid and type do the work | – |
| `A.ERA.current` | Current | Of this moment, dates in ~3 years | – |
| `A.ERA.revival` | Revival | Deliberately quotes a past era | – |

## A.POS — Positioning register

What the design is *claiming* about the product. Mixing registers is the most common cause
of a design that "looks fine but feels wrong".

| ID | Term | One line | Stance |
|---|---|---|---|
| `A.POS.utilitarian` | Utilitarian | A tool. Speed and clarity are the promise | – |
| `A.POS.performance` | Performance | Measurement, discipline, progress | – |
| `A.POS.premium` | Premium | Craft and restraint signal quality | – |
| `A.POS.luxury` | Luxury | Scarcity and ceremony | – |
| `A.POS.institutional` | Institutional | Authority, neutrality, trust | – |
| `A.POS.playful` | Playful | Warmth, humour, low stakes | – |
| `A.POS.countercultural` | Countercultural | Opposition to the category's defaults | – |

## Open questions

- Lineage for personal-brand work (portfolio) versus client product work — same or split?
- Is `A.FAM.neo-brutalist` interesting or cheap? Not yet observed either way.
- Where does `A.POS.premium` end and `A.POS.luxury` begin, in Sam's reading?
