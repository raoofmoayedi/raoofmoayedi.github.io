# Raoof Zare Moayedi — research website

A dark academic website for GitHub Pages, with a compact profile, grouped publications, aligned research experience and education, interactive research detail pages, BibTeX citations and a print-friendly CV.

## Preview

Open `index.html` in a browser. The figures and publication filters work without a server. For a local web server, run `python3 -m http.server 8000` in this directory and visit `http://localhost:8000`.

## Publish on GitHub Pages

1. Create the public repository `raoofmoayedi.github.io` in the `raoofmoayedi` account.
2. Upload the contents of this folder to the repository root, including `index.html`, `assets/`, and `research/`.
3. In the repository, select **Settings → Pages → Build and deployment → Deploy from a branch**.
4. Select **main** and **/(root)**, then save.
5. The intended public address is `https://raoofmoayedi.github.io/` once GitHub finishes publishing. It is not live merely because these files exist.

No build service, paid hosting, API key or external database is needed. DM Sans and Manrope load from Google Fonts with system-font fallbacks. Interactive figures use browser canvas and remain usable without animation.

## Updating the site

- Edit `publications.json` to update titles, authors, statuses and paper links. `authors` contains display names and equal-contribution markers; `bib_authors` contains full names in `Family, Given` format for BibTeX.
- Edit `build.py` to change the biography, experience, project explanations and CV.
- Run `python3 build.py`, then commit both source and generated HTML files.
- Adjust colors, spacing, and the responsive type scale in `assets/site.css`; interactions are in `assets/site.js`.
- The homepage uses flat publication rows and consistent text badges for institutions; illustrations are on the research pages. Print styling uses a light background.

No JavaScript framework or Python packages are required. Serve the generated HTML directly. The `.nojekyll` file disables Jekyll processing.

## Content notes

- The content uses the supplied CV and subsequent corrections from September 2026. NTU is listed as a funded visiting research student position as clarified by Raoof.
- The CV page includes the revised research summaries and graduate grades, and preserves audited courses. Print it to PDF using its button. It does not link to the older uploaded PDF.
- Class ranks are retained without the inconsistent CS cohort size from the earlier PDF. The unconfirmed Imperial numerical improvement and conflicting prose durations are omitted.
- Publication links were checked against arXiv, publisher DOI records and official metadata. Review statuses follow the author's supplied statements.
- All three interactive figures are conceptual illustrations, labeled on the relevant pages. They are not experimental results or trained model outputs.
- No portrait or Google Scholar URL was supplied or reliably verified. Neither is fabricated. Add these when available.
- Research source links: https://arxiv.org/abs/2609.33363 ; https://doi.org/10.1109/TPAMI.2026.3660863 ; https://doi.org/10.1016/j.cma.2025.118180 ; https://arxiv.org/abs/2311.15089 .

Publication dates and review statuses should be updated when they change.
