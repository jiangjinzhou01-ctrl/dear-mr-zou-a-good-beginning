import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = new URL('../', import.meta.url);
test('HTML and CSS assets are local, present, and safe for a Pages project subpath', async () => {
  const html = await readFile(new URL('index.html', root), 'utf8');
  const css = await readFile(new URL('styles.css', root), 'utf8');
  const paths = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(x => x[1]).concat([...css.matchAll(/url\(['"]?([^'"\)]+)['"]?\)/g)].map(x => x[1]));
  assert.ok(paths.length >= 7);
  for (const path of paths) {
    assert.ok(path.startsWith('./'), `Not a relative path: ${path}`);
    assert.ok((await stat(new URL(path, root))).size > 0, `Missing asset: ${path}`);
    const resolved = new URL(path, 'https://example.github.io/project-name/').pathname;
    assert.ok(resolved.startsWith('/project-name/'));
  }
  const modules = [...(await readFile(new URL('app.js', root), 'utf8')).matchAll(/from '([^']+)'/g)].map(x => x[1]);
  for (const path of modules) assert.ok((await stat(new URL(path, root))).size > 0);
});
test('every localized HTML string exists in both language dictionaries', async () => {
  const { copy } = await import('../content.mjs');
  const html = await readFile(new URL('index.html', root), 'utf8');
  for (const [, key] of html.matchAll(/data-copy="([^"]+)"/g)) for (const language of ['zh', 'en']) assert.ok(copy[language][key], `${language}.${key}`);
});
