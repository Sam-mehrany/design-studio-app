# The model

How this database is built, and the grammar everything in it obeys. Read this once;
after that the facet files and the templates are enough.

## 1. Why facets and not a tree

A single hierarchy of design styles fails immediately, because any real interface is
several things at once: a screen can be *dark*, *brutalist*, *data-dense*, *Swiss-gridded*
and *RTL-primary* simultaneously, and none of those is a parent of the others. Put them in
a tree and every design ends up filed under one label that hides the other four.

So this is a **faceted** classification. Twelve independent axes. A design is described by
picking one or more terms from each axis that matters, and the combination — not any single
label — is the description. "Minimal" is not a style; it is a *low* value on four separate
axes, and saying which four is the entire point of this system.

## 2. The twelve facets

| | Facet | The question it answers |
|---|---|---|
| **A** | [Style families](facets/A-style-families.md) | Which aesthetic lineage does this descend from? |
| **B** | [Structure & layout](facets/B-structure-layout.md) | How is space organised and hierarchy produced? |
| **C** | [Colour](facets/C-color.md) | What is the palette architecture, and what does colour *mean*? |
| **D** | [Typography](facets/D-typography.md) | How does type carry hierarchy, data and voice? |
| **E** | [Shape & surface](facets/E-shape-surface.md) | Radius, border, depth, texture — how do surfaces behave? |
| **F** | [Imagery & iconography](facets/F-imagery-iconography.md) | What non-type visual material is used, and how? |
| **G** | [Motion & interaction](facets/G-motion-interaction.md) | How does it move, respond and feel under the hand? |
| **H** | [Content & voice](facets/H-content-voice.md) | How do words, numbers and states speak? |
| **I** | [Components](facets/I-components.md) | The object inventory, cross-cut by A–H. |
| **J** | [Screen archetypes](facets/J-screen-archetypes.md) | What job is this screen doing? |
| **K** | [Platform & context](facets/K-platform-context.md) | Where, on what, under what conditions, in what locale? |
| **L** | [Evaluation rubric](facets/L-evaluation-rubric.md) | How is a result judged, and what counts as a miss? |

A–H are **descriptive** (what a design *is*). I–K are **situational** (what it is *for*).
L is **normative** (whether it is any good). Keeping those three kinds apart is what stops
the taxonomy turning into a list of opinions.

## 3. ID grammar

Every term has a stable ID so it can be cited precisely and never has to be re-explained:

```
<facet>.<dimension>.<term>        C.PAL.single-accent
                                  B.DEN.dense
                                  E.DEP.border-over-shadow
```

Record IDs, four digits, never reused:

```
PREF-0001   a taste record     — what I like or reject, and in which context
DDR-0001    a decision record  — a design decision, its alternatives, its cost
REF-0001    a reference record — one analysed artefact, scored on the facets
BRIEF-slug  a brief            — a project's target, written as facet terms
```

## 4. Stance marks

Every facet table carries a **Stance** column. It is Sam's position on that term, and it
is the thing that makes this a taste database rather than a glossary.

| Mark | Meaning |
|---|---|
| `✓` | **Likes.** Evidenced — a PREF record cites where it was said or shown. |
| `✗` | **Rejects.** Evidenced. Do not propose this without naming the exception. |
| `~` | **Conditional.** Depends on surface or context; the condition is stated inline. |
| `req` | **Required.** A constraint, not a taste — correctness, accessibility, locale or a DDR. |
| `–` | **Unknown.** Not yet observed. |

`✓`, `✗` and `~` are claims about **Sam**, and each one must cite the PREF or DDR that
carries its evidence. A tool that writes one without a citation is doing the thing this
database exists to prevent.

`req` is a claim about the **work**: tabular figures where numbers stack, a visible focus
ring, Jalali dates for an Iranian product. It is enforced like a preference but it is not
one, and it must never be read back as something Sam said. The parser returns it as
`required`, never as `likes` — that distinction was added on 24 Nov 2026, after an audit
found 78 of 122 claimed positions had no evidence behind them at all.

