// Behavioral smoke test: drive the real ported app.js against the built data
// in a jsdom DOM and assert every mode + the theater + filtering actually work.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Pull the exact data payload the built page ships.
const html = fs.readFileSync(path.join(ROOT, 'dist/index.html'), 'utf8');
const m = /<script id="fg-data" type="application\/json">([\s\S]*?)<\/script>/.exec(html);
if (!m) throw new Error('could not find embedded fg-data payload in dist/index.html');
const data = JSON.parse(m[1]);

// Minimal DOM with the same mount points as index.astro.
const dom = new JSDOM(
  `<!DOCTYPE html><body><div class="fg-root"><div id="fg-app"></div><div id="fg-theater-root"></div></div></body>`,
  { pretendToBeVisual: true }
);
const { window } = dom;

// Stubs for browser APIs jsdom lacks.
class IO {
  constructor(cb) { this.cb = cb; }
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.IntersectionObserver = IO;
window.scrollTo = () => {};
window.HTMLElement.prototype.scrollTo = () => {};

// Wire globals the module reads.
global.window = window;
global.document = window.document;
global.IntersectionObserver = IO;

const { initPortfolio } = await import('../src/scripts/app.js');
initPortfolio(data);

const $ = (sel) => window.document.querySelector(sel);
const $$ = (sel) => [...window.document.querySelectorAll(sel)];

let pass = 0, fail = 0;
const ok = (cond, msg) => { if (cond) { pass++; } else { fail++; console.error('  ✗ ' + msg); } };

// ---- Catalog (default) ----
ok($$('.fg-mode').length === 3, 'header renders 3 mode buttons');
ok($('.fg-mode[data-mode="catalog"]').getAttribute('data-on') === 'true', 'catalog mode active by default');
ok($$('.fg-card').length === data.total, `catalog shows all ${data.total} cards (got ${$$('.fg-card').length})`);
ok($('.fg-hero-img').getAttribute('src') === data.hero, 'hero image src matches settings');
ok($('.fg-fl-hint').textContent.includes(`same ${data.total} specimens`), 'hint count is dynamic');
ok($('.fg-count b').textContent === String(data.total), 'live count shows total');
ok($$('.fg-chip').length === 5, 'five category chips (All + 4)');

// ---- Filter to Birds ----
$('.fg-chip[data-cat="Birds"]').click();
const birds = data.specimens.filter((p) => p.cat === 'Birds').length;
ok($$('.fg-card').length === birds, `filtering to Birds shows ${birds} cards (got ${$$('.fg-card').length})`);
ok($('.fg-count').textContent.includes('· Birds'), 'count label appends category when filtered');
// back to All
$('.fg-chip[data-cat="All"]').click();
ok($$('.fg-card').length === data.total, 'back to All restores full set');

// ---- Theater open / navigate / close ----
$('.fg-hit[data-open="1"]').click();
ok(!!$('.fg-theater'), 'clicking a card opens the theater');
ok($('.fg-th-title').textContent === data.specimens[0].title, 'theater shows the clicked specimen title');
ok($('.fg-th-count').textContent.trim() === `1 / ${data.total}`, 'theater index label correct');
$('.fg-th-nav[data-act="next"]').click();
ok($('.fg-th-title').textContent === data.specimens[1].title, 'theater next advances specimen');
$('.fg-th-nav[data-act="prev"]').click();
$('.fg-th-nav[data-act="prev"]').click();
ok($('.fg-th-title').textContent === data.specimens[data.total - 1].title, 'theater prev wraps around');
$('.fg-th-close').click();
ok(!$('.fg-theater'), 'close removes the theater');

// ---- Journal ----
$('.fg-mode[data-mode="journal"]').click();
ok(!!$('.fg-journal'), 'switches to journal mode');
ok($('.fg-jr-title').textContent === data.specimens[0].title, 'journal opens on first specimen');
ok($('.fg-jcount').textContent.includes(`of ${data.total}`), 'journal page count is total');
ok($$('.fg-thumb').length === data.total, 'journal filmstrip has a thumb per specimen');
$('.fg-jbtn[data-act="jnext"]').click();
ok($('.fg-jr-title').textContent === data.specimens[1].title, 'journal next advances');
$('.fg-thumb[data-thumb="4"]').click();
ok($('.fg-jr-title').textContent === data.specimens[4].title, 'clicking a thumb jumps to that specimen');

// ---- Trail ----
$('.fg-mode[data-mode="trail"]').click();
ok(!!$('#fg-trail-scroll'), 'switches to trail mode');
ok($$('.fg-trail-sec').length === data.total, 'trail renders a section per specimen');
ok($$('.fg-rail-dot').length === data.total, 'trail rail has a dot per specimen');
ok($('.fg-trail-title').textContent === data.specimens[0].title, 'trail first section correct');

// ---- Back to catalog ----
$('.fg-mode[data-mode="catalog"]').click();
ok(!!$('.fg-gallery'), 'returns to catalog');

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
