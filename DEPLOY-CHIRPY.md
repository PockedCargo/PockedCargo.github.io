# Deploying the Chirpy version to GitHub Pages

This is a **Jekyll site** (not plain HTML like the first version) — it needs to be *built*
before it can be served. You do NOT need Ruby installed on your own machine for this:
GitHub Actions will build it automatically. This repo already includes the build
workflow (`.github/workflows/pages-deploy.yml`), courtesy of the official Chirpy starter.

## 1. Create the repository
- GitHub → New repository
- **Important naming choice:**
  - Name it exactly `PockedCargo.github.io` if you want this to be your main GitHub Pages
    site living at the root domain (`https://pockedcargo.github.io/`)
  - OR name it anything else (e.g. `chirpy-portfolio`) if you want it at a sub-path
    (`https://pockedcargo.github.io/chirpy-portfolio/`) — if you do this, you must also
    set `baseurl: "/chirpy-portfolio"` in `_config.yml` and update `url` accordingly
- Keep it Public
- Do NOT initialize with a README

## 2. Upload the files
Upload everything in this folder, **including hidden dot-folders**:
```
.github/            ← the build workflow — do not skip this folder
_config.yml
_data/
_drafts/
_plugins/
_posts/
_tabs/
assets/
Gemfile
index.html
```
GitHub's drag-and-drop uploader sometimes hides dotfiles from view but still uploads them
if they're inside the folder you drag — double check `.github/workflows/pages-deploy.yml`
actually made it into the repo afterward (browse to it on GitHub to confirm).

## 3. Enable GitHub Pages via Actions (different from the plain-HTML version!)
- Settings → Pages
- Source: **"GitHub Actions"** (NOT "Deploy from a branch" — Chirpy needs the custom build)
- That's it — no branch/folder picker needed

## 4. Let it build
- Go to the "Actions" tab of your repo — you'll see a workflow run start automatically
- Takes 1-3 minutes. Green checkmark = live.
- Your site will be at whatever `url` you set in `_config.yml`

## 5. Publishing the two locked writeups later
Both MangoBleed and PhantomCheck currently live in `_drafts/` — Jekyll never builds or
publishes files in that folder, so they're completely invisible on the live site right now.
This is the Jekyll-native way of doing what our plain-HTML site did with a password gate.

When you're ready to make one public:
1. Move the file from `_drafts/` to `_posts/`
2. Rename it to include today's date, e.g. `_drafts/mangobleed.md` → `_posts/2026-08-01-mangobleed.md`
3. Commit and push — the next Actions build will include it automatically

## 6. Important — a few things this version does NOT yet have
- **No password gate.** Chirpy has no built-in mechanism for this; `_drafts/` gives you
  "not public yet," not "public but locked behind a code." Porting our custom
  JS access-code gate into Chirpy would mean overriding `_layouts/post.html` — a
  meaningfully bigger task. Say the word if you want this built next.
- **A few color variables in `assets/css/jekyll-theme-chirpy.scss` are best-effort.**
  Chirpy has 80+ internal color variables and I've confirmed the core ones (background,
  text, links, borders, sidebar) directly from the theme's source. A few more specific
  ones (card hover states, some tag styling) are educated guesses based on Chirpy's naming
  conventions — after your first deploy, use your browser's devtools to inspect any element
  that still looks like default Chirpy colors, find its actual `--variable-name`, and add
  it to the override file.
- **`url` in `_config.yml`** is set assuming the repo will be named `PockedCargo.github.io`
  exactly. Update it (and add `baseurl`) if you name the repo something else — see step 1.
