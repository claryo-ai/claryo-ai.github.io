## Demo site (static)

This folder contains a small, standalone marketing-style website for the Claryo demo (copy based on the pitch deck).

### Publish (GitHub Pages)

If `agent-guardian-17` is pushed to GitHub, the workflow at `agent-guardian-17/.github/workflows/pages-demo-site.yml` can deploy this folder to GitHub Pages.

1) In GitHub repo settings → **Pages** → set **Source** to **GitHub Actions**
2) Push to the `main` branch (or run the workflow manually)

Your URL will be:

`https://<github-username>.github.io/<repo-name>/`

### Open locally

- Quickest: open `index.html` in a browser.
- If you want proper routing/assets loading, serve it:

```sh
cd agent-guardian-17/demo-site
python3 -m http.server 5179
```

Then open `http://localhost:5179`.
