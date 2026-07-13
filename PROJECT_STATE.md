# Between the Branches — Project State

_Last updated: 2026-07-13 (session with Larry). This is the single source of
truth for where the project stands. See `README.md` for architecture and
`DEPLOY.md` for the deployment walkthrough._

---

## What this is

A naturalist photography portfolio for a 13-year-old photographer — a
field-guide-style catalog where each photo is a numbered "specimen" (title,
location, time of day, category, a short handwritten-style story, camera
settings). Three browse modes — **Catalog** (grid), **Field Journal** (spread),
**Trail** (immersive) — plus a lightbox. Design was final/approved on delivery
and was preserved exactly.

## Live links

| What | URL |
|------|-----|
| **Live site** | https://betweenthebranches.netlify.app |
| **CMS (photographer login)** | https://betweenthebranches.netlify.app/admin/ |
| **GitHub repo** | https://github.com/mattanovak1979-prog/between-the-branches |
| **Local project** | `C:\Users\Novak\Desktop\PKA\between-the-branches\` |
| **Original handoff** | `C:\Users\Novak\Desktop\PKA\OWNER'S INBOX\BETWEEN THE BRANCHES\design_handoff_between_the_branches\` |

## The stack (all free)

- **Astro 5** — static site generator; builds to `dist/`, no server.
- **Decap CMS** at `/admin` — git-based CMS; the photographer edits via a form,
  Decap commits to GitHub, Netlify rebuilds. No database.
- **Netlify** — hosting + auto-deploy on push + free HTTPS.
- **Netlify Identity + Git Gateway** — invite-only login so the photographer
  never needs GitHub access.

---

## What was done this session

1. **Chose Astro** (over plain-static / keeping the prototype's proprietary
   runtime) — matches the README's recommendation.
2. **Migrated the data** (`scripts/migrate.mjs`): decoded the prototype's 1.5 MB
   base64 `data.js` into **30 real JPEGs + hero.jpg** (`public/images/specimens/`)
   and **one Markdown file per specimen** (`src/content/specimens/*.md`) + a hero
   settings file. `data.js` is no longer used.
3. **Ported the UI**: CSS copied **verbatim** from the approved prototype; the
   proprietary `.dc.html` / `support.js` React runtime was replaced with one
   dependency-free vanilla file (`src/scripts/app.js`) reproducing all three
   modes, the lightbox, filtering, keyboard nav, and every micro-interaction.
   The "30 specimens" count and category counts are now **dynamic** (derived
   from content, nothing hardcoded).
4. **Added Decap CMS** (`public/admin/`): git-gateway backend on `main`,
   invite-only, a Specimens folder collection (all fields + image upload) and a
   Site-settings singleton for the hero.
5. **Wrote docs**: `README.md`, `DEPLOY.md`, this file.
6. **Verified**: `npm run build` clean; `scripts/smoke.mjs` = **27/27**
   behavioral assertions pass (drives the real `app.js` in a jsdom DOM — all
   modes, filtering, theater wraparound, journal thumbs, trail rail).
7. **Deployed**: pushed to GitHub → imported into Netlify → enabled Identity
   (invite-only) + Git Gateway.
8. **Fixed a real bug found during deploy** (commit `8ca6f2b`): the Netlify
   Identity widget `<script src>` on the homepage needed `is:inline`. Without it,
   Astro tried to bundle the remote URL and emitted an empty chunk, so
   `window.netlifyIdentity` never loaded — which is why the first invite click
   dead-ended with no set-password prompt. Fixed and confirmed live.

## Current status

