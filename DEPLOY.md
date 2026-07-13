# Deploy guide — Between the Branches

Goal: get the site live on a free `*.netlify.app` URL, then let the photographer
add photos at `/admin` with no code. Everything here is free (a custom domain is
the only optional paid item, ~$12/yr).

You'll do this once. Budget ~20 minutes. You need a **GitHub** account and a
**Netlify** account (sign up for Netlify *with* GitHub — it makes step 2 easier).

---

## 1. Push the project to a new GitHub repo

From this project folder (`between-the-branches/`):

```sh
git init
git add .
git commit -m "Between the Branches — initial site"
```

Create an empty repo on GitHub named `between-the-branches` (no README/license —
keep it empty), then:

```sh
git branch -M main
git remote add origin https://github.com/<your-username>/between-the-branches.git
git push -u origin main
```

> The branch **must** be `main` — the CMS config (`public/admin/config.yml`) is
> set to commit there.

## 2. Create the Netlify site

1. Netlify → **Add new site → Import an existing project → GitHub**.
2. Pick the `between-the-branches` repo.
3. Netlify auto-detects Astro. Confirm the settings (already pinned in
   `netlify.toml`):
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. **Deploy.** In ~1 minute you'll have a live URL like
   `https://calm-otter-1234.netlify.app`. You can rename it under
   **Site configuration → Site details → Change site name**.

At this point the site is **live and public**. The `/admin` page exists but
login won't work until the next step.

## 3. Turn on the CMS login (Netlify Identity + Git Gateway)

The photographer logs in through Netlify Identity; Git Gateway lets the CMS
commit to the repo on their behalf (so they never need GitHub access).

1. In the site: **Integrations / Identity** → **Enable Identity**.
   *(On newer Netlify UIs this lives under "Integrations"; older ones have an
   "Identity" tab. Same feature.)*
2. **Registration preferences → set to "Invite only".** Important — this keeps
   random people from signing up.
3. **Services → Git Gateway → Enable.** (It links to your GitHub repo
   automatically.)

## 4. Invite the photographer

1. Identity tab → **Invite users** → enter the photographer's email
   (use your own first if you want to test).
2. They get an email → click the link → it opens the site, and the Identity
   widget forwards them to **`/admin/`** to set a password.
3. Done. They can now log in at `https://<your-site>.netlify.app/admin/`.

> If the invite link ever opens the homepage without a login box, have them go
> straight to `/admin/` and click **Login** — the site is wired to catch the
> token either way.

## 5. Verify the full loop

Log in at `/admin/` and confirm:

- [ ] The **Specimens** collection lists all 30 photos, and **Site settings**
      shows the hero.
- [ ] **New Specimen** → fill in number/title/category/etc., **upload a photo**,
      **Publish**.
- [ ] Netlify shows a new deploy building (triggered by the CMS commit). After
      ~1 min, the new specimen appears on the live site in **all three modes**,
      and the category count updates.
- [ ] Editing a specimen's story and re-publishing updates the site.

That's the whole system: photographer publishes → GitHub commit → Netlify
rebuilds → live.

---

## Optional: custom domain

Netlify → **Domain management → Add a domain**. Buy the domain anywhere
(~$12/yr) and point it per Netlify's instructions. HTTPS is automatic and free.
The `.netlify.app` URL keeps working too.

## Troubleshooting

- **CMS login says "Failed to load settings" / "Git Gateway error":** Identity
  or Git Gateway isn't enabled, or the repo's default branch isn't `main`.
  Re-check step 3.
- **Uploaded photo doesn't show:** confirm it committed to
  `public/images/specimens/` in the repo and the deploy finished. The `image`
  field should read `/images/specimens/<file>`.
- **Build fails on Netlify:** check the deploy log. Locally, `npm run build`
  should succeed; if it does, it's usually a Node version mismatch — `netlify.toml`
  pins Node 20.
- **Want to preview a photographer's edit before it goes live:** set
  `publish_mode: editorial_workflow` in `public/admin/config.yml` (adds a
  Draft → In review → Ready flow in the CMS).
