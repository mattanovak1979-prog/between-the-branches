// Between the Branches — vanilla port of the approved prototype's Component.
// Same markup, class names, and interactions; data comes from the CMS-built
// JSON payload instead of the base64 data.js. No framework, no runtime.

// ---- Icons (ported verbatim from the prototype) ----
const NODES = {
  feather: [['path', 'M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z'], ['path', 'M16 8 2 22'], ['path', 'M17.5 15H9']],
  paw: [['circle', [11, 4, 2]], ['circle', [18, 8, 2]], ['circle', [20, 16, 2]], ['circle', [4, 8, 2]], ['path', 'M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.05Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z']],
  mountain: [['path', 'm8 3 4 8 5-5 5 15H2z']],
  aperture: [['circle', [12, 12, 10]], ['path', 'm14.31 8 5.74 9.94'], ['path', 'M9.69 8h11.48'], ['path', 'm7.38 12 5.74-9.94'], ['path', 'M9.69 16 3.95 6.06'], ['path', 'M14.31 16H2.83'], ['path', 'm16.62 12-5.74 9.94']],
  sparkles: [['path', 'M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.13-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.13a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.13 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.13a.5.5 0 0 1-.96 0Z'], ['path', 'M20 3v4'], ['path', 'M22 5h-4'], ['path', 'M4 17v2'], ['path', 'M5 18H3']],
  leaf: [['path', 'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z'], ['path', 'M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12']],
  pin: [['path', 'M20 10c0 4.99-5.54 10.19-7.4 11.8a1 1 0 0 1-1.2 0C9.54 20.19 4 14.99 4 10a8 8 0 0 1 16 0'], ['circle', [12, 10, 3]]],
  camera: [['path', 'M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z'], ['circle', [12, 13, 3]]],
  x: [['path', 'M18 6 6 18'], ['path', 'm6 6 12 12']],
  chevLeft: [['path', 'm15 18-6-6 6-6']],
  chevRight: [['path', 'm9 18 6-6-6-6']],
  arrowDown: [['path', 'M12 5v14'], ['path', 'm19 12-7 7-7-7']],
  arrowUp: [['path', 'M12 19V5'], ['path', 'm5 12 7-7 7 7']],
};
function icon(name, size) {
  const spec = NODES[name] || [];
  const kids = spec.map((s) =>
    s[0] === 'circle'
      ? `<circle cx="${s[1][0]}" cy="${s[1][1]}" r="${s[1][2]}"></circle>`
      : `<path d="${s[1]}"></path>`
  ).join('');
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${kids}</svg>`;
}
const CAT_ICON = { All: 'sparkles', Birds: 'feather', Wildlife: 'paw', Landscapes: 'mountain', 'Close-ups': 'aperture' };
const CAT_LIST = ['All', 'Birds', 'Wildlife', 'Landscapes', 'Close-ups'];
const catIconName = (c) => CAT_ICON[c] || 'leaf';

// ---- Helpers ----
const esc = (s) =>
  String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const LOGO = `<svg class="fg-logomark" width="34" height="24" viewBox="0 0 100 72" aria-hidden="true">
  <path d="M 12,58 C 24,52 38,50 50,51 C 64,52 78,54 88,56 L 88,53 C 78,51 64,49 50,48 C 38,47 24,49 12,54 Z" fill="var(--ink)" stroke="var(--ink)" stroke-width="2.6" stroke-linejoin="round"></path>
  <path d="M 62,52 Q 72,42 80,36" fill="none" stroke="var(--ink)" stroke-width="2.2" stroke-linecap="round"></path>
  <path d="M 76,37 C 81,33 88,32 94,36 C 88,41 81,41 76,37 Z" fill="var(--pine)"></path>
  <circle cx="70" cy="40" r="2.4" fill="var(--amber)"></circle>
  <g transform="translate(28,34) scale(0.92)">
    <path d="M 0,-2.5 C -1.5,-8.5 3.5,-13.5 9,-12.5 C 12,-12 14,-10 14.6,-7.4 L 21.5,-9.2 L 15.6,-4.4 C 15.8,-1.2 14,1.6 10.6,2.6 L 13.4,7.6 L 6.8,3.4 C 3.4,3.6 0.8,1.2 0,-2.5 Z" fill="var(--ink)"></path>
    <circle cx="10.8" cy="-9.3" r="1" fill="var(--bone)"></circle>
    <path d="M 5,3.4 L 4.2,13 M 8,3.8 L 8,13.4" stroke="var(--ink)" stroke-width="1.4" stroke-linecap="round"></path>
  </g>
</svg>`;

export function initPortfolio(data) {
  const PHOTOS = data.specimens || [];
  const HERO = data.hero || '';
  const TOTAL = data.total ?? PHOTOS.length;

  const app = document.getElementById('fg-app');
  const theaterRoot = document.getElementById('fg-theater-root');
  if (!app) return;

  const state = { mode: 'catalog', cat: 'All', openId: null, jIdx: 0, trailNo: null };

  // Observers / listeners we own and must tear down between renders.
  let revIO = null, stuckIO = null, trailIO = null;
  let onKey = null, onTopScroll = null;

  const shownList = () =>
    state.cat === 'All' ? PHOTOS : PHOTOS.filter((p) => p.cat === state.cat);

  // ---------- Templates ----------
  const modesHtml = () =>
    [
      { label: 'Catalog', hint: 'grid', key: 'catalog' },
      { label: 'Journal', hint: 'spread', key: 'journal' },
      { label: 'Trail', hint: 'immersive', key: 'trail' },
    ]
      .map(
        (m) =>
          `<button class="fg-mode" data-on="${state.mode === m.key}" data-mode="${m.key}">${m.label} <small>${m.hint}</small></button>`
      )
      .join('');

  const chipsHtml = () =>
    CAT_LIST.map(
      (name) =>
        `<button class="fg-chip" data-on="${name === state.cat}" data-cat="${esc(name)}">${icon(catIconName(name), 15)} ${esc(name)}</button>`
    ).join('');

  const headerHtml = () => `
    <header class="fg-header">
      <div class="fg-brand">
        ${LOGO}
        <span class="fg-brand-name">Between&nbsp;<em class="fg-brand-the">the</em>&nbsp;Branches</span>
      </div>
      <div class="fg-modes">${modesHtml()}</div>
    </header>`;

  const catalogHtml = () => {
    const list = shownList();
    const countLabel = (list.length === 1 ? 'photo' : 'photos') + (state.cat === 'All' ? '' : ' · ' + state.cat);
    const cards = list
      .map(
        (p) => `
        <figure class="fg-card">
          <button class="fg-hit" data-open="${p.id}" aria-label="View ${esc(p.title)}">
            <div class="fg-frame">
              <img class="fg-img" src="${esc(p.src)}" alt="${esc(p.title)}" loading="lazy">
            </div>
          </button>
        </figure>`
      )
      .join('');
    const empty = list.length === 0
      ? `<div class="fg-empty">No specimens catalogued here yet — try another category.</div>`
      : '';
    return `
    <div>
      <section class="fg-hero">
        <img class="fg-hero-img" src="${esc(HERO)}" alt="Sunset over a northern lake, trees silhouetted">
        <div class="fg-hero-scrim"></div>
        <div class="fg-hero-copy">
          <p class="fg-eyebrow">Hold still · Look closer</p>
          <h1 class="fg-hero-title">Seen quietly,<br>between <em>the</em> branches.</h1>
          <button class="fg-hero-cta" data-act="goCatalog">Open the catalog <span class="fg-cta-arrow">${icon('arrowDown', 16)}</span></button>
        </div>
      </section>

      <div class="fg-filterbar" id="catalog-top">
        <div class="fg-fl-wrap">
          <span class="fg-filter-label">The catalog</span>
          <span class="fg-fl-hint">Also a journal &amp; a trail — same ${TOTAL} specimens, three ways to browse</span>
        </div>
        <div class="fg-chips">${chipsHtml()}</div>
        <span class="fg-count"><b>${list.length}</b> ${esc(countLabel)}</span>
      </div>
      <div id="fg-stuck-sentinel" style="height:1px;"></div>

      <main class="fg-gallery" id="fg-gallery">${cards}</main>
      ${empty}
      <div class="fg-peek" id="fg-peek">${icon('aperture', 13)} Look closer</div>
      <button class="fg-top" id="fg-top" aria-label="Back to top">${icon('arrowUp', 20)}</button>

      <section class="fg-about" id="about">
        <p class="fg-eyebrow">About the photographer</p>
        <p class="fg-about-body">I'm 13 and I keep a catalog of the wild things near where I live. Every photo has a specimen number, a location, and the story of how I got the shot. Best time: right after sunrise. Best snack: trail mix.</p>
      </section>

      <footer class="fg-footer">
        <span>Between the Branches</span>
        <span>Hold still. Look closer. · All photos © the photographer</span>
      </footer>
    </div>`;
  };

  const journalHtml = () => {
    const list = shownList();
    if (!list.length) {
      return `<div class="fg-journal"><div class="fg-jbar"><span class="fg-filter-label">Field journal</span><div class="fg-chips">${chipsHtml()}</div></div><div class="fg-empty">No specimens catalogued here yet — try another category.</div></div>`;
    }
    const jIdx = Math.min(state.jIdx, Math.max(0, list.length - 1));
    const p = list[jIdx];
    const thumbs = list
      .map(
        (t, i) =>
          `<button class="fg-thumb" data-on="${i === jIdx}" data-thumb="${i}" aria-label="Go to ${esc(t.title)}"><img src="${esc(t.src)}" alt="" loading="lazy"></button>`
      )
      .join('');
    return `
    <div class="fg-journal">
      <div class="fg-jbar">
        <span class="fg-filter-label">Field journal</span>
        <div class="fg-chips">${chipsHtml()}</div>
      </div>
      <div class="fg-spread">
        <div class="fg-page-l">
          <img src="${esc(p.src)}" alt="${esc(p.title)}">
          <span class="fg-jno">No. ${esc(p.no)}</span>
        </div>
        <div class="fg-page-r">
          <p class="fg-jr-eyebrow">${icon(catIconName(p.cat), 13)} ${esc(p.cat)}</p>
          <h2 class="fg-jr-title">${esc(p.title)}</h2>
          <p class="fg-jr-story">“${esc(p.story)}”</p>
          <div class="fg-jr-divider"></div>
          <div class="fg-jr-meta">
            <span>${icon('pin', 13)} <b>${esc(p.place)}</b> · ${esc(p.coord)}</span>
            <span>${icon('aperture', 13)} ${esc(p.exif)}</span>
          </div>
        </div>
      </div>
      <div class="fg-jnav">
        <button class="fg-jbtn" data-act="jprev" aria-label="Previous">${icon('chevLeft', 26)}</button>
        <button class="fg-jbtn" data-act="jnext" aria-label="Next">${icon('chevRight', 26)}</button>
        <span class="fg-jcount">Page <b>${jIdx + 1}</b> of ${list.length}</span>
      </div>
      <div class="fg-strip">${thumbs}</div>
    </div>`;
  };

  const trailHtml = () => {
    const list = shownList();
    if (!list.length) {
      return `<div class="fg-empty">No specimens catalogued here yet — try another category.</div>`;
    }
    const activeTrailNo = state.trailNo || list[0].no;
    const dots = list
      .map(
        (p) =>
          `<button class="fg-rail-dot" data-on="${p.no === activeTrailNo}" data-rail="${esc(p.no)}"><span>${esc(p.no)}</span><i></i></button>`
      )
      .join('');
    const sections = list
      .map(
        (p) => `
        <section class="fg-trail-sec" id="trail-${esc(p.no)}" data-screen-label="${esc(p.no)}">
          <img src="${esc(p.src)}" alt="${esc(p.title)}" loading="lazy">
          <div class="fg-trail-scrim"></div>
          <div class="fg-trail-copy">
            <p class="fg-trail-no">Specimen No. ${esc(p.no)} · ${esc(p.cat)}</p>
            <h2 class="fg-trail-title">${esc(p.title)}</h2>
            <p class="fg-trail-story">“${esc(p.story)}”</p>
            <div class="fg-trail-meta">
              <span>${icon('pin', 13)} ${esc(p.place)} · ${esc(p.coord)}</span>
              <span>${icon('aperture', 13)} ${esc(p.exif)}</span>
            </div>
          </div>
        </section>`
      )
      .join('');
    return `
    <div>
      <div class="fg-rail">${dots}</div>
      <div class="fg-trail" id="fg-trail-scroll">${sections}</div>
    </div>`;
  };

  const theaterHtml = () => {
    const list = shownList();
    const idx = list.findIndex((p) => p.id === state.openId);
    if (state.openId == null || idx < 0) return '';
    const p = list[idx];
    return `
    <div class="fg-theater" role="dialog" aria-label="${esc(p.title)}">
      <button class="fg-th-close" data-act="close" aria-label="Close">${icon('x', 19)}</button>
      <button class="fg-th-nav" data-act="prev" aria-label="Previous photo">${icon('chevLeft', 26)}</button>
      <figure class="fg-th-stage">
        <img class="fg-th-img" src="${esc(p.src)}" alt="${esc(p.title)}">
        <figcaption class="fg-th-panel">
          <div class="fg-th-tagrow">
            <span class="fg-th-no">Specimen No. ${esc(p.no)}</span>
            <span>${icon(catIconName(p.cat), 13)} ${esc(p.cat)}</span>
          </div>
          <h2 class="fg-th-title">${esc(p.title)}</h2>
          <p class="fg-th-story">“${esc(p.story)}”</p>
          <div class="fg-th-meta">
            <span>${icon('pin', 13)} ${esc(p.place)} · ${esc(p.coord)}</span>
            <span>${icon('aperture', 13)} ${esc(p.exif)}</span>
            <span class="fg-th-count">${idx + 1} / ${list.length}</span>
          </div>
        </figcaption>
      </figure>
      <button class="fg-th-nav" data-act="next" aria-label="Next photo">${icon('chevRight', 26)}</button>
      <div class="fg-th-scrim" data-act="close"></div>
    </div>`;
  };

  // ---------- State transitions ----------
  const setMode = (m) => { state.mode = m; state.openId = null; renderApp(); };
  const pickCat = (c) => { state.cat = c; state.jIdx = 0; state.openId = null; state.trailNo = null; renderApp(); };
  const stepTheater = (d) => {
    const list = shownList();
    const i = list.findIndex((p) => p.id === state.openId);
    if (i < 0) return;
    state.openId = list[(i + d + list.length) % list.length].id;
    renderTheater();
  };
  const stepJournal = (d) => {
    const len = shownList().length || 1;
    state.jIdx = (state.jIdx + d + len) % len;
    renderApp();
  };
  const scrollToTrail = (secId) => {
    const root = document.getElementById('fg-trail-scroll');
    const el = document.getElementById(secId);
    if (root && el) root.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
  };

  // ---------- Render ----------
  function renderApp() {
    const view =
      state.mode === 'catalog' ? catalogHtml()
      : state.mode === 'journal' ? journalHtml()
      : trailHtml();
    app.innerHTML = headerHtml() + view;
    wireCommon();
    if (state.mode === 'catalog') setupCatalog();
    else teardownCatalog();
    if (state.mode === 'trail') setupTrailObserver();
    else teardownTrailObserver();
    renderTheater();
  }

  function renderTheater() {
    theaterRoot.innerHTML = theaterHtml();
  }

  // ---------- Event wiring (delegated) ----------
  function wireCommon() {
    app.onclick = (e) => {
      const t = e.target.closest('[data-mode],[data-cat],[data-open],[data-act],[data-thumb],[data-rail]');
      if (!t) return;
      if (t.dataset.mode) return setMode(t.dataset.mode);
      if (t.dataset.cat) return pickCat(t.dataset.cat);
      if (t.dataset.open) { state.openId = Number(t.dataset.open); return renderTheater(); }
      if (t.dataset.thumb != null) { state.jIdx = Number(t.dataset.thumb); return renderApp(); }
      if (t.dataset.rail) return scrollToTrail('trail-' + t.dataset.rail);
      switch (t.dataset.act) {
        case 'goCatalog': {
          const el = document.getElementById('catalog-top');
          if (el) window.scrollTo({ top: el.offsetTop - 60, behavior: 'smooth' });
          return;
        }
        case 'jprev': return stepJournal(-1);
        case 'jnext': return stepJournal(1);
      }
    };

    theaterRoot.onclick = (e) => {
      const t = e.target.closest('[data-act]');
      if (!t) return;
      if (t.dataset.act === 'close') { state.openId = null; return renderTheater(); }
      if (t.dataset.act === 'prev') return stepTheater(-1);
      if (t.dataset.act === 'next') return stepTheater(1);
    };
  }

  // ---------- Catalog effects (reveal, sticky, back-to-top, peek) ----------
  function setupCatalog() {
    const gallery = document.getElementById('fg-gallery');
    if (!gallery) return;

    // reveal-on-scroll
    if (revIO) revIO.disconnect();
    revIO = new IntersectionObserver(
      (ents) => ents.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); revIO.unobserve(en.target); }
      }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    gallery.querySelectorAll('.fg-card').forEach((c) => revIO.observe(c));

    // sticky filter-bar shadow
    if (stuckIO) stuckIO.disconnect();
    const sentinel = document.getElementById('fg-stuck-sentinel');
    const bar = document.getElementById('catalog-top');
    if (sentinel && bar) {
      stuckIO = new IntersectionObserver(
        (ents) => bar.setAttribute('data-stuck', String(!ents[0].isIntersecting)),
        { threshold: 0 }
      );
      stuckIO.observe(sentinel);
    }

    // back-to-top
    const top = document.getElementById('fg-top');
    if (top) {
      top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
      if (onTopScroll) window.removeEventListener('scroll', onTopScroll);
      onTopScroll = () => top.setAttribute('data-show', String(window.scrollY > 600));
      window.addEventListener('scroll', onTopScroll, { passive: true });
      onTopScroll();
    }

    // cursor-follow peek pill
    const peek = document.getElementById('fg-peek');
    if (peek) {
      gallery.addEventListener('mousemove', (e) => {
        const hit = e.target.closest && e.target.closest('.fg-hit');
        if (hit) {
          peek.style.left = e.clientX + 'px';
          peek.style.top = e.clientY + 'px';
          peek.setAttribute('data-show', 'true');
        } else {
          peek.setAttribute('data-show', 'false');
        }
      });
      gallery.addEventListener('mouseleave', () => peek.setAttribute('data-show', 'false'));
    }
  }
  function teardownCatalog() {
    if (revIO) { revIO.disconnect(); revIO = null; }
    if (stuckIO) { stuckIO.disconnect(); stuckIO = null; }
    if (onTopScroll) { window.removeEventListener('scroll', onTopScroll); onTopScroll = null; }
  }

  // ---------- Trail scroll observer ----------
  function setupTrailObserver() {
    const root = document.getElementById('fg-trail-scroll');
    if (!root) return;
    if (trailIO) trailIO.disconnect();
    trailIO = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) {
          const no = en.target.getAttribute('data-screen-label');
          if (no !== state.trailNo) {
            state.trailNo = no;
            // update rail active state in place (no full re-render)
            document.querySelectorAll('.fg-rail-dot').forEach((d) =>
              d.setAttribute('data-on', String(d.dataset.rail === no))
            );
          }
        }
      }),
      { root, threshold: 0.55 }
    );
    root.querySelectorAll('.fg-trail-sec').forEach((el) => trailIO.observe(el));
  }
  function teardownTrailObserver() {
    if (trailIO) { trailIO.disconnect(); trailIO = null; }
  }

  // ---------- Keyboard ----------
  onKey = (e) => {
    if (state.openId != null) {
      if (e.key === 'Escape') { state.openId = null; renderTheater(); }
      else if (e.key === 'ArrowRight') stepTheater(1);
      else if (e.key === 'ArrowLeft') stepTheater(-1);
    } else if (state.mode === 'journal') {
      if (e.key === 'ArrowRight') stepJournal(1);
      else if (e.key === 'ArrowLeft') stepJournal(-1);
    }
  };
  window.addEventListener('keydown', onKey);

  // ---------- Go ----------
  renderApp();
}
