'use strict';
/**
 * THE AGENT LOOP — the heart of every tool-using agent, whatever the model.
 *
 *   ┌─> ask the model (conversation so far + tool definitions)
 *   │        │
 *   │        ├─ it asked for tools ──> run each one, add the results to the conversation ─┐
 *   │        │                                                                              │
 *   └────────┼──────────────────────────────────────────────────────────────────────────────┘
 *            └─ it stopped without tools ──> are we done? (did a finishing tool succeed?)
 *
 * Notice what is NOT here: nothing about Claude or Ollama. The loop talks to a "session"
 * object with three methods — next(), addToolResults(), addUserText() — and each adapter
 * in ./adapters implements those for its provider. Swap the adapter, keep the loop.
 *
 * The guard rails are the interesting part:
 *   - maxTurns: a model can loop forever (re-sampling colours, re-validating). Cap it.
 *   - one nudge: models sometimes "finish" by writing prose instead of calling the tool
 *     that saves the work. We remind once, then give up and report it.
 *   - refusals and truncation end the pin cleanly instead of crashing the run.
 */
const tools = require('./tools');

async function runAgent({ adapter, system, userText, image, ctx, maxTurns = 18, log = () => {} }) {
  const session = adapter.startSession({ system, tools: tools.DEFINITIONS, userText, image });
  const usage = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 };
  let nudged = false;
  let failedTurns = 0; // consecutive turns where EVERY tool call errored

  for (let turn = 1; turn <= maxTurns; turn++) {
    const reply = await session.next();
    for (const k of Object.keys(usage)) usage[k] += (reply.usage && reply.usage[k]) || 0;
    log({ turn, role: 'assistant', text: reply.text, toolCalls: reply.toolCalls, stop: reply.stop, usage: reply.usage });

    if (reply.stop === 'refusal') return { ok: false, reason: `model declined (${reply.detail || 'policy'})`, turns: turn, usage };
    if (reply.stop === 'max_tokens') return { ok: false, reason: 'reply was cut off at max_tokens', turns: turn, usage };

    if (reply.toolCalls.length) {
      // Run every call the model asked for, in order, and send ALL results back together.
      const results = [];
      for (const call of reply.toolCalls) {
        const r = await tools.execute(ctx, call.name, call.input);
        log({ turn, role: 'tool', name: call.name, input: call.input, isError: r.isError, content: r.content.slice(0, 2000) });
        results.push({ id: call.id, name: call.name, ...r });
      }
      if (ctx.result) return { ok: true, turns: turn, usage };   // a finishing tool succeeded
      // Stuck detection: a model repeating a failing call will happily do it until maxTurns.
      failedTurns = results.every((r) => r.isError) ? failedTurns + 1 : 0;
      if (failedTurns >= 4) return { ok: false, reason: `stuck — every tool call failed 4 turns running (last: ${results[0].content.slice(0, 120)})`, turns: turn, usage };
      session.addToolResults(results);
      continue;
    }

    // The model stopped talking without calling a tool.
    if (ctx.result) return { ok: true, turns: turn, usage };
    if (!nudged) {
      nudged = true;
      const msg = 'You have not saved anything yet. Finish this image now by calling write_record (or mark_duplicate if it is the same picture as an existing REF).';
      log({ turn, role: 'user', text: msg });
      session.addUserText(msg);
      continue;
    }
    return { ok: false, reason: 'stopped without writing a record (after one reminder)', turns: turn, usage };
  }
  return { ok: false, reason: `no record after ${maxTurns} turns`, turns: maxTurns, usage };
}

module.exports = { runAgent };
