'use strict';
/**
 * Claude adapter — talks to the Claude API through Anthropic's official SDK.
 *
 * The conversation is kept in Claude's own message format and only ever APPENDED to.
 * That matters for two reasons:
 *   - Prompt caching: the system prompt + tools (~12k tokens) are identical for every image,
 *     so after the first request they are read from cache at a tenth of the price.
 *   - Thinking blocks: Claude's reasoning blocks must be sent back unchanged in later
 *     turns. Appending response.content as-is does exactly that.
 *
 * Auth: the SDK reads ANTHROPIC_API_KEY from the environment. Never put the key in code.
 */
const Anthropic = require('@anthropic-ai/sdk');

// Per million tokens, USD — from Anthropic's price list for Claude Opus 5.5. Check
// https://www.anthropic.com/pricing if you change model; this is only for the run report.
const PRICES = {
  'claude-opus-5-5': { input: 4, output: 20, cacheRead: 0.2, cacheWrite: 5 },
  'claude-sonnet-5-5': { input: 2, output: 10, cacheRead: 0.1, cacheWrite: 2.5 },
  'claude-haiku-5-5': { input: 0.1, output: 0.5, cacheRead: 0.01, cacheWrite: 0.125 },
};

function createClaudeAdapter({ model = 'claude-opus-5-5', effort = 'high', maxTokens = 16000 } = {}) {
  const client = new Anthropic(); // ANTHROPIC_API_KEY from the environment

  function startSession({ system, tools, userText, image }) {
    const messages = [{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: image.mediaType, data: image.base64 } },
        { type: 'text', text: userText },
      ],
    }];
    const claudeTools = tools.map((t) => ({ name: t.name, description: t.description, input_schema: t.input_schema }));

    return {
      async next() {
        const response = await client.beta.messages.create({
          model,
          max_tokens: maxTokens,
          // Breakpoint 1: tools + system, shared by every image in the run (and the next run, within the cache TTL).
          system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
          tools: claudeTools,
          messages,
          // Breakpoint 2: automatic — caches the growing conversation turn by turn.
          cache_control: { type: 'ephemeral' },
          // Thinking is always on for Opus 5.5; effort sets how hard it thinks (default "medium").
          output_config: { effort },
          // If a safety classifier declines, retry server-side on the default fallback model.
          betas: ['server-side-fallback-2026-07-01'],
          fallbacks: 'default',
        });

        messages.push({ role: 'assistant', content: response.content }); // full content, thinking included
        const u = response.usage || {};
        const toolCalls = response.content
          .filter((b) => b.type === 'tool_use')
          .map((b) => ({ id: b.id, name: b.name, input: b.input }));
        const text = response.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n').trim();
        const stop = response.stop_reason === 'refusal' ? 'refusal'
          : response.stop_reason === 'max_tokens' || response.stop_reason === 'model_context_window_exceeded' ? 'max_tokens'
            : toolCalls.length ? 'tool_use' : 'end';
        return {
          text, toolCalls, stop,
          detail: response.stop_details ? response.stop_details.category : undefined,
          usage: {
            input: u.input_tokens || 0, output: u.output_tokens || 0,
            cacheRead: u.cache_read_input_tokens || 0, cacheWrite: u.cache_creation_input_tokens || 0,
          },
        };
      },
      addToolResults(results) {
        // All results of one turn go back in ONE user message, each matched by tool_use_id.
        messages.push({
          role: 'user',
          content: results.map((r) => ({ type: 'tool_result', tool_use_id: r.id, content: r.content, is_error: r.isError })),
        });
      },
      addUserText(text) {
        messages.push({ role: 'user', content: text });
      },
    };
  }

  function cost(usage) {
    const p = PRICES[model];
    if (!p) return null;
    return (usage.input * p.input + usage.output * p.output + usage.cacheRead * p.cacheRead + usage.cacheWrite * p.cacheWrite) / 1e6;
  }

  async function doctor() {
    if (!process.env.ANTHROPIC_API_KEY) return { ok: false, problem: 'ANTHROPIC_API_KEY is not set (put it in agent/.env)' };
    try {
      const m = await client.models.retrieve(model);
      return { ok: true, info: `${m.display_name || model} — reachable, key accepted` };
    } catch (e) {
      if (e instanceof Anthropic.AuthenticationError) return { ok: false, problem: 'the API key was rejected (401)' };
      if (e instanceof Anthropic.NotFoundError) return { ok: false, problem: `model ${model} not found for this key` };
      if (e instanceof Anthropic.APIConnectionError) return { ok: false, problem: 'cannot reach api.anthropic.com' };
      return { ok: false, problem: e.message };
    }
  }

  return { name: 'claude', model, startSession, cost, doctor };
}

module.exports = { createClaudeAdapter };
