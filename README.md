# Raoof Zare Moayedi — research website

A static academic website with a dark theme, selected research, a complete publication list, research detail pages, and a printable CV.

The repository is private and GitHub Pages is disabled as of September 29, 2026. Saving these files does not publish the website. There is no deployment workflow.

## Preview privately

Download `preview.html` and open the downloaded file in your browser. This single file includes all six pages, the styles, interactive figures, and bibliography download. It requires no server or internet connection to display the site. External paper and contact links still point to their original destinations.

Alternatively, download the repository and open `index.html`. The normal pages work directly from disk.

## Edit and rebuild

1. Edit `publications.json` for paper metadata. `authors` contains display names and equal-contribution markers. `bib_authors` contains full names in `Family, Given` format.
2. Edit `build.py` for the introduction, research summaries, experience, education, and CV. The `SELECTED` dictionary sets the three homepage papers and their short explanations.
3. Run `python3 build.py` to generate the seven HTML documents and `papers.bib`.
4. Run `python3 package_preview.py` to validate internal links and rebuild `preview.html` and the downloadable files in `dist/`.
5. Commit the source, generated pages, and updated `preview.html` to the private repository.

No framework, package installation, build service, or external font service is required. Typography uses the visitor's system fonts. Styles are in `assets/site.css`; publication filters and diagrams are in `assets/site.js`.

## Structure and design

- `index.html`: introduction, three selected works, research experience, education, and contact.
- `publications.html`: all seven papers, grouped into journal articles and preprints/manuscripts, with filters and BibTeX.
- `research/`: detailed explanations and interactive conceptual diagrams.
- `cv.html`: full academic record, including grades and audited courses, with print styling.
- `preview.html`: a generated, self-contained offline snapshot of the six main pages.

The homepage uses one reading area. Topic labels sit beside selected papers on larger screens and above them on smaller screens. University names are written out rather than represented by improvised logos. Titles, author names, metadata, and links have separate, consistent levels of emphasis.

The source layouts of [Jon Barron's homepage](https://github.com/jonbarron/jonbarron.github.io/blob/master/index.html) and [Minimal Light](https://github.com/yaoyao-liu/minimal-light/blob/main/_layouts/homepage.html) informed the content hierarchy. This site uses its own code and styles; it does not copy their layouts, text, or assets.

## Content

The content follows the supplied CV and subsequent corrections. NTU is listed as a funded visiting research student position. Machine unlearning appears as an interest, without implying completed projects. Publication and review statuses follow the author's supplied information and should be updated as they change.

The figures are conceptual illustrations, not experimental results. No portrait or unverified Google Scholar URL is included.

Paper sources:

- https://arxiv.org/abs/2609.33363
- https://doi.org/10.1109/TPAMI.2026.3660863
- https://doi.org/10.1016/j.cma.2025.118180
- https://arxiv.org/abs/2311.15089
