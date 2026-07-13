// One-off migration: decode base64 blobs in the prototype's data.js into real
// .jpg files + one Markdown content file per specimen (+ a hero settings file).
// Run once: `node scripts/migrate.mjs`. Safe to re-run (idempotent overwrite).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const HANDOFF = "C:/Users/Novak/Desktop/PKA/OWNER'S INBOX/BETWEEN THE BRANCHES/design_handoff_between_the_branches";

const IMG_DIR = path.join(ROOT, 'public/images/specimens');
const SPEC_DIR = path.join(ROOT, 'src/content/specimens');
const SET_DIR = path.join(ROOT, 'src/content/settings');
for (const d of [IMG_DIR, SPEC_DIR, SET_DIR]) fs.mkdirSync(d, { recursive: true });

// --- Load data.js in a Node sandbox (it only touches `window` at the very end)
const src = fs.readFileSync(path.join(HANDOFF, 'data.js'), 'utf8');
const win = {};
new Function('window', src)(win);
const { IMG, PHOTOS } = win.BTB;

// Reverse-map dataURL -> key name, so a photo whose src resolved to a blob
// gets a stable, human filename (loon.jpg, heron_log.jpg, ...).
const urlToKey = new Map();
for (const [key, url] of Object.entries(IMG)) urlToKey.set(url, key);

function decodeToFile(dataUrl, outPath) {
  const m = /^data:image\/[a-zA-Z]+;base64,(.+)$/s.exec(dataUrl);
  if (!m) throw new Error('not a base64 image data URL: ' + outPath);
  fs.writeFileSync(outPath, Buffer.from(m[1], 'base64'));
}

// YAML front-matter emitter that quotes every value (stories contain quotes,
// dots, apostrophes) so nothing breaks the parser.
const q = (s) => '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';

// --- Hero (site singleton)
const heroName = 'hero.jpg';
decodeToFile(IMG.hero, path.join(IMG_DIR, heroName));
fs.writeFileSync(
  path.join(SET_DIR, 'site.md'),
  `---\nhero: "/images/specimens/${heroName}"\n---\n`
);

// --- Specimens
let count = 0;
for (const p of PHOTOS) {
  const key = urlToKey.get(p.src);
  if (!key) throw new Error('no image key for photo ' + p.no + ' (' + p.title + ')');
  const file = `${key}.jpg`;
  decodeToFile(p.src, path.join(IMG_DIR, file));

  const fm = [
    '---',
    `no: ${q(p.no)}`,
    `title: ${q(p.title)}`,
    `cat: ${q(p.cat)}`,
    `place: ${q(p.place)}`,
    `coord: ${q(p.coord)}`,
    `story: ${q(p.story)}`,
    `exif: ${q(p.exif)}`,
    `image: ${q('/images/specimens/' + file)}`,
    `ratio: ${p.ratio ?? 1.5}`,
    '---',
    '',
  ].join('\n');
  fs.writeFileSync(path.join(SPEC_DIR, `${p.no}.md`), fm);
  count++;
}

console.log(`Migrated ${count} specimens + 1 hero.`);
console.log(`Images -> ${path.relative(ROOT, IMG_DIR)}`);
console.log(`Content -> ${path.relative(ROOT, SPEC_DIR)}`);
