# Between the Branches

A naturalist photography catalog — every photo is a numbered "specimen" with a
title, location, time, category, a short handwritten-style story, and camera
settings. Browse it three ways: **Catalog** (grid), **Field Journal** (spread),
and **Trail** (immersive full-screen).

Built with [Astro](https://astro.build) (static output) and edited through
[Decap CMS](https://decapcms.org) — the photographer adds photos through a form
at `/admin`, no code required.

---

## How it's put together

```
src/
  pages/index.astro      The page shell: fonts, styles, embeds specimen data,
                         mounts the app. Reads the content collection at build.
  scripts/app.js         Vanilla JS that renders the 3 modes + lightbox and all
                         interactions. No framework/runtime.
  styles/portfolio.css   All visual styling (verbatim from the approved design).
  content/
    specimens/*.md       ONE FILE PER PHOTO — the CMS edits these.
    settings/site.md     Site singleton (currently just the hero photo).
  content.config.ts      Schema for the two collections above.
public/
  images/specimens/      The photo files (CMS uploads land here).
  admin/                 Decap CMS: index.html + config.yml  ->  /admin
scripts/
  migrate.mjs            One-off: decoded the old base64 data.js into the files
                         above. Already run; kept for reference.
  smoke.mjs              Behavioral test of app.js (all modes + theater).
```

Data flow: `content/specimens/*.md` → (build) → embedded JSON in the page →
`app.js` renders. Add/edit a `.md` (or use the CMS) and the site rebuilds.

## Editing content

**Non-technical (the photographer):** go to `/admin`, log in, add or edit a
Specimen, publish. See `DEPLOY.md` for the one-time setup that enables this.

**Technical:** edit the Markdown files in `src/content/specimens/` directly and
push. Each file's front-matter fields:

| Field   | Example                          | Notes                              |
|---------|----------------------------------|------------------------------------|
| `no`    | `"0031"`                         | Zero-padded; orders + names entry  |
| `title` | `"Common Loon, Evening Patrol"`  |                                    |
| `cat`   | `"Birds"`                        | Birds / Wildlife / Landscapes / Close-ups |
| `place` | `"The Lake"`                     | Location                           |
| `coord` | `"8:02 PM"`                      | Time of day (free text)            |
| `story` | `"You hear them before..."`      | Handwritten-font caption           |
| `exif`  | `"f/5.6 · 1/1600s · ISO 400"`    | Camera settings                    |
| `image` | `"/images/specimens/loon.jpg"`   | Path to the photo in `public/`     |
| `ratio` | `1.5`                            | Optional aspect hint               |

The category counts and the "N specimens" hint are derived from the content —
nothing is hardcoded.

## Commands

```sh
npm install       # install dependencies
npm run dev       # local dev server (http://localhost:4321)
npm run build     # production build -> dist/
npm run preview   # preview the production build
node scripts/smoke.mjs   # behavioral test (run `npm run build` first)
```

## Deploying

See **`DEPLOY.md`** — GitHub → Netlify → Netlify Identity + Git Gateway →
invite the photographer.