| Item | Status |
|------|--------|
| Site live at correct domain | ✅ all routes 200, verified |
| Data migrated (30 + hero) | ✅ |
| UI fidelity (all 3 modes + theater) | ✅ 27/27 behavioral tests |
| Decap CMS at `/admin` | ✅ present, config valid |
| Netlify Identity (invite-only) | ✅ enabled |
| Git Gateway | ✅ enabled |
| Identity widget on homepage (invite flow) | ✅ fixed + live |
| Post-launch design refinements | ✅ done + approved by Matt (see below) |
| CMS **login** | ✅ appears working (Matt confirmed) |
| CMS **publish → commit → rebuild** loop | ⏳ **NOT yet exercised** — repo still has only 3 commits (all Larry's), live count still 30. Needs one real CMS publish to confirm the write path end-to-end. |
| Photographer invited | ⏳ not yet |

## Remaining steps (to fully close out)

1. **Confirm the write path:** log in at `/admin/`, create a test specimen
   (e.g. `0031`, any photo) and **Publish**. Then confirm: a new commit appears
   in the GitHub repo, Netlify runs a build, and the live site shows **31**
   specimens with the category count updated. Delete the test specimen after.
2. **Invite the photographer:** Netlify → Identity → Invite users → their email.
   Send them `https://betweenthebranches.netlify.app/admin/`. They click the
   email link → set a password → they're in.
3. (Optional) Point everyone at `README.md` for how to add photos.

## Post-launch design refinements (2026-07-13, all approved by Matt)

All in `src/styles/portfolio.css` unless noted; each was build-tested and pushed.

- **Mobile header** (`@media max-width:720px`): the "Trail" tab was clipping off
  the right edge in portrait. Hid the wordmark (kept the bird logomark) and
  enlarged the logomark to `48x35` so it reads as prominent; header stays ~52px
  tall so sticky/full-height offsets are unaffected.
- **Catalog cards:** caption overlay (No./title/place) shows on **hover on
  desktop**, **hidden on phones** (`.fg-reveal{display:none}` in the 720 block) —
  on mobile the photo shows alone and details open in the lightbox on tap. (The
  `.fg-reveal` markup lives in `src/scripts/app.js`.)
- **Desktop hero:** shows the **whole photo edge-to-edge** — full width, natural
  height (hero.jpg is 1150×767 ≈ 3:2), **no crop, no height cap, no Ken Burns
  zoom** (the zoom was clipping the water). Result is a tall hero (~width÷1.5).
  Mobile keeps a compact fixed-height (`min(52vh,420px)`) cover hero.
- **Mobile Trail:** landscape photos looked hard-cropped in the portrait
  full-screen sections. Reworked to show the **whole photo** (contain, in flow)
  with the caption **directly beneath**, the photo+caption block centered on a
  dark (`--ink`) field, scrim hidden — so caption placement is identical on
  every slide. Desktop Trail unchanged (full-bleed cover suits wide viewports).

Key lesson baked in: **portrait phone + landscape photo can't be both
full-screen and uncropped** — Trail/hero framing trades "fill" against "show the
whole photo." Current choice favors showing the whole photo.

---

## How to work on it later

```sh
cd C:\Users\Novak\Desktop\PKA\between-the-branches
npm install            # first time only
npm run dev            # local preview at http://localhost:4321
npm run build          # production build -> dist/
node scripts/smoke.mjs # behavioral test (run build first)
```

- **Edit content:** either use the CMS at `/admin`, or edit
  `src/content/specimens/*.md` directly and `git push` (Netlify auto-rebuilds).
- **Add a photo manually:** drop the JPEG in `public/images/specimens/`, add a
  matching `.md` file (copy an existing one, bump `no`, set fields), push.
- **Deploy:** any push to `main` triggers a Netlify build automatically.

## Known gotchas / lessons (so we don't re-debug these)

- **Renaming the Netlify site changes the URL.** Each rename frees the old
  `*.netlify.app` subdomain, which then returns Netlify's 404 "Not Found" page.
  During this session the site was renamed twice
  (`endearing-torte-236f92` → `betweenthebraches` → `betweenthebranches`); the
  old names 404ing looked like the site was "down" but it never was. **If the
  site ever appears down, first check the current site name in the Netlify
  dashboard.** Avoid renaming after the photographer has a working invite/link.
- **External `<script src>` in Astro needs `is:inline`** or Astro will try to
  bundle it and it silently won't load (this broke the invite flow — see above).
- **The CMS commits to `main`** — the repo's default branch must stay `main`
  (set in `public/admin/config.yml`).
- **Never** re-introduce `data.js` / base64 — content lives in the collection now.

## File map (quick reference)

```
src/pages/index.astro      page shell: fonts, styles, embeds specimen JSON,
                           mounts app, loads Identity widget (is:inline!)
src/scripts/app.js         vanilla renderer for all 3 modes + lightbox
src/styles/portfolio.css   verbatim design CSS — do not redesign
src/content/specimens/*.md ONE FILE PER PHOTO (CMS edits these)
src/content/settings/site.md  hero singleton
src/content.config.ts      collection schemas
public/images/specimens/   30 photos + hero.jpg
public/admin/              Decap CMS (index.html + config.yml)
scripts/migrate.mjs        one-off base64->files migration (already run)
scripts/smoke.mjs          behavioral test harness
netlify.toml               build command + publish dir
README.md / DEPLOY.md      architecture / deploy walkthrough
```
