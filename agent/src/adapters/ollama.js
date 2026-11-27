'use strict';
/**
 * Ollama adapter — talks to a local model through Ollama's /api/chat endpoint.
 *
 * Same three methods as the Claude adapter; different wire format:
 *   - images ride on the message as a base64 array (`images: [...]`), not as content blocks
 *   - tools are declared OpenAI-style: { type: "function", function: { name, description, parameters } }
 *   - a tool result is its own message: { role: "tool", tool_name, content }
 *   - tool calls carry no IDs, so we make some up for the loop's bookkeeping
 *
 * Plain fetch, no SDK: Ollama's API is small enough that a library would hide the lesson.
 */

function createOllamaAdapter({
  model = 'qwen3-vl:8b', host = 'http://127.0.0.1:11434', numCtx = 32768, temperature = 0.2, think,
} = {}) {
  async function post(pathname, body) {
    const r = await fetch(host + pathname, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!r.ok) throw new Error(`Ollama ${pathname} → HTTP ${r.status}: ${(await r.text()).slice(0, 300)}`);
    return r.json();
  }

  /**
   * Small models sometimes write a tool call as JSON in their text instead of using the
   * tool-calling channel. Recover the obvious cases rather than wasting a turn.
   */
  function toolCallsFromText(text, toolNames) {
    const calls = [];
    for (const m of String(text || '').matchAll(/\{[\s\S]*?"name"\s*:\s*"([a-z_]+)"[\s\S]*\}/g)) {
      if (!toolNames.has(m[1])) continue;
      try {
        const obj = JSON.parse(m[0]);
        calls.push({ name: obj.name, input: obj.arguments || obj.parameters || obj.input || {} });
      } catch { /* not clean JSON — leave it */ }
    }
    return calls;
  }

  function startSession({ system, tools, userText, image }) {
    const messages = [
      { role: 'system', content: system },
      { role: 'user', content: userText, images: [image.base64] },
    ];
    const ollamaTools = tools.map((t) => ({ type: 'function', function: { name: t.name, description: t.description, parameters: t.input_schema } }));
    const toolNames = new Set(tools.map((t) => t.name));
    let callSeq = 0;

    return {
      async next() {
        const body = { model, messages, tools: ollamaTools, stream: false, options: { num_ctx: numCtx, temperature } };
        if (think !== undefined) body.think = think;
        const res = await post('/api/chat', body);
        const msg = res.message || { role: 'assistant', content: '' };
        messages.push(msg); // keep the assistant turn exactly as Ollama returned it

        let calls = (msg.tool_calls || []).map((c) => ({
          name: c.function && c.function.name,
          input: typeof (c.function && c.function.arguments) === 'string' ? safeJson(c.function.arguments) : (c.function && c.function.arguments) || {},
        }));
        if (!calls.length) calls = toolCallsFromText(msg.content, toolNames);
        const toolCalls = calls.filter((c) => c.name).map((c) => ({ id: `call_${++callSeq}`, ...c }));

        return {
          text: String(msg.content || '').trim(),
          toolCalls,
          stop: res.done_reason === 'length' ? 'max_tokens' : toolCalls.length ? 'tool_use' : 'end',
          usage: { input: res.prompt_eval_count || 0, output: res.eval_count || 0 },
        };
      },
      addToolResults(results) {
        for (const r of results) messages.push({ role: 'tool', tool_name: r.name, content: r.content });
      },
      addUserText(text) {
        messages.push({ role: 'user', content: text });
      },
    };
  }

  /** Is Ollama running, is the model pulled, and can it see images and call tools? */
  async function doctor() {
    try {
      const tags = await fetch(host + '/api/tags').then((r) => r.json());
      const names = (tags.models || []).map((m) => m.name);
      if (!names.some((n) => n === model || n === `${model}:latest`)) {
        return { ok: false, problem: `model ${model} is not pulled — run: ollama pull ${model}` };
      }
      const show = await post('/api/show', { model });
      const caps = show.capabilities || [];
      const missing = ['vision', 'tools'].filter((c) => !caps.includes(c));
      if (missing.length) return { ok: false, problem: `${model} lacks ${missing.join(' + ')} support — pick a model with both (see README)` };
      return { ok: true, info: `${model} — ${caps.join(', ')} (context ${numCtx})` };
    } catch (e) {
      return { ok: false, problem: `Ollama is not reachable at ${host} — is it running? (${e.message})` };
    }
  }

  return { name: 'ollama', model, startSession, cost: () => 0, doctor };
}

function safeJson(s) { try { return JSON.parse(s); } catch { return {}; } }

module.exports = { createOllamaAdapter };
