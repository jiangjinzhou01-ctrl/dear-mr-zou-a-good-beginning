import { copy, clauses } from './content.mjs';
import { SCENES, freshState, sanitizeState, reduceState, sceneFromHash } from './state.mjs';

const $ = selector => document.querySelector(selector);
const storageKey = 'dear-mr-zou:good-beginning:1';
const systemMotion = matchMedia('(prefers-reduced-motion: reduce)');
let storageAvailable = true;
let state = freshState();
let openingTimer = null;
let opening = false;
let revealAnimation = null;
const eventController = new AbortController();
const listen = (element, event, callback, options = {}) => element.addEventListener(event, callback, { ...options, signal: eventController.signal });

try { state = sanitizeState(JSON.parse(localStorage.getItem(storageKey))); }
catch { /* Corrupt or blocked storage never prevents the experience. */ }
state.scene = sceneFromHash(location.hash, state);
const text = () => copy[state.language];
const reduceMotion = () => systemMotion.matches || state.motion === 'reduce';

function save() {
  try { localStorage.setItem(storageKey, JSON.stringify({ version: 1, ...state })); }
  catch { storageAvailable = false; $('#storage-note').hidden = false; }
}

function announce(message) {
  $('#live-status').textContent = message;
}

function applyPreferences() {
  document.documentElement.lang = state.language === 'zh' ? 'zh-CN' : 'en';
  document.documentElement.dataset.motion = reduceMotion() ? 'reduce' : 'full';
  document.title = text().pageTitle;
  $('#language-toggle').textContent = state.language === 'zh' ? 'EN' : '中文';
  $('#language-toggle').setAttribute('aria-label', text().languageLabel);
  const motion = $('#motion-toggle');
  motion.textContent = reduceMotion() ? text().motionReduce : text().motionFull;
  motion.setAttribute('aria-pressed', String(reduceMotion()));
  motion.setAttribute('aria-label', text().motionLabel);
  motion.disabled = systemMotion.matches;
  motion.title = systemMotion.matches ? (state.language === 'zh' ? '正在遵循系统的减弱动效设置' : 'Following your system’s reduced-motion preference') : text().motionLabel;
}

function renderCopy() {
  document.querySelectorAll('[data-copy]').forEach(element => {
    const value = text()[element.dataset.copy];
    if (typeof value === 'string') element.textContent = value;
  });
  $('#open-invitation').setAttribute('aria-label', text().open);
  $('#note-toggle').setAttribute('aria-label', text().noteToggle);
  $('#revision-tabs').setAttribute('aria-label', text().revisionTabs);
  $('#paper-slider').setAttribute('aria-label', text().sliderLabel);
  $('#paper-slider').setAttribute('aria-describedby', 'clause-note');
  $('.chapter-nav').setAttribute('aria-label', state.language === 'zh' ? '故事章节' : 'Story chapters');
  $('#draft-clauses').replaceChildren(...clauses.map(clause => {
    const li = document.createElement('li');
    li.lang = 'en';
    li.textContent = clause.formal;
    return li;
  }));
  $('#collected-words').replaceChildren(...clauses.map((clause, index) => {
    const block = document.createElement('div');
    block.className = 'collected-sentence';
    block.style.setProperty('--order', index);
    const en = document.createElement('p');
    en.lang = 'en';
    en.textContent = clause.revised;
    block.append(en);
    if (state.language === 'zh') {
      const zh = document.createElement('span');
      zh.textContent = clause.zh.next;
      block.append(zh);
    }
    return block;
  }));
}

function renderChapters() {
  $('#chapter-list').replaceChildren(...SCENES.map((scene, index) => {
    const li = document.createElement('li');
    if (scene === state.scene) li.setAttribute('aria-current', 'step');
    const number = document.createElement('span');
    number.className = 'chapter-index';
    number.textContent = String(index + 1).padStart(2, '0');
    li.append(number, document.createTextNode(text().scenes[index]));
    return li;
  }));
}

function renderTabs() {
  $('#revision-tabs').replaceChildren(...clauses.map((clause, index) => {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.id = `tab-${index}`;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', 'revision-sheet');
    tab.setAttribute('aria-selected', String(state.selected === index));
    tab.tabIndex = state.selected === index ? 0 : -1;
    tab.dataset.index = index;
    const number = document.createElement('span');
    number.className = 'tab-number';
    number.textContent = String(index + 1).padStart(2, '0');
    const label = document.createElement('span');
    label.textContent = clause[state.language].label;
    const check = document.createElement('span');
    check.className = 'tab-check';
    check.setAttribute('aria-hidden', 'true');
    check.textContent = state.edits[index] ? '✓' : '';
    tab.append(number, label, check);
    if (state.edits[index]) tab.setAttribute('aria-label', `${clause[state.language].label}, ${text().accepted}`);
    return tab;
  }));
}

