# Facet H — Content & voice

*How do words, numbers and states speak?* Words are design. A component is not specified
until its label, its empty state and its failure sentence are specified, and most
"the design feels off" reports resolve to this facet rather than to colour or layout.

## H.TONE — Label tone

| ID | Term | One line | Stance |
|---|---|---|---|
| `H.TONE.terse` | Terse | Nouns and verbs, no softening; operator register | – |
| `H.TONE.neutral` | Neutral | Plain, unremarkable, invisible | – |
| `H.TONE.warm` | Warm | Second person, encouraging | – |
| `H.TONE.technical` | Technical | Precise, domain vocabulary, assumes expertise | – |
| `H.TONE.coaching` | Coaching | Directive and motivational | – fits training products; wears out fast |
| `H.TONE.playful` | Playful | Jokes, personality, surprise | – |

## H.LEN — Microcopy density

| ID | Term | One line | Stance |
|---|---|---|---|
| `H.LEN.minimal` | Minimal | Labels only; no helper text | – |
| `H.LEN.helper` | With helpers | A line of guidance where ambiguity exists | – |
| `H.LEN.explanatory` | Explanatory | Teaching as you go | – |
| `H.LEN.verbose` | Verbose | Prose in the interface | – |

## H.PERS — Person and pronoun

| ID | Term | One line | Stance |
|---|---|---|---|
| `H.PERS.first-singular` | First person singular | "I" / «من» — one author, no corporate plural | ✓ PREF-0011 |
| `H.PERS.first-plural` | First person plural | "We" / «ما» — a team or company voice | ✗ PREF-0011 where the work is Sam's alone |
| `H.PERS.second` | Second person | "You" — addressing the user | – |
| `H.PERS.impersonal` | Impersonal | No pronouns; system voice | – |

## H.VOCAB — Vocabulary discipline

| ID | Term | One line | Stance |
|---|---|---|---|
| `H.VOCAB.domain-real` | Real domain words | Use the vocabulary the users and the platform already use | ✓ PREF-0012 |
| `H.VOCAB.invented` | Invented terms | New names for familiar objects | ✗ PREF-0012 |
| `H.VOCAB.glossary-locked` | Glossary-locked | One term per concept, recorded, never varied | req |

Redesign the layout, not the words. Renaming a platform's established pages and functions
turns a redesign into a different product and makes it unreviewable against the original.

## H.NUM — Number and unit formatting

| ID | Term | One line | Stance |
|---|---|---|---|
| `H.NUM.unit-adjacent` | Unit adjacent | Unit set small beside the figure | – |
| `H.NUM.unit-in-label` | Unit in the label | Figure bare, unit in the field name | – |
| `H.NUM.precision-fixed` | Fixed precision | Decimal places never change between renders | req for stable columns |
| `H.NUM.rounding-stated` | Stated rounding | The rule is written down, not per-screen | req |
| `H.NUM.thousands-sep` | Thousands separator | Locale-correct grouping | req |

## H.STATE — State voice

Every component owes these. A design without them is a mock-up, not a design.

| ID | Term | One line | Stance |
|---|---|---|---|
| `H.STATE.empty-first-run` | Empty: first run | Nothing here *yet* — says what to do, not that it is empty | req |
| `H.STATE.empty-filtered` | Empty: filtered | No matches — offers to widen, distinct from first-run | req |
| `H.STATE.loading` | Loading | Skeleton or progress, never a bare spinner on a known layout | – |
| `H.STATE.offline` | Offline | Honest, non-alarming, says what still works | req where offline-first |
| `H.STATE.stale` | Stale | Shows data is old and when it last synced | req where offline-first |
| `H.STATE.conflict` | Conflict | Two versions exist; the user chooses, nothing is lost silently | req where offline-first |
| `H.STATE.error-recoverable` | Error: recoverable | What happened, what to do, no blame, no codes alone | req |
| `H.STATE.error-fatal` | Error: fatal | What was preserved, and the way out | req |
| `H.STATE.success-quiet` | Success: quiet | Confirmation without ceremony | – |

## H.LOC — Localisation discipline

| ID | Term | One line | Stance |
|---|---|---|---|
| `H.LOC.calendar-jalali` | Jalali calendar | Persian dates as primary, with correct month names | req for Iranian products |
| `H.LOC.currency-toman` | Toman, not rial | Price in the unit people actually speak | req for Iranian products |
| `H.LOC.expansion` | Expansion headroom | Layout survives a translation 30% longer | req |
| `H.LOC.no-concatenation` | No string concatenation | Sentences are not assembled from fragments | req |
| `H.LOC.native-authored` | Natively authored | Persian copy written as Persian, not translated from English | – preferred |

## Open questions

- `H.TONE` default for the athlete-facing surface: coaching or terse? These read very
  differently in Persian and the choice is not transferable from English products.
- Does the first-person-singular rule extend past portfolio and case-study work into
  product copy, where a company voice might be wanted?
