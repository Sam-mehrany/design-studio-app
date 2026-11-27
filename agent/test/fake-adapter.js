'use strict';
/**
 * A scripted stand-in for a model, used only by test/run-tests.js. It speaks the same three
 * methods as the real adapters and REACTS to real tool results the way a model would:
 *   turn 1  look for duplicates + sample colours
 *   turn 2  if a library image is near-identical → mark_duplicate
 *           else write_record, with one deliberately invalid term (to exercise self-correction)
 *   turn 3  read the error, fix the term, write_record again
 * FAKE_BEHAVIOUR=lazy makes it answer in prose and never call a tool (exercises the nudge).
 */
function createFakeAdapter() {
  function startSession() {
    let turn = 0, seq = 0, similar = null, palette = [], lastError = null;
    const call = (name, input) => ({ id: `f${++seq}`, name, input });
    const record = (facets) => ({
      title: 'Test sign-in card — white card on pale field, single dark button',
      concept: 'component', kind: 'concept', archetype: ['J.ACQ.landing'],
      facets, imagery_dep: 'none', rtl: 'clean', cost: 'low', verdict: 'adapt', confidence: 'low',
      read: {
        method: 'Measured: palette by region sampling; contrast by WCAG formula on sampled pairs.',
        colour: `Field ${palette[0]}, card ${palette[1] || palette[0]}.`,
        typography: 'Single sans, two sizes.', layout: 'Centred card.', shape: 'Rounded card.',
        components: 'One filled button.', imagery: 'None.', contrast: 'Not measured in this test.',
      },
      why_verdict: 'Concept shot, so adapt at most.',
    });
    return {
      async next() {
        turn++;
        if (process.env.FAKE_BEHAVIOUR === 'lazy') return { text: 'This looks like a nice login card.', toolCalls: [], stop: 'end', usage: {} };
        if (turn === 1) return { text: '', toolCalls: [call('find_similar_refs', { limit: 3 }), call('sample_colors', { count: 3 })], stop: 'tool_use', usage: { input: 1000, output: 50 } };
        if (similar && similar.distance < 20) {
          return { text: '', toolCalls: [call('mark_duplicate', { ref_id: similar.ref, reason: 'same image re-pinned (fingerprint distance ' + similar.distance + ').' })], stop: 'tool_use', usage: {} };
        }
        if (!lastError) return { text: '', toolCalls: [call('write_record', record(['C.PAL.neutral-only', 'B.DEN.sparse', 'D.SCL.two-tier']))], stop: 'tool_use', usage: {} };
        return { text: '', toolCalls: [call('write_record', record(['C.PAL.neutral-only', 'B.DEN.sparse', 'D.SCALE.two-tier', 'B.CONT.cards']))], stop: 'tool_use', usage: {} };
      },
      addToolResults(results) {
        for (const r of results) {
          if (r.name === 'find_similar_refs' && !r.isError) similar = JSON.parse(r.content)[0];
          if (r.name === 'sample_colors' && !r.isError) palette = JSON.parse(r.content).colors.map((c) => c.hex);
          if (r.name === 'write_record') lastError = r.isError ? r.content : null;
        }
      },
      addUserText() {},
    };
  }
  return { name: 'fake', model: 'scripted', startSession, cost: () => 0, doctor: async () => ({ ok: true, info: 'scripted test model' }) };
}
module.exports = { createFakeAdapter };
