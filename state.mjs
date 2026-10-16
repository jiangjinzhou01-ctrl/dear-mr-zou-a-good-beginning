export const SCENES = ['invitation', 'draft', 'revision', 'welcome'];
export const TOTAL_EDITS = 3;
export const freshState = () => ({ scene: 'invitation', language: 'zh', edits: [false, false, false], selected: 0, motion: 'system' });

export function sanitizeState(value) {
  const base = freshState();
  if (!value || typeof value !== 'object') return base;
  base.language = value.language === 'en' ? 'en' : 'zh';
  base.motion = ['system', 'reduce', 'full'].includes(value.motion) ? value.motion : 'system';
  if (Array.isArray(value.edits) && value.edits.length === TOTAL_EDITS) base.edits = value.edits.map(x => x === true);
  if (Number.isInteger(value.selected) && value.selected >= 0 && value.selected < TOTAL_EDITS) base.selected = value.selected;
  if (SCENES.includes(value.scene)) base.scene = value.scene;
  if (base.scene === 'welcome' && !base.edits.every(Boolean)) base.scene = 'revision';
  return base;
}

export function reduceState(state, event) {
  switch (event.type) {
    case 'SCENE': {
      if (!SCENES.includes(event.scene)) return state;
      if (event.scene === 'welcome' && !state.edits.every(Boolean)) return state;
      return { ...state, scene: event.scene };
    }
    case 'SELECT': return Number.isInteger(event.index) && event.index >= 0 && event.index < TOTAL_EDITS ? { ...state, selected: event.index } : state;
    case 'EDIT': return Number.isInteger(event.index) && event.index >= 0 && event.index < TOTAL_EDITS ? { ...state, edits: state.edits.map((x, i) => i === event.index ? true : x) } : state;
    case 'UNDO': return { ...state, scene: state.scene === 'welcome' ? 'revision' : state.scene, edits: state.edits.map((x, i) => i === event.index ? false : x) };
    case 'LANGUAGE': return { ...state, language: event.language === 'en' ? 'en' : 'zh' };
    case 'MOTION': return { ...state, motion: event.motion === 'reduce' ? 'reduce' : 'full' };
    case 'RESTART': return { ...freshState(), language: state.language, motion: state.motion };
    default: return state;
  }
}

export function sceneFromHash(hash, state) {
  const candidate = hash.replace(/^#/, '');
  if (!SCENES.includes(candidate)) return state.scene;
  return candidate === 'welcome' && !state.edits.every(Boolean) ? 'revision' : candidate;
}
