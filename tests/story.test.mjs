import test from 'node:test';
import assert from 'node:assert/strict';
import { freshState, reduceState, sanitizeState, sceneFromHash } from '../state.mjs';
import { copy, clauses } from '../content.mjs';

test('the welcome cannot open before every sentence has been revised', () => {
  let state = freshState();
  state = reduceState(state, { type: 'SCENE', scene: 'welcome' });
  assert.equal(state.scene, 'invitation');
  for (const index of [2, 0]) state = reduceState(state, { type: 'EDIT', index });
  assert.equal(reduceState(state, { type: 'SCENE', scene: 'welcome' }).scene, 'invitation');
  state = reduceState(state, { type: 'EDIT', index: 1 });
  assert.equal(reduceState(state, { type: 'SCENE', scene: 'welcome' }).scene, 'welcome');
});
test('undoing a completed letter returns to a revisable, consistent state', () => {
  const state = sanitizeState({ scene: 'welcome', edits: [true, true, true] });
  const next = reduceState(state, { type: 'UNDO', index: 1 });
  assert.equal(next.scene, 'revision');
  assert.deepEqual(next.edits, [true, false, true]);
});
test('repeated edits are idempotent and do not double count', () => {
  const edited = reduceState(freshState(), { type: 'EDIT', index: 0 });
  assert.deepEqual(reduceState(edited, { type: 'EDIT', index: 0 }), edited);
});
test('invalid persisted data is bounded and never invents completed edits', () => {
  for (const value of [null, 12, 'hello', [], { selected: -1, edits: ['true', 1, {}], language: '<script>', scene: 'welcome' }]) {
    const state = sanitizeState(value);
    assert.equal(state.selected, 0);
    assert.deepEqual(state.edits, [false, false, false]);
    assert.notEqual(state.scene, 'welcome');
  }
});
test('out-of-range events cannot corrupt the editor', () => {
  const state = freshState();
  for (const index of [-1, 3, NaN, '1', 1.5]) {
    assert.deepEqual(reduceState(state, { type: 'EDIT', index }), state);
    assert.deepEqual(reduceState(state, { type: 'SELECT', index }), state);
  }
});
test('replay clears story progress while keeping language and motion preferences', () => {
  const state = sanitizeState({ language: 'en', motion: 'reduce', scene: 'welcome', selected: 2, edits: [true, true, true] });
  assert.deepEqual(reduceState(state, { type: 'RESTART' }), { ...freshState(), language: 'en', motion: 'reduce' });
});
test('refresh and history hashes cannot bypass the welcome gate', () => {
  assert.equal(sceneFromHash('#welcome', freshState()), 'revision');
  assert.equal(sceneFromHash('#unknown', freshState()), 'invitation');
  assert.equal(sceneFromHash('#draft', freshState()), 'draft');
  assert.equal(sceneFromHash('#welcome', { ...freshState(), edits: [true, true, true] }), 'welcome');
});
test('both languages cover the same interface and narrative keys', () => {
  assert.deepEqual(Object.keys(copy.zh).sort(), Object.keys(copy.en).sort());
  for (const language of ['zh', 'en']) for (const [key, value] of Object.entries(copy[language])) {
    if (key === 'countUnit') continue;
    assert.ok(Array.isArray(value) ? value.length === 4 && value.every(item => typeof item === 'string' && item.trim()) : typeof value === 'string' && value.trim(), `${language}.${key}`);
  }
  for (const clause of clauses) assert.deepEqual(Object.keys(clause.zh).sort(), Object.keys(clause.en).sort());
});