`–` cells are the backlog. They are what to ask about, and they are why this system gets
sharper rather than staler over time: each new project converts some `–` into `✓`, `✗` or
`~`, with evidence. A `–` may still carry a note — that note is guidance, not a position.

**Nothing becomes `✓` or `✗` from inference.** It takes a statement, or a rejection of
something concrete. A guess is left `–`, because a wrong `✓` is worse than an empty cell —
it fabricates a preference and then designs to it.

## 5. The DNA string

This is the payoff. A one-line form, built from facet terms, that specifies a design
precisely enough to produce or critique against:

```
dark-first · single-accent · brutalist-utility · dense · tabular-numerals ·
border-over-shadow · fast-removable-motion · rtl-primary · no-photography
```

Long form, when a surface needs the detail, as a block in the brief:

```
surface   athlete PWA · mobile-first · one-hand · gym light · RTL primary
lineage   A.FAM.brutalist-utility, finished as A.FAM.dark-athletic
structure B.DEN.dense · B.HIER.enclosure+size · B.GRID.single-column-list
colour    C.PAL.single-accent · C.VAL.dark-first · C.CON.high
type      D.NUM.tabular · D.WGT.high-contrast · D.HERO.display-numeral
surface   E.RAD.small · E.DEP.border-over-shadow
motion    G.DUR.fast · G.RED.removable
reject    F.IMG.photography · E.DEP.glass-blur · C.CON.low
```

The `reject` line is as load-bearing as the rest. Most briefs fail by under-specifying
what is *out*, which is how a request for restraint comes back as a gradient.

## 6. Record types

All four are **frontmatter-first**: `type`, `id`, `title` and the queryable fields live in
YAML so Obsidian Bases and the `design-db` MCP server can read them without parsing prose.
They carry no `description:` key — that is reserved for root-level memories, which must not
have to compete with database records during recall. See [HARNESS.md](HARNESS.md).

**PREF** — one taste fact. Polarity (`like` / `reject` / `conditional`), the facet terms it
touches, the evidence (what was said or shown, and when), the reason, and the scope it
applies to. Written only from evidence. `preferences/_template.md`.

**DDR** — one design decision. What was decided, what else was considered, why this one,
what it costs, and where it binds. A DDR can contradict a PREF if a constraint forces it —
it must then say so. `decisions/_template.md`.

**REF** — one analysed artefact: a screenshot, app, site or print piece. Scored on the
facets, plus the three fields that kill most references — imagery dependency, RTL
survivability, render/download cost — and a verdict. `references/_template.md`.

**BRIEF** — a project's target as facet terms, with its constraints and its rejects. This is
what a design gets produced *from* and critiqued *against*. `briefs/_template.md`.

## 7. The loop

```
observe  →  REF (an artefact scored)  or  PREF (a thing said)
             ↓
cluster  →  a term's Stance changes, with evidence
             ↓
specify  →  BRIEF: the DNA string for this surface
             ↓
produce  →  the design
             ↓
critique →  score against facet L + the BRIEF's reject line + active PREFs
             ↓
            misses become new PREF/DDR records, and the loop closes
```

The critique step is not optional and it is not self-congratulation. It reports **misses**,
by ID: "violates PREF-0003 (side-stripe status), scores 2/5 on L.ROB (no empty state)".
A design that cannot be scored against a brief was not briefed.

## 8. Maintenance

- **A new term is admitted** when an existing term cannot express a real distinction that
  came up in actual work. Not speculatively. Terms are cheap to add and expensive to have:
  a vocabulary nobody can hold is not a language.
- **A term is retired**, never silently redefined. Redefining breaks every record citing it.
- **Stance changes carry evidence.** Edit the cell, add or update the PREF, date it.
- **Promotion rule.** A PREF stays in this folder. It is *also* written as a root
  `feedback-*` memory only when it is general enough to apply outside design work, or when
  it has been restated across projects. The root is the recall layer and must not fill up
  with fifty colour opinions — see [[vault-conventions]].
- **Project design systems do not live here.** A project's own tokens and components live in
  the project repo. This database holds the *language* used to specify them, the taste
  record, and the cross-project references.
