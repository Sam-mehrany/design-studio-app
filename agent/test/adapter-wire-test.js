#!/usr/bin/env node
'use strict';
/**
 * Checks what each adapter puts on the wire, against a local mock server that answers like
 * Ollama and like the Claude API. No real model, no key, no network.
 *   node test/adapter-wire-test.js
 */
const http = require('http');
const assert = require('assert');

const seen = [];
let claudeTurn = 0, ollamaTurn = 0;
const server = http.createServer((req, res) => {
  let body = '';
  req.on('data', (c) => { body += c; });
  req.on('end', () => {
    const json = body ? JSON.parse(body) : null;
    seen.push({ url: req.url, headers: req.headers, body: json });
    const send = (o) => { res.writeHead(200, { 'content-type': 'application/json' }); res.end(JSON.stringify(o)); };
    if (req.url === '/api/tags') return send({ models: [{ name: 'qwen3-vl:8b' }] });
    if (req.url === '/api/show') return send({ capabilities: ['completion', 'vision', 'tools'] });
    if (req.url === '/api/chat') {
      ollamaTurn++;
      if (ollamaTurn === 1) return send({ message: { role: 'assistant', content: '', tool_calls: [{ function: { name: 'sample_colors', arguments: { count: 3 } } }] }, done_reason: 'stop', prompt_eval_count: 900, eval_count: 20 });
      // turn 2: the model writes its tool call as text instead — the adapter should recover it
      return send({ message: { role: 'assistant', content: 'Calling: {"name": "validate_terms", "arguments": {"terms": ["C.PAL.neutral-only"]}}' }, done_reason: 'stop' });
    }
    if (req.url.startsWith('/v1/messages')) {
      claudeTurn++;
      const content = claudeTurn === 1
        ? [{ type: 'thinking', thinking: '', signature: 'sig' }, { type: 'tool_use', id: 'toolu_1', name: 'sample_colors', input: { count: 3 } }]
        : [{ type: 'text', text: 'Done.' }];
      return send({ id: 'msg_' + claudeTurn, type: 'message', role: 'assistant', model: 'claude-opus-5-5', content, stop_reason: claudeTurn === 1 ? 'tool_use' : 'end_turn', stop_details: null, usage: { input_tokens: 50, output_tokens: 10, cache_read_input_tokens: 12000, cache_creation_input_tokens: 0 } });
    }
    res.writeHead(404); res.end('{}');
  });
});

server.listen(0, '127.0.0.1', async () => {
  const base = `http://127.0.0.1:${server.address().port}`;
  const tools = [{ name: 'sample_colors', description: 'd', input_schema: { type: 'object', properties: {} } }, { name: 'validate_terms', description: 'd', input_schema: { type: 'object', properties: {} } }];
  const image = { mediaType: 'image/jpeg', base64: 'QUJD' };
  try {
    // ---- Ollama
    const { createOllamaAdapter } = require('../src/adapters/ollama');
    const o = createOllamaAdapter({ host: base });
    assert.ok((await o.doctor()).ok, 'ollama doctor passes when the model has vision + tools');
    const os = o.startSession({ system: 'SYS', tools, userText: 'look', image });
    const t1 = await os.next();
    assert.deepStrictEqual(t1.toolCalls.map((c) => [c.name, c.input]), [['sample_colors', { count: 3 }]]);
    os.addToolResults([{ id: t1.toolCalls[0].id, name: 'sample_colors', content: '{"colors":[]}', isError: false }]);
    const t2 = await os.next();
    assert.deepStrictEqual(t2.toolCalls.map((c) => c.name), ['validate_terms'], 'tool call written as text is recovered');
    const chat2 = seen.filter((s) => s.url === '/api/chat')[1].body;
    assert.strictEqual(chat2.messages[0].role, 'system');
    assert.deepStrictEqual(chat2.messages[1].images, ['QUJD'], 'image rides on the user message');
    assert.strictEqual(chat2.messages[3].role, 'tool'); assert.strictEqual(chat2.messages[3].tool_name, 'sample_colors');
    assert.strictEqual(chat2.tools[0].type, 'function'); assert.strictEqual(chat2.options.num_ctx, 32768);
    console.log('  ✓ ollama: doctor, image on message, tools as functions, tool-role results, text-call recovery');

    // ---- Claude
    process.env.ANTHROPIC_API_KEY = 'test-key';
    process.env.ANTHROPIC_BASE_URL = base;
    const { createClaudeAdapter } = require('../src/adapters/claude');
    const c = createClaudeAdapter();
    const cs = c.startSession({ system: 'SYS', tools, userText: 'look', image });
    const c1 = await cs.next();
    assert.deepStrictEqual(c1.toolCalls.map((x) => x.name), ['sample_colors']);
    assert.strictEqual(c1.usage.cacheRead, 12000);
    cs.addToolResults([{ id: 'toolu_1', name: 'sample_colors', content: '{}', isError: false }]);
    const c2 = await cs.next();
    assert.strictEqual(c2.stop, 'end');
    const reqs = seen.filter((s) => s.url.startsWith('/v1/messages'));
    const r1 = reqs[0], r2 = reqs[1].body;
    assert.match(r1.headers['anthropic-beta'] || '', /server-side-fallback-2026-07-01/);
    // SDK 1.x sends the key as a bearer token (older SDKs used an x-api-key header).
    assert.ok(r1.headers.authorization === 'Bearer test-key' || r1.headers['x-api-key'] === 'test-key', 'API key is sent');
    assert.strictEqual(r1.body.model, 'claude-opus-5-5'); assert.strictEqual(r1.body.fallbacks, 'default');
    assert.deepStrictEqual(r1.body.output_config, { effort: 'high' });
    assert.deepStrictEqual(r1.body.system[0].cache_control, { type: 'ephemeral' });
    assert.deepStrictEqual(r1.body.cache_control, { type: 'ephemeral' });
    assert.strictEqual(r1.body.messages[0].content[0].type, 'image');
    assert.strictEqual(r2.messages[1].content[0].type, 'thinking', 'thinking block sent back unchanged');
    assert.strictEqual(r2.messages[2].content[0].type, 'tool_result'); assert.strictEqual(r2.messages[2].content[0].tool_use_id, 'toolu_1');
    assert.ok(c.cost({ input: 1e6, output: 0, cacheRead: 0, cacheWrite: 0 }) === 4, 'cost uses Opus 5.5 input price');
    console.log('  ✓ claude: key header, fallback beta, effort, both cache breakpoints, image block, thinking echoed, tool_result ids');
    console.log('\nadapter wire tests passed');
  } catch (e) {
    console.error('FAILED:', e.message); process.exitCode = 1;
  } finally { server.close(); }
});