function renderHistory() {
  const traces = clauses.flatMap((clause, index) => {
    if (!state.edits[index]) return [];
    const row = document.createElement('div');
    row.className = 'trace-entry';
    const old = document.createElement('del');
    old.lang = 'en';
    old.textContent = clause.formal;
    const revised = document.createElement('ins');
    revised.lang = 'en';
    revised.textContent = clause.revised;
    row.append(old, revised);
    return [row];
  });
  if (!traces.length) {
    const empty = document.createElement('p');
    empty.className = 'trace-empty';
    empty.textContent = text().traceEmpty;
    traces.push(empty);
  }
  $('#revision-traces').replaceChildren(...traces);
}

function renderEditor() {
  const index = state.selected;
  const clause = clauses[index];
  const local = clause[state.language];
  const accepted = state.edits[index];
  const count = state.edits.filter(Boolean).length;
  const sheet = $('#revision-sheet');
  sheet.dataset.clause = index;
  revealAnimation?.cancel();
  revealAnimation = null;
  sheet.setAttribute('aria-labelledby', `tab-${index}`);
  sheet.classList.toggle('is-accepted', accepted);
  sheet.classList.remove('is-peeling');
  sheet.style.setProperty('--split', accepted ? '100%' : '0%');
  $('#formal-sentence').textContent = clause.formal;
  $('#formal-translation').textContent = local.old;
  $('#new-sentence').textContent = clause.revised;
  $('#new-translation').textContent = local.next;
  $('#clause-note').textContent = local.note;
  $('#clause-position').textContent = `${String(index + 1).padStart(2, '0')} / 03`;
  $('#paper-slider').value = accepted ? 100 : 0;
  $('#paper-slider').disabled = accepted;
  $('#paper-slider').setAttribute('aria-valuetext', accepted ? clause.revised : clause.formal);
  $('#accepted-mark').hidden = !accepted;
  $('#formal-face').setAttribute('aria-hidden', String(accepted));
  $('.revised-face').setAttribute('aria-hidden', String(!accepted));
  $('#accept-edit').hidden = accepted;
  $('#accept-edit').textContent = local.action;
  $('#accept-edit').setAttribute('aria-label', `${local.action}: ${clause.revised}`);
  $('#undo-edit').hidden = !accepted;
  const pending = state.edits.findIndex((value, candidate) => !value && candidate !== index);
  $('#next-clause').hidden = !accepted || pending < 0;
  $('#next-clause').textContent = pending >= 0 ? (state.language === 'zh' ? `再看看「${clauses[pending].zh.label}」 ↗` : `Revise: ${clauses[pending].en.label} ↗`) : '';
  $('#next-clause').dataset.next = pending;
  $('#edit-count').replaceChildren(document.createTextNode(`${count} `), Object.assign(document.createElement('span'), { textContent: '/ 3' }));
  $('#assemble-letter').hidden = count !== 3;
  $('#assembly-caption').textContent = count === 3 ? text().ready : count === 0 ? text().incomplete : text().oneLeft;
  document.body.dataset.edits = count;
  renderTabs();
  renderHistory();
}

function renderScene({ focus = false, animate = false } = {}) {
  document.body.dataset.scene = state.scene;
  SCENES.forEach(id => {
    const section = $(`#${id}`);
    const visible = state.scene === id;
    section.hidden = !visible;
    section.classList.toggle('scene-enter', visible && animate && !reduceMotion());
  });
  $('#site-footer').hidden = state.scene === 'invitation';
  renderChapters();
  if (focus) {
    window.scrollTo({ top: 0, behavior: 'instant' });
    $(`#${state.scene}-heading`).focus({ preventScroll: true });
  }
}

function renderAll(options) {
  applyPreferences();
  renderCopy();
  renderEditor();
  renderScene(options);
  $('#storage-note').hidden = storageAvailable;
}

function dispatch(event, options = {}) {
  state = reduceState(state, event);
  save();
  renderAll(options);
}

function cancelOpening() {
  if (openingTimer !== null) clearTimeout(openingTimer);
  openingTimer = null;
  opening = false;
  $('#invitation').classList.remove('is-opening');
  $('#open-invitation').classList.remove('is-open');
  $('#open-invitation').disabled = false;
}

function go(scene, { replace = false } = {}) {
  cancelOpening();
  const next = reduceState(state, { type: 'SCENE', scene });
  if (next.scene !== scene) return;
  state = next;
  save();
  const url = `${location.pathname}${location.search}#${state.scene}`;
  try { history[replace ? 'replaceState' : 'pushState']({ scene: state.scene }, '', url); }
  catch { /* The story also works in restrictive embedded browsers. */ }
  renderAll({ focus: true, animate: true });
}

