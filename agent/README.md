# Pinterest agent

A hand-built AI agent that checks your Pinterest boards every day, finds the pins you
added, analyses each image the way the ingest skill says, and files it in the Design
Studio vault as a REF record.

It runs on **your Windows PC**, with either a **local model** (Ollama, free, private) or
**Claude** (the Claude API, paid per use). It was built to teach how agents work, so the
code is small, commented, and has no framework in it.

```
Daily, Task Scheduler ─> node src/run.js
   1. SYNC     plain code   pinterest-sync.js: new pins → references/inbox/
   2. ANALYSE  the agent    for each image: model ⇄ tools loop → REF record
   3. INDEX    plain code   regenerate references/index.md
   4. COMMIT   plain code   git commit in the vault
```

## What each file teaches

| File | The idea |
|---|---|
| [`src/loop.js`](src/loop.js) | **The agent loop.** Ask the model → it asks for tools → run them → send results back → repeat until a finishing tool succeeds. Plus the guard rails every unattended agent needs: a turn cap, one reminder when it stops without saving, and stuck detection when it keeps repeating a failing call. ~70 lines, and nothing in it is specific to a model. |
| [`src/tools.js`](src/tools.js) | **Tools = a definition the model reads + code you run.** The model never touches a file or pixel. The two finishing tools (`write_record`, `mark_duplicate`) validate everything and send back precise errors, which is how the model corrects itself. |
| [`src/adapters/`](src/adapters/) | **One loop, many models.** `claude.js` and `ollama.js` each implement the same three methods (`next`, `addToolResults`, `addUserText`) for very different APIs. Compare them side by side. |
| [`src/prompt.js`](src/prompt.js) | **Context engineering.** The system prompt is your ingest skill (read live from the vault, so it can't drift) plus the whole facet vocabulary, so the model picks real terms instead of inventing plausible ones. |
| [`src/record.js`](src/record.js) | **Never let the model do bookkeeping.** IDs, filenames, the pin URL, moving the image: code does these, because a model slip there corrupts the library silently. |
| [`src/run.js`](src/run.js) | **Workflow outside, agent inside.** Only the step that needs judgement is an agent. Everything that can be deterministic is. |

Two rules from the vault are enforced in code, not just requested in the prompt:
- **Measured, not guessed.** `write_record` rejects any hex value that didn't come from `sample_colors` or `contrast_ratio`.
- **A classifier never writes a stance.** Records always land `status: unreviewed` with an empty `sam_reaction`.

## Setup on your Windows PC

You need **Node.js 20+** and **git**. In PowerShell:

```powershell
cd <your clone of design-studio-app>
git pull
cd agent
npm install
copy .env.example .env
notepad .env
```

In `.env`, check `DESIGN_VAULT=D:\Memory\design`, then copy the pin ledger into your vault
once. Without it, pins from your older records look new and would be ingested again:

```powershell
copy ..\design\references\pinterest-seen.json D:\Memory\design\references\
```

### Local model (Ollama)

1. Install Ollama from <https://ollama.com/download> (Windows installer). It runs in the background.
2. Pull a model that can **see images** and **call tools**:
   ```powershell
   ollama pull qwen3-vl:8b
   ```
3. `npm run doctor`. It checks that Ollama is running, the model is pulled, and the model reports
   both `vision` and `tools`. If the model lacks either, pick another from
   <https://ollama.com/search?c=vision&c=tools> and set `OLLAMA_MODEL` in `.env`.

With a 12 GB+ NVIDIA card, an 8B vision model at a 32k context fits on the GPU. If replies
get cut off or the model loses the thread, `AGENT_VOCAB=names` makes the prompt ~40% smaller.

### Claude

1. Create an API key at <https://console.anthropic.com/settings/keys> and add credit. API usage
   is billed separately from a Claude subscription.
2. Put it in `.env` as `ANTHROPIC_API_KEY=...`. Never in code, never in chat.
3. `npm run doctor -- --provider claude`

Expect roughly **$0.10–0.25 per image** with Claude Opus 5.5 at `CLAUDE_EFFORT=high`. The
system prompt (~12k tokens) is cached, so later turns and images reuse it at a tenth of the
price. Every run's `summary.md` shows the real cost per image.

## First runs: learn by watching

```powershell
npm run check                                   # which pins are new? (changes nothing)
npm run preview -- --image C:\path\to\any.png   # analyse one image into runs\, vault untouched
npm run compare -- --image C:\path\to\any.png   # same image through BOTH models
npm start                                       # a real run: sync, analyse, index, commit
```

Every run gets a folder in `agent\runs\<timestamp>\` with:
- `summary.md`: one row per image: result, turns, seconds, cost.
- one `.jsonl` **transcript per image**, with every model turn and every tool call, its input and
  its result. **Read these.** They're where you see what the model actually did: which regions it
  sampled, which terms it tried, which errors it fixed. That's the fastest way to understand agents.

A good first exercise: run `compare` on three or four images already in your library
(`D:\Memory\design\references\library\REF-00xx.jpg`), and set the two previews beside the
existing record that Hark wrote. Where do the models disagree with each other, and with Hark?

## Daily schedule

```powershell
powershell -ExecutionPolicy Bypass -File schedule\install-task.ps1             # daily 20:43
powershell -ExecutionPolicy Bypass -File schedule\install-task.ps1 -Time 21:15 # another time
Start-ScheduledTask -TaskName "Design Studio Pinterest Agent"                  # run it now
```

- The task runs as you, while you're signed in. If the PC was off at that time, it runs as
  soon as you're back. Output goes to `agent\runs\scheduled.log`.
- In Task Scheduler, **Last Run Result** `0x0` means everything succeeded and `0x2` means at
  least one image failed. Failed images stay in the inbox and are retried next run. Check the
  transcript to see why.
- `AGENT_MAX_PINS` (default 10) caps one run, so 200 new pins can't take all evening or a
  big bill.
- Remove the task with `Unregister-ScheduledTask -TaskName "Design Studio Pinterest Agent" -Confirm:$false`.

## Tests

```powershell
npm test
```

These run without a model or a key. `test/run-tests.js` drives the real `run.js` against a
throwaway copy of the vault, using a scripted fake model. It checks IDs, files, the pin line,
the index, the commit, self-correction, the reminder and failure paths, and preview mode.
`test/adapter-wire-test.js` checks what each adapter sends, against a mock Ollama and a mock
Claude API.

## Exercises to grow it

1. **Add a tool.** For example `crop_image`, which returns a zoomed region so the model can read
   small type. Claude accepts images inside a tool result; Ollama doesn't, so you'll learn where
   the adapters differ.
2. **Measure, don't guess, which model is better.** Take ten records you've reviewed, re-run
   them in `--preview`, and score agreement on `concept`, `archetype` and `verdict`. That's an
   eval, the tool that turns "it feels better" into a number.
3. **Swap the loop.** Replace `loop.js` for Claude with the SDK's Tool Runner
   (`client.beta.messages.toolRunner`) and see what it does for you.
4. **Route by difficulty.** Run the local model first, and send only low-confidence images to
   Claude.
5. **Move it to the cloud.** Once it's stable, host the same agent on Railway, or rebuild it
   on Claude Managed Agents, and compare what you had to write.
