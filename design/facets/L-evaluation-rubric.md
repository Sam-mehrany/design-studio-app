# Facet L — Evaluation rubric

*How is a result judged, and what counts as a miss?* This is the normative facet. Its
purpose is to make critique **reportable**: not "this feels off", but "scores 2 on L.ROB
because no empty state exists, and violates PREF-0002".

Each dimension is scored 1–5. The anchors matter more than the number — only 1 and 5 are
defined, because a defended 3 is just an honest "partly".

## The dimensions

### `L.HIER` — Hierarchy clarity
**1** — everything competes; no element is obviously first.
**5** — the single most important element is unmistakable in under a second, and the second
and third ranks are also clear.

### `L.SCAN` — Scanability
**1** — values must be hunted; alignment shifts between rows; no entry point.
**5** — the eye lands in the right place, numbers align in columns, grouping is apparent
without reading labels.

### `L.AFF` — Affordance clarity
**1** — unclear what is interactive; actions discoverable only by trying.
**5** — every control reads as what it is, the primary action is obvious, and nothing
decorative pretends to be tappable.

### `L.CONS` — System consistency
**1** — one-off treatments; this screen implies a different design system from the last.
**5** — every treatment already exists in the system; nothing new was invented to solve a
local problem. This is the dimension PREF-0002 is about.

### `L.A11Y` — Accessibility compliance
**1** — contrast fails, targets are small, status is colour-only, focus invisible.
**5** — every item in `K.A11Y` verified, in both themes, measured rather than assumed.

### `L.DENS` — Density appropriateness
**1** — density fights the job: a logger made sparse, or a glance screen made dense.
**5** — density matches the archetype's `K.ATT` budget exactly.

### `L.ROB` — Robustness
**1** — only the happy path exists; long text clips, zero items looks broken, errors are raw.
**5** — every applicable row of `I.STATE` is designed, including long content, translation
expansion, offline, stale and conflict.

### `L.COST` — Cost discipline
**1** — effects and assets the target device and network cannot afford.
**5** — inside the stated `K.BUDGET`, with the expensive choices justified individually.

### `L.RTL` — Direction integrity
**1** — a mirrored LTR layout; numerals, units, dates or icons wrong.
**5** — RTL designed as primary; directional icons flip, metaphors do not, numbers and dates
follow the stated policy.

### `L.FID` — Brief fidelity
**1** — ignores the brief's DNA string, or quietly violates its `reject` line.
**5** — every term in the brief is traceable in the result, and any deviation is named and
argued rather than slipped in.

### `L.DIST` — Distinctiveness
**1** — indistinguishable from the category default; nothing would be lost if it were
swapped for a competitor's screen.
**5** — recognisably this product, achieved through structure and type rather than ornament.

`L.DIST` is scored **last** and never traded against `L.HIER`, `L.A11Y` or `L.ROB`.
Distinctiveness bought by damaging clarity is not a 5 on anything.

## The critique protocol

Applied to every design produced against a brief. Output format:

```
BRIEF      brief-<slug>  ·  DNA: <the one-line string>

SCORES     HIER 4 · SCAN 3 · AFF 4 · CONS 5 · A11Y 3 · DENS 4
           ROB 2 · COST 4 · RTL 5 · FID 4 · DIST 3

MISSES     L.ROB 2   no empty or offline state for the roster list
           L.A11Y 3  muted-on-surface measures 3.9:1, below the 4.5:1 floor
           PREF-0002 status on the active card uses a tinted left edge

HELD       weight budget 74KB of 90KB · RTL mirror verified · tabular figures throughout

OPEN       accent hue not yet decided; placeholder in use
```

Rules for the protocol:

- **Misses are cited by ID.** A miss without an ID is an opinion.
- **Two low scores beat ten high ones.** Report the floor, not the average.
- **`HELD` exists to be honest about what was verified** versus assumed. Anything not
  actually checked goes in `OPEN`, never in `HELD`.
- **A deviation from the brief is allowed** — but it is argued in `MISSES` with its reason,
  never absorbed silently.
- **Every miss is a candidate record.** If it reveals a taste, it becomes a PREF; if it
  reveals a constraint trade, it becomes a DDR.