function accept({ animate = true } = {}) {
  if (state.edits[state.selected]) return;
  const previous = state.selected;
  const focusWasInControl = document.activeElement === $('#accept-edit') || document.activeElement === $('#paper-slider');
  const previousClip = getComputedStyle($('#formal-face')).clipPath;
  state = reduceState(state, { type: 'EDIT', index: previous });
  save();
  renderEditor();
  if (animate && !reduceMotion() && $('#formal-face').animate) {
    revealAnimation = $('#formal-face').animate([
      { clipPath: previousClip === 'none' ? 'inset(0 0 0 0%)' : previousClip },
      { clipPath: 'inset(0 0 0 100%)' }
    ], { duration: 520, easing: 'cubic-bezier(.22,1,.36,1)' });
  }
  announce(`${text().announce} ${clauses[previous].revised} ${state.edits.filter(Boolean).length} / 3`);
  if (focusWasInControl) $('#undo-edit').focus({ preventScroll: true });
}

listen($('#open-invitation'), 'click', () => {
  if (opening) return;
  opening = true;
  $('#open-invitation').disabled = true;
  $('#open-invitation').classList.add('is-open');
  $('#invitation').classList.add('is-opening');
  if (reduceMotion()) { go('draft'); return; }
  openingTimer = setTimeout(() => go('draft'), 850);
});
listen($('#language-toggle'), 'click', () => dispatch({ type: 'LANGUAGE', language: state.language === 'zh' ? 'en' : 'zh' }));
listen($('#motion-toggle'), 'click', () => dispatch({ type: 'MOTION', motion: reduceMotion() ? 'full' : 'reduce' }));
listen($('#note-toggle'), 'click', () => {
  const open = $('#note-content').hidden;
  $('#note-content').hidden = !open;
  $('#note-toggle').setAttribute('aria-expanded', String(open));
});
listen($('#start-revision'), 'click', () => go('revision'));
listen($('#back-draft'), 'click', () => go('draft'));
listen($('#revision-tabs'), 'click', event => {
  const tab = event.target.closest('[role=tab]');
  if (!tab) return;
  dispatch({ type: 'SELECT', index: Number(tab.dataset.index) });
  $(`#tab-${state.selected}`).focus({ preventScroll: true });
});
listen($('#revision-tabs'), 'keydown', event => {
  const keys = ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'];
  if (!keys.includes(event.key)) return;
  event.preventDefault();
  let index = state.selected;
  if (['ArrowRight', 'ArrowDown'].includes(event.key)) index = (index + 1) % clauses.length;
  if (['ArrowLeft', 'ArrowUp'].includes(event.key)) index = (index + clauses.length - 1) % clauses.length;
  if (event.key === 'Home') index = 0;
  if (event.key === 'End') index = clauses.length - 1;
  dispatch({ type: 'SELECT', index });
  $(`#tab-${index}`).focus({ preventScroll: true });
});
listen($('#paper-slider'), 'input', event => {
  const value = Number(event.target.value);
  if (!Number.isFinite(value) || state.edits[state.selected]) return;
  $('#revision-sheet').style.setProperty('--split', `${value}%`);
  $('#revision-sheet').classList.toggle('is-peeling', value > 0 && value < 100);
  event.target.setAttribute('aria-valuetext', value >= 50 ? clauses[state.selected].revised : clauses[state.selected].formal);
  if (value >= 100) accept({ animate: false });
});
listen($('#paper-slider'), 'keydown', event => {
  if (event.key === 'Enter') { event.preventDefault(); accept(); }
});
listen($('#accept-edit'), 'click', () => accept());
listen($('#undo-edit'), 'click', () => {
  dispatch({ type: 'UNDO', index: state.selected });
  $('#accept-edit').focus({ preventScroll: true });
});
listen($('#next-clause'), 'click', event => {
  dispatch({ type: 'SELECT', index: Number(event.currentTarget.dataset.next) });
  $(`#tab-${state.selected}`).focus({ preventScroll: true });
});
listen($('#assemble-letter'), 'click', () => go('welcome'));
listen($('#review-revisions'), 'click', () => go('revision'));
listen($('#restart-story'), 'click', () => {
  state = reduceState(state, { type: 'RESTART' });
  $('#note-content').hidden = true;
  $('#note-toggle').setAttribute('aria-expanded', 'false');
  $('#revision-history').open = false;
  go('invitation');
  announce(text().restartAnnounce);
});
listen(window, 'popstate', () => {
  cancelOpening();
  state = reduceState(state, { type: 'SCENE', scene: sceneFromHash(location.hash || '#invitation', state) });
  save();
  renderAll({ focus: true });
});
listen(window, 'pageshow', event => { if (event.persisted) { cancelOpening(); renderAll(); } });
if (systemMotion.addEventListener) systemMotion.addEventListener('change', () => {
  applyPreferences();
  if (opening && reduceMotion()) go('draft');
}, { signal: eventController.signal });

renderAll();
try { history.replaceState({ scene: state.scene }, '', `${location.pathname}${location.search}#${state.scene}`); } catch { /* no routing dependency */ }
