# Raoof Zare Moayedi — research website

Public site: https://raoofmoayedi.github.io/

A responsive academic portfolio with six illustrated research cards, searchable publications, an expandable research timeline, education with grades and ranks, a printable CV, light/dark themes, and reduced-motion support. GitHub Pages publishes the root of `main`.

## Edit and rebuild

- Edit `build.py` for homepage structure, selected research, and education.
- Edit `publications.json` for publication metadata.
- Research explanations and the full CV are retained in `content/research/` and `content/cv.html`; homepage experience is sourced from `content/index.html`.
- The shared base stylesheet is `content/assets/site.css`; design refinements live in `assets/redesign.css`, interactions in `assets/site.js`.
- Run `python3 build.py`, then `python3 package_preview.py`.
- Commit generated root pages, scripts, source content, assets, and `preview.html` together.

No framework or external font service is needed. Illustrations are optimized local WebP assets; no university logos or external image requests are used. The `ASSETS.md` file describes the conceptual illustrations.

## Offline preview

Download `preview.html` and open it in a browser. It embeds all nine main pages, styles, scripts, illustrations, and bibliography. External paper and contact links still require their normal services. The packaging script also creates a downloadable ZIP under ignored `dist/`.

## Academic content

Publication statuses reflect the author's September 2026 record. Machine unlearning is labeled as an interest. The CV retains teaching, honors, coursework, dates, grades, and ranks. Research illustrations are playful visual metaphors, not experimental plots or technical diagrams.
