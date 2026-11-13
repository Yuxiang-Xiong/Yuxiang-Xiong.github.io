# Yuxiang Xiong academic website

Static personal academic website scaffold for GitHub Pages.

## Files

- `index.html` - homepage with bio, research interests, news, and portrait slot.
- `research.html` - working papers and research experience.
- `research-data.json` - selected research content, summaries, methods, and tags.
- `research/` - individual research detail pages.
- `research.css` - poster gallery and research detail styling.
- `teaching.html` - teaching, workshop, and service page.
- `cv.html` - education, skills, contact, and PDF CV link.
- `styles.css` - shared responsive styling.
- `script.js` - current-page navigation and mobile menu.
- `assets/Yuxiang-Xiong-CV.pdf` - copied CV PDF.
- `assets/profile-placeholder.svg` - replace with a current portrait when available.

## GitHub Pages

Research pages are static and work without a server. After editing
`research-data.json`, run `node tools/build-research.mjs` to regenerate the gallery
and seven detail pages. Research illustrations are in `assets/research/`.

1. Create a new GitHub repository.
2. Upload these files to the repository root.
3. In GitHub, open Settings > Pages.
4. Set Source to `Deploy from a branch`, Branch to `main`, and Folder to `/root`.

## Next edits

- Replace the portrait placeholder with a real image, keeping the file name or updating `index.html`.
- Update the email address if you no longer use the IE University address.
- Replace the 2022 CV with a current CV before publishing.
- Add links to papers, SSRN, Google Scholar, GitHub, or LinkedIn when ready.
